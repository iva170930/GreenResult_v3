const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");
const dropdownTriggers = document.querySelectorAll(".nav-trigger");

const headerNode = document.querySelector(".header");
if (headerNode) {
  let isHeaderScrolled = false;
  let isScrollUpdateQueued = false;

  const syncHeaderScrollState = () => {
    const nextState = window.scrollY > 50;
    if (nextState !== isHeaderScrolled) {
      isHeaderScrolled = nextState;
      headerNode.classList.toggle("scrolled", nextState);
    }
    isScrollUpdateQueued = false;
  };

  syncHeaderScrollState();
  window.addEventListener("scroll", () => {
    if (!isScrollUpdateQueued) {
      isScrollUpdateQueued = true;
      requestAnimationFrame(syncHeaderScrollState);
    }
  }, { passive: true });
}

function setActiveMenuItem() {
  if (!menu) {
    return;
  }

  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = menu.querySelectorAll("a[href]");
  const servicesPages = new Set([
    "service.html",
    "services.html",
    "service-finishing.html",
    "service-electrics.html",
    "service-hydraulics.html",
    "service-floors.html"
  ]);

  let hasActiveServicesLink = false;

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
      return;
    }

    const linkPath = href.split("/").pop();
    const isActive = linkPath === currentPath;

    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }

    if (link.closest(".dropdown-menu") && isActive) {
      hasActiveServicesLink = true;
    }
  });

  const isServicesRoute = servicesPages.has(currentPath);
  const shouldHighlightServices = hasActiveServicesLink || isServicesRoute;

  dropdownTriggers.forEach((trigger) => {
    trigger.classList.toggle("is-active", shouldHighlightServices);
    if (shouldHighlightServices) {
      trigger.setAttribute("aria-current", "page");
    } else {
      trigger.removeAttribute("aria-current");
    }
  });
}

setActiveMenuItem();

function renderUnifiedFooter() {
  const footer = document.querySelector(".footer");
  if (!footer) return;

  footer.classList.add("site-footer");
  footer.innerHTML = `
    <div class="container site-footer-grid">
      <div class="site-footer-brand">
        <a class="site-footer-logo" href="index.html" aria-label="GREEN-RESULT - главная страница">
          <img src="images/logo.png" alt="" width="44" height="44">
          <span>GREEN-RESULT</span>
        </a>
        <p>Комплексный ремонт квартир и домов под ключ в Польше. Чёткие сроки, прозрачная смета и контроль качества на каждом этапе.</p>
        <a class="site-footer-call" href="tel:+48500000000">+48 500 000 000</a>
      </div>

      <nav class="site-footer-column" aria-label="Навигация в подвале">
        <h2>Навигация</h2>
        <a href="index.html">Главная</a>
        <a href="services.html">Наши услуги</a>
        <a href="cases.html">Реализации</a>
        <a href="about.html">О компании</a>
        <a href="contacts.html">Контакты</a>
      </nav>

      <nav class="site-footer-column" aria-label="Услуги">
        <h2>Услуги</h2>
        <a href="service-finishing.html">Ванные комнаты под ключ</a>
        <a href="service-electrics.html">Электромонтаж</a>
        <a href="service-hydraulics.html">Сантехнические работы</a>
        <a href="service-floors.html">Отделка стен и полов</a>
      </nav>

      <address class="site-footer-column site-footer-contacts">
        <h2>Связаться с нами</h2>
        <a href="tel:+48500000000">+48 500 000 000</a>
        <a href="mailto:iva170930@gmail.com">iva170930@gmail.com</a>
        <p>Варшава и область<br>Работаем по всей Польше</p>
        <p class="site-footer-hours">Пн-Сб: 09:00-19:00</p>
      </address>
    </div>
    <div class="container site-footer-bottom">
      <span>© <span data-footer-year></span> GREEN-RESULT. Все права защищены.</span>
      <a href="contacts.html">Получить консультацию</a>
    </div>
  `;

  const year = footer.querySelector("[data-footer-year]");
  if (year) year.textContent = new Date().getFullYear();
}

renderUnifiedFooter();

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

dropdownTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const parent = trigger.closest(".nav-item");
    if (!parent) {
      return;
    }

    const isOpen = parent.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", String(isOpen));

    dropdownTriggers.forEach((otherTrigger) => {
      const otherParent = otherTrigger.closest(".nav-item");
      if (otherTrigger !== trigger && otherParent) {
        otherParent.classList.remove("is-open");
        otherTrigger.setAttribute("aria-expanded", "false");
      }
    });
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-item")) {
    dropdownTriggers.forEach((trigger) => {
      const parent = trigger.closest(".nav-item");
      if (parent) {
        parent.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

function observeReveals(root = document) {
  root.querySelectorAll(".reveal").forEach((element) => {
    if (!element.classList.contains("is-visible")) {
      revealObserver.observe(element);
    }
  });
}

observeReveals();

window.observeReveals = observeReveals;

const yearSlot = document.getElementById("year");

if (yearSlot) {
  yearSlot.textContent = new Date().getFullYear();
}

// Portfolio lightbox (home page)
const portfolioItems = document.querySelectorAll(".portfolio-item");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

if (portfolioItems.length && lightbox && lightboxImg) {
  const lightboxClose = lightbox.querySelector(".lightbox-close");
  const lightboxPrev = lightbox.querySelector(".lightbox-prev");
  const lightboxNext = lightbox.querySelector(".lightbox-next");
  const lightboxBg = lightbox.querySelector(".lightbox-bg");
  const srcs = Array.from(portfolioItems).map((item) => item.dataset.src || "");
  let currentIndex = 0;

  const openLightbox = (index) => {
    currentIndex = index;
    lightboxImg.src = srcs[currentIndex];
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  };

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + srcs.length) % srcs.length;
    lightboxImg.src = srcs[currentIndex];
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % srcs.length;
    lightboxImg.src = srcs[currentIndex];
  };

  portfolioItems.forEach((item, i) => item.addEventListener("click", () => openLightbox(i)));
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxBg) lightboxBg.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", showPrev);
  if (lightboxNext) lightboxNext.addEventListener("click", showNext);

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("active")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showPrev();
    if (event.key === "ArrowRight") showNext();
  });
}

// Reviews slider (home page)
const reviewCards = document.querySelectorAll(".review-card");
const dots = document.querySelectorAll(".dot");
const reviewsPrev = document.querySelector(".reviews-prev");
const reviewsNext = document.querySelector(".reviews-next");
let reviewIndex = 0;
let reviewTimer;

if (reviewCards.length && dots.length && reviewsPrev && reviewsNext) {
  const showReview = (index) => {
    reviewCards.forEach((card) => card.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));
    reviewIndex = (index + reviewCards.length) % reviewCards.length;
    reviewCards[reviewIndex].classList.add("active");
    dots[reviewIndex].classList.add("active");
  };

  const startReviewTimer = () => {
    clearInterval(reviewTimer);
    reviewTimer = setInterval(() => showReview(reviewIndex + 1), 4000);
  };

  reviewsPrev.addEventListener("click", () => {
    showReview(reviewIndex - 1);
    startReviewTimer();
  });

  reviewsNext.addEventListener("click", () => {
    showReview(reviewIndex + 1);
    startReviewTimer();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showReview(Number(dot.dataset.index || 0));
      startReviewTimer();
    });
  });

  startReviewTimer();
}
