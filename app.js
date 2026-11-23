/**
 * OLIMPO PIZZARIA — LÓGICA DO CARDÁPIO ONLINE PÚBLICO (APP.JS)
 * ==============================================================================
 * Gerencia o carregamento de produtos, busca em tempo real, filtros de categorias,
 * modal interativo de personalização (tamanhos, meia a meia, bordas),
 * carrinho de compras e envio formatado direto para o WhatsApp da pizzaria.
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", async () => {
  // ==========================================
  // 1. ESTADO GLOBAL DA APLICAÇÃO
  // ==========================================
  const state = {
    configuracoes: {},
    produtos: [],
    bordas: [],
    categorias: [],
    carrinho: [],
    categoriaAtiva: "todas",
    termoBusca: "",
    tipoEntrega: "delivery", // 'delivery' ou 'retirada'
    formaPagamento: "pix",    // 'pix', 'cartao' ou 'dinheiro'
    // Estado do item atualmente aberto no modal
    modal: {
      produto: null,
      tamanhoSelecionado: "grande", // 'brotinho', 'media', 'grande', 'familia' ou null
      meiaAMeia: false,
      segundoSabor: null,
      bordaSelecionada: null,
      observacoes: "",
      quantidade: 1,
      precoUnitario: 0,
      precoTotal: 0
    }
  };

  // Nomes amigáveis dos tamanhos e fatias
  const TAMANHOS_CONFIG = {
    brotinho: { nome: "Brotinho", fatias: "4 fatias", ordem: 1 },
    media: { nome: "Média", fatias: "6 fatias", ordem: 2 },
    grande: { nome: "Grande", fatias: "8 fatias", ordem: 3 },
    familia: { nome: "Família", fatias: "12 fatias", ordem: 4 }
  };

  // ==========================================
  // 2. REFERÊNCIAS DOS ELEMENTOS DO DOM
  // ==========================================
  const DOM = {
    // Topo e Banner
    headerStoreName: document.getElementById("headerStoreName"),
    storeStatusBadge: document.getElementById("storeStatusBadge"),
    storeStatusText: document.getElementById("storeStatusText"),
    infoDeliveryTime: document.getElementById("infoDeliveryTime"),
    infoDeliveryFee: document.getElementById("infoDeliveryFee"),
    infoOpenHours: document.getElementById("infoOpenHours"),
    heroDescription: document.getElementById("heroDescription"),
    currentYear: document.getElementById("currentYear"),
    
    // Busca e Categorias
    searchInput: document.getElementById("searchInput"),
    searchClearBtn: document.getElementById("searchClearBtn"),
    categoriesBar: document.getElementById("categoriesBar"),
    productsContainer: document.getElementById("productsContainer"),

    // Botões do Carrinho
    btnOpenCartDesktop: document.getElementById("btnOpenCartDesktop"),
    btnOpenCartMobile: document.getElementById("btnOpenCartMobile"),
    headerCartCount: document.getElementById("headerCartCount"),
    headerCartCountMobile: document.getElementById("headerCartCountMobile"),
    mobileCartBar: document.getElementById("mobileCartBar"),
    btnOpenMobileBottomCart: document.getElementById("btnOpenMobileBottomCart"),
    mobileBottomCount: document.getElementById("mobileBottomCount"),
    mobileBottomTotal: document.getElementById("mobileBottomTotal"),

    // Modal de Personalização
    productModalOverlay: document.getElementById("productModalOverlay"),
    btnCloseModal: document.getElementById("btnCloseModal"),
    modalProductName: document.getElementById("modalProductName"),
    modalProductCategory: document.getElementById("modalProductCategory"),
    modalProductImage: document.getElementById("modalProductImage"),
    modalProductDescription: document.getElementById("modalProductDescription"),
    modalSizesContainer: document.getElementById("modalSizesContainer"),
    modalSizesGrid: document.getElementById("modalSizesGrid"),
    modalHalfPizzaBox: document.getElementById("modalHalfPizzaBox"),
    modalHalfRuleNote: document.getElementById("modalHalfRuleNote"),
    halfPizzaCheckbox: document.getElementById("halfPizzaCheckbox"),
    halfFlavorWrap: document.getElementById("halfFlavorWrap"),
    secondFlavorSelect: document.getElementById("secondFlavorSelect"),
    modalCrustContainer: document.getElementById("modalCrustContainer"),
    modalCrustList: document.getElementById("modalCrustList"),
    modalNotesInput: document.getElementById("modalNotesInput"),
    btnModalDecreaseQty: document.getElementById("btnModalDecreaseQty"),
    btnModalIncreaseQty: document.getElementById("btnModalIncreaseQty"),
    modalQtyDisplay: document.getElementById("modalQtyDisplay"),
    btnModalAddToCart: document.getElementById("btnModalAddToCart"),
    modalLiveTotalPrice: document.getElementById("modalLiveTotalPrice"),

    // Drawer do Carrinho
    cartDrawerOverlay: document.getElementById("cartDrawerOverlay"),
    btnCloseCart: document.getElementById("btnCloseCart"),
    cartEmptyState: document.getElementById("cartEmptyState"),
    cartItemsList: document.getElementById("cartItemsList"),
    checkoutSection: document.getElementById("checkoutSection"),
    cartFooter: document.getElementById("cartFooter"),
    clientName: document.getElementById("clientName"),
    clientPhone: document.getElementById("clientPhone"),
    tabDelivery: document.getElementById("tabDelivery"),
    tabPickup: document.getElementById("tabPickup"),
    addressFieldsContainer: document.getElementById("addressFieldsContainer"),
    addressStreet: document.getElementById("addressStreet"),
    addressNumber: document.getElementById("addressNumber"),
    addressNeighborhood: document.getElementById("addressNeighborhood"),
    addressComplement: document.getElementById("addressComplement"),
    paymentButtons: document.querySelectorAll(".payment-btn"),
    pixDetailsBox: document.getElementById("pixDetailsBox"),
    pixKeyLabel: document.getElementById("pixKeyTypeLabel"),
    pixKeyDisplay: document.getElementById("pixKeyDisplay"),
    btnCopyPix: document.getElementById("btnCopyPix"),
    changeBox: document.getElementById("changeBox"),
    changeAmount: document.getElementById("changeAmount"),
    cartSubtotalText: document.getElementById("cartSubtotalText"),
    deliveryFeeLine: document.getElementById("deliveryFeeLine"),
    cartDeliveryFeeText: document.getElementById("cartDeliveryFeeText"),
    cartTotalText: document.getElementById("cartTotalText"),
    btnSubmitOrder: document.getElementById("btnSubmitOrder"),

    // Confirmação de Sucesso
    orderSuccessOverlay: document.getElementById("orderSuccessOverlay"),
    successOrderId: document.getElementById("successOrderId"),
    btnRetryWhatsApp: document.getElementById("btnRetryWhatsApp"),
    btnCloseSuccessModal: document.getElementById("btnCloseSuccessModal"),

    // Toasts
    toastContainer: document.getElementById("toastContainer")
  };

  // ==========================================
  // 3. FUNÇÕES UTILITÁRIAS
  // ==========================================
  function formatarMoeda(valor) {
    const num = Number(valor) || 0;
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function mostrarToast(mensagem, tipo = "info") {
    if (!DOM.toastContainer) return;
    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;

    let icone = "fa-info-circle";
    if (tipo === "success") icone = "fa-circle-check";
    if (tipo === "error") icone = "fa-circle-exclamation";

    toast.innerHTML = `<i class="fa-solid ${icone}"></i> <span>${mensagem}</span>`;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(50px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // ==========================================
  // 4. INICIALIZAÇÃO DA APLICAÇÃO
  // ==========================================
  async function inicializar() {
    if (DOM.currentYear) {
      DOM.currentYear.textContent = new Date().getFullYear();
    }

    // Carrega dados do banco (Firebase ou LocalStorage)
    await carregarDados();

    // Recupera carrinho salvo da sessão anterior
    carregarCarrinhoSalvo();

    // Renderiza interface inicial
    renderizarInformacoesLoja();
    renderizarCategorias();
    renderizarProdutos();
    atualizarVisualCarrinho();

    // Registra ouvintes em tempo real para mudanças vindas do Admin
    registrarOuvintesTempoReal();

    // Conecta eventos de cliques e interações
    configurarEventos();
  }

  async function carregarDados() {
    try {
      state.configuracoes = await OlimpoDB.obterConfiguracoes();
      state.produtos = await OlimpoDB.obterProdutos();
      state.bordas = await OlimpoDB.obterBordas();
      state.categorias = (typeof SEED_DATA !== "undefined" && SEED_DATA.categorias) ? SEED_DATA.categorias : [];
    } catch (e) {
      console.error("Erro ao carregar dados:", e);
      mostrarToast("Erro ao carregar dados do cardápio", "error");
    }
  }

  function registrarOuvintesTempoReal() {
    OlimpoDB.ouvirAtualizacoes("configuracoes", (novasConfig) => {
      state.configuracoes = novasConfig;
      renderizarInformacoesLoja();
      atualizarVisualCarrinho();
    });

    OlimpoDB.ouvirAtualizacoes("produtos", (novosProdutos) => {
      state.produtos = novosProdutos;
      renderizarProdutos();
    });

    OlimpoDB.ouvirAtualizacoes("bordas", (novasBordas) => {
      state.bordas = novasBordas;
    });
  }

  // ==========================================
  // 5. RENDERIZAÇÃO DAS INFORMAÇÕES DA LOJA
  // ==========================================
  function renderizarInformacoesLoja() {
    const conf = state.configuracoes || {};

    if (DOM.headerStoreName && conf.nomePizzaria) {
      DOM.headerStoreName.textContent = conf.nomePizzaria;
    }

    if (DOM.storeStatusBadge && DOM.storeStatusText) {
      if (conf.aberto !== false) {
        DOM.storeStatusBadge.className = "status-badge open";
        DOM.storeStatusText.textContent = "Aberto Agora";
      } else {
        DOM.storeStatusBadge.className = "status-badge closed";
        DOM.storeStatusText.textContent = "Fechado no Momento";
      }
    }

    if (DOM.infoDeliveryTime && conf.tempoEntrega) {
      DOM.infoDeliveryTime.textContent = conf.tempoEntrega;
    }

    if (DOM.infoDeliveryFee && conf.taxaEntrega !== undefined) {
      DOM.infoDeliveryFee.textContent = formatarMoeda(conf.taxaEntrega);
    }

    if (DOM.infoOpenHours && conf.horarioFuncionamento) {
      DOM.infoOpenHours.textContent = conf.horarioFuncionamento;
    }

    if (DOM.pixKeyDisplay && conf.chavePix) {
      DOM.pixKeyDisplay.textContent = conf.chavePix;
    }

    if (DOM.pixKeyLabel && conf.tipoChavePix) {
      DOM.pixKeyLabel.textContent = `Chave ${conf.tipoChavePix}`;
    }
  }

  // ==========================================
  // 6. RENDERIZAÇÃO DAS CATEGORIAS
  // ==========================================
  function renderizarCategorias() {
    if (!DOM.categoriesBar) return;

    let html = `
      <button class="category-pill ${state.categoriaAtiva === 'todas' ? 'active' : ''}" data-category="todas">
        <i class="fa-solid fa-border-all"></i>
        <span>Todas as Opções</span>
      </button>
    `;

    state.categorias.forEach(cat => {
      const ativa = state.categoriaAtiva === cat.id ? "active" : "";
      html += `
        <button class="category-pill ${ativa}" data-category="${cat.id}">
          <i class="fa-solid ${cat.icone || 'fa-utensils'}"></i>
          <span>${cat.nome}</span>
        </button>
      `;
    });

    DOM.categoriesBar.innerHTML = html;

    // Adiciona evento de clique a cada pílula de categoria
    DOM.categoriesBar.querySelectorAll(".category-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        state.categoriaAtiva = btn.getAttribute("data-category");
        renderizarCategorias();
        renderizarProdutos();
      });
    });
  }

  // ==========================================
  // 7. RENDERIZAÇÃO DOS PRODUTOS DO CARDÁPIO
  // ==========================================
  function renderizarProdutos() {
    if (!DOM.productsContainer) return;

    // Filtra produtos conforme busca e categoria selecionada
    let produtosFiltrados = state.produtos.filter(prod => {
      // Filtro de categoria
      if (state.categoriaAtiva !== "todas" && prod.categoria !== state.categoriaAtiva) {
        return false;
      }
      // Filtro de busca textual (nome ou descrição/ingredientes)
      if (state.termoBusca.trim() !== "") {
        const termo = state.termoBusca.toLowerCase();
        const nomeMatch = prod.nome.toLowerCase().includes(termo);
        const descMatch = (prod.descricao || "").toLowerCase().includes(termo);
        if (!nomeMatch && !descMatch) return false;
      }
      return true;
    });

    if (produtosFiltrados.length === 0) {
      DOM.productsContainer.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 1rem; color: var(--gold-primary);">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <h3 style="font-family: var(--font-brand); color: #fff; font-size: 1.3rem; margin-bottom: 0.5rem;">
            Nenhum item celestial encontrado
          </h3>
          <p>Tente buscar por outro ingrediente ou selecionar outra categoria acima.</p>
        </div>
      `;
      return;
    }

    // Se estiver em "todas", agrupa visualmente por categoria para elegância
    let html = "";

    if (state.categoriaAtiva === "todas" && state.termoBusca.trim() === "") {
      state.categorias.forEach(cat => {
        const itensDaCategoria = produtosFiltrados.filter(p => p.categoria === cat.id);
        if (itensDaCategoria.length > 0) {
          html += `
            <section class="menu-section" id="cat-section-${cat.id}">
              <div class="section-header">
                <h2 class="section-title">
                  <i class="fa-solid ${cat.icone || 'fa-pizza-slice'}"></i>
                  <span>${cat.nome}</span>
                </h2>
                <span class="section-count">${itensDaCategoria.length} itens</span>
              </div>
              <div class="products-grid">
                ${itensDaCategoria.map(p => criarCardProdutoHTML(p)).join("")}
              </div>
            </section>
          `;
        }
      });
    } else {
      // Listagem direta
      html = `
        <section class="menu-section">
          <div class="products-grid">
            ${produtosFiltrados.map(p => criarCardProdutoHTML(p)).join("")}
          </div>
        </section>
      `;
    }

    DOM.productsContainer.innerHTML = html;

    // Vincula clique nos cards e botões para abrir o modal de personalização
    DOM.productsContainer.querySelectorAll(".product-card").forEach(card => {
      card.addEventListener("click", () => {
        const prodId = card.getAttribute("data-id");
        const produto = state.produtos.find(p => p.id === prodId);
        if (produto) {
          if (!produto.disponivel) {
            mostrarToast("Este item está esgotado no momento", "info");
            return;
          }
          abrirModalProduto(produto);
        }
      });
    });
  }

  function criarCardProdutoHTML(produto) {
    const esgotadoClass = !produto.disponivel ? "esgotado" : "";
    
    // Cálculo do menor preço para o preview "A partir de"
    let precoFormatado = "";
    if (produto.precos) {
      const valores = Object.values(produto.precos);
      const menorPreco = Math.min(...valores);
      precoFormatado = `A partir de <strong>${formatarMoeda(menorPreco)}</strong>`;
    } else if (produto.precoFixo) {
      precoFormatado = `<strong>${formatarMoeda(produto.precoFixo)}</strong>`;
    }

    const badgeDestaque = produto.destaque 
      ? `<span class="product-badge">${produto.destaque}</span>` 
      : "";

    const statusEsgotado = !produto.disponivel 
      ? `<span class="product-status-tag unavailable"><i class="fa-solid fa-ban"></i> Esgotado</span>` 
      : "";

    return `
      <div class="product-card ${esgotadoClass}" data-id="${produto.id}">
        <div class="product-image-wrap">
          <img src="${produto.imagem}" alt="${produto.nome}" class="product-img" loading="lazy">
          ${badgeDestaque}
          ${statusEsgotado}
        </div>
        <div class="product-body">
          <h3 class="product-name">${produto.nome}</h3>
          <p class="product-desc">${produto.descricao || ""}</p>
          <div class="product-footer">
            <div class="product-price-box">
              <span class="price-label">Valor</span>
              <span class="product-price">${precoFormatado}</span>
            </div>
            <button class="btn-add-item" type="button" aria-label="Personalizar e adicionar ${produto.nome}">
              <i class="fa-solid fa-plus"></i>
              <span>${produto.precos ? 'Montar' : 'Pedir'}</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 8. MODAL DE PERSONALIZAÇÃO DO PRODUTO
  // ==========================================
  function abrirModalProduto(produto) {
    state.modal.produto = produto;
    state.modal.quantidade = 1;
    state.modal.meiaAMeia = false;
    state.modal.segundoSabor = null;
    state.modal.observacoes = "";

    // Define tamanho padrão se for pizza
    if (produto.precos) {
      state.modal.tamanhoSelecionado = produto.precos.grande ? "grande" : Object.keys(produto.precos)[0];
    } else {
      state.modal.tamanhoSelecionado = null;
    }

    // Define borda padrão ("Sem borda" ou primeira disponível)
    const bordaPadrao = state.bordas.find(b => b.disponivel && b.preco === 0) || state.bordas[0];
    state.modal.bordaSelecionada = bordaPadrao || null;

    // Preenche dados visuais no modal
    DOM.modalProductName.textContent = produto.nome;
    const cat = state.categorias.find(c => c.id === produto.categoria);
    DOM.modalProductCategory.textContent = cat ? cat.nome : "Olimpo Pizzaria";
    DOM.modalProductImage.src = produto.imagem;
    DOM.modalProductImage.alt = produto.nome;
    DOM.modalProductDescription.textContent = produto.descricao || "";
    DOM.modalNotesInput.value = "";
    DOM.modalQtyDisplay.textContent = "1";

    // Mostra/oculta seletores de tamanho e meia a meia
    if (produto.precos) {
      DOM.modalSizesContainer.style.display = "block";
      renderizarSeletoresTamanho(produto);

      if (produto.permiteMeia !== false) {
        DOM.modalHalfPizzaBox.style.display = "block";
        DOM.halfPizzaCheckbox.checked = false;
        DOM.halfFlavorWrap.classList.remove("active");
        renderizarOpcoesSegundoSabor(produto);

        // Explica a regra da meia a meia configurada na loja
        const regra = state.configuracoes.regraMeiaAMeia === "media" 
          ? "Cobrado pela média dos valores" 
          : "Cobrado pelo sabor de maior valor";
        DOM.modalHalfRuleNote.textContent = `Escolha 2 sabores na mesma pizza (${regra})`;
      } else {
        DOM.modalHalfPizzaBox.style.display = "none";
      }

      DOM.modalCrustContainer.style.display = "block";
      renderizarSeletoresBorda();
    } else {
      // Produto com preço fixo (Bebidas, Combos fechados)
      DOM.modalSizesContainer.style.display = "none";
      DOM.modalHalfPizzaBox.style.display = "none";
      DOM.modalCrustContainer.style.display = "none";
    }

    // Calcula valor ao vivo
    recalcularTotalModal();

    // Abre o modal com animação suave
    DOM.productModalOverlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Evita scroll de fundo
  }

  function fecharModalProduto() {
    DOM.productModalOverlay.classList.remove("active");
    document.body.style.overflow = "";
    state.modal.produto = null;
  }

  function renderizarSeletoresTamanho(produto) {
    if (!DOM.modalSizesGrid || !produto.precos) return;

    let html = "";
    const tamanhosChaves = Object.keys(produto.precos);

    tamanhosChaves.forEach(tamKey => {
      const config = TAMANHOS_CONFIG[tamKey] || { nome: tamKey, fatias: "" };
      const preco = produto.precos[tamKey];
      const selecionado = state.modal.tamanhoSelecionado === tamKey ? "selected" : "";

      html += `
        <div class="size-option-card ${selecionado}" data-tam="${tamKey}">
          <div class="size-name">${config.nome}</div>
          <div class="size-slices">${config.fatias}</div>
          <div class="size-price">${formatarMoeda(preco)}</div>
        </div>
      `;
    });

    DOM.modalSizesGrid.innerHTML = html;

    DOM.modalSizesGrid.querySelectorAll(".size-option-card").forEach(card => {
      card.addEventListener("click", () => {
        state.modal.tamanhoSelecionado = card.getAttribute("data-tam");
        DOM.modalSizesGrid.querySelectorAll(".size-option-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        recalcularTotalModal();
      });
    });
  }

  function renderizarOpcoesSegundoSabor(produtoAtual) {
    if (!DOM.secondFlavorSelect) return;

    // Busca outras pizzas salgadas ou doces elegíveis
    const outrasPizzas = state.produtos.filter(p => 
      p.id !== produtoAtual.id && 
      p.precos && 
      p.disponivel && 
      p.permiteMeia !== false
    );

    let html = `<option value="">-- Toque para escolher o 2º sabor --</option>`;
    outrasPizzas.forEach(p => {
      html += `<option value="${p.id}">${p.nome}</option>`;
    });

    DOM.secondFlavorSelect.innerHTML = html;
  }

  function renderizarSeletoresBorda() {
    if (!DOM.modalCrustList) return;

    let html = "";
    const bordasDisponiveis = state.bordas.filter(b => b.disponivel);

    bordasDisponiveis.forEach(borda => {
      const isSelected = state.modal.bordaSelecionada && state.modal.bordaSelecionada.id === borda.id;
      const precoTexto = borda.preco > 0 ? `+ ${formatarMoeda(borda.preco)}` : "Grátis";

      html += `
        <div class="crust-option-card ${isSelected ? 'selected' : ''}" data-crust-id="${borda.id}">
          <div class="crust-info">
            <span class="radio-circle"></span>
            <div>
              <div class="crust-name">${borda.nome}</div>
              <div style="font-size: 0.76rem; color: var(--text-dimmed);">${borda.descricao || ''}</div>
            </div>
          </div>
          <span class="crust-price">${precoTexto}</span>
        </div>
      `;
    });

    DOM.modalCrustList.innerHTML = html;

    DOM.modalCrustList.querySelectorAll(".crust-option-card").forEach(card => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-crust-id");
        state.modal.bordaSelecionada = state.bordas.find(b => b.id === id);
        DOM.modalCrustList.querySelectorAll(".crust-option-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        recalcularTotalModal();
      });
    });
  }

  function recalcularTotalModal() {
    const prod = state.modal.produto;
    if (!prod) return;

    let precoBase = 0;

    if (prod.precos && state.modal.tamanhoSelecionado) {
      precoBase = prod.precos[state.modal.tamanhoSelecionado] || 0;

      // Se Meia a Meia estiver ativa e houver 2º sabor selecionado
      if (state.modal.meiaAMeia && state.modal.segundoSabor) {
        const precoSabor2 = state.modal.segundoSabor.precos 
          ? (state.modal.segundoSabor.precos[state.modal.tamanhoSelecionado] || precoBase)
          : precoBase;

        if (state.configuracoes.regraMeiaAMeia === "media") {
          precoBase = (precoBase + precoSabor2) / 2;
        } else {
          // Cobra pelo maior valor
          precoBase = Math.max(precoBase, precoSabor2);
        }
      }

      // Adiciona taxa de borda recheada
      if (state.modal.bordaSelecionada && state.modal.bordaSelecionada.preco) {
        precoBase += state.modal.bordaSelecionada.preco;
      }
    } else if (prod.precoFixo) {
      precoBase = prod.precoFixo;
    }

    state.modal.precoUnitario = precoBase;
    state.modal.precoTotal = precoBase * state.modal.quantidade;

    if (DOM.modalLiveTotalPrice) {
      DOM.modalLiveTotalPrice.textContent = formatarMoeda(state.modal.precoTotal);
    }
  }

  // ==========================================
  // 9. CARRINHO DE COMPRAS (ADICIONAR & GERENCIAR)
  // ==========================================
  function adicionarItemAoCarrinho() {
    const prod = state.modal.produto;
    if (!prod) return;

    // Se ativou meia a meia, exige que selecione o 2º sabor
    if (prod.precos && state.modal.meiaAMeia && !state.modal.segundoSabor) {
      mostrarToast("Por favor, selecione o 2º sabor da sua pizza meia a meia!", "error");
      DOM.secondFlavorSelect.focus();
      return;
    }

    const tamanhoConfig = state.modal.tamanhoSelecionado ? TAMANHOS_CONFIG[state.modal.tamanhoSelecionado] : null;

    const itemCarrinho = {
      idUnico: "item-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
      produtoId: prod.id,
      nome: prod.nome,
      tamanhoId: state.modal.tamanhoSelecionado,
      tamanhoNome: tamanhoConfig ? `${tamanhoConfig.nome} (${tamanhoConfig.fatias})` : null,
      meiaAMeia: state.modal.meiaAMeia,
      segundoSaborId: state.modal.segundoSabor ? state.modal.segundoSabor.id : null,
      segundoSaborNome: state.modal.segundoSabor ? state.modal.segundoSabor.nome : null,
      bordaId: state.modal.bordaSelecionada ? state.modal.bordaSelecionada.id : null,
      bordaNome: state.modal.bordaSelecionada ? state.modal.bordaSelecionada.nome : null,
      bordaPreco: state.modal.bordaSelecionada ? state.modal.bordaSelecionada.preco : 0,
      observacoes: DOM.modalNotesInput ? DOM.modalNotesInput.value.trim() : "",
      quantidade: state.modal.quantidade,
      precoUnitario: state.modal.precoUnitario,
      subtotal: state.modal.precoTotal
    };

    state.carrinho.push(itemCarrinho);
    salvarCarrinhoStorage();
    atualizarVisualCarrinho();
    fecharModalProduto();

    mostrarToast(`"${prod.nome}" adicionado com sucesso!`, "success");
  }

  function carregarCarrinhoSalvo() {
    try {
      const salvo = localStorage.getItem("olimpo_carrinho_v1");
      if (salvo) {
        state.carrinho = JSON.parse(salvo);
      }
    } catch (e) {
      state.carrinho = [];
    }
  }

  function salvarCarrinhoStorage() {
    localStorage.setItem("olimpo_carrinho_v1", JSON.stringify(state.carrinho));
  }

  function alterarQuantidadeItemCarrinho(idUnico, delta) {
    const index = state.carrinho.findIndex(item => item.idUnico === idUnico);
    if (index >= 0) {
      state.carrinho[index].quantidade += delta;
      if (state.carrinho[index].quantidade <= 0) {
        state.carrinho.splice(index, 1);
        mostrarToast("Item removido da sacola", "info");
      } else {
        state.carrinho[index].subtotal = state.carrinho[index].precoUnitario * state.carrinho[index].quantidade;
      }
      salvarCarrinhoStorage();
      atualizarVisualCarrinho();
    }
  }

  function removerItemCarrinho(idUnico) {
    state.carrinho = state.carrinho.filter(item => item.idUnico !== idUnico);
    salvarCarrinhoStorage();
    atualizarVisualCarrinho();
    mostrarToast("Item removido", "info");
  }

  function atualizarVisualCarrinho() {
    const totalItens = state.carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    const subtotal = state.carrinho.reduce((acc, item) => acc + item.subtotal, 0);
    
    // Taxa de entrega se aplicável
    const taxaEntrega = state.tipoEntrega === "delivery" 
      ? (Number(state.configuracoes.taxaEntrega) || 0) 
      : 0;

    const totalGeral = subtotal + taxaEntrega;

    // Badges contadores do cabeçalho
    if (DOM.headerCartCount) DOM.headerCartCount.textContent = totalItens;
    if (DOM.headerCartCountMobile) DOM.headerCartCountMobile.textContent = totalItens;

    // Barra inferior flutuante no celular
    if (DOM.mobileCartBar && DOM.mobileBottomCount && DOM.mobileBottomTotal) {
      if (totalItens > 0) {
        DOM.mobileCartBar.classList.add("active");
        DOM.mobileBottomCount.textContent = totalItens;
        DOM.mobileBottomTotal.textContent = formatarMoeda(totalGeral);
      } else {
        DOM.mobileCartBar.classList.remove("active");
      }
    }

    // Drawer do carrinho
    if (totalItens === 0) {
      if (DOM.cartEmptyState) DOM.cartEmptyState.style.display = "block";
      if (DOM.cartItemsList) DOM.cartItemsList.innerHTML = "";
      if (DOM.checkoutSection) DOM.checkoutSection.style.display = "none";
      if (DOM.cartFooter) DOM.cartFooter.style.display = "none";
    } else {
      if (DOM.cartEmptyState) DOM.cartEmptyState.style.display = "none";
      if (DOM.checkoutSection) DOM.checkoutSection.style.display = "flex";
      if (DOM.cartFooter) DOM.cartFooter.style.display = "flex";

      // Renderiza itens
      let html = "";
      state.carrinho.forEach(item => {
        let detalhesExtras = "";
        if (item.tamanhoNome) {
          detalhesExtras += `<span><i class="fa-solid fa-arrows-up-down-left-right"></i> Tamanho: <strong>${item.tamanhoNome}</strong></span>`;
        }
        if (item.meiaAMeia && item.segundoSaborNome) {
          detalhesExtras += `<span><i class="fa-solid fa-circle-half-stroke"></i> 2º Sabor: <strong>${item.segundoSaborNome}</strong></span>`;
        }
        if (item.bordaNome && item.bordaNome !== "Sem Borda Recheada (Massa Tradicional)") {
          detalhesExtras += `<span><i class="fa-solid fa-ring"></i> Borda: <strong>${item.bordaNome}</strong></span>`;
        }
        if (item.observacoes) {
          detalhesExtras += `<span><i class="fa-regular fa-comment-dots"></i> Obs: <em>${item.observacoes}</em></span>`;
        }

        html += `
          <div class="cart-item-card">
            <div class="cart-item-top">
              <span class="cart-item-name">${item.nome}</span>
              <button class="btn-remove-item" onclick="window.removerItemCarrinhoApp('${item.idUnico}')" title="Excluir item">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
            
            <div class="cart-item-details">
              ${detalhesExtras}
            </div>

            <div class="cart-item-bottom">
              <div class="qty-controller" style="transform: scale(0.9); transform-origin: left;">
                <button class="qty-btn" onclick="window.alterarQtdCarrinhoApp('${item.idUnico}', -1)"><i class="fa-solid fa-minus"></i></button>
                <span class="qty-display">${item.quantidade}</span>
                <button class="qty-btn" onclick="window.alterarQtdCarrinhoApp('${item.idUnico}', 1)"><i class="fa-solid fa-plus"></i></button>
              </div>
              <span class="cart-item-price">${formatarMoeda(item.subtotal)}</span>
            </div>
          </div>
        `;
      });

      if (DOM.cartItemsList) DOM.cartItemsList.innerHTML = html;

      // Resumo financeiro no rodapé do drawer
      if (DOM.cartSubtotalText) DOM.cartSubtotalText.textContent = formatarMoeda(subtotal);
      
      if (DOM.deliveryFeeLine && DOM.cartDeliveryFeeText) {
        if (state.tipoEntrega === "delivery") {
          DOM.deliveryFeeLine.style.display = "flex";
          DOM.cartDeliveryFeeText.textContent = formatarMoeda(taxaEntrega);
        } else {
          DOM.deliveryFeeLine.style.display = "none";
        }
      }

      if (DOM.cartTotalText) DOM.cartTotalText.textContent = formatarMoeda(totalGeral);
    }
  }

  // Expõe funções para os botões do HTML inline do carrinho
  window.alterarQtdCarrinhoApp = alterarQuantidadeItemCarrinho;
  window.removerItemCarrinhoApp = removerItemCarrinho;

  function abrirDrawerCarrinho() {
    atualizarVisualCarrinho();
    DOM.cartDrawerOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function fecharDrawerCarrinho() {
    DOM.cartDrawerOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  // ==========================================
  // 10. FINALIZAÇÃO DO PEDIDO & WHATSAPP
  // ==========================================
  async function finalizarPedido() {
    if (state.carrinho.length === 0) {
      mostrarToast("Sua sacola está vazia!", "error");
      return;
    }

    // 1. Validação de dados do cliente
    const nome = DOM.clientName.value.trim();
    const telefone = DOM.clientPhone.value.trim();

    if (!nome) {
      mostrarToast("Por favor, digite seu nome completo.", "error");
      DOM.clientName.focus();
      return;
    }

    if (!telefone || telefone.length < 8) {
      mostrarToast("Por favor, informe seu telefone com DDD.", "error");
      DOM.clientPhone.focus();
      return;
    }

    // 2. Validação de endereço se for Delivery
    let endereco = null;
    if (state.tipoEntrega === "delivery") {
      const rua = DOM.addressStreet.value.trim();
      const numero = DOM.addressNumber.value.trim();
      const bairro = DOM.addressNeighborhood.value.trim();
      const complemento = DOM.addressComplement.value.trim();

      if (!rua || !numero || !bairro) {
        mostrarToast("Preencha rua, número e bairro para a entrega.", "error");
        DOM.addressStreet.focus();
        return;
      }

      endereco = { rua, numero, bairro, complemento };
    }

    // 3. Cálculos de totais
    const subtotal = state.carrinho.reduce((acc, item) => acc + item.subtotal, 0);
    const taxaEntrega = state.tipoEntrega === "delivery" 
      ? (Number(state.configuracoes.taxaEntrega) || 0) 
      : 0;
    const totalGeral = subtotal + taxaEntrega;

    const troco = state.formaPagamento === "dinheiro" ? DOM.changeAmount.value.trim() : null;

    // Gera ID único do pedido (ex: ORD-7821)
    const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);
    const orderId = "ORD-" + numeroAleatorio;

    // Monta objeto do pedido para salvar no banco
    const pedidoCompleto = {
      id: orderId,
      dataHora: new Date().toISOString(),
      cliente: {
        nome,
        telefone
      },
      tipoEntrega: state.tipoEntrega,
      endereco: endereco,
      itens: state.carrinho,
      subtotal: subtotal,
      taxaEntrega: taxaEntrega,
      total: totalGeral,
      formaPagamento: state.formaPagamento,
      trocoPara: troco,
      status: "pendente"
    };

    // 4. Salva o pedido no banco de dados (Firebase Firestore ou LocalStorage)
    try {
      await OlimpoDB.criarPedido(pedidoCompleto);
    } catch (err) {
      console.warn("Aviso ao salvar pedido no DB:", err);
    }

    // 5. Monta a mensagem formatada para o WhatsApp em PT-BR
    const mensagemWhatsApp = montarMensagemWhatsApp(pedidoCompleto);

    // Número de WhatsApp configurado na loja
    const numeroWhats = (state.configuracoes.telefoneWhatsApp || "5511999999999").replace(/\D/g, "");
    const urlWhatsApp = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(mensagemWhatsApp)}`;

    // Abre o WhatsApp em nova aba
    window.open(urlWhatsApp, "_blank");

    // 6. Limpa o carrinho e exibe modal de confirmação
    state.carrinho = [];
    salvarCarrinhoStorage();
    atualizarVisualCarrinho();
    fecharDrawerCarrinho();

    // Exibe modal de sucesso com o número do pedido
    if (DOM.successOrderId) DOM.successOrderId.textContent = orderId;
    if (DOM.btnRetryWhatsApp) DOM.btnRetryWhatsApp.href = urlWhatsApp;
    if (DOM.orderSuccessOverlay) DOM.orderSuccessOverlay.classList.add("active");
  }

  function montarMensagemWhatsApp(p) {
    let msg = `🏛️ *PEDIDO #${p.id} — OLIMPO PIZZARIA*\n`;
    msg += `------------------------------------------\n`;
    msg += `👤 *Cliente:* ${p.cliente.nome}\n`;
    msg += `📱 *Telefone:* ${p.cliente.telefone}\n`;

    if (p.tipoEntrega === "delivery") {
      msg += `🛵 *Modalidade:* Entrega (Delivery)\n`;
      msg += `📍 *Endereço:* ${p.endereco.rua}, nº ${p.endereco.numero}\n`;
      msg += `🏘️ *Bairro:* ${p.endereco.bairro}\n`;
      if (p.endereco.complemento) {
        msg += `🏢 *Complemento:* ${p.endereco.complemento}\n`;
      }
    } else {
      msg += `🏬 *Modalidade:* Retirada no Balcão\n`;
    }

    msg += `------------------------------------------\n`;
    msg += `📋 *ITENS DO PEDIDO:*\n\n`;

    p.itens.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.quantidade}x ${item.nome}*\n`;
      if (item.tamanhoNome) {
        msg += `   • Tamanho: ${item.tamanhoNome}\n`;
      }
      if (item.meiaAMeia && item.segundoSaborNome) {
        msg += `   • 2º Sabor: ${item.segundoSaborNome}\n`;
      }
      if (item.bordaNome && item.bordaNome !== "Sem Borda Recheada (Massa Tradicional)") {
        msg += `   • Borda: ${item.bordaNome}\n`;
      }
      if (item.observacoes) {
        msg += `   • Obs: ${item.observacoes}\n`;
      }
      msg += `   • Valor: ${formatarMoeda(item.subtotal)}\n\n`;
    });

    msg += `------------------------------------------\n`;
    msg += `💵 *Subtotal:* ${formatarMoeda(p.subtotal)}\n`;
    if (p.tipoEntrega === "delivery") {
      msg += `🛵 *Taxa de Entrega:* ${formatarMoeda(p.taxaEntrega)}\n`;
    }
    msg += `💰 *TOTAL A PAGAR: ${formatarMoeda(p.total)}*\n`;
    msg += `------------------------------------------\n`;

    let pagtoDesc = "Pix";
    if (p.formaPagamento === "cartao") pagtoDesc = "Cartão na Entrega";
    if (p.formaPagamento === "dinheiro") {
      pagtoDesc = `Dinheiro (Troco para: ${p.trocoPara || "Não precisa"})`;
    }
    msg += `💳 *Forma de Pagamento:* ${pagtoDesc}\n`;

    if (p.formaPagamento === "pix" && state.configuracoes.chavePix) {
      msg += `⚡ *Chave Pix (${state.configuracoes.tipoChavePix || "Chave"}):* ${state.configuracoes.chavePix}\n`;
    }

    msg += `------------------------------------------\n`;
    msg += `⚡ _Por favor, confirme o recebimento do pedido! Obrigado pela preferência no Olimpo dos Sabores._ 🍕`;

    return msg;
  }

  // ==========================================
  // 11. CONFIGURAÇÃO DE EVENTOS DO USUÁRIO
  // ==========================================
  function configurarEventos() {
    // Busca em tempo real
    if (DOM.searchInput) {
      DOM.searchInput.addEventListener("input", (e) => {
        state.termoBusca = e.target.value;
        if (DOM.searchClearBtn) {
          DOM.searchClearBtn.classList.toggle("active", state.termoBusca.length > 0);
        }
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

    // Abertura / Fechamento do Carrinho
    if (DOM.btnOpenCartDesktop) DOM.btnOpenCartDesktop.addEventListener("click", abrirDrawerCarrinho);
    if (DOM.btnOpenCartMobile) DOM.btnOpenCartMobile.addEventListener("click", abrirDrawerCarrinho);
    if (DOM.btnOpenMobileBottomCart) DOM.btnOpenMobileBottomCart.addEventListener("click", abrirDrawerCarrinho);
    if (DOM.btnCloseCart) DOM.btnCloseCart.addEventListener("click", fecharDrawerCarrinho);

    // Fechar ao clicar no fundo escuro
    if (DOM.cartDrawerOverlay) {
      DOM.cartDrawerOverlay.addEventListener("click", (e) => {
        if (e.target === DOM.cartDrawerOverlay) fecharDrawerCarrinho();
      });
    }

    // Modal de produto
    if (DOM.btnCloseModal) DOM.btnCloseModal.addEventListener("click", fecharModalProduto);
    if (DOM.productModalOverlay) {
      DOM.productModalOverlay.addEventListener("click", (e) => {
        if (e.target === DOM.productModalOverlay) fecharModalProduto();
      });
    }

    // Contadores de quantidade no modal
    if (DOM.btnModalDecreaseQty) {
      DOM.btnModalDecreaseQty.addEventListener("click", () => {
        if (state.modal.quantidade > 1) {
          state.modal.quantidade--;
          DOM.modalQtyDisplay.textContent = state.modal.quantidade;
          recalcularTotalModal();
        }
      });
    }

    if (DOM.btnModalIncreaseQty) {
      DOM.btnModalIncreaseQty.addEventListener("click", () => {
        if (state.modal.quantidade < 20) {
          state.modal.quantidade++;
          DOM.modalQtyDisplay.textContent = state.modal.quantidade;
          recalcularTotalModal();
        }
      });
    }

    // Switch de Meia a Meia
    if (DOM.halfPizzaCheckbox) {
      DOM.halfPizzaCheckbox.addEventListener("change", (e) => {
        state.modal.meiaAMeia = e.target.checked;
        if (DOM.halfFlavorWrap) {
          DOM.halfFlavorWrap.classList.toggle("active", e.target.checked);
        }
        if (!e.target.checked) {
          state.modal.segundoSabor = null;
          if (DOM.secondFlavorSelect) DOM.secondFlavorSelect.value = "";
        }
        recalcularTotalModal();
      });
    }

    if (DOM.secondFlavorSelect) {
      DOM.secondFlavorSelect.addEventListener("change", (e) => {
        const id = e.target.value;
        state.modal.segundoSabor = state.produtos.find(p => p.id === id) || null;
        recalcularTotalModal();
      });
    }

    // Botão Adicionar do Modal
    if (DOM.btnModalAddToCart) {
      DOM.btnModalAddToCart.addEventListener("click", adicionarItemAoCarrinho);
    }

    // Alternador de Entrega / Retirada
    if (DOM.tabDelivery) {
      DOM.tabDelivery.addEventListener("click", () => {
        state.tipoEntrega = "delivery";
        DOM.tabDelivery.classList.add("active");
        DOM.tabPickup.classList.remove("active");
        if (DOM.addressFieldsContainer) DOM.addressFieldsContainer.style.display = "block";
        atualizarVisualCarrinho();
      });
    }

    if (DOM.tabPickup) {
      DOM.tabPickup.addEventListener("click", () => {
        state.tipoEntrega = "retirada";
        DOM.tabPickup.classList.add("active");
        DOM.tabDelivery.classList.remove("active");
        if (DOM.addressFieldsContainer) DOM.addressFieldsContainer.style.display = "none";
        atualizarVisualCarrinho();
      });
    }

    // Alternador de Forma de Pagamento
    DOM.paymentButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        DOM.paymentButtons.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.formaPagamento = btn.getAttribute("data-payment");

        if (DOM.pixDetailsBox) {
          DOM.pixDetailsBox.classList.toggle("active", state.formaPagamento === "pix");
        }
        if (DOM.changeBox) {
          DOM.changeBox.classList.toggle("active", state.formaPagamento === "dinheiro");
        }
      });
    });

    // Botão Copiar Chave Pix
    if (DOM.btnCopyPix) {
      DOM.btnCopyPix.addEventListener("click", () => {
        const chave = state.configuracoes.chavePix || DOM.pixKeyDisplay.textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(chave).then(() => {
            mostrarToast("Chave Pix copiada com sucesso!", "success");
          }).catch(() => {
            mostrarToast("Chave: " + chave, "info");
          });
        } else {
          mostrarToast("Chave: " + chave, "info");
        }
      });
    }

    // Botão de Enviar Pedido
    if (DOM.btnSubmitOrder) {
      DOM.btnSubmitOrder.addEventListener("click", finalizarPedido);
    }

    // Modal de Sucesso
    if (DOM.btnCloseSuccessModal) {
      DOM.btnCloseSuccessModal.addEventListener("click", () => {
        DOM.orderSuccessOverlay.classList.remove("active");
      });
    }
  }

  // Inicia tudo
  inicializar();
});
