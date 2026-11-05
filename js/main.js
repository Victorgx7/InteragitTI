(() => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const nav = document.querySelector(".site-nav");
  const menuButton = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-links");
  const techOrbit = document.querySelector(".interagi-tech-orbit");
  const mobileWhatsapp = document.querySelector(".interagi-mobile-whatsapp");
  const finalCta = document.querySelector(".cta-section, .about-cta");
  const dropdown = document.querySelector(".nav-dropdown");
  const navigationProgress = document.createElement("div");
  navigationProgress.className = "navigation-progress";
  navigationProgress.setAttribute("aria-hidden", "true");
  document.body.append(navigationProgress);

  if (!reduceMotion) {
    document.querySelectorAll("a[href]").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          link.target === "_blank"
        )
          return;
        if (document.body.classList.contains("is-leaving")) return;
        const destination = new URL(link.href, window.location.href);
        if (
          destination.origin !== window.location.origin ||
          !destination.pathname.endsWith(".html") ||
          destination.href === window.location.href
        )
          return;
        event.preventDefault();
        navigationProgress.classList.add("is-active");
        document.body.classList.add("is-leaving");
        window.setTimeout(() => {
          navigationProgress.style.width = "100%";
          window.location.href = destination.href;
        }, 450);
      });
    });
  }

  const setNavState = () => {
    nav?.classList.toggle("is-scrolled", window.scrollY > 12);
    const finalCtaApproaching =
      finalCta && finalCta.getBoundingClientRect().top <= window.innerHeight * 0.85;
    mobileWhatsapp?.classList.toggle(
      "is-visible",
      window.scrollY > 220 && !finalCtaApproaching,
    );
    if (techOrbit && !reduceMotion) {
      const scrollProgress = Math.min(window.scrollY / 600, 1);
      const scale = 1 - scrollProgress * 0.18;
      techOrbit.style.setProperty("--interagi-tech-scroll-scale", scale.toFixed(3));
    }
  };
  setNavState();
  window.addEventListener("scroll", setNavState, { passive: true });

  if (menuButton && menu) {
    const closeMenu = () => {
      menu.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menu");
      document.body.classList.remove("menu-open");

      const openDropdown = menu.querySelector(".nav-dropdown.open");
      if (openDropdown) {
        openDropdown.classList.remove("open");
        const toggle = openDropdown.querySelector(".nav-dropdown-toggle");
        toggle?.setAttribute("aria-expanded", "false");
      }
    };
    menuButton.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
      document.body.classList.toggle("menu-open", isOpen);
    });
    menu.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", closeMenu),
    );
    document.addEventListener("click", (event) => {
      if (!nav?.contains(event.target)) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) closeMenu();
    }, { passive: true });
  }

  if (dropdown) {
    const dropdownButton = dropdown.querySelector(".nav-dropdown-toggle");
    const closeDropdown = () => {
      dropdown.classList.remove("open");
      dropdownButton?.setAttribute("aria-expanded", "false");
    };
    dropdownButton?.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      const isOpen = dropdown.classList.toggle("open");
      dropdownButton.setAttribute("aria-expanded", String(isOpen));
    });
    dropdown.querySelectorAll(".nav-dropdown-menu a").forEach((link) =>
      link.addEventListener("click", () => {
        closeDropdown();
        if (menu?.classList.contains("open")) {
          menu.classList.remove("open");
          menuButton?.setAttribute("aria-expanded", "false");
          menuButton?.setAttribute("aria-label", "Abrir menu");
          document.body.classList.remove("menu-open");
        }
      }),
    );
    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) closeDropdown();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeDropdown();
    });
  }

  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.append(progress);
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });

  const revealTargets = document.querySelectorAll(
    ".section-head, .service-card, .bento-card, .cert-info-cell, .plan-card, .contact-info-block, .process-list li, .cta-box, .certificate-explainer article, .certificate-use-card, .systems-problems, .systems-offers-head, .systems-offer-card, .reviews-box, .number-card, .about-value-card, .site-footer, body > footer:not(.site-footer)",
  );
  revealTargets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty(
      "--reveal-delay",
      `${Math.min(index % 4, 3) * 70}ms`,
    );
  });
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.14 },
    );
    revealTargets.forEach((element) => observer.observe(element));
  }

  if (!reduceMotion) {
    document
      .querySelectorAll(".service-card, .bento-card, .plan-card, .cert-info-cell, .contact-info-block, .map-embed, .certificate-explainer article, .certificate-use-card, .systems-problems, .systems-offer-card, .review-card, .number-card, .about-value-card")
      .forEach((card) => {
        card.addEventListener("pointermove", (event) => {
          const bounds = card.getBoundingClientRect();
          card.style.setProperty(
            "--pointer-x",
            `${((event.clientX - bounds.left) / bounds.width) * 100}%`,
          );
          card.style.setProperty(
            "--pointer-y",
            `${((event.clientY - bounds.top) / bounds.height) * 100}%`,
          );
        });
      });
  }

  const form = document.querySelector("#contactForm");
  if (form)
    form.addEventListener(
      "submit",
      () => {
        form.classList.add("is-submitting");
        window.setTimeout(() => form.classList.remove("is-submitting"), 1200);
      },
      { capture: true },
    );

  const animateNumber = (element) => {
    const original = element.textContent.trim();
    const target = Number.parseInt(original, 10);
    if (Number.isNaN(target)) return;
    const suffix = original.replace(String(target), "");
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / 1150, 1);
      element.firstChild.nodeValue = `${Math.round(target * (1 - Math.pow(1 - progress, 3)))}`;
      if (progress < 1) requestAnimationFrame(tick);
      else element.firstChild.nodeValue = `${target}`;
    };
    if (!reduceMotion) requestAnimationFrame(tick);
    else element.firstChild.nodeValue = `${target}`;
    element.dataset.animated = "true";
    element.dataset.suffix = suffix;
  };
  const numberCards = document.querySelectorAll(".number-card strong");
  if (numberCards.length && "IntersectionObserver" in window && !reduceMotion) {
    const numberObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.animated) {
            animateNumber(entry.target);
            numberObserver.unobserve(entry.target);
          }
        }),
      { threshold: 0.6 },
    );
    numberCards.forEach((number) => numberObserver.observe(number));
  } else numberCards.forEach(animateNumber);

  if (!reduceMotion) {
    document
      .querySelectorAll(".about-value-card, .number-card")
      .forEach((card) => {
        card.addEventListener("pointermove", (event) => {
          const box = card.getBoundingClientRect();
          card.style.setProperty(
            "--rotate-y",
            `${((event.clientX - box.left) / box.width - 0.5) * 5}deg`,
          );
          card.style.setProperty(
            "--rotate-x",
            `${((event.clientY - box.top) / box.height - 0.5) * -5}deg`,
          );
          card.classList.add("is-tilting");
        });
        card.addEventListener("pointerleave", () =>
          card.classList.remove("is-tilting"),
        );
      });
    document
      .querySelectorAll(".btn, .btn-primary-lg, .btn-nav-cta, .plan-cta")
      .forEach((button) => {
        button.addEventListener("pointermove", (event) => {
          const box = button.getBoundingClientRect();
          button.style.setProperty(
            "--magnetic-x",
            `${((event.clientX - box.left) / box.width - 0.5) * 5}px`,
          );
          button.style.setProperty(
            "--magnetic-y",
            `${((event.clientY - box.top) / box.height - 0.5) * 5}px`,
          );
        });
        button.addEventListener("pointerleave", () => {
          button.style.removeProperty("--magnetic-x");
          button.style.removeProperty("--magnetic-y");
        });
      });
    const orbit = document.querySelector(".about-orbit");
    const orbitHero = document.querySelector(".about-hero");
    if (orbit && orbitHero)
      orbitHero.addEventListener("pointermove", (event) => {
        const box = orbitHero.getBoundingClientRect();
        orbit.style.setProperty(
          "--orbit-x",
          `${((event.clientX - box.left) / box.width - 0.5) * 13}px`,
        );
        orbit.style.setProperty(
          "--orbit-y",
          `${((event.clientY - box.top) / box.height - 0.5) * 13}px`,
        );
      });
  }
})();
