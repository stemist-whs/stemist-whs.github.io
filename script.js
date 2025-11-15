document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const dropdowns = document.querySelectorAll(".nav-dropdown");

  // Mobile menu toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      navToggle.classList.toggle("active");
    });
  }

  // Close mobile menu when clicking on a link
  if (navLinks) {
    navLinks.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("open");
        if (navToggle) navToggle.classList.remove("active");
      }
    });
  }

  // Dropdown menu toggle
  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".nav-dropdown-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      dropdown.classList.toggle("open");
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href === "#home") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        // Update browser hash (clear it for home)
        window.history.pushState(null, null, window.location.pathname);
        // Close mobile menu if open
        if (navLinks) navLinks.classList.remove("open");
        if (navToggle) navToggle.classList.remove("active");
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        // Update browser hash before scrolling
        window.history.pushState(null, null, href);

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Close mobile menu if open
        if (navLinks) navLinks.classList.remove("open");
        if (navToggle) navToggle.classList.remove("active");
      }
    });
  });

  // Handle cross-page navigation with hash (e.g., index.html#team)
  const hash = window.location.hash;
  if (hash && hash !== "#") {
    setTimeout(() => {
      const target = document.querySelector(hash);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 100);
  }

  // Scroll reveal animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // Observe all sections except hero (which should be visible immediately)
  document.querySelectorAll(".section:not(.hero)").forEach((section) => {
    observer.observe(section);
  });

  // Observe cards with staggered delay
  document.querySelectorAll(".team-card, .sponsor-card, .tier-card").forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(card);
  });

  // Hero section should be visible immediately
  const heroSection = document.querySelector(".hero");
  if (heroSection) {
    heroSection.classList.add("visible");
  }
});

document.addEventListener("DOMContentLoaded", () => {

  setTimeout(() => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a[href^='#']");

    const observer = new IntersectionObserver((entries) => {
      // Filter entries that are actually visible
      const visible = entries.filter(e => e.isIntersecting);
      if (visible.length === 0) return;
    
      // Find the section whose TOP is closest to the viewport top
      visible.sort((a, b) => {
        return Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top);
      });
    
      const topEntry = visible[0];
      const id = topEntry.target.id;
    
      // Update nav
      navLinks.forEach(link => link.classList.remove("active"));
      const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (activeLink) activeLink.classList.add("active");
    }, { threshold: 0.25 });
    

    sections.forEach(section => observer.observe(section));
  }, 100);

});

// Highlight EVENTS if on events pages
const eventsPages = ["current-events.html", "past-events.html"];
const currentPage = window.location.pathname.split("/").pop();

if (eventsPages.includes(currentPage)) {
  const eventsButton = document.querySelector(".nav-dropdown-toggle");
  if (eventsButton) eventsButton.classList.add("active");
}
