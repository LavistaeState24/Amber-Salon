const salonWhatsappNumber = "9512517604";

async function loadPartial(targetId, path) {
  const target = document.getElementById(targetId);
  if (!target) return;

  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load ${path}: ${response.status}`);
    }

    target.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}

function setCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}

function handleMobileMenu() {
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  if (!menuToggle || !mobileMenu) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.classList.toggle("hidden");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      mobileMenu.classList.add("hidden");
    });
  });
}

function handleServicesDropdown() {
  const toggle = document.querySelector("[data-services-toggle]");
  const menu = document.querySelector("[data-services-menu]");
  const chevron = document.querySelector("[data-services-chevron]");
  const mobileToggle = document.querySelector("[data-mobile-services-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-services-menu]");
  const mobileChevron = document.querySelector("[data-mobile-services-chevron]");

  if (toggle && menu && chevron) {
    const closeDesktopMenu = () => {
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.add("hidden", "pointer-events-none", "opacity-0");
      chevron.classList.remove("rotate-180");
    };

    const openDesktopMenu = () => {
      toggle.setAttribute("aria-expanded", "true");
      menu.classList.remove("hidden");
      menu.classList.remove("pointer-events-none", "opacity-0");
      chevron.classList.add("rotate-180");
    };

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeDesktopMenu();
      } else {
        openDesktopMenu();
      }
    });

    menu.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    document.addEventListener("click", closeDesktopMenu);
  }

  if (mobileToggle && mobileMenu && mobileChevron) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mobileToggle.getAttribute("aria-expanded") === "true";
      mobileToggle.setAttribute("aria-expanded", String(!isOpen));
      mobileMenu.classList.toggle("hidden");
      mobileChevron.classList.toggle("rotate-180", !isOpen);
    });
  }
}

function highlightActiveLinks() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll("[data-nav-link]");
  const servicePages = ["services.html", "packages.html"];

  navLinks.forEach((link) => {
    const match = link.getAttribute("data-nav-match") || "";
    const matchedPage = match.split("#")[0];
    const isActive =
      matchedPage === page ||
      (servicePages.includes(page) && match.startsWith("services.html"));

    if (isActive) {
      link.classList.add("text-amberpurple-rich");
      link.classList.remove("text-amberpurple-deep/75", "text-amberpurple-deep/80");
    }
  });

  const servicesToggle = document.querySelector("[data-services-toggle]");
  if (servicesToggle && servicePages.includes(page)) {
    servicesToggle.classList.add("text-amberpurple-rich");
    servicesToggle.classList.remove("text-amberpurple-deep/75");
  }
}

function setupRevealAnimations() {
  const revealNodes = document.querySelectorAll(".reveal");
  if (!revealNodes.length) return;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));
}

function setupFaqs() {
  const faqButtons = document.querySelectorAll("[data-faq-button]");

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const currentItem = button.closest("article");
      const currentAnswer = currentItem?.querySelector("[data-faq-answer]");
      const currentIcon = button.querySelector("[data-faq-icon]");
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      faqButtons.forEach((otherButton) => {
        otherButton.setAttribute("aria-expanded", "false");
        const otherItem = otherButton.closest("article");
        const otherAnswer = otherItem?.querySelector("[data-faq-answer]");
        const otherIcon = otherButton.querySelector("[data-faq-icon]");
        otherAnswer?.classList.remove("is-open");
        otherIcon?.classList.remove("rotate-45");
      });

      if (!isExpanded) {
        button.setAttribute("aria-expanded", "true");
        currentAnswer?.classList.add("is-open");
        currentIcon?.classList.add("rotate-45");
      }
    });
  });
}

function setupBackToTopAndHeader() {
  const header = document.querySelector("[data-site-header]");
  const backToTop = document.querySelector("[data-back-to-top]");

  const syncScrollState = () => {
    const hasScrolled = window.scrollY > 24;

    if (header) {
      header.classList.toggle("shadow-[0_16px_40px_rgba(49,18,75,0.08)]", hasScrolled);
    }

    if (backToTop) {
      backToTop.classList.toggle("translate-y-0", window.scrollY > 420);
      backToTop.classList.toggle("opacity-100", window.scrollY > 420);
      backToTop.classList.toggle("pointer-events-auto", window.scrollY > 420);
      backToTop.classList.toggle("translate-y-4", window.scrollY <= 420);
      backToTop.classList.toggle("opacity-0", window.scrollY <= 420);
      backToTop.classList.toggle("pointer-events-none", window.scrollY <= 420);
    }
  };

  syncScrollState();
  window.addEventListener("scroll", syncScrollState);

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

function setupWhatsappForms() {
  const whatsappForms = document.querySelectorAll("[data-whatsapp-form]");

  whatsappForms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const messageLines = [
        "Hello Amber Salon by Heer,",
        "",
        ...Array.from(formData.entries()).map(([key, value]) => {
          const label = key.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
          return `${label}: ${String(value).trim()}`;
        })
      ];

      const message = messageLines.join("\n");
      const whatsappUrl = `https://wa.me/${salonWhatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    });
  });
}

function initializeLayout() {
  setCurrentYear();
  handleMobileMenu();
  handleServicesDropdown();
  highlightActiveLinks();
  setupRevealAnimations();
  setupFaqs();
  setupBackToTopAndHeader();
  setupWhatsappForms();
}

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadPartial("navbar", "./components/navbar.html"),
    loadPartial("footer", "./components/footer.html")
  ]);

  initializeLayout();
});

// contact form submission to WhatsApp

const contactWhatsappNumber = "919512517604";
const contactForm = document.getElementById("contact-form");
const preferredDateInput = document.getElementById("preferred-date");
const feedbackNode = document.getElementById("form-feedback");

if (preferredDateInput) {
  const today = new Date();
  const offsetDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
  preferredDateInput.min = offsetDate.toISOString().split("T")[0];
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const formData = new FormData(contactForm);
    const fullName = String(formData.get("fullName") || "").trim();
    const mobile = String(formData.get("mobile") || "").trim();
    const email = String(formData.get("email") || "").trim() || "N/A";
    const enquiryType = String(formData.get("enquiryType") || "").trim();
    const service = String(formData.get("service") || "").trim();
    const preferredDate = String(formData.get("preferredDate") || "").trim();
    const preferredTime = String(formData.get("preferredTime") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const whatsappMessage = [
      "Hello Amber Salon by Heer,",
      "",
      "I would like to enquire/book an appointment.",
      "",
      `Name: ${fullName}`,
      `Mobile: ${mobile}`,
      `Email: ${email}`,
      `Enquiry Type: ${enquiryType}`,
      `Service: ${service}`,
      `Preferred Date: ${preferredDate}`,
      `Preferred Time: ${preferredTime}`,
      `Message: ${message}`,
      "",
      "Please contact me regarding my appointment."
    ].join("\n");

    if (feedbackNode) {
      feedbackNode.textContent = "Opening WhatsApp with your booking details...";
      feedbackNode.classList.remove("hidden");
    }

    window.open(
      `https://wa.me/${contactWhatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`,
      "_blank",
      "noopener,noreferrer"
    );
  });
}


