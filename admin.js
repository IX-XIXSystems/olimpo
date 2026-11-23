document.addEventListener("DOMContentLoaded", async () => {
  const state = {
    autenticado: false,
    produtos: [],
    bordas: [],
    configuracoes: {},
    abaAtiva: "cardapio"
  };

  const DOM = {
    loginModalOverlay: document.getElementById("loginModalOverlay"),
    loginForm: document.getElementById("loginForm"),
    loginUser: document.getElementById("loginUser"),
    loginPass: document.getElementById("loginPass"),
    btnQuickDemoLogin: document.getElementById("btnQuickDemoLogin"),
    btnLogout: document.getElementById("btnLogout"),

    adminStoreNameDisplay: document.getElementById("adminStoreNameDisplay"),
    btnToggleStoreStatus: document.getElementById("btnToggleStoreStatus"),
    adminStoreStatusLabel: document.getElementById("adminStoreStatusLabel"),

    navTabs: document.querySelectorAll(".admin-tab-btn"),
    tabContents: document.querySelectorAll(".admin-tab-content"),

    adminProductsContainer: document.getElementById("adminProductsContainer"),
    btnOpenNewProductModal: document.getElementById("btnOpenNewProductModal"),
    productFormModalOverlay: document.getElementById("productFormModalOverlay"),
    productFormTitle: document.getElementById("productFormTitle"),
    btnCloseProductForm: document.getElementById("btnCloseProductForm"),
    productEditForm: document.getElementById("productEditForm"),
    editProdId: document.getElementById("editProdId"),
    prodName: document.getElementById("prodName"),
    prodCategory: document.getElementById("prodCategory"),
    prodBadge: document.getElementById("prodBadge"),
    prodDesc: document.getElementById("prodDesc"),
    prodImage: document.getElementById("prodImage"),
    chkHasSizes: document.getElementById("chkHasSizes"),
    boxSizesPrices: document.getElementById("boxSizesPrices"),
    boxFixedPrice: document.getElementById("boxFixedPrice"),
    priceBrotinho: document.getElementById("priceBrotinho"),
    priceMedia: document.getElementById("priceMedia"),
    priceGrande: document.getElementById("priceGrande"),
    priceFamilia: document.getElementById("priceFamilia"),
    priceFixed: document.getElementById("priceFixed"),

    adminCrustsContainer: document.getElementById("adminCrustsContainer"),
    btnOpenNewCrustModal: document.getElementById("btnOpenNewCrustModal"),
    crustFormModalOverlay: document.getElementById("crustFormModalOverlay"),
    crustFormTitle: document.getElementById("crustFormTitle"),
    btnCloseCrustForm: document.getElementById("btnCloseCrustForm"),
    crustEditForm: document.getElementById("crustEditForm"),
    editCrustId: document.getElementById("editCrustId"),
    crustName: document.getElementById("crustName"),
    crustDesc: document.getElementById("crustDesc"),
    crustPrice: document.getElementById("crustPrice"),

    storeSettingsForm: document.getElementById("storeSettingsForm"),
    cfgStoreName: document.getElementById("cfgStoreName"),
    cfgWhatsApp: document.getElementById("cfgWhatsApp"),
    cfgDeliveryFee: document.getElementById("cfgDeliveryFee"),
    cfgDeliveryTime: document.getElementById("cfgDeliveryTime"),
    cfgOpenHours: document.getElementById("cfgOpenHours"),
    btnResetSeedData: document.getElementById("btnResetSeedData"),

    adminToastContainer: document.getElementById("adminToastContainer")
  };

  function formatarMoeda(valor) {
    return (Number(valor) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function mostrarToast(mensagem) {
    if (!DOM.adminToastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--gold);"></i> <span>${mensagem}</span>`;
    DOM.adminToastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  }

  function verificarSessao() {
    if (localStorage.getItem("olimpo_admin_autenticado_v1") === "true") {
      state.autenticado = true;
      DOM.loginModalOverlay.classList.remove("active");
      inicializarPainel();
    }
  }

  function realizarLogin(usuario, senha) {
    if ((usuario.toLowerCase() === "admin" && senha === "olimpo123") || (usuario.includes("@") && senha.length >= 6)) {
      state.autenticado = true;
      localStorage.setItem("olimpo_admin_autenticado_v1", "true");
      DOM.loginModalOverlay.classList.remove("active");
      inicializarPainel();
    } else {
      mostrarToast("Credenciais inválidas (use admin / olimpo123)");
    }
  }

  function encerrarSessao() {
    state.autenticado = false;
    localStorage.removeItem("olimpo_admin_autenticado_v1");
    DOM.loginModalOverlay.classList.add("active");
  }

  async function inicializarPainel() {
    state.configuracoes = await OlimpoDB.obterConfiguracoes();
    state.produtos = await OlimpoDB.obterProdutos();
    state.bordas = await OlimpoDB.obterBordas();

    renderizarCabecalho();
    renderizarProdutos();
    renderizarBordas();
    preencherFormularioConfiguracoes();

    OlimpoDB.ouvirAtualizacoes("produtos", (novos) => {
      state.produtos = novos;
      renderizarProdutos();
    });

    OlimpoDB.ouvirAtualizacoes("bordas", (novas) => {
      state.bordas = novas;
      renderizarBordas();
    });

    OlimpoDB.ouvirAtualizacoes("configuracoes", (novasConfig) => {
      state.configuracoes = novasConfig;
      renderizarCabecalho();
    });
  }

  function renderizarCabecalho() {
    const conf = state.configuracoes || {};
    if (DOM.adminStoreNameDisplay && conf.nomePizzaria) {
      DOM.adminStoreNameDisplay.textContent = conf.nomePizzaria;
    }
    if (DOM.btnToggleStoreStatus && DOM.adminStoreStatusLabel) {
      const aberto = conf.aberto !== false;
      DOM.btnToggleStoreStatus.className = `status-pill ${aberto ? "open" : "closed"}`;
      DOM.adminStoreStatusLabel.textContent = aberto ? "Aberto" : "Fechado";
    }
  }

  async function alternarStatusLoja() {
    const novoStatus = !(state.configuracoes.aberto !== false);
    state.configuracoes.aberto = novoStatus;
    await OlimpoDB.salvarConfiguracoes(state.configuracoes);
    renderizarCabecalho();
    mostrarToast(novoStatus ? "Cardápio marcado como ABERTO" : "Cardápio marcado como FECHADO");
  }

  function renderizarProdutos() {
    if (!DOM.adminProductsContainer) return;

    DOM.adminProductsContainer.innerHTML = state.produtos.map(prod => {
      const precoResumo = prod.precos
        ? `Brot: ${formatarMoeda(prod.precos.brotinho)} · Méd: ${formatarMoeda(prod.precos.media)} · Gde: ${formatarMoeda(prod.precos.grande)}`
        : `Valor: ${formatarMoeda(prod.precoFixo)}`;

      return `
        <div class="product-card">
          <div class="product-image-wrap">
            <img src="${prod.imagem}" alt="${prod.nome}" class="product-img">
            ${prod.destaque ? `<span class="product-badge">${prod.destaque}</span>` : ""}
          </div>
          <div class="product-body">
            <h3 class="product-name">${prod.nome}</h3>
            <p class="product-desc">${prod.descricao || ""}</p>
            <div style="font-size: 0.76rem; color: var(--gold-soft); margin-bottom: 0.85rem;">${precoResumo}</div>

            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 0.75rem; border-top: 1px solid var(--border); margin-top: auto;">
              <label class="toggle-label" style="gap: 0.5rem;">
                <span style="font-size: 0.76rem; font-weight: 600; color: ${prod.disponivel ? "var(--green)" : "var(--red)"};">
                  ${prod.disponivel ? "Disponível" : "Esgotado"}
                </span>
                <div class="custom-switch" style="transform: scale(0.82);">
                  <input type="checkbox" ${prod.disponivel ? "checked" : ""} onchange="window.alternarDisponibilidadeProdAdmin('${prod.id}')">
                  <span class="switch-slider"></span>
                </div>
              </label>

              <div style="display: flex; gap: 0.4rem;">
                <button class="btn-icon" onclick="window.abrirModalEdicaoProdAdmin('${prod.id}')" title="Editar">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn-icon" style="color: var(--red);" onclick="window.excluirProdutoAdmin('${prod.id}')" title="Excluir">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  window.alternarDisponibilidadeProdAdmin = async (id) => {
    const disp = await OlimpoDB.alternarDisponibilidadeProduto(id);
    mostrarToast(disp ? "Item disponível no cardápio" : "Item marcado como esgotado");
  };

  window.excluirProdutoAdmin = async (id) => {
    if (confirm("Excluir este item do cardápio?")) {
      await OlimpoDB.excluirProduto(id);
      mostrarToast("Item excluído");
    }
  };

  window.abrirModalEdicaoProdAdmin = (id) => {
    const prod = state.produtos.find(p => p.id === id);
    if (!prod) return;

    DOM.productFormTitle.textContent = "Editar Item";
    DOM.editProdId.value = prod.id;
    DOM.prodName.value = prod.nome;
    DOM.prodCategory.value = prod.categoria || "especiais";
    DOM.prodBadge.value = prod.destaque || "";
    DOM.prodDesc.value = prod.descricao || "";
    DOM.prodImage.value = prod.imagem || "";

    if (prod.precos) {
      DOM.chkHasSizes.checked = true;
      DOM.boxSizesPrices.style.display = "block";
      DOM.boxFixedPrice.style.display = "none";
      DOM.priceBrotinho.value = prod.precos.brotinho || "";
      DOM.priceMedia.value = prod.precos.media || "";
      DOM.priceGrande.value = prod.precos.grande || "";
      DOM.priceFamilia.value = prod.precos.familia || "";
    } else {
      DOM.chkHasSizes.checked = false;
      DOM.boxSizesPrices.style.display = "none";
      DOM.boxFixedPrice.style.display = "block";
      DOM.priceFixed.value = prod.precoFixo || "";
    }

    DOM.productFormModalOverlay.classList.add("active");
  };

  function abrirModalNovoProduto() {
    DOM.productFormTitle.textContent = "Novo Item";
    DOM.productEditForm.reset();
    DOM.editProdId.value = "";
    DOM.chkHasSizes.checked = true;
    DOM.boxSizesPrices.style.display = "block";
    DOM.boxFixedPrice.style.display = "none";
    DOM.productFormModalOverlay.classList.add("active");
  }

  async function salvarFormularioProduto(e) {
    e.preventDefault();
    const id = DOM.editProdId.value || ("prod-" + Date.now());
    const hasSizes = DOM.chkHasSizes.checked;

    const produtoSalvar = {
      id,
      nome: DOM.prodName.value.trim(),
      categoria: DOM.prodCategory.value,
      destaque: DOM.prodBadge.value.trim(),
      descricao: DOM.prodDesc.value.trim(),
      imagem: DOM.prodImage.value.trim(),
      disponivel: true,
      permiteMeia: hasSizes,
      precos: hasSizes ? {
        brotinho: parseFloat(DOM.priceBrotinho.value) || 0,
        media: parseFloat(DOM.priceMedia.value) || 0,
        grande: parseFloat(DOM.priceGrande.value) || 0,
        familia: parseFloat(DOM.priceFamilia.value) || 0
      } : null,
      precoFixo: hasSizes ? null : (parseFloat(DOM.priceFixed.value) || 0)
    };

    await OlimpoDB.salvarProduto(produtoSalvar);
    DOM.productFormModalOverlay.classList.remove("active");
    mostrarToast("Item salvo com sucesso");
  }

  function renderizarBordas() {
    if (!DOM.adminCrustsContainer) return;

    DOM.adminCrustsContainer.innerHTML = state.bordas.map(borda => `
      <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 0.95rem 1.15rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
        <div style="flex: 1;">
          <div style="font-weight: 600; font-size: 0.95rem;">${borda.nome}</div>
          <div style="font-size: 0.78rem; color: var(--text-secondary);">${borda.descricao || ""}</div>
        </div>
        <div style="font-weight: 700; color: var(--gold-soft);">
          ${borda.preco > 0 ? formatarMoeda(borda.preco) : "Grátis"}
        </div>
        <div style="display: flex; align-items: center; gap: 0.65rem;">
          <div class="custom-switch" style="transform: scale(0.82);">
            <input type="checkbox" ${borda.disponivel ? "checked" : ""} onchange="window.alternarDisponibilidadeBordaAdmin('${borda.id}')">
            <span class="switch-slider"></span>
          </div>
          <button class="btn-icon" onclick="window.abrirModalEdicaoBordaAdmin('${borda.id}')"><i class="fa-solid fa-pen"></i></button>
          <button class="btn-icon" style="color: var(--red);" onclick="window.excluirBordaAdmin('${borda.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `).join("");
  }

  window.alternarDisponibilidadeBordaAdmin = async (id) => {
    await OlimpoDB.alternarDisponibilidadeBorda(id);
    mostrarToast("Status da borda atualizado");
  };

  window.excluirBordaAdmin = async (id) => {
    if (confirm("Remover esta borda?")) {
      await OlimpoDB.excluirBorda(id);
      mostrarToast("Borda removida");
    }
  };

  window.abrirModalEdicaoBordaAdmin = (id) => {
    const borda = state.bordas.find(b => b.id === id);
    if (!borda) return;
    DOM.crustFormTitle.textContent = "Editar Borda";
    DOM.editCrustId.value = borda.id;
    DOM.crustName.value = borda.nome;
    DOM.crustDesc.value = borda.descricao || "";
    DOM.crustPrice.value = borda.preco !== undefined ? borda.preco : "";
    DOM.crustFormModalOverlay.classList.add("active");
  };

  function abrirModalNovaBorda() {
    DOM.crustFormTitle.textContent = "Nova Borda";
    DOM.crustEditForm.reset();
    DOM.editCrustId.value = "";
    DOM.crustFormModalOverlay.classList.add("active");
  }

  async function salvarFormularioBorda(e) {
    e.preventDefault();
    const bordaSalvar = {
      id: DOM.editCrustId.value || ("borda-" + Date.now()),
      nome: DOM.crustName.value.trim(),
      descricao: DOM.crustDesc.value.trim(),
      preco: parseFloat(DOM.crustPrice.value) || 0,
      disponivel: true
    };
    await OlimpoDB.salvarBorda(bordaSalvar);
    DOM.crustFormModalOverlay.classList.remove("active");
    mostrarToast("Borda salva");
  }

  function preencherFormularioConfiguracoes() {
    const conf = state.configuracoes || {};
    if (DOM.cfgStoreName) DOM.cfgStoreName.value = conf.nomePizzaria || "Olimpo Pizzaria";
    if (DOM.cfgWhatsApp) DOM.cfgWhatsApp.value = conf.telefoneWhatsApp || "";
    if (DOM.cfgDeliveryFee) DOM.cfgDeliveryFee.value = conf.taxaEntrega !== undefined ? conf.taxaEntrega : 7.00;
    if (DOM.cfgDeliveryTime) DOM.cfgDeliveryTime.value = conf.tempoEntrega || "35–50 min";
    if (DOM.cfgOpenHours) DOM.cfgOpenHours.value = conf.horarioFuncionamento || "";
  }

  async function salvarFormularioConfiguracoes(e) {
    e.preventDefault();
    state.configuracoes.nomePizzaria = DOM.cfgStoreName.value.trim();
    state.configuracoes.telefoneWhatsApp = DOM.cfgWhatsApp.value.trim();
    state.configuracoes.taxaEntrega = parseFloat(DOM.cfgDeliveryFee.value) || 0;
    state.configuracoes.tempoEntrega = DOM.cfgDeliveryTime.value.trim();
    state.configuracoes.horarioFuncionamento = DOM.cfgOpenHours.value.trim();

    await OlimpoDB.salvarConfiguracoes(state.configuracoes);
    renderizarCabecalho();
    mostrarToast("Informações atualizadas!");
  }

  function restaurarDadosFabrica() {
    if (confirm("Restaurar dados originais do cardápio?")) {
      OlimpoDB.restaurarDadosFabrica();
      setTimeout(() => window.location.reload(), 400);
    }
  }

  function configurarEventos() {
    if (DOM.loginForm) {
      DOM.loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        realizarLogin(DOM.loginUser.value, DOM.loginPass.value);
      });
    }
    if (DOM.btnQuickDemoLogin) DOM.btnQuickDemoLogin.addEventListener("click", () => realizarLogin("admin", "olimpo123"));
    if (DOM.btnLogout) DOM.btnLogout.addEventListener("click", encerrarSessao);
    if (DOM.btnToggleStoreStatus) DOM.btnToggleStoreStatus.addEventListener("click", alternarStatusLoja);

    DOM.navTabs.forEach(btn => {
      btn.addEventListener("click", () => {
        DOM.navTabs.forEach(b => b.classList.remove("active"));
        DOM.tabContents.forEach(c => c.classList.remove("active"));
        btn.classList.add("active");
        const tabId = btn.getAttribute("data-tab");
        const content = document.getElementById(`tabContent${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
        if (content) content.classList.add("active");
      });
    });

    if (DOM.btnOpenNewProductModal) DOM.btnOpenNewProductModal.addEventListener("click", abrirModalNovoProduto);
    if (DOM.btnCloseProductForm) DOM.btnCloseProductForm.addEventListener("click", () => DOM.productFormModalOverlay.classList.remove("active"));
    if (DOM.productEditForm) DOM.productEditForm.addEventListener("submit", salvarFormularioProduto);

    if (DOM.chkHasSizes) {
      DOM.chkHasSizes.addEventListener("change", (e) => {
        DOM.boxSizesPrices.style.display = e.target.checked ? "block" : "none";
        DOM.boxFixedPrice.style.display = e.target.checked ? "none" : "block";
      });
    }

    if (DOM.btnOpenNewCrustModal) DOM.btnOpenNewCrustModal.addEventListener("click", abrirModalNovaBorda);
    if (DOM.btnCloseCrustForm) DOM.btnCloseCrustForm.addEventListener("click", () => DOM.crustFormModalOverlay.classList.remove("active"));
    if (DOM.crustEditForm) DOM.crustEditForm.addEventListener("submit", salvarFormularioBorda);

    if (DOM.storeSettingsForm) DOM.storeSettingsForm.addEventListener("submit", salvarFormularioConfiguracoes);
    if (DOM.btnResetSeedData) DOM.btnResetSeedData.addEventListener("click", restaurarDadosFabrica);
  }

  configurarEventos();
  verificarSessao();
});
