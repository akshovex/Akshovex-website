/* =========================================================
   AKSHOVEX - MAIN JS
   Premium enterprise front-end interactions
   Beginner-friendly and fully commented
   ========================================================= */

/* =========================================================
   1. MARK PAGE AS JS-ENABLED
   ========================================================= */
document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");

/* =========================================================
   2. HELPER SELECTORS
   ========================================================= */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

/* =========================================================
   3. THEME TOGGLE
   - Saves theme in localStorage
   - Uses inline SVG icon IDs: #icon-moon / #icon-sun
   ========================================================= */
(function setupTheme() {
  const themeToggle = $("#themeToggle");
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("akshovex-theme");

  if (savedTheme === "dark") {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
  }

  function updateThemeIcon() {
    const themeIconUse = $("#themeIcon use");
    const themeLabel = $("#themeToggle .btn__label");

    if (!themeIconUse) return;

    const isDark = root.getAttribute("data-theme") === "dark";

    themeIconUse.setAttribute("href", isDark ? "#icon-sun" : "#icon-moon");

    if (themeLabel) {
      themeLabel.textContent = "Theme";
    }

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );
      themeToggle.setAttribute(
        "title",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );
    }

    const metaThemeColor = $('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", isDark ? "#08111f" : "#2F6BFF");
    }
  }

  updateThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = root.getAttribute("data-theme") === "dark";

      if (isDark) {
        root.removeAttribute("data-theme");
        localStorage.setItem("akshovex-theme", "light");
      } else {
        root.setAttribute("data-theme", "dark");
        localStorage.setItem("akshovex-theme", "dark");
      }

      updateThemeIcon();
    });
  }
})();

/* =========================================================
   4. MOBILE NAVIGATION
   ========================================================= */
(function setupMobileNav() {
  const nav = $(".site-nav");
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");

  if (!nav || !navToggle || !navMenu) return;

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  $$(".site-nav__link", navMenu).forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = nav.contains(event.target);
    if (!clickedInsideNav) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    }
  });
})();

/* =========================================================
   5. STICKY HEADER SCROLL STATE
   ========================================================= */
(function setupHeaderScrollState() {
  const header = $(".site-header");
  if (!header) return;

  function handleScroll() {
    if (window.scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
})();

/* =========================================================
   6. PAGE LOADER
   ========================================================= */
(function setupLoader() {
  const loader = $("#siteLoader");
  if (!loader) return;

  const skipLoaderOnce = sessionStorage.getItem("akSkipLoaderOnce") === "true";

  if (skipLoaderOnce) {
    loader.classList.add("is-hidden");
    sessionStorage.removeItem("akSkipLoaderOnce");
    return;
  }

  window.addEventListener("load", () => {
    loader.classList.add("is-hidden");
  });
})();

(function setupPageTransitionLoader() {
  const loader = $("#siteLoader");
  const loaderLogo = $(".site-loader__logo");

  if (!loader || !loaderLogo) return;

  $$('a[href]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        link.target === "_blank"
      ) {
        return;
      }

      event.preventDefault();

      loader.classList.remove("is-hidden");
      loaderLogo.getAnimations().forEach((animation) => animation.cancel());
      loaderLogo.style.transform = "rotate(0deg)";

      const spin = loaderLogo.animate(
        [
          { transform: "rotate(0deg)" },
          { transform: "rotate(360deg)" }
        ],
        {
          duration: 1200,
          easing: "linear",
          iterations: 1,
          fill: "forwards"
        }
      );

      spin.onfinish = () => {
        sessionStorage.setItem("akSkipLoaderOnce", "true");
        window.location.href = href;
      };
    });
  });
})();
/* =========================================================
   7. BACK TO TOP BUTTON
   ========================================================= */
(function setupBackToTop() {
  const backToTop = $("#backToTop");
  if (!backToTop) return;

  function toggleButton() {
    if (window.scrollY > 400) {
      backToTop.classList.add("is-visible");
    } else {
      backToTop.classList.remove("is-visible");
    }
  }

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  toggleButton();
  window.addEventListener("scroll", toggleButton, { passive: true });
})();

/* =========================================================
   8. FOOTER YEAR
   ========================================================= */
(function setupYear() {
  const yearEl = $("#year");
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
})();

/* =========================================================
   9. SCROLL REVEAL
   ========================================================= */
