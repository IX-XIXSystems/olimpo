(function () {
  const MENU_DATA = {
    whatsapp: "5549999156336",
    categorias: [
      { id: "promocoes", nome: "Promoção Olimpo" },
      { id: "combos", nome: "Combo Olimpo" },
      { id: "pizzas", nome: "Pizzas" },
      { id: "calzones", nome: "Calzones" },
      { id: "bebidas", nome: "Bebidas" }
    ],
    produtos: [
      {
        id: "promo-pizza-pequena",
        nome: "Pizza Pequena Promocional",
        categoria: "promocoes",
        descricao: "Escolha entre os sabores tradicionais selecionados da casa. Massa artesanal assada na hora.",
        imagem: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=260&q=72",
        destaque: "Oferta",
        precoFixo: 39.90
      },
      {
        id: "combo-dupla-35",
        nome: "Combo 2 Pizzas Grandes (35cm)",
        categoria: "combos",
        descricao: "1 Pizza Grande 35cm com borda recheada + 1 Pizza Grande 35cm sem borda. Ideal para toda a família.",
        imagem: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=260&q=72",
        destaque: "Mais Pedido",
        precoFixo: 116.99
      },
      {
        id: "combo-dupla-30",
        nome: "Combo 2 Pizzas Médias (30cm) c/ Borda",
        categoria: "combos",
        descricao: "2 Pizzas Médias de 30cm, ambas com borda recheada à sua escolha.",
        imagem: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=260&q=72",
        destaque: "Combo Olimpo",
        precoFixo: 109.99
      },
      {
        id: "pizza-zeus",
        nome: "Zeus Suprema",
        categoria: "pizzas",
        descricao: "Molho artesanal, muçarela especial, pepperoni italiano fatiado, champignon salteado, azeitonas pretas e orégano.",
        imagem: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=260&q=72",
        destaque: "Especial",
        precos: { pequena: 50.00, media: 60.00, grande: 70.00, gigante: 80.00 }
      },
      {
        id: "pizza-poseidon",
        nome: "Poseidon (Camarão & Catupiry)",
        categoria: "pizzas",
        descricao: "Molho da casa, muçarela, camarões selecionados salteados no azeite de ervas, alho-poró e requeijão cremoso.",
        imagem: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=260&q=72",
        destaque: "Chef",
        precos: { pequena: 55.00, media: 68.00, grande: 79.00, gigante: 89.00 }
      },
      {
        id: "pizza-atena",
        nome: "Atena (Marguerita Especial)",
        categoria: "pizzas",
        descricao: "Molho de tomate pelati, muçarela, tomate cereja confitado, parmesão ralado na hora e manjericão fresco.",
        imagem: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=260&q=72",
        destaque: "",
        precos: { pequena: 50.00, media: 60.00, grande: 70.00, gigante: 80.00 }
      },
      {
        id: "pizza-dionisio",
        nome: "Dionísio (Quatro Queijos)",
        categoria: "pizzas",
        descricao: "Muçarela, provolone defumado, gorgonzola nobre e autêntico requeijão cremoso sobre molho artesanal.",
        imagem: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=260&q=72",
        destaque: "",
        precos: { pequena: 50.00, media: 60.00, grande: 70.00, gigante: 80.00 }
      },
      {
        id: "pizza-ares",
        nome: "Ares (Calabresa Acebolada)",
        categoria: "pizzas",
        descricao: "Molho de tomate, muçarela, calabresa fatiada dourada no forno, cebola roxa e orégano.",
        imagem: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=260&q=72",
        destaque: "Clássica",
        precos: { pequena: 50.00, media: 60.00, grande: 70.00, gigante: 80.00 }
      },
      {
        id: "pizza-afrodite",
        nome: "Afrodite (Nutella com Morango)",
        categoria: "pizzas",
        descricao: "Massa doce crocante com creme de avelã Nutella, morangos frescos fatiados e raspas de chocolate.",
        imagem: "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=260&q=72",
        destaque: "Doce",
        precos: { pequena: 50.00, media: 60.00, grande: 70.00, gigante: 80.00 }
      },
      {
        id: "calzone-olimpo",
        nome: "Calzone Tradicional do Olimpo",
        categoria: "calzones",
        descricao: "Massa fechada recheada com muçarela, presunto, calabresa, tomate, orégano e toque de requeijão cremoso.",
        imagem: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=260&q=72",
        destaque: "Artesanal",
        precoFixo: 44.90
      },
      {
        id: "calzone-frango",
        nome: "Calzone Frango com Catupiry",
        categoria: "calzones",
        descricao: "Recheio generoso de peito de frango desfiado temperado, muçarela derretida e Catupiry legítimo.",
        imagem: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=260&q=72",
        destaque: "",
        precoFixo: 44.90
      },
      {
        id: "bebida-coca-2l",
        nome: "Coca-Cola 2 Litros",
        categoria: "bebidas",
        descricao: "Garrafa PET 2L bem gelada.",
        imagem: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=260&q=72",
        destaque: "",
        precoFixo: 15.00
      },
      {
        id: "bebida-guarana-2l",
        nome: "Guaraná Antarctica 2 Litros",
        categoria: "bebidas",
        descricao: "Garrafa PET 2L bem gelada.",
        imagem: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=260&q=72",
        destaque: "",
        precoFixo: 14.00
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

    try {
      const customProds = JSON.parse(localStorage.getItem("olimpo_produtos_v1"));
      if (Array.isArray(customProds) && customProds.length > 0) {
        MENU_DATA.produtos = customProds;
      }
      const customCfg = JSON.parse(localStorage.getItem("olimpo_configuracoes_v1"));
      if (customCfg && customCfg.aberto === false) {
        const badge = document.getElementById("storeStatusBadge");
        const txt = document.getElementById("storeStatusText");
        if (badge) badge.className = "status-pill closed";
        if (txt) txt.textContent = "Fechado";
      }
    } catch (e) {}

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

    const msg = `Olá! Vi no cardápio da Olimpo Pizzaria e gostaria de pedir: *${p.nome}*`;
    document.getElementById("btnWhatsAppItem").href = `https://wa.me/${MENU_DATA.whatsapp}?text=${encodeURIComponent(msg)}`;

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

    // Modal Mapa (vista previa antes de abrir Google Maps)
    ["btnOpenMapTop", "btnOpenMapHero", "btnOpenMapFooter"].forEach(btnId => {
      document.getElementById(btnId)?.addEventListener("click", () => openModal("mapModalOverlay"));
    });
    document.getElementById("btnCloseMapModal")?.addEventListener("click", () => closeModal("mapModalOverlay"));
    document.getElementById("mapModalOverlay")?.addEventListener("click", (e) => {
      if (e.target.id === "mapModalOverlay") closeModal("mapModalOverlay");
    });

    // Botón Copiar Dirección dentro del modal del Mapa
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

    // Modal Instagram (vista previa antes de abrir Instagram)
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
