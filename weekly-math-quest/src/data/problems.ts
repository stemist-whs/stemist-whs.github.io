// ============================================================
// PROBLEM OF THE WEEK — Data file
// ------------------------------------------------------------
// Add one entry to PROBLEMS for each week. Weeks are numbered
// starting from week 1. The current week is determined by
// counting how many "Saturday 11:59pm PST" boundaries have
// passed since SEASON_START (inclusive of week 1 from start).
//
// LaTeX: write everything as a normal string. Use \\ for
// backslashes, e.g. "\\frac{1}{2}". The site renders with
// MathJax, so use $...$ for inline math and $$...$$ for display
// math inside `problem` and `solution`.
//
// answers: list ALL accepted answer strings. The grader accepts
// any input that is either an exact (normalized) match OR
// numerically equivalent (to ~10 decimals) when parsed as
// LaTeX or AsciiMath. Examples for "one half":
//   answers: ["1/2", "0.5", "\\frac{1}{2}"]
// ============================================================

export type Problem = {
  statement: string  // LaTeX/markdown allowed
  answers: string[]  // accepted answers
  solution: string   // LaTeX/markdown allowed
}

export type WeekProblems = {
  week: number             // 1-indexed
  title?: string           // optional theme/title for the week
  divisionA: Problem       // easier
  divisionB: Problem       // harder
}

// First Saturday 11:59pm PST when week 1 should be live.
// Update this to the date you want the season to begin.
// Time is fixed at Saturday 23:59 America/Los_Angeles.
export const SEASON_START_ISO = "2026-04-25T23:59:00-08:00"