(function setupReveal() {
  const revealItems = $$(".reveal");

  if (!revealItems.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach((item) => observer.observe(item));
})();

/* =========================================================
   10. ANIMATED COUNTERS
   ========================================================= */
(function setupCounters() {
  const counters = $$("[data-counter]");
  if (!counters.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function animateCounter(counter) {
    const target = parseFloat(counter.dataset.to || "0");
    const decimals = parseInt(counter.dataset.decimals || "0", 10);
    const suffix = counter.dataset.suffix || "";
    const duration = 1400;

    if (reducedMotion) {
      counter.textContent = target.toFixed(decimals) + suffix;
      return;
    }

    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      counter.textContent = current.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counter.textContent = target.toFixed(decimals) + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.4
    }
  );

  counters.forEach((counter) => observer.observe(counter));
})();

/* =========================================================
   11. TESTIMONIAL SLIDER
   - Fixed: uses percentage-based translateX
   - This matches .testimonial-slide { flex: 0 0 100% }
   ========================================================= */
(function setupSlider() {
  const slider = $("[data-slider]");
  if (!slider) return;

  const track = $("[data-slider-track]", slider);
  const slides = $$("[data-slide]", slider);
  const prevBtn = $("[data-slider-prev]", slider);
  const nextBtn = $("[data-slider-next]", slider);
  const dots = $$("[data-slider-dot]", slider);

  if (!track || !slides.length) return;

  let currentIndex = 0;
  const maxIndex = slides.length - 1;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let autoPlay = null;

  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentIndex);
      dot.setAttribute("aria-current", index === currentIndex ? "true" : "false");
    });
  }

  function goToSlide(index) {
    currentIndex = index;

    if (currentIndex < 0) currentIndex = maxIndex;
    if (currentIndex > maxIndex) currentIndex = 0;

    updateSlider();
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      goToSlide(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      goToSlide(currentIndex + 1);
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
    });
  });

  window.addEventListener("resize", updateSlider);

  if (!reducedMotion && slides.length > 1) {
    function stopAutoPlay() {
      if (autoPlay) {
        clearInterval(autoPlay);
        autoPlay = null;
      }
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlay = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 5000);
    }

    slider.addEventListener("mouseenter", stopAutoPlay);
    slider.addEventListener("mouseleave", startAutoPlay);
    slider.addEventListener("focusin", stopAutoPlay);
    slider.addEventListener("focusout", startAutoPlay);

    startAutoPlay();
  }

  updateSlider();
})();

/* =========================================================
   12. CONTACT FORM SUBMISSION
   ========================================================= */
(function setupContactForm() {
  const form = $("#contactForm");
  const status = $("#formStatus");

  if (!form || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = $("#name", form);
    const email = $("#email", form);
    const message = $("#message", form);

    let hasError = false;
    status.textContent = "";
    status.className = "form-status";

    [name, email, message].forEach((field) => {
      if (field) field.setCustomValidity("");
    });

    if (!name.value.trim()) {
      name.setCustomValidity("Please enter your full name.");
      hasError = true;
    }

    if (!email.value.trim()) {
      email.setCustomValidity("Please enter your work email.");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.setCustomValidity("Please enter a valid email address.");
      hasError = true;
    }

    if (!message.value.trim()) {
      message.setCustomValidity("Please describe your project or challenge.");
      hasError = true;
    }

    if (hasError) {
      form.reportValidity();
      status.textContent = "Please complete all required fields correctly.";
      status.classList.add("is-error");
      return;
    }

    const formData = {
      name: $("#name", form)?.value.trim() || "",
      email: $("#email", form)?.value.trim() || "",
      company: $("#company", form)?.value.trim() || "",
      topic: $("#topic", form)?.value || "",
      message: $("#message", form)?.value.trim() || ""
    };

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        status.textContent = "Message sent successfully. Thank you.";
        status.classList.add("is-success");
        form.reset();
      } else {
        status.textContent = "Message could not be sent. Please try again.";
        status.classList.add("is-error");
      }
    } catch (error) {
      status.textContent = "Something went wrong. Please try again.";
      status.classList.add("is-error");
    }
  });
})();

/* =========================================================
   13. NEWSLETTER FORM SUBMISSION
   ========================================================= */
