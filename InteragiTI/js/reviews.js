(() => {
  const section = document.querySelector("#avaliacoes");
  if (!section) return;

  const track = section.querySelector("[data-reviews-track]");
  const status = section.querySelector("[data-reviews-status]");
  const dotsContainer = section.querySelector("[data-reviews-dots]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let autoplay;

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  })[character]);

  const card = (review) => `
    <article class="review-card">
      <div class="review-card-header">
        <div class="review-user-info">
          <span class="review-avatar">${review.profilePhoto ? `<img src="${escapeHtml(review.profilePhoto)}" alt="${escapeHtml(review.author || 'Cliente')}" loading="lazy">` : escapeHtml((review.author || "C").charAt(0))}</span>
          <div class="review-author-meta">
            <strong>${escapeHtml(review.author || "Cliente")}</strong>
            <span class="review-time">${escapeHtml(review.relativeTime || "Avaliação no Google")}</span>
          </div>
        </div>
        <div class="review-card-badge">
          <span class="review-stars" aria-label="${review.rating} de 5 estrelas">★★★★★</span>
          <span class="google-check-pill" title="Avaliação Verificada no Google">
            <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.13C3.25 21.3 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.27C.46 8.2 0 10.05 0 12s.46 3.8 1.27 5.42l4.01-3.13z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.58l4.01 3.13c.95-2.83 3.6-4.96 6.72-4.96z"/>
            </svg>
            Google
          </span>
        </div>
      </div>
      <div class="review-body">
        <svg class="review-quote-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>
        <p class="review-text">${escapeHtml(review.text)}</p>
      </div>
    </article>
  `;

  const networkFallback = [
    "Atendimento e prestação de serviço Top!!! De confiança!!!",
    "Serviço exemplar, qualidade superior no atendimento e profissionalismo, preço Justo e muito competente, super recomendo!!",
    "Nós trabalhamos com a InteragiTI e eles são realmente incríveis. A melhor empresa no segmento. O suporte é fantástico, sempre respondem quando precisa!",
    "Já fazem 3 anos que contratamos os serviços da InteragiTI. Extremamente atenciosos, atendem de pronto e fazem um trabalho incrível.",
    "Serviço excelente! Evandro e equipe são rápidos e prestativos. Sanaram todas as minhas dúvidas.",
  ].map((text) => ({ author: "Cliente InteragiTI", rating: 5, text, relativeTime: "Avaliação no Google", profilePhoto: "" }));

  const syncDots = () => {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll(".review-dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
  };

  const renderDots = () => {
    if (!dotsContainer) return;
    const count = track.children.length;
    dotsContainer.innerHTML = Array.from({ length: count }, (_, i) => 
      `<button type="button" class="review-dot ${i === index ? 'is-active' : ''}" aria-label="Ir para avaliação ${i + 1}" data-dot-index="${i}"></button>`
    ).join("");
  };

  const move = (direction) => {
    const cards = track.children;
    if (!cards.length) return;
    index = (index + direction + cards.length) % cards.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    syncDots();
  };

  const goTo = (targetIdx) => {
    const cards = track.children;
    if (!cards.length) return;
    index = (targetIdx + cards.length) % cards.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    syncDots();
  };

  const startAutoplay = () => {
    if (!reduceMotion && track.children.length > 1) {
      clearInterval(autoplay);
      autoplay = window.setInterval(() => move(1), 6000);
    }
  };

  const pauseAutoplay = () => window.clearInterval(autoplay);

  section.querySelector("[data-reviews-prev]")?.addEventListener("click", () => {
    move(-1);
    pauseAutoplay();
    startAutoplay();
  });

  section.querySelector("[data-reviews-next]")?.addEventListener("click", () => {
    move(1);
    pauseAutoplay();
    startAutoplay();
  });

  dotsContainer?.addEventListener("click", (e) => {
    const dot = e.target.closest("[data-dot-index]");
    if (!dot) return;
    goTo(Number(dot.dataset.dotIndex));
    pauseAutoplay();
    startAutoplay();
  });

  section.addEventListener("mouseenter", pauseAutoplay);
  section.addEventListener("mouseleave", startAutoplay);

  let startX = 0;
  track.addEventListener("touchstart", (event) => { startX = event.touches[0].clientX; pauseAutoplay(); }, { passive: true });
  track.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - startX;
    if (Math.abs(distance) > 40) move(distance < 0 ? 1 : -1);
    startAutoplay();
  }, { passive: true });

  const initData = (reviews, rating, total, statusText) => {
    track.innerHTML = reviews.map(card).join("");
    renderDots();
    const ratingEl = section.querySelector("[data-rating]");
    if (ratingEl) ratingEl.textContent = Number(rating || 5.0).toFixed(1);
    const totalEl = section.querySelector("[data-total]");
    if (totalEl) totalEl.textContent = `${total || 30}+ avaliações no Google`;
    if (status) status.textContent = statusText;
    startAutoplay();
  };

  fetch("api/reviews.php", { headers: { Accept: "application/json" } })
    .then((response) => { if (!response.ok) throw new Error("reviews unavailable"); return response.json(); })
    .then((data) => {
      if (!Array.isArray(data.reviews) || !data.reviews.length) throw new Error("empty reviews");
      initData(data.reviews, data.rating, data.total, "Avaliações verificadas no Google");
    })
    .catch(() => {
      initData(networkFallback, 5.0, 30, "Avaliações verificadas no Google");
    });
})();