export const PROBLEMS: WeekProblems[] = [
  {
    week: 1,
    divisionA: {
      statement: "How many $3$-digit odd numbers have an even sum of digits?",
      answers: ["225"],
      solution: "Let the digits be $a$ (hundreds), $b$ (tens), $c$ (units). Since the number is odd, $c$ has $5$ choices: $1,3,5,7,9$.\n\nFor the sum $a+b+c$ to be even, and since $c$ is odd, $a+b$ must be odd. So one of $a,b$ is odd and the other is even.\n\nWe count the cases:\n- $a$ odd ($5$ choices), $b$ even ($5$ choices): $25$\n- $a$ even ($4$ choices, since $a\\neq 0$), $b$ odd ($5$ choices): $20$\n\nSo there are $25+20=45$ choices for $a,b$, and $5$ choices for $c$:\n$$45 \\cdot 5 = \\boxed{225}.$$",
    },
    divisionB: {
      statement: "The numbers $1$ through $12$ are written around a circle. John draws a line segment connecting a pair of numbers and writes the sum of the two numbers at the ends of the line. He does this for all possible line segments. Find the total sum of all the numbers that he writes down.",
      answers: ["858"],
      solution: "Let's begin by looking at which numbers $1$ will be connected to. $1$ will be connected to each of $2, 3, \\dots, 12$, hence it will be connected to $11$ numbers and appear $11$ times in the sum. However, there's nothing special about $1$ — all the numbers from $1$ through $12$ will appear $11$ times in the sum, so our answer is\n$$11(1) + 11(2) + \\dots + 11(12) = 11(1+2+\\dots+12) = \\frac{11 \\cdot 12 \\cdot 13}{2} = \\boxed{858}.$$",
    },
  },
  {
    week: 2,
    divisionA: {
      statement: "John shoots $8$ basketballs into a hoop, and because he is a pro, all of them make. If he could have scored either $2$ or $3$ points per shot, how many possible total point values could John have scored?",
      answers: ["9"],
      solution: "He can make all integer values between $8 \\cdot 2 = 16$ and $8 \\cdot 3 = 24$ inclusive (one for each number of $3$-pointers from $0$ to $8$), which is a total of $\\boxed{9}$ values.",
    },
    divisionB: {
      statement: "I am choosing $3$ dots from a $3 \\times 3$ grid. What is the probability that the $3$ dots I choose are on different rows of the grid?",
      answers: ["9/28"],
      solution: "For the first pick we can choose any dot, so the probability is $1$.\n\nAfter choosing the first dot, there are $8$ dots left. In the same row as the first dot, there are $2$ remaining dots, so $6$ of the remaining $8$ dots are in different rows. The probability that the second dot is in a different row is $\\dfrac{6}{8}$.\n\nAfter choosing the second dot, two different rows have been used. There are now $7$ dots left total, and exactly one full row of $3$ dots remains untouched. For the third dot to be in a different row from the first two, it must come from this remaining row, so the probability is $\\dfrac{3}{7}$.\n\nTherefore, the desired probability is\n$$1 \\cdot \\frac{6}{8} \\cdot \\frac{3}{7} = \\frac{18}{56} = \\boxed{\\frac{9}{28}}.$$",
    },
  },
  {
    week: 3,
    divisionA: {
      statement: "Let $f(x)$ denote the remainder when $x$ is divided by $9$. Find $$f\\big(f(1) + f(2) + \\dots + f(2026)\\big).$$",
      answers: ["1"],
      solution: "First, compute $S = f(1)+f(2)+\\cdots+f(2026)$.\n\nObserve the repeating pattern $f(1),f(2),\\dots,f(9) = 1,2,3,4,5,6,7,8,0$, whose sum is $36$. So every block of $9$ consecutive integers contributes $36$.\n\nWrite $2026 = 9 \\cdot 225 + 1$. So there are $225$ full blocks from $1$ to $2025$, plus one extra term $2026$.\n\nThus $S = 225 \\cdot 36 + f(2026)$. Since $2026 = 9 \\cdot 225 + 1$, we have $f(2026)=1$, giving\n$$S = 225 \\cdot 36 + 1 = 8101.$$\n\nFinally, $8100$ is divisible by $9$, so $f(S) = \\boxed{1}.$",
    },
    divisionB: {
      statement: "The operation $\\#$ is defined as $a \\,\\#\\, b = \\sqrt{a^2 + b^2}$. Compute $$\\left(\\sqrt{1} \\,\\#\\, \\left(\\sqrt{2} \\,\\#\\, \\left(\\dots \\left(\\sqrt{48} \\,\\#\\, \\sqrt{49}\\right) \\dots \\right)\\right)\\right)^2.$$",
      answers: ["1225"],
      solution: "Since $(a \\# b)^2 = a^2 + b^2$, each application of the operation (after squaring the final result) simply adds the squares of all the terms involved. So\n$$\\left(\\sqrt{1} \\# \\left(\\sqrt{2} \\# \\left(\\dots \\# \\sqrt{49}\\right)\\right)\\right)^2 = 1 + 2 + 3 + \\cdots + 49 = \\frac{49 \\cdot 50}{2} = \\boxed{1225}.$$",
    },
  },
]

// ----------------------------------------------------------------
// Week resolution helpers
// ----------------------------------------------------------------

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

/** Returns the 1-indexed current week, or 0 if the season hasn't started. */
export function getCurrentWeekNumber(now: Date = new Date()): number {
  const start = new Date(SEASON_START_ISO).getTime()
  const diff = now.getTime() - start
  if (diff < 0) return 0
  return Math.floor(diff / WEEK_MS) + 1
}

/** Returns the WeekProblems entry for the current week, or null. */
export function getCurrentWeek(now: Date = new Date()): WeekProblems | null {
  const n = getCurrentWeekNumber(now)
  if (n <= 0) return null
  return PROBLEMS.find(p => p.week === n) ?? null
}

/** Returns the Date when the next problem is released. */
export function getNextReleaseDate(now: Date = new Date()): Date {
  const start = new Date(SEASON_START_ISO).getTime()
  const diff = now.getTime() - start
  const weeksPassed = Math.max(0, Math.floor(diff / WEEK_MS) + 1)
  return new Date(start + weeksPassed * WEEK_MS)
}

/** Returns all weeks that have already been released (excluding current). */
export function getArchivedWeeks(now: Date = new Date()): WeekProblems[] {
  const current = getCurrentWeekNumber(now)
  return PROBLEMS.filter(p => p.week < current).sort((a, b) => b.week - a.week)
}

/** Stable id for a week, used as DB key. */
export function weekId(week: number): string {
  return `w${String(week).padStart(4, "0")}`
}