(function setupNewsletterForm() {
  const form = $("#newsletterForm");
  const email = $("#newsletterEmail");
  const status = $("#newsletterStatus");

  if (!form || !email || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    status.textContent = "";
    status.className = "form-status";
    email.setCustomValidity("");

    const value = email.value.trim();

    if (!value) {
      email.setCustomValidity("Please enter your email address.");
      form.reportValidity();
      status.textContent = "Please enter your email address.";
      status.classList.add("is-error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      email.setCustomValidity("Please enter a valid email address.");
      form.reportValidity();
      status.textContent = "Please enter a valid email address.";
      status.classList.add("is-error");
      return;
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: value
        })
      });

      if (response.ok) {
        status.textContent = "Subscribed successfully. Thank you.";
        status.classList.add("is-success");
        form.reset();
      } else {
        status.textContent = "Subscription failed. Please try again.";
        status.classList.add("is-error");
      }
    } catch (error) {
      status.textContent = "Something went wrong. Please try again.";
      status.classList.add("is-error");
    }
  });
})();

/* =========================================================
   14. SAFETY: CLOSE MENU ON WINDOW RESIZE
   ========================================================= */
(function setupResizeSafety() {
  const nav = $(".site-nav");
  const navToggle = $("#navToggle");

  if (!nav || !navToggle) return;

  window.addEventListener("resize", () => {
    if (window.innerWidth > 991) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    }
  });
})();

/* =========================================================
   15. ASK AKSHOVEX CHATBOT
   - Branded assistant using your Akshovex logo
   - Includes quick chips and beginner-friendly replies
   ========================================================= */
(function setupChatbot() {
  const chatbotToggle = $("#akChatbotToggle");
  const chatbot = $("#akChatbot");
  const chatbotClose = $("#akChatbotClose");
  const chatbotBody = $("#akChatbotBody");
  const chatbotForm = $("#akChatbotForm");
  const chatbotInput = $("#akChatbotInput");
  const chatbotChips = $$("[data-chatbot-question]");

  if (!chatbotToggle || !chatbot || !chatbotBody) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const chatbotReplies = {
    services:
      "Akshovex offers cloud modernization, data platforms, cybersecurity, digital engineering, enterprise integration, and resilient delivery support.",

    caseStudies:
      "Our case studies focus on measurable business outcomes like cloud cost reduction, improved release quality, stronger cyber posture, and faster time to value.",

    contact:
      "You can contact Akshovex through the Contact page or email akshovex@gmail.com to start a consulting conversation.",

    careers:
      "For careers at Akshovex, please subscribe to our newsletter and follow our LinkedIn and social media pages for future openings, company updates, and hiring announcements.",

    cloud:
      "Our cloud work includes migration, landing zones, SRE, governance, observability, and cost optimization for enterprise environments.",

    cybersecurity:
      "Akshovex helps with cyber resilience, IAM, Zero Trust, secure architecture, AppSec, and risk-aware engineering delivery.",

    data:
      "We support data platform strategy, governed analytics, data engineering, reporting modernization, and enterprise-ready insights.",

    greeting:
      "Hello. I’m Ask Akshovex, your Akshovex virtual assistant. How can I help you today?",

    default:
      "I can help with Akshovex services, case studies, careers, cloud modernization, cybersecurity, data platforms, and how to contact the team."
  };

  function openChatbot() {
    chatbot.classList.add("is-open");
    chatbot.setAttribute("aria-hidden", "false");
    chatbotToggle.setAttribute("aria-expanded", "true");

    if (chatbotInput) {
      setTimeout(() => {
        chatbotInput.focus();
      }, reducedMotion ? 0 : 180);
    }
  }

  function closeChatbot() {
    chatbot.classList.remove("is-open");
    chatbot.setAttribute("aria-hidden", "true");
    chatbotToggle.setAttribute("aria-expanded", "false");
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function appendChatMessage(type, text) {
    const message = document.createElement("div");
    message.className = `ak-chatbot__message ak-chatbot__message--${type}`;

    if (type === "bot") {
      message.innerHTML = `
        <div class="ak-chatbot__message-avatar">
          <img src="logo-icon.png" alt="Ask Akshovex">
        </div>
        <div class="ak-chatbot__bubble">${escapeHtml(text)}</div>
      `;
    } else {
      message.innerHTML = `
        <div class="ak-chatbot__bubble">${escapeHtml(text)}</div>
      `;
    }

    chatbotBody.appendChild(message);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }

  function getBotReply(text) {
    const value = text.toLowerCase();

    if (
      value.includes("hello") ||
      value.includes("hi") ||
      value.includes("hey")
    ) {
      return chatbotReplies.greeting;
    }

    if (
      value.includes("career") ||
      value.includes("job") ||
      value.includes("jobs") ||
      value.includes("hiring") ||
      value.includes("vacancy") ||
      value.includes("work with") ||
      value.includes("join")
    ) {
      return chatbotReplies.careers;
    }

    if (
      value.includes("service") ||
      value.includes("offer") ||
      value.includes("solution") ||
      value.includes("capability")
    ) {
      return chatbotReplies.services;
    }

    if (
      value.includes("case") ||
      value.includes("study") ||
      value.includes("project") ||
      value.includes("result")
    ) {
      return chatbotReplies.caseStudies;
    }

    if (
      value.includes("contact") ||
      value.includes("email") ||
      value.includes("call") ||
      value.includes("talk") ||
      value.includes("reach")
    ) {
      return chatbotReplies.contact;
    }

    if (
      value.includes("cloud") ||
      value.includes("migration") ||
      value.includes("sre") ||
      value.includes("finops")
    ) {
      return chatbotReplies.cloud;
    }

    if (
      value.includes("security") ||
      value.includes("cyber") ||
      value.includes("zero trust") ||
      value.includes("iam")
    ) {
      return chatbotReplies.cybersecurity;
    }

    if (
      value.includes("data") ||
      value.includes("analytics") ||
      value.includes("ai") ||
      value.includes("platform")
    ) {
      return chatbotReplies.data;
    }

    return chatbotReplies.default;
  }

  chatbotToggle.addEventListener("click", () => {
    const isOpen = chatbot.classList.contains("is-open");
    if (isOpen) {
      closeChatbot();
    } else {
      openChatbot();
    }
  });

  if (chatbotClose) {
    chatbotClose.addEventListener("click", closeChatbot);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeChatbot();
    }
  });

  document.addEventListener("click", (event) => {
    const clickedInsideChatbot = chatbot.contains(event.target);
    const clickedToggle = chatbotToggle.contains(event.target);

    if (!clickedInsideChatbot && !clickedToggle && chatbot.classList.contains("is-open")) {
      closeChatbot();
    }
  });

  chatbotChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const question = chip.getAttribute("data-chatbot-question");
      if (!question) return;

      openChatbot();
      appendChatMessage("user", question);

      setTimeout(() => {
        appendChatMessage("bot", getBotReply(question));
      }, reducedMotion ? 0 : 400);
    });
  });

  if (chatbotForm && chatbotInput) {
    chatbotForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const userText = chatbotInput.value.trim();
      if (!userText) return;

      openChatbot();
      appendChatMessage("user", userText);
      chatbotInput.value = "";

      setTimeout(() => {
        appendChatMessage("bot", getBotReply(userText));
      }, reducedMotion ? 0 : 500);
    });
  }
})();
/* =========================================================
   16. CAREERS FORM SUBMISSION
   ========================================================= */
