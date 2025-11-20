// ==================== Animaciones y Slider unificado ====================
const sections = document.querySelectorAll(".roadmap-section");

sections.forEach(sec => {

  // ---------------- Intersection Observer ----------------
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {

        // Animar línea vertical y fade-slide
        const line = entry.target.querySelector(".line");
        if (line && !line.classList.contains("animate-line")) {
          line.classList.add("animate-line");
        }
        entry.target.querySelectorAll(".fade-slide").forEach((el, i) => {
          el.style.animationDelay = `${i * 0.2}s`;
          el.style.opacity = "1";
        });

        // Activar animaciones Docker, MySQL, PostgreSQL, MongoDB
        entry.target.querySelectorAll(".docker-line").forEach(p => p.classList.add("typing-docker"));
        entry.target.querySelectorAll(".mysql-line").forEach(p => p.classList.add("typing-mysql"));
        entry.target.querySelectorAll(".postgres-line").forEach(p => p.classList.add("typing-postgres"));
        entry.target.querySelectorAll(".mongo-line").forEach(p => p.classList.add("typing-mongo"));

        // Activar animaciones Backend
        entry.target.querySelectorAll(".node-line").forEach(p => p.classList.add("typing-node"));
        entry.target.querySelectorAll(".spring-line").forEach(p => p.classList.add("typing-spring"));
        entry.target.querySelectorAll(".dotnet-line").forEach(p => p.classList.add("typing-dotnet"));
        entry.target.querySelectorAll(".laravel-line").forEach(p => p.classList.add("typing-laravel"));

      }
    });
  }, { threshold: 0.4 });

  observer.observe(sec);

  // ---------------- Slider ----------------
  const sliderWrapper = sec.querySelector(".slider-wrapper");
  if (!sliderWrapper) return;

  const slider = sliderWrapper.querySelector(".slider");
  const slides = Array.from(slider.querySelectorAll(".slider-slide"));
  const prevBtn = sliderWrapper.querySelector(".prev-slide");
  const nextBtn = sliderWrapper.querySelector(".next-slide");
  const line = sec.querySelector(".line");
  const glow = sec.querySelector(".glow");

  let currentIndex = 0;
  const autoSlideInterval = 5000;

  // ---------------- Colores por slide ----------------
  const dbColors = [
    { line: 'linear-gradient(to bottom, #F59E0B, #F97316)', glow: '#facc15', cta: '#FBBF24' }, // Docker
    { line: 'linear-gradient(to bottom, #008bb9, #008bb9)', glow: '#008bb9', cta: '#008bb9' }, // PostgreSQL
    { line: 'linear-gradient(to bottom, #47A248, #47A248)', glow: '#47A248', cta: '#47A248' }  // MongoDB
  ];

  const frontendColors = [
    { line: 'linear-gradient(to bottom, #61DAFB, #61DAFB)', glow: '#61DAFB', cta: '#61DAFB' }, // React
    { line: 'linear-gradient(to bottom, #dd00bcff, #dd00bcff)', glow: '#dd00bcff', cta: '#dd00bcff' }, // Angular
    { line: 'linear-gradient(to bottom, #42b883, #42b883)', glow: '#42b883', cta: '#42b883' }  // Vue
  ];

  const backendColors = [
    { line: 'linear-gradient(to bottom, #E3342F, #E3342F)', glow: '#E3342F', cta: '#E3342F' }, // Laravel
    { line: 'linear-gradient(to bottom, #6DB33F, #6DB33F)', glow: '#6DB33F', cta: '#6DB33F' }, // Spring
    { line: 'linear-gradient(to bottom, #E0234E, #E0234E)', glow: '#E0234E', cta: '#E0234E' }, // Node
    { line: 'linear-gradient(to bottom, #512BD4, #512BD4)', glow: '#512BD4', cta: '#512BD4' }  // .NET Core
  ];

  // ---------------- Seleccionar colores según sección ----------------
  let slideColors;
  if (sec.classList.contains("backend-section")) {
    slideColors = backendColors;
  } else if (sec.classList.contains("frontend-section")) {
    slideColors = frontendColors;
  } else {
    slideColors = dbColors;
  }

  // ---------------- Transiciones suaves ----------------
  line.style.transition = 'background 0.5s ease';
  glow.style.transition = 'background-color 0.5s ease';
  [prevBtn, nextBtn].forEach(btn => btn.style.transition = 'background-color 0.5s ease');

  // ---------------- Clonar primer y último slide para loop infinito ----------------
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  slider.appendChild(firstClone);
  slider.prepend(lastClone);
  slider.style.transform = `translateX(-100%)`;

  // ---------------- Funciones ----------------
  function updateColors(index) {
    const realIndex = (index + slides.length) % slides.length;
    const colors = slideColors[realIndex];
    if (!colors) return;

    line.style.background = colors.line;
    glow.style.backgroundColor = colors.glow;
    prevBtn.style.backgroundColor = colors.glow;
    nextBtn.style.backgroundColor = colors.glow;

    const currentSlide = slides[realIndex];
    const cta = currentSlide.querySelector("a");
    if (cta) cta.style.backgroundColor = colors.cta;
  }

  function moveToSlide(index) {
    slider.style.transition = 'transform 0.5s ease';
    slider.style.transform = `translateX(-${(index + 1) * 100}%)`;
    currentIndex = index;
    updateColors(currentIndex);
  }

  slider.addEventListener('transitionend', () => {
    if (currentIndex >= slides.length) {
      slider.style.transition = 'none';
      slider.style.transform = `translateX(-100%)`;
      currentIndex = 0;
      updateColors(currentIndex);
    } else if (currentIndex < 0) {
      slider.style.transition = 'none';
      slider.style.transform = `translateX(-${slides.length * 100}%)`;
      currentIndex = slides.length - 1;
      updateColors(currentIndex);
    }
  });

  // ---------------- Botones ----------------
  nextBtn.addEventListener('click', () => moveToSlide(currentIndex + 1));
  prevBtn.addEventListener('click', () => moveToSlide(currentIndex - 1));

  // ---------------- Auto-slide ----------------
  let slideTimer = setInterval(() => moveToSlide(currentIndex + 1), autoSlideInterval);
  [prevBtn, nextBtn].forEach(btn => {
    btn.addEventListener('click', () => {
      clearInterval(slideTimer);
      slideTimer = setInterval(() => moveToSlide(currentIndex + 1), autoSlideInterval);
    });
  });

  // ---------------- Swipe en móviles ----------------
  let startX = 0, startY = 0, locked = false;

  sliderWrapper.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    locked = false;
    clearInterval(slideTimer);
  });

  sliderWrapper.addEventListener("touchmove", e => {
    if (locked) return;
    const deltaX = e.touches[0].clientX - startX;
    const deltaY = e.touches[0].clientY - startY;

    if (Math.abs(deltaY) > Math.abs(deltaX)) { locked = true; return; }

    if (Math.abs(deltaX) > 50) {
      locked = true;
      if (deltaX < 0) moveToSlide(currentIndex + 1);
      else moveToSlide(currentIndex - 1);
    }
  });

  sliderWrapper.addEventListener("touchend", () => {
    slideTimer = setInterval(() => moveToSlide(currentIndex + 1), autoSlideInterval);
  });

  // ---------------- Inicializar ----------------
  updateColors(currentIndex);

});
