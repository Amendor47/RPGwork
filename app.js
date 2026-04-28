(function () {
  const { useEffect, useMemo, useRef, useState } = React;
  const html = htm.bind(React.createElement);
  const source = window.thesisContent || window.siteContent || {};
  const pages = window.thesisChapters || [];

  const navItems = [
    { id: "home", label: "Home" },
    { id: "reader", label: "Read" },
    { id: "map", label: "Map" },
    { id: "chapters", label: "Chapters" },
    { id: "arguments", label: "Arguments" },
    { id: "method", label: "Method" },
    { id: "evidence", label: "Evidence" },
    { id: "synthesis", label: "Synthesis" },
    { id: "resources", label: "Resources" }
  ];

  const fallbackContent = {
    meta: {
      title: "Defending Peace by Other Means",
      subtitle: "Active Kantianism and the Post-2022 European Union",
      author: "Rayane Feriate",
      institution: "College of Europe - European Political and Governance Studies",
      supervisor: "Supervisor: Alberto Alemanno",
      question:
        "How has the European Union justified and institutionalised its post-2022 shift from a Kantian peace project to a geopolitical actor, and what does this reveal about the transformation of its normative identity?",
      claim:
        "The EU has not simply moved from norms to power. It has reframed power as necessary for the defence of norms.",
      abstract:
        "The European Union has long drawn part of its legitimacy from its identity as a peace project: a political order designed to overcome war among Europeans through law, integration and the diffusion of norms rather than coercive force. Russia's full-scale invasion of Ukraine placed this identity under direct pressure."
    },
    hypotheses: [
      {
        title: "Latent Kantianism becomes active",
        text:
          "The post-2022 transformation activates a Kantian category: the unjust enemy whose conduct negates the conditions of peaceful juridical order."
      },
      {
        title: "Institutions preserve their form",
        text:
          "The EPF, EDIP, SAFE and defence centralisation are read as effects of institutional conatus: the Union's drive to preserve its identity while changing its instruments."
      },
      {
        title: "Power is normatively reframed",
        text:
          "The EU does not abandon the language of peace; it recasts coercive capacity as necessary to defend the legal order on which peace depends."
      }
    ],
    arguments: [
      {
        id: "identity",
        title: "Normative identity under pressure",
        summary:
          "Russia's full-scale invasion forces the EU to reconcile a peace identity with military assistance, sanctions, defence industry and deterrence.",
        concepts: ["Normative Power Europe", "Geopolitical Commission", "Peace project"],
        evidence:
          "Presidential speeches, Council decisions, defence packages and legal instruments after February 2022.",
        objection: "The shift may simply show that normative power was always rhetorical.",
        response:
          "The thesis argues instead that the persistence of peace, law and responsibility in the EU's vocabulary is analytically significant."
      },
      {
        id: "conatus",
        title: "Institutional conatus",
        summary:
          "The Union adapts under existential pressure by selecting instruments that preserve its recognisable normative form.",
        concepts: ["Spinoza", "Conatus", "Institutional self-preservation"],
        evidence:
          "Emergency instruments become durable legal and institutional architecture.",
        objection: "Institutions do not literally have a will to preserve themselves.",
        response:
          "Conatus is used as a political-science hypothesis, not as a metaphysical claim about institutional consciousness."
      },
      {
        id: "active-kantianism",
        title: "Active Kantianism",
        summary:
          "Coercive instruments are justified as the active defence of the conditions under which perpetual peace remains possible.",
        concepts: ["Kant", "Unjust enemy", "Perpetual peace"],
        evidence:
          "The EU frames military assistance and defence readiness through peace, legality and responsibility.",
        objection:
          "Using weapons in the name of peace risks collapsing into permanent militarisation.",
        response:
          "That risk is real, which is why democratic accountability and federal legitimacy become central to the conclusion."
      }
    ],
    progression: [
      "The EU begins as a juridical peace project.",
      "The war in Ukraine creates existential pressure.",
      "The Union builds coercive and defence-industrial capacity.",
      "It preserves the vocabulary of law, peace and responsibility.",
      "The result is Active Kantianism: defending peace by other means.",
      "The unresolved problem becomes democratic control over European coercion."
    ],
    glossary: [
      [
        "Active Kantianism",
        "The use of coercive instruments to defend the legal and political conditions that make perpetual peace possible."
      ],
      [
        "Institutional conatus",
        "The tendency of an institution to preserve its constitutive form while adapting its instruments of action."
      ],
      [
        "Unjust enemy",
        "A Kantian limit concept naming an adversary whose conduct threatens the possibility of lawful peace."
      ],
      [
        "Normative Power Europe",
        "The idea that the EU exercises power by shaping norms, law and standards rather than relying mainly on coercion."
      ],
      [
        "Geopolitical Commission",
        "The post-2019 Commission's self-description as a more strategic actor in a hostile international environment."
      ]
    ]
  };

  const content = enhanceContent(source);

  function enhanceContent(raw) {
    const meta = { ...fallbackContent.meta, ...(raw.meta || {}) };
    const argumentsList = normalizeArguments(raw.arguments || fallbackContent.arguments);
    const progression = raw.progression || fallbackContent.progression;
    const hypotheses = raw.hypotheses || fallbackContent.hypotheses;
    const glossary = raw.glossary || fallbackContent.glossary;

    return {
      meta,
      nav: navItems,
      arguments: argumentsList,
      hypotheses,
      progression,
      glossary,
      stats: [
        { value: String(pages.filter((page) => page.type === "chapter").length), label: "chapters" },
        { value: totalWords().toLocaleString("en-US"), label: "words online" },
        { value: "2022-2026", label: "period analysed" },
        { value: "4", label: "elite interviews" }
      ],
      method: raw.method || {
        title: "A philosophical and discursive institutionalist reading",
        summary:
          "The thesis connects political philosophy, EU institutional change and close discourse analysis. It treats the EU's post-2022 transformation not only as a strategic response, but as a process of self-definition under pressure.",
        lenses: [
          {
            title: "Conceptual genealogy",
            text:
              "Kant, Spinoza, Schmitt and Just War theory are used to clarify what is at stake when a peace project acquires coercive instruments."
          },
          {
            title: "Institutional mechanisms",
            text:
              "The analysis follows the European Peace Facility, defence readiness, industrial policy and Commission centralisation as concrete institutional forms."
          },
          {
            title: "Discursive legitimation",
            text:
              "Speeches, official communications and policy language are read as mechanisms through which the Union justifies its transformation."
          }
        ],
        operationalisation: [
          "Identify the inherited peace narrative.",
          "Trace the post-2022 legal and policy instruments.",
          "Compare coercive practices with the vocabulary used to legitimate them.",
          "Evaluate whether the shift is a rupture, a fulfilment, or a hybrid transformation."
        ]
      },
      evidenceMatrix: raw.evidenceMatrix || [
        {
          title: "European Peace Facility",
          type: "Legal innovation",
          use:
            "Shows how the EU finances military assistance while preserving a peace-oriented justification."
        },
        {
          title: "Geopolitical Commission",
          type: "Institutional discourse",
          use:
            "Shows the Commission's self-presentation as a strategic actor before and after 2022."
        },
        {
          title: "SAFE, EDIP and defence readiness",
          type: "Industrial policy",
          use:
            "Shows how security and defence move into the economic and regulatory core of integration."
        },
        {
          title: "Presidential speeches",
          type: "Political language",
          use:
            "Shows how peace, Europe, responsibility and force are rhetorically coupled."
        }
      ],
      interviews: raw.interviews || [
        {
          role: "EU institutional actor",
          insight:
            "The war is described as forcing the Union to protect its own conditions of existence."
        },
        {
          role: "Defence policy expert",
          insight:
            "Defence instruments are treated as a continuation of integration through new means."
        },
        {
          role: "Academic observer",
          insight:
            "The federal question reappears because coercive capacity needs democratic control."
        },
        {
          role: "Policy practitioner",
          insight:
            "Language of peace remains politically necessary even when the instruments become harder."
        }
      ],
      synthesis: raw.synthesis || {
        title: "The thesis logic",
        statement:
          "The EU's geopolitical turn does not erase its peace identity. It exposes the conditions under which that identity must become active, institutionalised and democratically accountable.",
        points: [
          "Normative identity supplies the grammar of justification.",
          "Institutional conatus explains why adaptation preserves continuity.",
          "Active Kantianism names the hybrid posture produced by this pressure.",
          "The conclusion turns from strategy to legitimacy: who controls European coercion?"
        ],
        final:
          "The thesis therefore reads the post-2022 Union as a political order defending peace by other means while still needing a stronger democratic form for the power it now exercises."
      },
      sourceLibrary: raw.sourceLibrary || [
        "Immanuel Kant, Toward Perpetual Peace",
        "Carl Schmitt, The Concept of the Political",
        "Michael Walzer, Just and Unjust Wars",
        "Ernst B. Haas, The Uniting of Europe",
        "Josep Borrell, EU Foreign Policy in 2022",
        "Ursula von der Leyen, State of the Union Address"
      ],
      furtherReading: raw.furtherReading || [
        "Normative Power Europe",
        "Discursive institutionalism",
        "European defence integration",
        "Kantian international political theory"
      ]
    };
  }

  function normalizeArguments(items) {
    return items.map((item, index) => ({
      id: item.id || slug(item.title || `argument-${index + 1}`),
      title: item.title || `Argument ${index + 1}`,
      summary: item.summary || item.text || "",
      concepts: item.concepts || [],
      evidence: item.evidence || "This argument is supported by the thesis text and the post-2022 institutional record.",
      objection: item.objection || "This interpretation may overstate continuity between peace discourse and coercive practice.",
      response: item.response || "The response is that continuity and transformation are not mutually exclusive in institutional change."
    }));
  }

  function slug(value) {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function totalWords() {
    return pages.reduce((sum, page) => sum + (page.wordCount || 0), 0);
  }

  function pageHash(page) {
    return `#/chapter/${page.id}`;
  }

  function readRoute() {
    const hash = window.location.hash || "#";
    const chapterMatch = hash.match(/^#\/chapter\/([^/]+)$/);
    if (chapterMatch) return { type: "chapter", id: decodeURIComponent(chapterMatch[1]) };
    return { type: "home", id: hash.replace(/^#/, "") || "home" };
  }

  function goHomeSection(id) {
    if (window.location.hash.startsWith("#/chapter/")) {
      window.location.hash = `#${id}`;
      return;
    }
    window.location.hash = `#${id}`;
    window.setTimeout(() => scrollToId(id), 20);
  }

  function goChapter(id) {
    window.location.hash = `#/chapter/${id}`;
  }

  function scrollToId(id) {
    const node = document.getElementById(id);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function readingMinutes(page) {
    return Math.max(1, Math.round((page.wordCount || 0) / 230));
  }

  function useRoute() {
    const [route, setRoute] = useState(readRoute());
    useEffect(() => {
      const onHash = () => setRoute(readRoute());
      window.addEventListener("hashchange", onHash);
      return () => window.removeEventListener("hashchange", onHash);
    }, []);
    return route;
  }

  function useProgress(ids) {
    const [active, setActive] = useState("home");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      let ticking = false;
      const update = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const max = document.documentElement.scrollHeight - window.innerHeight || 1;
        setProgress(Math.min(100, Math.max(0, (scrollTop / max) * 100)));

        let current = ids[0] || "home";
        ids.forEach((id) => {
          const node = document.getElementById(id);
          if (!node) return;
          if (node.getBoundingClientRect().top <= 132) current = id;
        });
        setActive(current);
        ticking = false;
      };
      const onScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      };
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }, [ids.join("|")]);

    return { active, progress };
  }

  function useReveal() {
    useEffect(() => {
      const nodes = Array.from(document.querySelectorAll(".reveal"));
      if (!("IntersectionObserver" in window)) {
        nodes.forEach((node) => node.classList.add("is-visible"));
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      nodes.forEach((node) => observer.observe(node));
      return () => observer.disconnect();
    });
  }

  function useTilt() {
    useEffect(() => {
      const nodes = Array.from(document.querySelectorAll("[data-tilt]"));
      const move = (event) => {
        const card = event.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--tilt-x", (x * 4).toFixed(2));
        card.style.setProperty("--tilt-y", (y * 4).toFixed(2));
      };
      const clear = (event) => {
        event.currentTarget.style.setProperty("--tilt-x", "0");
        event.currentTarget.style.setProperty("--tilt-y", "0");
      };
      nodes.forEach((node) => {
        node.addEventListener("pointermove", move);
        node.addEventListener("pointerleave", clear);
      });
      return () =>
        nodes.forEach((node) => {
          node.removeEventListener("pointermove", move);
          node.removeEventListener("pointerleave", clear);
        });
    });
  }

  function HeroCanvas() {
    const ref = useRef(null);
    useEffect(() => {
      const canvas = ref.current;
      if (!canvas) return undefined;
      const context = canvas.getContext("2d");
      let frame = 0;
      let animation;

      const resize = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.floor(rect.width * ratio);
        canvas.height = Math.floor(rect.height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
      };

      const draw = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        context.clearRect(0, 0, width, height);
        context.lineWidth = 1;

        const nodes = [
          [0.16, 0.2, "Peace"],
          [0.48, 0.14, "Law"],
          [0.78, 0.24, "Power"],
          [0.26, 0.62, "Conatus"],
          [0.58, 0.68, "Active Kantianism"],
          [0.82, 0.58, "Democracy"]
        ];
        const links = [
          [0, 1],
          [1, 2],
          [1, 4],
          [2, 4],
          [3, 4],
          [4, 5]
        ];

        links.forEach(([a, b], index) => {
          const start = nodes[a];
          const end = nodes[b];
          const pulse = 0.25 + Math.sin(frame / 38 + index) * 0.14;
          context.strokeStyle = `rgba(0, 102, 204, ${0.16 + pulse})`;
          context.beginPath();
          context.moveTo(start[0] * width, start[1] * height);
          context.lineTo(end[0] * width, end[1] * height);
          context.stroke();
        });

        nodes.forEach((node, index) => {
          const x = node[0] * width;
          const y = node[1] * height + Math.sin(frame / 45 + index) * 4;
          context.fillStyle = "rgba(255, 255, 255, 0.92)";
          context.strokeStyle = index === 4 ? "rgba(0, 102, 204, 0.62)" : "rgba(24, 32, 48, 0.14)";
          context.lineWidth = index === 4 ? 1.8 : 1;
          roundRect(context, x - 68, y - 20, 136, 40, 8);
          context.fill();
          context.stroke();
          context.fillStyle = index === 4 ? "#0066cc" : "#1d1d1f";
          context.font = index === 4 ? "600 12px -apple-system, BlinkMacSystemFont, sans-serif" : "500 12px -apple-system, BlinkMacSystemFont, sans-serif";
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.fillText(node[2], x, y);
        });

        frame += 1;
        animation = window.requestAnimationFrame(draw);
      };

      resize();
      draw();
      window.addEventListener("resize", resize);
      return () => {
        window.cancelAnimationFrame(animation);
        window.removeEventListener("resize", resize);
      };
    }, []);

    return html`<canvas ref=${ref} className="hero-canvas" aria-hidden="true"></canvas>`;
  }

  function roundRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.arcTo(x + width, y, x + width, y + height, radius);
    context.arcTo(x + width, y + height, x, y + height, radius);
    context.arcTo(x, y + height, x, y, radius);
    context.arcTo(x, y, x + width, y, radius);
    context.closePath();
  }

  function Header({ activeId, progress, route, readingMode, setReadingMode }) {
    const [open, setOpen] = useState(false);
    const [chaptersOpen, setChaptersOpen] = useState(false);

    useEffect(() => {
      document.body.classList.toggle("nav-open", open);
      return () => document.body.classList.remove("nav-open");
    }, [open]);

    const go = (id) => {
      goHomeSection(id);
      setOpen(false);
      setChaptersOpen(false);
    };

    return html`
      <header className="site-header">
        <div className="progress-track"><span style=${{ width: `${progress}%` }}></span></div>
        <div className="nav-shell">
          <button className="brand" type="button" onClick=${() => go("home")} aria-label="Go to home">
            <span className="brand-mark"></span>
            <span>
              <strong>Active Kantianism</strong>
              <small>Thesis reader</small>
            </span>
          </button>

          <nav className="desktop-nav" aria-label="Primary navigation">
            ${content.nav.slice(0, 5).map(
              (item) => html`
                <button
                  key=${item.id}
                  type="button"
                  className=${activeId === item.id ? "is-active" : ""}
                  onClick=${() => go(item.id)}
                >
                  ${item.label}
                </button>
              `
            )}
            <div className="nav-dropdown">
              <button type="button" className=${chaptersOpen ? "is-open" : ""} onClick=${() => setChaptersOpen(!chaptersOpen)}>
                More
              </button>
              ${chaptersOpen
                ? html`
                    <div className="dropdown-panel">
                      ${content.nav.slice(5).map(
                        (item) => html`<button key=${item.id} type="button" onClick=${() => go(item.id)}>${item.label}</button>`
                      )}
                      <div className="dropdown-rule"></div>
                      ${pages.slice(0, 8).map(
                        (page) => html`<button key=${page.id} type="button" onClick=${() => goChapter(page.id)}>${page.shortTitle}</button>`
                      )}
                    </div>
                  `
                : null}
            </div>
          </nav>

          <div className="nav-actions">
            <button
              className=${readingMode ? "icon-button is-active" : "icon-button"}
              type="button"
              onClick=${() => setReadingMode(!readingMode)}
              title="Toggle reading mode"
            >
              Aa
            </button>
            <button className="mobile-menu" type="button" onClick=${() => setOpen(!open)} aria-label="Open menu">
              <span></span><span></span>
            </button>
          </div>
        </div>

        <aside className=${open ? "mobile-panel is-open" : "mobile-panel"} aria-hidden=${!open}>
          ${content.nav.map(
            (item) => html`
              <button key=${item.id} type="button" className=${activeId === item.id ? "is-active" : ""} onClick=${() => go(item.id)}>
                ${item.label}
              </button>
            `
          )}
          <div className="mobile-chapters">
            <strong>Chapters</strong>
            ${pages.map(
              (page) => html`<button key=${page.id} type="button" onClick=${() => { goChapter(page.id); setOpen(false); }}>${page.shortTitle}</button>`
            )}
          </div>
        </aside>
      </header>
    `;
  }

  function SideRail({ activeId }) {
    return html`
      <aside className="side-rail" aria-label="Section shortcuts">
        ${content.nav.map(
          (item) => html`
            <button
              key=${item.id}
              type="button"
              className=${activeId === item.id ? "is-active" : ""}
              onClick=${() => goHomeSection(item.id)}
              title=${item.label}
            >
              <span></span>
            </button>
          `
        )}
      </aside>
    `;
  }

  function Hero() {
    return html`
      <section className="hero section-anchor" id="home">
        <div className="hero-copy">
          <p className="eyebrow reveal">Readable final thesis website</p>
          <h1 className="hero-title reveal">${content.meta.title}</h1>
          <p className="hero-subtitle reveal">${content.meta.subtitle}</p>
          <p className="hero-abstract reveal">${content.meta.abstract}</p>
          <div className="hero-actions reveal">
            <button className="primary-action" type="button" onClick=${() => goHomeSection("reader")}>Read the thesis</button>
            <button className="secondary-action" type="button" onClick=${() => goHomeSection("map")}>Explore the logic</button>
          </div>
          <div className="hero-meta reveal">
            <span>${content.meta.author}</span>
            <span>${content.meta.institution}</span>
            <span>${content.meta.supervisor}</span>
          </div>
        </div>

        <div className="hero-visual reveal" data-tilt>
          <${HeroCanvas} />
          <div className="question-card">
            <span>Central research question</span>
            <p>${content.meta.question}</p>
          </div>
          <div className="claim-card">
            <span>Main claim</span>
            <p>${content.meta.claim}</p>
          </div>
        </div>
      </section>
    `;
  }

  function Stats() {
    return html`
      <section className="stats-strip reveal" aria-label="Thesis metrics">
        ${content.stats.map(
          (item) => html`
            <article key=${item.label}>
              <strong>${item.value}</strong>
              <span>${item.label}</span>
            </article>
          `
        )}
      </section>
    `;
  }

  function ReaderIndex() {
    const [query, setQuery] = useState("");
    const [kind, setKind] = useState("all");
    const filtered = pages.filter((page) => {
      const matchesKind = kind === "all" || page.type === kind;
      const haystack = `${page.shortTitle} ${page.title} ${page.summary} ${page.part}`.toLowerCase();
      return matchesKind && haystack.includes(query.toLowerCase());
    });

    return html`
      <section className="reader-section section-anchor" id="reader">
        <div className="section-shell">
          <div className="section-heading reveal">
            <p className="eyebrow">Final thesis reader</p>
            <h2>Read the thesis from introduction to conclusion.</h2>
            <p>
              Each chapter is available as an isolated reading page with section navigation,
              reading time, next/previous controls and long-form typography.
            </p>
          </div>

          <div className="reader-toolbar reveal">
            <label>
              <span>Search</span>
              <input value=${query} onInput=${(event) => setQuery(event.target.value)} placeholder="Find a concept, chapter or case..." />
            </label>
            <div className="segmented-control" role="tablist" aria-label="Filter chapters">
              ${["all", "chapter", "part"].map(
                (item) => html`
                  <button type="button" className=${kind === item ? "is-active" : ""} onClick=${() => setKind(item)}>
                    ${item === "all" ? "All" : item === "chapter" ? "Chapters" : "Parts"}
                  </button>
                `
              )}
            </div>
          </div>

          <div className="reader-grid">
            ${filtered.map(
              (page, index) => html`
                <article className=${page.type === "part" ? "chapter-card part-card reveal" : "chapter-card reveal"} key=${page.id} data-tilt>
                  <div className="card-topline">
                    <span>${page.type === "part" ? page.number : `Chapter ${page.number}`}</span>
                    <span>${readingMinutes(page)} min</span>
                  </div>
                  <h3>${page.shortTitle}</h3>
                  <p>${page.summary}</p>
                  <div className="chapter-card-footer">
                    <span>${(page.wordCount || 0).toLocaleString("en-US")} words</span>
                    <button type="button" onClick=${() => goChapter(page.id)}>Open</button>
                  </div>
                </article>
              `
            )}
          </div>
        </div>
      </section>
    `;
  }

  function ArgumentMap() {
    const nodes = [
      ["Inherited identity", "Peace project, law, integration", "identity"],
      ["Shock", "Russia's full-scale invasion of Ukraine", "shock"],
      ["Institutional adaptation", "EPF, SAFE, EDIP, defence portfolio", "adaptation"],
      ["Discursive justification", "Peace defended through power", "discursive"],
      ["Active Kantianism", "Coercion as defence of lawful peace", "active"],
      ["Federal question", "Democratic control over European coercion", "federal"]
    ];

    return html`
      <section className="map-section section-anchor" id="map">
        <div className="section-shell">
          <div className="section-heading reveal">
            <p className="eyebrow">Argument map</p>
            <h2>The thesis is a sequence of transformations.</h2>
            <p>Follow the conceptual passage from inherited peace identity to the democratic problem opened by European coercive capacity.</p>
          </div>
          <div className="map-board reveal">
            ${nodes.map(
              ([title, text, id], index) => html`
                <article className=${id === "active" ? "map-node is-core" : "map-node"} key=${id}>
                  <span>${String(index + 1).padStart(2, "0")}</span>
                  <h3>${title}</h3>
                  <p>${text}</p>
                </article>
              `
            )}
          </div>
        </div>
      </section>
    `;
  }

  function ChapterGuide() {
    return html`
      <section className="chapter-guide section-anchor" id="chapters">
        <div className="section-shell">
          <div className="section-heading reveal">
            <p className="eyebrow">Structure</p>
            <h2>A chapter-by-chapter route through the argument.</h2>
          </div>
          <div className="guide-list">
            ${pages.map(
              (page, index) => html`
                <article className="guide-row reveal" key=${page.id}>
                  <span>${page.number}</span>
                  <div>
                    <small>${page.part}</small>
                    <h3>${page.shortTitle}</h3>
                    <p>${page.summary}</p>
                  </div>
                  <button type="button" onClick=${() => goChapter(page.id)}>Read</button>
                </article>
              `
            )}
          </div>
        </div>
      </section>
    `;
  }

  function Accordion({ title, children, defaultOpen }) {
    const [open, setOpen] = useState(Boolean(defaultOpen));
    return html`
      <div className=${open ? "accordion is-open" : "accordion"}>
        <button type="button" onClick=${() => setOpen(!open)}>
          <span>${title}</span>
          <i>${open ? "-" : "+"}</i>
        </button>
        ${open ? html`<div className="accordion-body">${children}</div>` : null}
      </div>
    `;
  }

  function ArgumentsSection() {
    const [active, setActive] = useState(0);
    const item = content.arguments[active];
    return html`
      <section className="arguments-section section-anchor" id="arguments">
        <div className="section-shell">
          <div className="section-heading reveal">
            <p className="eyebrow">Major arguments</p>
            <h2>Three claims hold the thesis together.</h2>
          </div>
          <div className="argument-workspace reveal">
            <div className="argument-tabs">
              ${content.arguments.map(
                (argument, index) => html`
                  <button
                    type="button"
                    key=${argument.id}
                    className=${active === index ? "is-active" : ""}
                    onClick=${() => setActive(index)}
                  >
                    <span>${String(index + 1).padStart(2, "0")}</span>
                    ${argument.title}
                  </button>
                `
              )}
            </div>
            <article className="argument-panel" data-tilt>
              <p className="panel-kicker">Argument ${String(active + 1).padStart(2, "0")}</p>
              <h3>${item.title}</h3>
              <p className="argument-summary">${item.summary}</p>
              <div className="concept-grid">
                ${item.concepts.map((concept) => html`<span key=${concept}>${concept}</span>`)}
              </div>
              <${Accordion} title="Supporting evidence" defaultOpen=${true}>
                <p>${item.evidence}</p>
              </${Accordion}>
              <${Accordion} title="Counterargument">
                <p>${item.objection}</p>
              </${Accordion}>
              <${Accordion} title="Response">
                <p>${item.response}</p>
              </${Accordion}>
            </article>
          </div>
        </div>
      </section>
    `;
  }

  function MethodSection() {
    return html`
      <section className="method-section section-anchor" id="method">
        <div className="section-shell two-column">
          <div className="section-heading reveal">
            <p className="eyebrow">Method</p>
            <h2>${content.method.title}</h2>
            <p>${content.method.summary}</p>
          </div>
          <div className="method-stack">
            ${content.method.lenses.map(
              (lens) => html`
                <article className="method-card reveal" key=${lens.title}>
                  <h3>${lens.title}</h3>
                  <p>${lens.text}</p>
                </article>
              `
            )}
          </div>
        </div>
        <div className="section-shell">
          <div className="logic-steps reveal">
            ${content.method.operationalisation.map(
              (step, index) => html`
                <article key=${step}>
                  <span>${String(index + 1).padStart(2, "0")}</span>
                  <p>${step}</p>
                </article>
              `
            )}
          </div>
        </div>
      </section>
    `;
  }

  function EvidenceSection() {
    return html`
      <section className="evidence-section section-anchor" id="evidence">
        <div className="section-shell">
          <div className="section-heading reveal">
            <p className="eyebrow">Evidence</p>
            <h2>The empirical body of the thesis.</h2>
            <p>The website surfaces the institutional and discursive material that supports the philosophical claim.</p>
          </div>
          <div className="evidence-grid">
            ${content.evidenceMatrix.map(
              (item) => html`
                <article className="evidence-card reveal" key=${item.title}>
                  <span>${item.type}</span>
                  <h3>${item.title}</h3>
                  <p>${item.use}</p>
                </article>
              `
            )}
          </div>
        </div>
      </section>
    `;
  }

  function InterviewsSection() {
    return html`
      <section className="interviews-section">
        <div className="section-shell">
          <div className="interview-band reveal">
            <div>
              <p className="eyebrow">Interviews</p>
              <h2>Elite interviews add institutional texture.</h2>
            </div>
            <div className="interview-grid">
              ${content.interviews.map(
                (item) => html`
                  <article key=${item.role}>
                    <h3>${item.role}</h3>
                    <p>${item.insight}</p>
                  </article>
                `
              )}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function Progression() {
    return html`
      <section className="timeline-section section-anchor" id="progression">
        <div className="section-shell">
          <div className="section-heading reveal">
            <p className="eyebrow">Logical progression</p>
            <h2>How the reasoning develops.</h2>
          </div>
          <div className="timeline">
            ${content.progression.map(
              (step, index) => html`
                <article className="timeline-item reveal" key=${step}>
                  <span>${String(index + 1).padStart(2, "0")}</span>
                  <p>${step}</p>
                </article>
              `
            )}
          </div>
        </div>
      </section>
    `;
  }

  function Synthesis() {
    return html`
      <section className="synthesis-section section-anchor" id="synthesis">
        <div className="section-shell synthesis-shell reveal">
          <p className="eyebrow">Synthesis</p>
          <h2>${content.synthesis.title}</h2>
          <p className="synthesis-statement">${content.synthesis.statement}</p>
          <div className="synthesis-grid">
            ${content.synthesis.points.map((point) => html`<article key=${point}>${point}</article>`)}
          </div>
          <p className="synthesis-final">${content.synthesis.final}</p>
        </div>
      </section>
    `;
  }

  function Resources() {
    return html`
      <section className="resources-section section-anchor" id="resources">
        <div className="section-shell">
          <div className="section-heading reveal">
            <p className="eyebrow">Resources</p>
            <h2>Glossary, sources and further reading.</h2>
          </div>
          <div className="resources-layout">
            <article className="resource-panel reveal">
              <h3>Glossary</h3>
              ${content.glossary.map(
                ([term, definition]) => html`
                  <details key=${term}>
                    <summary>${term}</summary>
                    <p>${definition}</p>
                  </details>
                `
              )}
            </article>
            <article className="resource-panel reveal">
              <h3>Source library</h3>
              <ul>
                ${content.sourceLibrary.map((item) => html`<li key=${item}>${item}</li>`)}
              </ul>
            </article>
            <article className="resource-panel reveal">
              <h3>Further reading tracks</h3>
              <ul>
                ${content.furtherReading.map((item) => html`<li key=${item}>${item}</li>`)}
              </ul>
              <a className="resource-link" href="assets/Temporary-FINAL-DRAFT.docx" download>Download final draft</a>
            </article>
          </div>
        </div>
      </section>
    `;
  }

  function Home({ route, readingMode, setReadingMode }) {
    const ids = useMemo(() => content.nav.map((item) => item.id), []);
    const { active, progress } = useProgress(ids);
    useReveal();
    useTilt();

    useEffect(() => {
      if (route.id && route.id !== "home") window.setTimeout(() => scrollToId(route.id), 30);
    }, [route.id]);

    return html`
      <${Header}
        activeId=${active}
        progress=${progress}
        route=${route}
        readingMode=${readingMode}
        setReadingMode=${setReadingMode}
      />
      <${SideRail} activeId=${active} />
      <main>
        <${Hero} />
        <${Stats} />
        <${ReaderIndex} />
        <${ArgumentMap} />
        <${ChapterGuide} />
        <${ArgumentsSection} />
        <${MethodSection} />
        <${EvidenceSection} />
        <${InterviewsSection} />
        <${Progression} />
        <${Synthesis} />
        <${Resources} />
      </main>
      <${Footer} />
    `;
  }

  function ReaderTopBar({ page, progress, readingMode, setReadingMode, fontScale, setFontScale }) {
    return html`
      <div className="reader-topbar">
        <div className="progress-track"><span style=${{ width: `${progress}%` }}></span></div>
        <button type="button" className="reader-home" onClick=${() => goHomeSection("reader")}>All chapters</button>
        <div className="reader-title">
          <span>${page.type === "part" ? "Part" : `Chapter ${page.number}`}</span>
          <strong>${page.shortTitle}</strong>
        </div>
        <div className="reader-controls">
          <button type="button" onClick=${() => setFontScale(Math.max(0, fontScale - 1))}>A-</button>
          <button type="button" onClick=${() => setFontScale(Math.min(2, fontScale + 1))}>A+</button>
          <button type="button" className=${readingMode ? "is-active" : ""} onClick=${() => setReadingMode(!readingMode)}>Focus</button>
        </div>
      </div>
    `;
  }

  function ChapterPage({ pageId, readingMode, setReadingMode }) {
    const pageIndex = pages.findIndex((page) => page.id === pageId);
    const page = pages[pageIndex];
    const previous = pages[pageIndex - 1];
    const next = pages[pageIndex + 1];
    const [fontScale, setFontScale] = useState(0);
    const { progress } = useProgress([]);

    useReveal();

    useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [pageId]);

    if (!page) {
      return html`
        <main className="missing-page">
          <h1>Chapter not found</h1>
          <button type="button" onClick=${() => goHomeSection("reader")}>Back to reader</button>
        </main>
      `;
    }

    return html`
      <${ReaderTopBar}
        page=${page}
        progress=${progress}
        readingMode=${readingMode}
        setReadingMode=${setReadingMode}
        fontScale=${fontScale}
        setFontScale=${setFontScale}
      />
      <main className=${readingMode ? "reader-page-shell focus-mode" : "reader-page-shell"}>
        <aside className="chapter-nav-panel">
          <strong>Thesis chapters</strong>
          ${pages.map(
            (item) => html`
              <button
                type="button"
                key=${item.id}
                className=${item.id === page.id ? "is-active" : ""}
                onClick=${() => goChapter(item.id)}
              >
                <span>${item.number}</span>${item.shortTitle}
              </button>
            `
          )}
        </aside>
        <article className=${`reader-article font-${fontScale}`}>
          <header className="reader-hero reveal">
            <p>${page.type === "part" ? "Part opening" : `Chapter ${page.number}`} - ${page.part}</p>
            <h1>${page.shortTitle}</h1>
            <div>
              <span>${(page.wordCount || 0).toLocaleString("en-US")} words</span>
              <span>${readingMinutes(page)} min read</span>
              <span>${page.sections.length} sections</span>
            </div>
            <p>${page.summary}</p>
          </header>

          ${page.sections.length > 1
            ? html`
                <nav className="section-list reveal">
                  ${page.sections.map(
                    (section, index) => html`<a key=${`${page.id}-${index}`} href=${`#reader-section-${index}`}>${section.heading}</a>`
                  )}
                </nav>
              `
            : null}

          <div className="reader-text">
            ${page.sections.map(
              (section, index) => html`
                <section key=${`${page.id}-${index}`} id=${`reader-section-${index}`} className="reveal">
                  ${section.heading !== "Opening" && section.heading !== "Part opening" ? html`<h2>${section.heading}</h2>` : null}
                  ${section.paragraphs.map((paragraph, paragraphIndex) => html`<p key=${paragraphIndex}>${paragraph}</p>`)}
                </section>
              `
            )}
          </div>

          <nav className="pager">
            ${previous
              ? html`<button type="button" onClick=${() => goChapter(previous.id)}><span>Previous</span>${previous.shortTitle}</button>`
              : html`<span></span>`}
            ${next
              ? html`<button type="button" onClick=${() => goChapter(next.id)}><span>Next</span>${next.shortTitle}</button>`
              : html`<span></span>`}
          </nav>
        </article>
      </main>
    `;
  }

  function Footer() {
    return html`
      <footer className="site-footer">
        <p>${content.meta.title}</p>
        <button type="button" onClick=${() => goHomeSection("home")}>Back to top</button>
      </footer>
    `;
  }

  function App() {
    const route = useRoute();
    const [readingMode, setReadingMode] = useState(false);

    useEffect(() => {
      document.body.classList.toggle("reading-mode", readingMode);
      return () => document.body.classList.remove("reading-mode");
    }, [readingMode]);

    return route.type === "chapter"
      ? html`<${ChapterPage} pageId=${route.id} readingMode=${readingMode} setReadingMode=${setReadingMode} />`
      : html`<${Home} route=${route} readingMode=${readingMode} setReadingMode=${setReadingMode} />`;
  }

  ReactDOM.createRoot(document.getElementById("root")).render(html`<${App} />`);
})();
