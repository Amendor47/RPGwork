(function () {
  const progress = document.createElement("div");
  progress.className = "thesis-progress";
  progress.innerHTML = "<span></span>";
  document.body.prepend(progress);

  const tools = document.createElement("div");
  tools.className = "thesis-tools";
  tools.innerHTML = `
    <button type="button" data-action="focus" aria-pressed="false">Focus</button>
    <button type="button" data-action="top" aria-label="Back to top">Top</button>
  `;
  document.body.appendChild(tools);

  const focusButton = tools.querySelector('[data-action="focus"]');
  const topButton = tools.querySelector('[data-action="top"]');

  const savedFocus = localStorage.getItem("thesis-focus-reading") === "true";
  if (savedFocus) document.body.classList.add("focus-reading");
  focusButton.classList.toggle("is-active", savedFocus);
  focusButton.setAttribute("aria-pressed", String(savedFocus));

  function setRouteState() {
    const isChapter = window.location.hash.startsWith("#/chapter/");
    document.body.dataset.route = isChapter ? "chapter" : "home";
    focusButton.hidden = !isChapter;
  }

  function updateProgress() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const value = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
    progress.style.setProperty("--progress", value.toFixed(2));
  }

  function revealVisible() {
    document
      .querySelectorAll(
        ".section, .reader-card, .map-line article, .argument-panel, .hypotheses article, .glossary article, .chapter-text section"
      )
      .forEach((node) => node.classList.add("revealable"));
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  function observeReveals() {
    revealVisible();
    document.querySelectorAll(".revealable").forEach((node) => observer.observe(node));
  }

  function enhanceTilt() {
    const nodes = document.querySelectorAll(".reader-card, .hypotheses article, .glossary article, .hero-panel");
    nodes.forEach((node) => {
      if (node.dataset.tiltReady) return;
      node.dataset.tiltReady = "true";
      node.addEventListener("pointermove", (event) => {
        const rect = node.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 6;
        node.style.setProperty("--tilt-x", x.toFixed(2));
        node.style.setProperty("--tilt-y", y.toFixed(2));
      });
      node.addEventListener("pointerleave", () => {
        node.style.setProperty("--tilt-x", "0");
        node.style.setProperty("--tilt-y", "0");
      });
    });
  }

  function enhanceMap() {
    const cards = document.querySelectorAll(".map-line article");
    cards.forEach((card, index) => {
      if (card.dataset.mapReady) return;
      card.dataset.mapReady = "true";
      card.addEventListener("mouseenter", () => {
        cards.forEach((item, itemIndex) => item.classList.toggle("is-focused", itemIndex <= index));
      });
      card.addEventListener("mouseleave", () => {
        cards.forEach((item) => item.classList.remove("is-focused"));
      });
    });
  }

  function refresh() {
    setRouteState();
    updateProgress();
    observeReveals();
    enhanceTilt();
    enhanceMap();
  }

  focusButton.addEventListener("click", () => {
    const enabled = !document.body.classList.contains("focus-reading");
    document.body.classList.toggle("focus-reading", enabled);
    localStorage.setItem("thesis-focus-reading", String(enabled));
    focusButton.classList.toggle("is-active", enabled);
    focusButton.setAttribute("aria-pressed", String(enabled));
  });

  topButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  window.addEventListener("hashchange", () => setTimeout(refresh, 60));

  const mutationObserver = new MutationObserver(() => {
    window.requestAnimationFrame(refresh);
  });
  mutationObserver.observe(document.getElementById("root"), { childList: true, subtree: true });

  setTimeout(refresh, 100);
})();
