import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import { all, create } from 'https://esm.sh/mathjs@13.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const math = create(all, {})

// Convert LaTeX-ish input to a parseable expression
function latexToExpr(input: string): string {
  let s = input.trim()
  // strip surrounding $...$ or \(...\) or \[...\]
  s = s.replace(/^\$+|\$+$/g, '')
  s = s.replace(/^\\\(|\\\)$/g, '').replace(/^\\\[|\\\]$/g, '')
  // \dfrac, \tfrac -> \frac
  s = s.replace(/\\[dt]frac/g, '\\frac')
  // \frac{a}{b} -> (a)/(b)  (handle nested by repeating)
  for (let i = 0; i < 10; i++) {
    const next = s.replace(/\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '($1)/($2)')
    if (next === s) break
    s = next
  }
  // \sqrt{x} -> sqrt(x), \sqrt[n]{x} -> nthRoot(x,n)
  s = s.replace(/\\sqrt\s*\[([^\]]+)\]\s*\{([^{}]*)\}/g, 'nthRoot($2,$1)')
  for (let i = 0; i < 5; i++) {
    const next = s.replace(/\\sqrt\s*\{([^{}]*)\}/g, 'sqrt($1)')
    if (next === s) break
    s = next
  }
  // \cdot, \times -> *
  s = s.replace(/\\cdot/g, '*').replace(/\\times/g, '*')
  // \div -> /
  s = s.replace(/\\div/g, '/')
  // \pi -> pi, \e -> e
  s = s.replace(/\\pi/g, 'pi')
  // \left( \right) -> remove
  s = s.replace(/\\left/g, '').replace(/\\right/g, '')
  // ^{...} -> ^(...)
  s = s.replace(/\^\s*\{([^{}]*)\}/g, '^($1)')
  // remove remaining backslashes for common funcs
  s = s.replace(/\\(sin|cos|tan|log|ln|exp)/g, '$1')
  s = s.replace(/\\,|\\;|\\!|\\:|\\\s/g, '')
  // ascii: ^ already supported by mathjs; mathjs uses log(x) base e? use ln->log
  s = s.replace(/\bln\s*\(/g, 'log(')
  return s
}

function tryNumeric(input: string): number | null {
  try {
    const expr = latexToExpr(input)
    const val = math.evaluate(expr)
    if (typeof val === 'number' && isFinite(val)) return val
    if (val && typeof val.toNumber === 'function') {
      const n = val.toNumber()
      return isFinite(n) ? n : null
    }
  } catch (_) {}
  return null
}

function answersMatch(userInput: string, accepted: string[]): boolean {
  const userNum = tryNumeric(userInput)
  for (const a of accepted) {
    // exact normalized string match
    if (userInput.trim().toLowerCase().replace(/\s+/g, '') === a.trim().toLowerCase().replace(/\s+/g, '')) {
      return true
    }
    const accNum = tryNumeric(a)
    if (userNum !== null && accNum !== null) {
      if (Math.abs(userNum - accNum) < 1e-8 || Math.abs(userNum - accNum) / Math.max(Math.abs(accNum), 1) < 1e-8) {
        return true
      }
    }
  }
  return false
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const body = await req.json()
    const { weekId, division, userAnswer, acceptedAnswers, name, clientId } = body

    if (!weekId || !division || typeof userAnswer !== 'string' || !Array.isArray(acceptedAnswers)) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const correct = answersMatch(userAnswer, acceptedAnswers)

    if (correct && name && clientId) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )
      const cleanName = String(name).trim().slice(0, 50) || 'Anonymous'
      const cleanClient = String(clientId).slice(0, 100)
      // Insert; ignore unique violation (already on board)
      await supabase.from('submissions').insert({
        week_id: String(weekId),
        division: String(division),
        name: cleanName,
        client_id: cleanClient,
      })
    }

    return new Response(JSON.stringify({ correct }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})