(function setupCareersForm() {
  const form = $("#careersForm");
  const status = $("#careersFormStatus");

  if (!form || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = $("#careerName", form);
    const email = $("#careerEmail", form);
    const role = $("#careerRole", form);
    const message = $("#careerMessage", form);

    let hasError = false;
    status.textContent = "";
    status.className = "form-status";

    [name, email, role, message].forEach((field) => {
      if (field) field.setCustomValidity("");
    });

    if (!name.value.trim()) {
      name.setCustomValidity("Please enter your full name.");
      hasError = true;
    }

    if (!email.value.trim()) {
      email.setCustomValidity("Please enter your email address.");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.setCustomValidity("Please enter a valid email address.");
      hasError = true;
    }

    if (!role.value.trim()) {
      role.setCustomValidity("Please select a role.");
      hasError = true;
    }

    if (!message.value.trim()) {
      message.setCustomValidity("Please tell us about yourself.");
      hasError = true;
    }

    if (hasError) {
      form.reportValidity();
      status.textContent = "Please complete all required fields correctly.";
      status.classList.add("is-error");
      return;
    }

    const formData = {
      name: $("#careerName", form)?.value.trim() || "",
      email: $("#careerEmail", form)?.value.trim() || "",
      phone: $("#careerPhone", form)?.value.trim() || "",
      role: $("#careerRole", form)?.value || "",
      profile: $("#careerLinkedin", form)?.value.trim() || "",
      message: $("#careerMessage", form)?.value.trim() || ""
    };

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        status.textContent = "Application submitted successfully. Thank you.";
        status.classList.add("is-success");
        form.reset();
      } else {
        status.textContent = "Application could not be submitted. Please try again.";
        status.classList.add("is-error");
      }
    } catch (error) {
      status.textContent = "Something went wrong. Please try again.";
      status.classList.add("is-error");
    }
  });
})();


