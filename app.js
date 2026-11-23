document.addEventListener("DOMContentLoaded", () => {
  const data = typeof SEED_DATA !== "undefined" ? SEED_DATA : { configuracoes: {}, categorias: [], produtos: [], bordas: [] };

  const state = {
    configuracoes: JSON.parse(localStorage.getItem("olimpo_configuracoes_v1")) || data.configuracoes,
    produtos: JSON.parse(localStorage.getItem("olimpo_produtos_v1")) || data.produtos,
    bordas: JSON.parse(localStorage.getItem("olimpo_bordas_v1")) || data.bordas,
    categorias: data.categorias || [],
    categoriaAtiva: "todas",
    termoBusca: ""
  };

  // Si hay datos antiguos sin dirección de Fraiburgo, actualiza al instante
  if (!state.configuracoes.endereco && data.configuracoes) {
    state.configuracoes = data.configuracoes;
    state.produtos = data.produtos;
    state.bordas = data.bordas;
    localStorage.setItem("olimpo_configuracoes_v1", JSON.stringify(data.configuracoes));
    localStorage.setItem("olimpo_produtos_v1", JSON.stringify(data.produtos));
    localStorage.setItem("olimpo_bordas_v1", JSON.stringify(data.bordas));
  }

  const TAMANHOS_CONFIG = {
    brotinho: { nome: "Brotinho", detalhe: "25cm · até 2 sabores" },
    pequena:  { nome: "Pequena",  detalhe: "25cm · até 2 sabores" },
    media:    { nome: "Média",    detalhe: "30cm · até 3 sabores" },
    grande:   { nome: "Grande",   detalhe: "35cm · até 4 sabores" },
    gigante:  { nome: "Gigante",  detalhe: "40cm · até 4 sabores" },
    familia:  { nome: "Família",  detalhe: "40cm · até 4 sabores" }
  };

  const DOM = {
    headerStoreName: document.getElementById("headerStoreName"),
    headerMapBtn: document.getElementById("headerMapBtn"),
    storeStatusBadge: document.getElementById("storeStatusBadge"),
    storeStatusText: document.getElementById("storeStatusText"),
    infoDeliveryTime: document.getElementById("infoDeliveryTime"),
    infoDeliveryFee: document.getElementById("infoDeliveryFee"),
    infoMinOrder: document.getElementById("infoMinOrder"),
    infoOpenHours: document.getElementById("infoOpenHours"),
    footerAddress: document.getElementById("footerAddress"),
    footerWhatsAppBtn: document.getElementById("footerWhatsAppBtn"),
    footerPhoneText: document.getElementById("footerPhoneText"),
    footerMapBtn: document.getElementById("footerMapBtn"),
    currentYear: document.getElementById("currentYear"),

    searchInput: document.getElementById("searchInput"),
    searchClearBtn: document.getElementById("searchClearBtn"),
    categoriesBar: document.getElementById("categoriesBar"),
    productsContainer: document.getElementById("productsContainer"),

    productModalOverlay: document.getElementById("productModalOverlay"),
    btnCloseModal: document.getElementById("btnCloseModal"),
    modalProductImage: document.getElementById("modalProductImage"),
    modalProductCategory: document.getElementById("modalProductCategory"),
    modalProductName: document.getElementById("modalProductName"),
    modalProductDescription: document.getElementById("modalProductDescription"),
    modalSizesContainer: document.getElementById("modalSizesContainer"),
    modalSizesGrid: document.getElementById("modalSizesGrid"),
    modalFixedPriceContainer: document.getElementById("modalFixedPriceContainer"),
    modalFixedPriceValue: document.getElementById("modalFixedPriceValue"),
    modalExtrasNote: document.getElementById("modalExtrasNote"),
    modalCrustsSummary: document.getElementById("modalCrustsSummary"),
    btnWhatsAppItem: document.getElementById("btnWhatsAppItem")
  };

  function formatarMoeda(valor) {
    return (Number(valor) || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function otimizarImagem(url, largura = 240) {
    if (!url) return "logo.png";
    if (url.includes("images.unsplash.com")) {
      return url.replace(/w=\d+/, `w=${largura}`).replace(/q=\d+/, "q=70");
    }
    return url;
  }

  function renderizarInformacoesLoja() {
    const conf = state.configuracoes || {};

    if (DOM.headerStoreName) DOM.headerStoreName.textContent = "Olimpo";

    if (DOM.storeStatusBadge && DOM.storeStatusText) {
      const aberto = conf.aberto !== false;
      DOM.storeStatusBadge.className = `status-pill ${aberto ? "open" : "closed"}`;
      DOM.storeStatusText.textContent = aberto ? "Aberto" : "Fechado";
    }

    if (DOM.infoDeliveryTime && conf.tempoEntrega) DOM.infoDeliveryTime.textContent = conf.tempoEntrega;
    if (DOM.infoDeliveryFee && conf.taxaEntrega !== undefined) DOM.infoDeliveryFee.textContent = formatarMoeda(conf.taxaEntrega);
    if (DOM.infoMinOrder && conf.pedidoMinimo !== undefined) DOM.infoMinOrder.textContent = formatarMoeda(conf.pedidoMinimo);
    if (DOM.infoOpenHours && conf.horarioFuncionamento) DOM.infoOpenHours.textContent = conf.horarioFuncionamento;
    if (DOM.footerAddress && conf.endereco) DOM.footerAddress.textContent = conf.endereco;
    if (DOM.footerPhoneText && conf.telefoneFormatado) DOM.footerPhoneText.textContent = conf.telefoneFormatado;

    const mapLink = conf.mapsUrl || "https://www.google.com/maps/search/?api=1&query=Rua+Olavo+Bilac+303+Fraiburgo+SC";
    if (DOM.headerMapBtn) DOM.headerMapBtn.href = mapLink;
    if (DOM.footerMapBtn) DOM.footerMapBtn.href = mapLink;

    if (DOM.footerWhatsAppBtn) {
      const num = (conf.telefoneWhatsApp || "5549999156336").replace(/\D/g, "");
      DOM.footerWhatsAppBtn.href = `https://wa.me/${num}?text=${encodeURIComponent("Olá! Vi o cardápio da Olimpo Pizzas Delivery e gostaria de fazer um pedido.")}`;
    }
  }

  function renderizarCategorias() {
    if (!DOM.categoriesBar) return;

    let html = `
      <button type="button" class="cat-chip ${state.categoriaAtiva === "todas" ? "active" : ""}" data-category="todas">
        Todos
      </button>
    `;

    state.categorias.forEach(cat => {
      const ativa = state.categoriaAtiva === cat.id ? "active" : "";
      html += `
        <button type="button" class="cat-chip ${ativa}" data-category="${cat.id}">
          ${cat.nome}
        </button>
      `;
    });

    DOM.categoriesBar.innerHTML = html;

    DOM.categoriesBar.querySelectorAll(".cat-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        state.categoriaAtiva = btn.getAttribute("data-category");
        renderizarCategorias();
        renderizarProdutos();
        btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      });
    });
  }

  function renderizarProdutos() {
    if (!DOM.productsContainer) return;

    const filtrados = state.produtos.filter(prod => {
      if (state.categoriaAtiva !== "todas" && prod.categoria !== state.categoriaAtiva) return false;
      if (state.termoBusca.trim() !== "") {
        const termo = state.termoBusca.toLowerCase();
        return prod.nome.toLowerCase().includes(termo) || (prod.descricao || "").toLowerCase().includes(termo);
      }
      return true;
    });

    if (filtrados.length === 0) {
      DOM.productsContainer.innerHTML = `
        <div class="empty-search">
          <i class="fa-solid fa-magnifying-glass"></i>
          <p>Nenhum item encontrado para "${state.termoBusca}".</p>
        </div>
      `;
      return;
    }

    let html = "";

    if (state.categoriaAtiva === "todas" && state.termoBusca.trim() === "") {
      state.categorias.forEach(cat => {
        const itens = filtrados.filter(p => p.categoria === cat.id);
        if (itens.length > 0) {
          html += `
            <section class="menu-group">
              <h2 class="group-title">
                <span>${cat.nome}</span>
                <span class="count">${itens.length}</span>
              </h2>
              <div class="items-grid">
                ${itens.map(criarCardHTML).join("")}
              </div>
            </section>
          `;
        }
      });
    } else {
      html = `
        <section class="menu-group">
          <div class="items-grid">
            ${filtrados.map(criarCardHTML).join("")}
          </div>
        </section>
      `;
    }

    DOM.productsContainer.innerHTML = html;

    DOM.productsContainer.querySelectorAll(".menu-card").forEach(card => {
      card.addEventListener("click", () => {
        const prod = state.produtos.find(p => p.id === card.getAttribute("data-id"));
        if (prod && prod.disponivel) abrirModalProduto(prod);
      });
    });
  }

  function criarCardHTML(prod) {
    let precoTexto = "";
    if (prod.precos) {
      const menor = Math.min(...Object.values(prod.precos));
      precoTexto = `<small>a partir de</small> ${formatarMoeda(menor)}`;
    } else {
      precoTexto = formatarMoeda(prod.precoFixo);
    }

    const thumbUrl = otimizarImagem(prod.imagem, 240);

    return `
      <article class="menu-card ${!prod.disponivel ? "esgotado" : ""}" data-id="${prod.id}">
        <div class="menu-card-info">
          <div>
            ${prod.destaque ? `<span class="menu-card-tag">${prod.destaque}</span>` : ""}
            <h3 class="menu-card-title">${prod.nome}</h3>
            <p class="menu-card-desc">${prod.descricao || ""}</p>
          </div>
          <div class="menu-card-price">${precoTexto}</div>
        </div>
        <div class="menu-card-thumb">
          <img src="${thumbUrl}" alt="${prod.nome}" width="92" height="92" decoding="async" onerror="this.src='logo.png'">
          ${!prod.disponivel ? `<span class="sold-out-pill">Esgotado</span>` : ""}
        </div>
      </article>
    `;
  }

  function abrirModalProduto(prod) {
    const cat = state.categorias.find(c => c.id === prod.categoria);
    DOM.modalProductCategory.textContent = cat ? cat.nome : "Cardápio";
    DOM.modalProductName.textContent = prod.nome;
    DOM.modalProductDescription.textContent = prod.descricao || "";
    DOM.modalProductImage.src = otimizarImagem(prod.imagem, 540);

    if (prod.precos) {
      DOM.modalSizesContainer.style.display = "block";
      DOM.modalFixedPriceContainer.style.display = "none";

      DOM.modalSizesGrid.innerHTML = Object.keys(prod.precos).map(key => {
        const info = TAMANHOS_CONFIG[key] || { nome: key, detalhe: "" };
        return `
          <div class="size-row">
            <span><strong>${info.nome}</strong> <small>${info.detalhe}</small></span>
            <span class="price">${formatarMoeda(prod.precos[key])}</span>
          </div>
        `;
      }).join("");

      const bordasAtivas = state.bordas.filter(b => b.disponivel && b.preco > 0);
      if (bordasAtivas.length > 0) {
        const listaBordas = bordasAtivas.map(b => `${b.nome} (+${formatarMoeda(b.preco)})`).join(" · ");
        DOM.modalCrustsSummary.innerHTML = `<i class="fa-solid fa-ring"></i> Bordas: ${listaBordas}`;
        DOM.modalExtrasNote.style.display = "flex";
      } else {
        DOM.modalExtrasNote.style.display = "none";
      }
    } else {
      DOM.modalSizesContainer.style.display = "none";
      DOM.modalExtrasNote.style.display = "none";
      DOM.modalFixedPriceContainer.style.display = "block";
      DOM.modalFixedPriceValue.textContent = formatarMoeda(prod.precoFixo);
    }

    const num = (state.configuracoes.telefoneWhatsApp || "5549999156336").replace(/\D/g, "");
    const msg = `Olá! Vi no cardápio da Olimpo Pizzas Delivery e gostaria de pedir: *${prod.nome}*`;
    DOM.btnWhatsAppItem.href = `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;

    DOM.productModalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function fecharModalProduto() {
    DOM.productModalOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Inicialización inmediata
  if (DOM.currentYear) DOM.currentYear.textContent = new Date().getFullYear();
  renderizarInformacoesLoja();
  renderizarCategorias();
  renderizarProdutos();

  if (DOM.searchInput) {
    DOM.searchInput.addEventListener("input", (e) => {
      state.termoBusca = e.target.value;
      DOM.searchClearBtn.classList.toggle("active", state.termoBusca.length > 0);
      renderizarProdutos();
    });
  }

  if (DOM.searchClearBtn) {
    DOM.searchClearBtn.addEventListener("click", () => {
      DOM.searchInput.value = "";
      state.termoBusca = "";
      DOM.searchClearBtn.classList.remove("active");
      renderizarProdutos();
    });
  }

  if (DOM.btnCloseModal) DOM.btnCloseModal.addEventListener("click", fecharModalProduto);
  if (DOM.productModalOverlay) {
    DOM.productModalOverlay.addEventListener("click", (e) => {
      if (e.target === DOM.productModalOverlay) fecharModalProduto();
    });
  }
});
