(function () {
  const MENU_DATA = {
    categorias: [
      { id: "pizzas", nome: "Pizzas" }
    ],
    produtos: [
      {
        id: "teste-1",
        nome: "Teste 1",
        categoria: "pizzas",
        descricao: "Descrição ilustrativa do sabor Teste 1. Massa artesanal assada na hora com ingredientes selecionados.",
        imagem: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=260&q=72",
        destaque: "Exemplo",
        precos: { pequena: 50.00, media: 60.00, grande: 70.00, gigante: 80.00 }
      },
      {
        id: "teste-2",
        nome: "Teste 2",
        categoria: "pizzas",
        descricao: "Descrição ilustrativa do sabor Teste 2. Massa artesanal assada na hora com ingredientes selecionados.",
        imagem: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=260&q=72",
        destaque: "",
        precos: { pequena: 50.00, media: 60.00, grande: 70.00, gigante: 80.00 }
      },
      {
        id: "teste-3",
        nome: "Teste 3",
        categoria: "pizzas",
        descricao: "Descrição ilustrativa do sabor Teste 3. Massa artesanal assada na hora com ingredientes selecionados.",
        imagem: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=260&q=72",
        destaque: "",
        precos: { pequena: 50.00, media: 60.00, grande: 70.00, gigante: 80.00 }
      }
    ]
  };

  const TAMANHOS = {
    pequena: { nome: "Pequena", info: "25cm · até 2 sabores" },
    media:   { nome: "Média",   info: "30cm · até 3 sabores" },
    grande:  { nome: "Grande",  info: "35cm · até 4 sabores" },
    gigante: { nome: "Gigante", info: "40cm · até 4 sabores" }
  };

  let categoriaAtiva = "todas";
  let termoBusca = "";

  const fmt = (v) => (Number(v) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  function init() {
    const yearEl = document.getElementById("currentYear");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    renderCategorias();
    renderProdutos();
    bindEvents();
  }

  function renderCategorias() {
    const bar = document.getElementById("categoriesBar");
    if (!bar) return;

    bar.innerHTML = [
      `<button type="button" class="cat-btn ${categoriaAtiva === "todas" ? "active" : ""}" data-cat="todas">Todos</button>`,
      ...MENU_DATA.categorias.map(c =>
        `<button type="button" class="cat-btn ${categoriaAtiva === c.id ? "active" : ""}" data-cat="${c.id}">${c.nome}</button>`
      )
    ].join("");

    bar.querySelectorAll(".cat-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        categoriaAtiva = btn.getAttribute("data-cat");
        renderCategorias();
        renderProdutos();
        btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      });
    });
  }

  function renderProdutos() {
    const box = document.getElementById("productsContainer");
    if (!box) return;

    const filtrados = MENU_DATA.produtos.filter(p => {
      if (categoriaAtiva !== "todas" && p.categoria !== categoriaAtiva) return false;
      if (termoBusca.trim()) {
        const q = termoBusca.toLowerCase();
        return p.nome.toLowerCase().includes(q) || (p.descricao || "").toLowerCase().includes(q);
      }
      return true;
    });

    if (!filtrados.length) {
      box.innerHTML = `<p style="text-align:center;padding:3rem 1rem;color:var(--text-2);">Nenhum item encontrado para "${termoBusca}".</p>`;
      return;
    }

    if (categoriaAtiva === "todas" && !termoBusca.trim()) {
      box.innerHTML = MENU_DATA.categorias.map(cat => {
        const itens = filtrados.filter(p => p.categoria === cat.id);
        if (!itens.length) return "";
        return `
          <section class="menu-section">
            <h2 class="section-head"><span>${cat.nome}</span><small>${itens.length}</small></h2>
            <div class="cards-grid">${itens.map(cardHTML).join("")}</div>
          </section>
        `;
      }).join("");
    } else {
      box.innerHTML = `
        <section class="menu-section">
          <div class="cards-grid">${filtrados.map(cardHTML).join("")}</div>
        </section>
      `;
    }

    box.querySelectorAll(".item-card").forEach(card => {
      card.addEventListener("click", () => {
        const prod = MENU_DATA.produtos.find(p => p.id === card.getAttribute("data-id"));
        if (prod) abrirProduto(prod);
      });
    });
  }

  function cardHTML(p) {
    const preco = p.precos
      ? `<small>a partir de</small> ${fmt(Math.min(...Object.values(p.precos)))}`
      : fmt(p.precoFixo);

    return `
      <article class="item-card" data-id="${p.id}">
        <div class="item-info">
          <div>
            ${p.destaque ? `<span class="item-badge">${p.destaque}</span>` : ""}
            <h3 class="item-title">${p.nome}</h3>
            <p class="item-desc">${p.descricao || ""}</p>
          </div>
          <div class="item-price">${preco}</div>
        </div>
        <div class="item-thumb">
          <img src="${p.imagem}" alt="${p.nome}" width="92" height="92" decoding="async" onerror="this.src='logo.png'">
        </div>
      </article>
    `;
  }

  function abrirProduto(p) {
    const cat = MENU_DATA.categorias.find(c => c.id === p.categoria);
    document.getElementById("modalProductCategory").textContent = cat ? cat.nome : "Cardápio";
    document.getElementById("modalProductName").textContent = p.nome;
    document.getElementById("modalProductDescription").textContent = p.descricao || "";
    document.getElementById("modalProductImage").src = p.imagem.replace("w=260", "w=540");

    const sizesBox = document.getElementById("modalSizesContainer");
    const fixedBox = document.getElementById("modalFixedPriceContainer");

    if (p.precos) {
      sizesBox.style.display = "block";
      fixedBox.style.display = "none";
      document.getElementById("modalSizesGrid").innerHTML = Object.keys(p.precos).map(k => {
        const t = TAMANHOS[k] || { nome: k, info: "" };
        return `<div class="size-item"><span><strong>${t.nome}</strong><small>${t.info}</small></span><span class="val">${fmt(p.precos[k])}</span></div>`;
      }).join("");
    } else {
      sizesBox.style.display = "none";
      fixedBox.style.display = "block";
      document.getElementById("modalFixedPriceValue").textContent = fmt(p.precoFixo);
    }

    openModal("productModalOverlay");
  }

  function openModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove("active");
    document.body.style.overflow = "";
  }

  function bindEvents() {
    const search = document.getElementById("searchInput");
    const clear = document.getElementById("searchClearBtn");

    if (search) {
      search.addEventListener("input", (e) => {
        termoBusca = e.target.value;
        if (clear) clear.classList.toggle("active", termoBusca.length > 0);
        renderProdutos();
      });
    }

    if (clear) {
      clear.addEventListener("click", () => {
        search.value = "";
        termoBusca = "";
        clear.classList.remove("active");
        renderProdutos();
      });
    }

    // Modal Producto
    document.getElementById("btnCloseModal")?.addEventListener("click", () => closeModal("productModalOverlay"));
    document.getElementById("productModalOverlay")?.addEventListener("click", (e) => {
      if (e.target.id === "productModalOverlay") closeModal("productModalOverlay");
    });

    // Modal Mapa
    ["btnOpenMapTop", "btnOpenMapHero", "btnOpenMapFooter"].forEach(btnId => {
      document.getElementById(btnId)?.addEventListener("click", () => openModal("mapModalOverlay"));
    });
    document.getElementById("btnCloseMapModal")?.addEventListener("click", () => closeModal("mapModalOverlay"));
    document.getElementById("mapModalOverlay")?.addEventListener("click", (e) => {
      if (e.target.id === "mapModalOverlay") closeModal("mapModalOverlay");
    });

    // Copiar Dirección
    document.getElementById("btnCopyAddress")?.addEventListener("click", () => {
      const addr = "Av Adalberto Smith Burda, 303, São José - Fraiburgo, SC";
      const label = document.getElementById("copyAddressLabel");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr).then(() => {
          if (label) label.textContent = "Endereço Copiado!";
          setTimeout(() => { if (label) label.textContent = "Copiar Endereço"; }, 2200);
        });
      }
    });

    // Modal Instagram
    ["btnOpenIgTop", "btnOpenIgHero", "btnOpenIgFooter"].forEach(btnId => {
      document.getElementById(btnId)?.addEventListener("click", () => openModal("igModalOverlay"));
    });
    document.getElementById("btnCloseIgModal")?.addEventListener("click", () => closeModal("igModalOverlay"));
    document.getElementById("igModalOverlay")?.addEventListener("click", (e) => {
      if (e.target.id === "igModalOverlay") closeModal("igModalOverlay");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
