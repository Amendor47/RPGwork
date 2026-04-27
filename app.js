(function () {
  const { useEffect, useMemo, useState } = React;
  const html = htm.bind(React.createElement);
  const content = window.siteContent;
  const pages = window.thesisChapters || [];

  function setHash(hash) {
    window.location.hash = hash;
  }

  function pageHash(page) {
    return `#/chapter/${page.id}`;
  }

  function currentRoute() {
    const hash = window.location.hash || "#";
    const match = hash.match(/^#\/chapter\/(.+)$/);
    return match ? { type: "chapter", id: match[1] } : { type: "home", id: hash.replace(/^#/, "") || "home" };
  }

  function readingMinutes(page) {
    return Math.max(1, Math.round((page.wordCount || 0) / 230));
  }

  function Header({ route }) {
    const [open, setOpen] = useState(false);
    return html`
      <header className="topbar">
        <button className="brand" onClick=${() => setHash("#home")} type="button">
          <span></span>
          <strong>Active Kantianism</strong>
        </button>
        <nav className=${open ? "nav is-open" : "nav"}>
          ${content.nav.map(
            ([id, label]) => html`
              <button
                key=${id}
                type="button"
                className=${route.id === id ? "active" : ""}
                onClick=${() => {
                  setHash(`#${id}`);
                  setOpen(false);
                }}
              >
                ${label}
              </button>
            `
          )}
        </nav>
        <button className="menu" type="button" onClick=${() => setOpen(!open)} aria-label="Open menu">
          <i></i><i></i>
        </button>
      </header>
    `;
  }

  function Hero() {
    const totalWords = pages.reduce((sum, page) => sum + (page.wordCount || 0), 0);
    return html`
      <section className="hero section" id="home">
        <div className="hero-copy">
          <p className="eyebrow">Readable thesis website</p>
          <h1>${content.meta.title}</h1>
          <p className="subtitle">${content.meta.subtitle}</p>
          <p className="abstract">${content.meta.abstract}</p>
          <div className="actions">
            <button type="button" onClick=${() => setHash("#reader")}>Read the thesis</button>
            <button type="button" className="ghost" onClick=${() => setHash("#map")}>Explore the argument</button>
          </div>
          <div className="meta">
            <span>${content.meta.author}</span>
            <span>${content.meta.institution}</span>
            <span>${content.meta.supervisor}</span>
          </div>
        </div>
        <aside className="hero-panel">
          <p>Central research question</p>
          <h2>${content.meta.question}</h2>
          <div className="stat-row">
            <strong>${pages.filter((page) => page.type === "chapter").length}</strong><span>chapters</span>
            <strong>${totalWords.toLocaleString("en-US")}</strong><span>words online</span>
          </div>
        </aside>
      </section>
    `;
  }

  function ReaderIndex() {
    return html`
      <section className="section reader" id="reader">
        <div className="section-head">
          <p className="eyebrow">Final thesis reader</p>
          <h2>Read the final draft chapter by chapter.</h2>
          <p>
            The thesis has been transposed from Introduction to Conclusion into isolated
            reading pages with clean typography, internal navigation and a continuous
            intellectual progression.
          </p>
        </div>
        <div className="reader-grid">
          ${pages.map(
            (page) => html`
              <article className=${page.type === "part" ? "reader-card part-card" : "reader-card"} key=${page.id}>
                <div className="card-meta">
                  <span>${page.type === "part" ? page.number : `Chapter ${page.number}`}</span>
                  <span>${page.wordCount.toLocaleString("en-US")} words</span>
                </div>
                <h3>${page.shortTitle}</h3>
                <p>${page.summary}</p>
                <button type="button" onClick=${() => setHash(pageHash(page))}>Open page</button>
              </article>
            `
          )}
        </div>
      </section>
    `;
  }

  function Map() {
    return html`
      <section className="section map" id="map">
        <div className="section-head">
          <p className="eyebrow">Argument map</p>
          <h2>The thesis is a chain, not a list.</h2>
        </div>
        <div className="map-line">
          ${content.progression.map(
            (step, index) => html`
              <article key=${step}>
                <span>${String(index + 1).padStart(2, "0")}</span>
                <p>${step}</p>
              </article>
            `
          )}
        </div>
      </section>
    `;
  }

  function Arguments() {
    const [active, setActive] = useState(0);
    const item = content.arguments[active];
    return html`
      <section className="section arguments" id="arguments">
        <div className="section-head">
          <p className="eyebrow">Major arguments</p>
          <h2>The conceptual architecture of the thesis.</h2>
        </div>
        <div className="argument-layout">
          <div className="argument-tabs">
            ${content.arguments.map(
              (argument, index) => html`
                <button
                  type="button"
                  key=${argument.title}
                  className=${active === index ? "active" : ""}
                  onClick=${() => setActive(index)}
                >
                  <span>${String(index + 1).padStart(2, "0")}</span>${argument.title}
                </button>
              `
            )}
          </div>
          <article className="argument-panel">
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            <div className="chips">${item.concepts.map((concept) => html`<span key=${concept}>${concept}</span>`)}</div>
            <details open>
              <summary>Supporting evidence</summary>
              <p>${item.evidence}</p>
            </details>
            <details>
              <summary>Counterargument</summary>
              <p>${item.objection}</p>
            </details>
            <details>
              <summary>Response</summary>
              <p>${item.response}</p>
            </details>
          </article>
        </div>
      </section>
    `;
  }

  function Synthesis() {
    return html`
      <section className="section synthesis" id="synthesis">
        <div className="section-head">
          <p className="eyebrow">Synthesis</p>
          <h2>${content.meta.claim}</h2>
          <p>
            The thesis argues that the post-2022 EU is not best understood as the abandonment
            of Kantian peace, but as the coercive reinterpretation of that project under
            existential pressure.
          </p>
        </div>
        <div className="hypotheses">
          ${content.hypotheses.map(
            (item, index) => html`
              <article key=${item.title}>
                <span>${String(index + 1).padStart(2, "0")}</span>
                <h3>${item.title}</h3>
                <p>${item.text}</p>
              </article>
            `
          )}
        </div>
      </section>
    `;
  }

  function Resources() {
    return html`
      <section className="section resources" id="resources">
        <div className="section-head">
          <p className="eyebrow">Resources</p>
          <h2>Glossary and source material.</h2>
          <p>The full thesis text is integrated into the reader. This public version is designed as a readable web edition from Introduction to Conclusion.</p>
        </div>
        <div className="glossary">
          ${content.glossary.map(
            ([term, definition]) => html`
              <article key=${term}>
                <h3>${term}</h3>
                <p>${definition}</p>
              </article>
            `
          )}
        </div>
      </section>
    `;
  }

  function Home({ route }) {
    useEffect(() => {
      if (route.id && route.id !== "home") {
        const node = document.getElementById(route.id);
        if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, [route.id]);

    return html`
      <${Header} route=${route} />
      <main>
        <${Hero} />
        <${ReaderIndex} />
        <${Map} />
        <${Arguments} />
        <${Synthesis} />
        <${Resources} />
      </main>
    `;
  }

  function ChapterPage({ id }) {
    const pageIndex = pages.findIndex((page) => page.id === id);
    const page = pages[pageIndex];
    const previous = pages[pageIndex - 1];
    const next = pages[pageIndex + 1];

    useEffect(() => window.scrollTo(0, 0), [id]);

    if (!page) {
      return html`
        <${Header} route=${{ id: "reader" }} />
        <main className="chapter-shell"><h1>Page not found</h1></main>
      `;
    }

    return html`
      <${Header} route=${{ id: "reader" }} />
      <main className="chapter-shell">
        <aside className="chapter-nav">
          <strong>Final thesis reader</strong>
          ${pages.map(
            (item) => html`
              <button
                type="button"
                key=${item.id}
                className=${item.id === page.id ? "active" : ""}
                onClick=${() => setHash(pageHash(item))}
              >
                <small>${item.type === "part" ? item.number : item.number}</small>${item.shortTitle}
              </button>
            `
          )}
        </aside>
        <article className="chapter">
          <div className="chapter-hero">
            <p>${page.type === "part" ? "Part opening" : `Chapter ${page.number}`} - ${page.part}</p>
            <h1>${page.shortTitle}</h1>
            <div><span>${page.wordCount.toLocaleString("en-US")} words</span><span>${readingMinutes(page)} min read</span></div>
            <p>${page.summary}</p>
          </div>
          ${page.sections.length > 1
            ? html`
                <nav className="section-list">
                  ${page.sections.map(
                    (section, index) => html`<a key=${`${page.id}-${index}`} href=${`#section-${index}`}>${section.heading}</a>`
                  )}
                </nav>
              `
            : null}
          <div className="chapter-text">
            ${page.sections.map(
              (section, index) => html`
                <section key=${`${page.id}-${index}`} id=${`section-${index}`}>
                  ${section.heading !== "Opening" && section.heading !== "Part opening" ? html`<h2>${section.heading}</h2>` : null}
                  ${section.paragraphs.map((paragraph, paragraphIndex) => html`<p key=${paragraphIndex}>${paragraph}</p>`)}
                </section>
              `
            )}
          </div>
          <nav className="pager">
            ${previous ? html`<button type="button" onClick=${() => setHash(pageHash(previous))}><span>Previous</span>${previous.shortTitle}</button>` : html`<span></span>`}
            ${next ? html`<button type="button" onClick=${() => setHash(pageHash(next))}><span>Next</span>${next.shortTitle}</button>` : html`<span></span>`}
          </nav>
        </article>
      </main>
    `;
  }

  function App() {
    const [route, setRoute] = useState(currentRoute());
    useEffect(() => {
      const onHash = () => setRoute(currentRoute());
      window.addEventListener("hashchange", onHash);
      return () => window.removeEventListener("hashchange", onHash);
    }, []);
    return route.type === "chapter" ? html`<${ChapterPage} id=${route.id} />` : html`<${Home} route=${route} />`;
  }

  ReactDOM.createRoot(document.getElementById("root")).render(html`<${App} />`);
})();
