(() => {
  if (!window.gsap || !window.ScrollTrigger) {
    return;
  }

  const { gsap, ScrollTrigger } = window;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Keep the page fully visible and skip motion for visitors who request it.
  if (prefersReducedMotion) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Introduce the headline and salon image together when the page loads.
  gsap.from("[data-gsap='hero-copy'], [data-gsap='hero-image']", {
    autoAlpha: 0,
    y: 24,
    duration: 0.9,
    stagger: 0.16,
    ease: "power3.out"
  });

  // Reveal story sections as they enter the viewport.
  [
    { selector: "[data-gsap='fade-up']", from: { y: 32 } },
    { selector: "[data-gsap='fade-left']", from: { x: 40 } },
    { selector: "[data-gsap='fade-right']", from: { x: -40 } }
  ].forEach(({ selector, from }) => {
    gsap.utils.toArray(selector).forEach((element) => {
      gsap.from(element, {
        ...from,
        autoAlpha: 0,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 86%",
          once: true
        }
      });
    });
  });

  // Animate each card group together so cards enter in a calm, ordered rhythm.
  document.querySelectorAll(".grid").forEach((grid) => {
    const cards = Array.from(grid.children).filter((child) =>
      child.matches("[data-gsap='stagger-card']")
    );

    if (!cards.length) {
      return;
    }

    gsap.from(cards, {
      autoAlpha: 0,
      y: 24,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: grid,
        start: "top 86%",
        once: true
      }
    });
  });
})();
