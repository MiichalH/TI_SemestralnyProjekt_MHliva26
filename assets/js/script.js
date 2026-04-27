/* ================================================
   HELIOS TRAVEL — script.js
   Všetok JavaScript pre projekt
   ================================================ */

// ------------------------------------------------
// 1. DARK MODE — prepínač svetlý/tmavý režim
// ------------------------------------------------
const darkModeToggle = document.getElementById('darkModeToggle');

// Načítaj uloženú preferenciu pri načítaní stránky
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode');
  if (darkModeToggle) darkModeToggle.textContent = '☀️ Svetlý';
}

if (darkModeToggle) {
  darkModeToggle.addEventListener('click', function () {
    // Prepni dark mode triedu na body
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
      this.textContent = '☀️ Svetlý';
    } else {
      localStorage.setItem('theme', 'light');
      this.textContent = '🌙 Tmavý';
    }
  });
}

// ------------------------------------------------
// 2. NAVBAR — scroll efekt (pridanie triedy .scrolled)
// ------------------------------------------------
const navbar = document.querySelector('.navbar');

if (navbar) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ------------------------------------------------
// 3. TOAST — notifikácia po odoslaní formulára
// ------------------------------------------------
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

if (contactForm && submitBtn) {
  submitBtn.addEventListener('click', function (e) {
    e.preventDefault();

    // Jednoduchá validácia — skontroluj povinné polia
    const name = document.getElementById('meno');
    const email = document.getElementById('email');
    const message = document.getElementById('sprava');
    const gdpr = document.getElementById('gdpr');

    let isValid = true;

    // Skontroluj každé povinné pole
    [name, email, message].forEach(function (field) {
      if (!field.value.trim()) {
        field.classList.add('is-invalid');
        isValid = false;
      } else {
        field.classList.remove('is-invalid');
      }
    });

    if (gdpr && !gdpr.checked) {
      gdpr.classList.add('is-invalid');
      isValid = false;
    } else if (gdpr) {
      gdpr.classList.remove('is-invalid');
    }

    if (!isValid) {
      // Zobraz chybovú notifikáciu
      showToast('Prosím vyplňte všetky povinné polia.', 'error');
      return;
    }

    // Formulár je vyplnený — zobraz úspešný toast
    showToast('Ďakujeme! Vaša správa bola odoslaná. Ozveme sa do 24 hodín.', 'success');

    // Vynuluj formulár po odoslaní
    contactForm.reset();
  });
}

// Pomocná funkcia pre zobrazenie Toast notifikácie
function showToast(message, type) {
  const toastEl = document.getElementById('formToast');
  const toastBody = document.getElementById('toastBody');

  if (!toastEl || !toastBody) return;

  toastBody.textContent = message;

  // Nastav farbu podľa typu správy
  toastEl.classList.remove('border-success', 'border-danger');
  if (type === 'success') {
    toastEl.classList.add('border-success');
  } else {
    toastEl.classList.add('border-danger');
  }

  // Aktivuj Bootstrap Toast
  const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
  toast.show();
}

// ------------------------------------------------
// 4. POČÍTADLO — animácia čísiel v hero sekcii
// ------------------------------------------------
function animateCounter(element, target, duration) {
  let start = 0;
  const increment = target / (duration / 16);

  const timer = setInterval(function () {
    start += increment;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(start) + (element.dataset.suffix || '');
  }, 16);
}

// Spusti počítadlá keď sú viditeľné (Intersection Observer)
const counters = document.querySelectorAll('.stat-number[data-target]');

if (counters.length > 0) {
  const observerOptions = {
    threshold: 0.5
  };

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target, 1500);
      }
    });
  }, observerOptions);

  counters.forEach(function (counter) {
    counterObserver.observe(counter);
  });
}

// ------------------------------------------------
// 5. PODMIENENÝ FORMULÁR — zobrazenie/skrytie poľa
//    Ak sa vyberie zájazd "Iné", zobraz textové pole
// ------------------------------------------------
const zajazdSelect = document.getElementById('zajazd');
const ineWrapper = document.getElementById('ineWrapper');

if (zajazdSelect && ineWrapper) {
  zajazdSelect.addEventListener('change', function () {
    if (this.value === 'ine') {
      ineWrapper.style.display = 'block';
      ineWrapper.querySelector('input').setAttribute('required', '');
    } else {
      ineWrapper.style.display = 'none';
      ineWrapper.querySelector('input').removeAttribute('required');
    }
  });
}

// ------------------------------------------------
// 6. SMOOTH SCROLL — pre anchor linky
// ------------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ------------------------------------------------
// 7. NAVBAR — zatvorenie hamburger menu po kliknutí na link
// ------------------------------------------------
const navLinks = document.querySelectorAll('.nav-link');
const navbarCollapse = document.querySelector('.navbar-collapse');

navLinks.forEach(function (link) {
  link.addEventListener('click', function () {
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      if (bsCollapse) bsCollapse.hide();
    }
  });
});

// ------------------------------------------------
// 8. GALÉRIA — modal po kliknutí na obrázok (index.html)
// ------------------------------------------------
const galleryImages = document.querySelectorAll('.gallery-thumb');

galleryImages.forEach(function (img) {
  img.addEventListener('click', function () {
    const modalImg = document.getElementById('galleryModalImg');
    const modalCaption = document.getElementById('galleryModalCaption');

    if (modalImg && modalCaption) {
      modalImg.src = this.src;
      modalCaption.textContent = this.alt;
    }
  });
});
