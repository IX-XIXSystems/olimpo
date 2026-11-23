/**
 * OLIMPO PIZZARIA — LÓGICA DO PAINEL ADMINISTRATIVO (ADMIN.JS)
 * ==============================================================================
 * Gerencia a autenticação do gerente, atualização de pedidos em tempo real,
 * alteração de status com botão de notificação via WhatsApp para o cliente,
 * cadastro/edição de produtos e bordas com toggle de disponível/esgotado
 * e configurações gerais da loja.
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", async () => {
  // ==========================================
  // 1. ESTADO GLOBAL DO PAINEL
  // ==========================================
  const state = {
    autenticado: false,
    pedidos: [],
    produtos: [],
    bordas: [],
    configuracoes: {},
    filtroStatusPedido: "todos",
    abaAtiva: "pedidos"
  };

  // ==========================================
  // 2. REFERÊNCIAS DO DOM
  // ==========================================
  const DOM = {
    // Autenticação
    loginModalOverlay: document.getElementById("loginModalOverlay"),
    loginForm: document.getElementById("loginForm"),
    loginUser: document.getElementById("loginUser"),
    loginPass: document.getElementById("loginPass"),
    btnQuickDemoLogin: document.getElementById("btnQuickDemoLogin"),
    btnLogout: document.getElementById("btnLogout"),

    // Topo
    adminStoreNameDisplay: document.getElementById("adminStoreNameDisplay"),
    btnToggleStoreStatus: document.getElementById("btnToggleStoreStatus"),
    adminStoreStatusLabel: document.getElementById("adminStoreStatusLabel"),
    badgePendingOrdersCount: document.getElementById("badgePendingOrdersCount"),

    // Abas de navegação
    navTabs: document.querySelectorAll(".admin-tab-btn"),
    tabContents: document.querySelectorAll(".admin-tab-content"),

    // Aba Pedidos
    orderFilterButtons: document.querySelectorAll(".order-filter-btn"),
    adminOrdersContainer: document.getElementById("adminOrdersContainer"),
    btnRefreshOrders: document.getElementById("btnRefreshOrders"),

    // Aba Cardápio
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

    // Aba Bordas
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

    // Aba Configurações
    storeSettingsForm: document.getElementById("storeSettingsForm"),
    cfgStoreName: document.getElementById("cfgStoreName"),
    cfgWhatsApp: document.getElementById("cfgWhatsApp"),
    cfgDeliveryFee: document.getElementById("cfgDeliveryFee"),
    cfgDeliveryTime: document.getElementById("cfgDeliveryTime"),
    cfgOpenHours: document.getElementById("cfgOpenHours"),
    cfgPixKey: document.getElementById("cfgPixKey"),
    cfgPixType: document.getElementById("cfgPixType"),
    cfgHalfRule: document.getElementById("cfgHalfRule"),
    btnResetSeedData: document.getElementById("btnResetSeedData"),

    // Toast Container
    adminToastContainer: document.getElementById("adminToastContainer")
  };

  // ==========================================
  // 3. UTILITÁRIOS
  // ==========================================
  function formatarMoeda(valor) {
    const num = Number(valor) || 0;
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function mostrarToast(mensagem, tipo = "info") {
    if (!DOM.adminToastContainer) return;
    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;

    let icone = "fa-info-circle";
    if (tipo === "success") icone = "fa-circle-check";
    if (tipo === "error") icone = "fa-circle-exclamation";

    toast.innerHTML = `<i class="fa-solid ${icone}"></i> <span>${mensagem}</span>`;
    DOM.adminToastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(50px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  function formatarDataHora(isoString) {
    if (!isoString) return "";
    const data = new Date(isoString);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  // ==========================================
  // 4. AUTENTICAÇÃO E SESSÃO
  // ==========================================
  function verificarSessao() {
    const logado = localStorage.getItem("olimpo_admin_autenticado_v1");
    if (logado === "true") {
      state.autenticado = true;
      if (DOM.loginModalOverlay) DOM.loginModalOverlay.classList.remove("active");
      inicializarPainel();
    } else {
      state.autenticado = false;
      if (DOM.loginModalOverlay) DOM.loginModalOverlay.classList.add("active");
    }
  }

  function realizarLogin(usuario, senha) {
    // Validação simples e prática (admin / olimpo123)
    if ((usuario.toLowerCase() === "admin" && senha === "olimpo123") || 
        (usuario.includes("@") && senha.length >= 6)) {
      state.autenticado = true;
      localStorage.setItem("olimpo_admin_autenticado_v1", "true");
      DOM.loginModalOverlay.classList.remove("active");
      mostrarToast("Acesso concedido! Bem-vindo ao painel.", "success");
      inicializarPainel();
      return true;
    } else {
      mostrarToast("Usuário ou senha incorretos. Use admin / olimpo123", "error");
      return false;
    }
  }

  function encerrarSessao() {
    state.autenticado = false;
    localStorage.removeItem("olimpo_admin_autenticado_v1");
    DOM.loginModalOverlay.classList.add("active");
    mostrarToast("Sessão encerrada com sucesso.", "info");
  }

  // ==========================================
  // 5. INICIALIZAÇÃO DO PAINEL ADMIN
  // ==========================================
  async function inicializarPainel() {
    await carregarDados();
    renderizarCabecalho();
    renderizarPedidos();
    renderizarProdutos();
    renderizarBordas();
    preencherFormularioConfiguracoes();

    // Sincronização em tempo real
    registrarOuvintesTempoReal();
  }

  async function carregarDados() {
    try {
      state.configuracoes = await OlimpoDB.obterConfiguracoes();
      state.pedidos = await OlimpoDB.obterPedidos();
      state.produtos = await OlimpoDB.obterProdutos();
      state.bordas = await OlimpoDB.obterBordas();
    } catch (e) {
      console.error("Erro ao carregar dados do admin:", e);
    }
  }

  function registrarOuvintesTempoReal() {
    OlimpoDB.ouvirAtualizacoes("pedidos", (novosPedidos) => {
      state.pedidos = novosPedidos;
      renderizarPedidos();
      atualizarBadgeContador();
    });

    OlimpoDB.ouvirAtualizacoes("produtos", (novosProdutos) => {
      state.produtos = novosProdutos;
      renderizarProdutos();
    });

    OlimpoDB.ouvirAtualizacoes("bordas", (novasBordas) => {
      state.bordas = novasBordas;
      renderizarBordas();
    });

    OlimpoDB.ouvirAtualizacoes("configuracoes", (novasConfig) => {
      state.configuracoes = novasConfig;
      renderizarCabecalho();
    });
  }

  // ==========================================
  // 6. CABEÇALHO & TOGGLE ABERTO/FECHADO
  // ==========================================
  function renderizarCabecalho() {
    const conf = state.configuracoes || {};

    if (DOM.adminStoreNameDisplay && conf.nomePizzaria) {
      DOM.adminStoreNameDisplay.textContent = conf.nomePizzaria;
    }

    if (DOM.btnToggleStoreStatus && DOM.adminStoreStatusLabel) {
      if (conf.aberto !== false) {
        DOM.btnToggleStoreStatus.className = "status-badge open";
        DOM.adminStoreStatusLabel.textContent = "Loja Aberta";
      } else {
        DOM.btnToggleStoreStatus.className = "status-badge closed";
        DOM.adminStoreStatusLabel.textContent = "Loja Fechada";
      }
    }

    atualizarBadgeContador();
  }

  function atualizarBadgeContador() {
    const pendentes = state.pedidos.filter(p => p.status === "pendente" || p.status === "em_preparo").length;
    if (DOM.badgePendingOrdersCount) {
      DOM.badgePendingOrdersCount.textContent = pendentes;
      DOM.badgePendingOrdersCount.style.display = pendentes > 0 ? "inline-flex" : "none";
    }
  }

  async function alternarStatusLoja() {
    const novoStatus = !(state.configuracoes.aberto !== false);
    state.configuracoes.aberto = novoStatus;
    await OlimpoDB.salvarConfiguracoes(state.configuracoes);
    renderizarCabecalho();
    mostrarToast(novoStatus ? "A loja agora está ABERTA para pedidos!" : "A loja foi FECHADA temporariamente.", novoStatus ? "success" : "info");
  }

  // ==========================================
  // 7. ABA 1: GERENCIAMENTO DE PEDIDOS
  // ==========================================
  function renderizarPedidos() {
    if (!DOM.adminOrdersContainer) return;

    let pedidosFiltrados = state.pedidos;
    if (state.filtroStatusPedido !== "todos") {
      pedidosFiltrados = state.pedidos.filter(p => p.status === state.filtroStatusPedido);
    }

    if (pedidosFiltrados.length === 0) {
      DOM.adminOrdersContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-xl); border: 1px solid var(--border-subtle);">
          <i class="fa-solid fa-clipboard-check" style="font-size: 2.5rem; color: var(--gold-primary); margin-bottom: 0.85rem;"></i>
          <h3 style="font-family: var(--font-brand); color: #fff; font-size: 1.2rem; margin-bottom: 0.35rem;">
            Nenhum pedido encontrado neste status
          </h3>
          <p>Quando chegarem novos pedidos eles aparecerão aqui instantaneamente.</p>
        </div>
      `;
      return;
    }

    let html = "";
    pedidosFiltrados.forEach(pedido => {
      html += criarCardPedidoHTML(pedido);
    });

    DOM.adminOrdersContainer.innerHTML = html;
  }

  function criarCardPedidoHTML(p) {
    const statusLabels = {
      pendente: { nome: "Pendente", classe: "pendente" },
      em_preparo: { nome: "Em Preparo", classe: "em_preparo" },
      saiu_para_entrega: { nome: "Saiu p/ Entrega", classe: "saiu_para_entrega" },
      concluido: { nome: "Concluído", classe: "concluido" },
      cancelado: { nome: "Cancelado", classe: "cancelado" }
    };

    const statusInfo = statusLabels[p.status] || { nome: p.status, classe: "pendente" };

    // Formata itens
    let itensHtml = "";
    (p.itens || []).forEach(item => {
      let detalhes = [];
      if (item.tamanhoNome) detalhes.push(item.tamanhoNome);
      if (item.meiaAMeia && item.segundoSaborNome) detalhes.push(`2º Sabor: ${item.segundoSaborNome}`);
      if (item.bordaNome && item.bordaNome !== "Sem Borda Recheada (Massa Tradicional)") detalhes.push(`Borda: ${item.bordaNome}`);
      if (item.observacoes) detalhes.push(`Obs: "${item.observacoes}"`);

      itensHtml += `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; border-bottom: 1px dashed rgba(255,255,255,0.06); padding-bottom: 0.35rem;">
          <div>
            <strong>${item.quantidade}x ${item.nome}</strong>
            ${detalhes.length > 0 ? `<div style="font-size: 0.78rem; color: var(--text-dimmed);">${detalhes.join(" • ")}</div>` : ""}
          </div>
          <span style="font-weight: 700; color: var(--gold-light); white-space: nowrap;">${formatarMoeda(item.subtotal)}</span>
        </div>
      `;
    });

    // Detalhes da entrega
    let enderecoHtml = "";
    if (p.tipoEntrega === "delivery" && p.endereco) {
      enderecoHtml = `
        <span><i class="fa-solid fa-motorcycle" style="color: var(--accent-orange);"></i> <strong>Entrega:</strong> ${p.endereco.rua}, ${p.endereco.numero} - ${p.endereco.bairro} ${p.endereco.complemento ? `(${p.endereco.complemento})` : ''}</span>
      `;
    } else {
      enderecoHtml = `
        <span><i class="fa-solid fa-store" style="color: var(--gold-primary);"></i> <strong>Retirada no Balcão</strong></span>
      `;
    }

    return `
      <div class="admin-order-card" data-order-id="${p.id}">
        <div class="order-card-header">
          <div>
            <span class="order-id">#${p.id}</span>
            <div class="order-time"><i class="fa-regular fa-clock"></i> ${formatarDataHora(p.dataHora)}</div>
          </div>
          <span class="order-status-pill ${statusInfo.classe}">${statusInfo.nome}</span>
        </div>

        <div class="order-customer-info">
          <span><i class="fa-solid fa-user"></i> <strong>${p.cliente.nome}</strong></span>
          <span><i class="fa-solid fa-phone"></i> ${p.cliente.telefone}</span>
          ${enderecoHtml}
          <span><i class="fa-solid fa-credit-card"></i> Pagamento: <strong>${p.formaPagamento.toUpperCase()}</strong> ${p.trocoPara ? `(Troco p/: ${p.trocoPara})` : ''}</span>
        </div>

        <div class="order-items-box">
          ${itensHtml}
          <div style="display: flex; justify-content: space-between; padding-top: 0.4rem; font-weight: 800; font-size: 0.95rem; color: #fff;">
            <span>Total com Entrega:</span>
            <span style="color: var(--gold-primary); font-size: 1.05rem;">${formatarMoeda(p.total)}</span>
          </div>
        </div>

        <!-- Barra de Ações Rápidas de Status -->
        <div class="order-actions-bar">
          <button class="btn-status-change" onclick="window.alterarStatusPedidoAdmin('${p.id}', 'em_preparo')" title="Iniciar Preparo">
            <i class="fa-solid fa-fire"></i> Preparar
          </button>
          <button class="btn-status-change" onclick="window.alterarStatusPedidoAdmin('${p.id}', 'saiu_para_entrega')" title="Despachar com o Entregador">
            <i class="fa-solid fa-motorcycle"></i> Despachar
          </button>
          <button class="btn-status-change" onclick="window.alterarStatusPedidoAdmin('${p.id}', 'concluido')" title="Marcar como Concluído">
            <i class="fa-solid fa-check"></i> Concluir
          </button>
          <button class="btn-status-change" style="color: var(--status-closed);" onclick="window.alterarStatusPedidoAdmin('${p.id}', 'cancelado')" title="Cancelar Pedido">
            <i class="fa-solid fa-ban"></i> Cancelar
          </button>

          <!-- Botão Especial: Notificar Cliente no WhatsApp -->
          <button class="btn-notify-whatsapp" onclick="window.notificarClienteWhatsAppAdmin('${p.id}')" title="Enviar mensagem automática para o cliente">
            <i class="fa-brands fa-whatsapp"></i> Notificar
          </button>
        </div>
      </div>
    `;
  }

  // Ações globais nos pedidos
  window.alterarStatusPedidoAdmin = async (orderId, novoStatus) => {
    await OlimpoDB.atualizarStatusPedido(orderId, novoStatus);
    mostrarToast(`Status do pedido #${orderId} atualizado com sucesso!`, "success");
  };

  window.notificarClienteWhatsAppAdmin = (orderId) => {
    const pedido = state.pedidos.find(p => p.id === orderId);
    if (!pedido) return;

    const telefoneLimpo = (pedido.cliente.telefone || "").replace(/\D/g, "");
    if (!telefoneLimpo) {
      mostrarToast("Telefone do cliente não encontrado.", "error");
      return;
    }

    let msg = "";
    if (pedido.status === "em_preparo") {
      msg = `Olá *${pedido.cliente.nome}*! 🍕\nSeu pedido *#${pedido.id}* na *Olimpo Pizzaria* foi aceito e já está no forno sendo preparado com todo carinho! Em breve atualizamos você. ⚡🔥`;
    } else if (pedido.status === "saiu_para_entrega") {
      msg = `Olá *${pedido.cliente.nome}*! 🛵💨\nNotícia boa: Seu pedido *#${pedido.id}* da *Olimpo Pizzaria* acabou de sair para entrega! Fique atento(a) ao interfone ou portão.`;
    } else if (pedido.status === "concluido") {
      msg = `Olá *${pedido.cliente.nome}*! ⭐\nSeu pedido *#${pedido.id}* foi entregue e concluído. Esperamos que você tenha uma refeição divina! Bom apetite e volte sempre à *Olimpo Pizzaria*! 🍕🏛️`;
    } else {
      msg = `Olá *${pedido.cliente.nome}*! Estamos entrando em contato referente ao seu pedido *#${pedido.id}* na *Olimpo Pizzaria*.`;
    }

    const url = `https://wa.me/55${telefoneLimpo}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  // ==========================================
  // 8. ABA 2: GERENCIAMENTO DE PRODUTOS
  // ==========================================
  function renderizarProdutos() {
    if (!DOM.adminProductsContainer) return;

    let html = "";
    state.produtos.forEach(prod => {
      let precoResumo = "";
      if (prod.precos) {
        precoResumo = `Brot: ${formatarMoeda(prod.precos.brotinho)} | Média: ${formatarMoeda(prod.precos.media)} | Gde: ${formatarMoeda(prod.precos.grande)} | Fam: ${formatarMoeda(prod.precos.familia)}`;
      } else if (prod.precoFixo) {
        precoResumo = `Preço Único: ${formatarMoeda(prod.precoFixo)}`;
      }

      html += `
        <div class="product-card" style="cursor: default;" data-prod-id="${prod.id}">
          <div class="product-image-wrap" style="height: 160px;">
            <img src="${prod.imagem}" alt="${prod.nome}" class="product-img">
            ${prod.destaque ? `<span class="product-badge">${prod.destaque}</span>` : ''}
          </div>
          <div class="product-body">
            <h3 class="product-name" style="font-size: 1.05rem;">${prod.nome}</h3>
            <p class="product-desc" style="-webkit-line-clamp: 2;">${prod.descricao || ''}</p>
            <div style="font-size: 0.78rem; color: var(--gold-light); font-weight: 700; margin-bottom: 0.85rem;">
              ${precoResumo}
            </div>

            <!-- Rodapé de Ações do Produto -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 0.75rem; border-top: 1px solid var(--border-light); margin-top: auto;">
              <!-- Toggle Disponível / Esgotado -->
              <label class="toggle-label" style="gap: 0.5rem;" title="Alternar Disponível / Esgotado">
                <span style="font-size: 0.78rem; font-weight: 700; color: ${prod.disponivel ? 'var(--status-open)' : 'var(--status-closed)'};">
                  ${prod.disponivel ? 'Disponível' : 'Esgotado'}
                </span>
                <div class="custom-switch" style="transform: scale(0.8);">
                  <input type="checkbox" ${prod.disponivel ? 'checked' : ''} onchange="window.alternarDisponibilidadeProdAdmin('${prod.id}')">
                  <span class="switch-slider"></span>
                </div>
              </label>

              <!-- Botões Editar / Excluir -->
              <div style="display: flex; gap: 0.4rem;">
                <button class="btn-icon" style="width: 34px; height: 34px; font-size: 0.85rem;" onclick="window.abrirModalEdicaoProdAdmin('${prod.id}')" title="Editar Produto">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn-icon" style="width: 34px; height: 34px; font-size: 0.85rem; color: var(--status-closed);" onclick="window.excluirProdutoAdmin('${prod.id}')" title="Excluir Produto">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    DOM.adminProductsContainer.innerHTML = html;
  }

  window.alternarDisponibilidadeProdAdmin = async (id) => {
    const disp = await OlimpoDB.alternarDisponibilidadeProduto(id);
    mostrarToast(disp ? "Produto marcado como DISPONÍVEL" : "Produto marcado como ESGOTADO", "info");
  };

  window.excluirProdutoAdmin = async (id) => {
    if (confirm("Tem certeza que deseja excluir este produto do cardápio?")) {
      await OlimpoDB.excluirProduto(id);
      mostrarToast("Produto excluído com sucesso!", "success");
    }
  };

  window.abrirModalEdicaoProdAdmin = (id) => {
    const prod = state.produtos.find(p => p.id === id);
    if (!prod) return;

    DOM.productFormTitle.textContent = "Editar Item do Cardápio";
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
    DOM.productFormTitle.textContent = "Cadastrar Novo Item no Cardápio";
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
    const nome = DOM.prodName.value.trim();
    const categoria = DOM.prodCategory.value;
    const destaque = DOM.prodBadge.value.trim();
    const descricao = DOM.prodDesc.value.trim();
    const imagem = DOM.prodImage.value.trim();
    const hasSizes = DOM.chkHasSizes.checked;

    let precos = null;
    let precoFixo = null;

    if (hasSizes) {
      precos = {
        brotinho: parseFloat(DOM.priceBrotinho.value) || 0,
        media: parseFloat(DOM.priceMedia.value) || 0,
        grande: parseFloat(DOM.priceGrande.value) || 0,
        familia: parseFloat(DOM.priceFamilia.value) || 0
      };
    } else {
      precoFixo = parseFloat(DOM.priceFixed.value) || 0;
    }

    const produtoSalvar = {
      id,
      nome,
      categoria,
      destaque,
      descricao,
      imagem,
      disponivel: true,
      permiteMeia: hasSizes,
      precos: precos,
      precoFixo: precoFixo
    };

    await OlimpoDB.salvarProduto(produtoSalvar);
    DOM.productFormModalOverlay.classList.remove("active");
    mostrarToast(`"${nome}" salvo com sucesso!`, "success");
  }

  // ==========================================
  // 9. ABA 3: GERENCIAMENTO DE BORDAS RECHEADAS
  // ==========================================
  function renderizarBordas() {
    if (!DOM.adminCrustsContainer) return;

    let html = "";
    state.bordas.forEach(borda => {
      html += `
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
          <div style="flex-grow: 1;">
            <div style="font-weight: 700; font-size: 1rem; color: #fff;">${borda.nome}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${borda.descricao || ''}</div>
          </div>

          <div style="font-size: 1.1rem; font-weight: 800; color: var(--gold-light);">
            ${borda.preco > 0 ? formatarMoeda(borda.preco) : 'Grátis'}
          </div>

          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <label class="toggle-label" style="gap: 0.4rem;">
              <span style="font-size: 0.75rem; font-weight: 700; color: ${borda.disponivel ? 'var(--status-open)' : 'var(--status-closed)'};">
                ${borda.disponivel ? 'Ativa' : 'Inativa'}
              </span>
              <div class="custom-switch" style="transform: scale(0.8);">
                <input type="checkbox" ${borda.disponivel ? 'checked' : ''} onchange="window.alternarDisponibilidadeBordaAdmin('${borda.id}')">
                <span class="switch-slider"></span>
              </div>
            </label>

            <button class="btn-icon" style="width: 34px; height: 34px; font-size: 0.85rem;" onclick="window.abrirModalEdicaoBordaAdmin('${borda.id}')" title="Editar Borda">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-icon" style="width: 34px; height: 34px; font-size: 0.85rem; color: var(--status-closed);" onclick="window.excluirBordaAdmin('${borda.id}')" title="Excluir Borda">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
    });

    DOM.adminCrustsContainer.innerHTML = html;
  }

  window.alternarDisponibilidadeBordaAdmin = async (id) => {
    const disp = await OlimpoDB.alternarDisponibilidadeBorda(id);
    mostrarToast(disp ? "Borda marcada como ATIVA" : "Borda marcada como INATIVA", "info");
  };

  window.excluirBordaAdmin = async (id) => {
    if (confirm("Deseja realmente remover esta opção de borda recheada?")) {
      await OlimpoDB.excluirBorda(id);
      mostrarToast("Borda removida com sucesso!", "success");
    }
  };

  window.abrirModalEdicaoBordaAdmin = (id) => {
    const borda = state.bordas.find(b => b.id === id);
    if (!borda) return;

    DOM.crustFormTitle.textContent = "Editar Borda Recheada";
    DOM.editCrustId.value = borda.id;
    DOM.crustName.value = borda.nome;
    DOM.crustDesc.value = borda.descricao || "";
    DOM.crustPrice.value = borda.preco !== undefined ? borda.preco : "";
    DOM.crustFormModalOverlay.classList.add("active");
  };

  function abrirModalNovaBorda() {
    DOM.crustFormTitle.textContent = "Nova Borda Recheada";
    DOM.crustEditForm.reset();
    DOM.editCrustId.value = "";
    DOM.crustFormModalOverlay.classList.add("active");
  }

  async function salvarFormularioBorda(e) {
    e.preventDefault();
    const id = DOM.editCrustId.value || ("borda-" + Date.now());
    const nome = DOM.crustName.value.trim();
    const descricao = DOM.crustDesc.value.trim();
    const preco = parseFloat(DOM.crustPrice.value) || 0;

    const bordaSalvar = {
      id,
      nome,
      descricao,
      preco,
      disponivel: true
    };

    await OlimpoDB.salvarBorda(bordaSalvar);
    DOM.crustFormModalOverlay.classList.remove("active");
    mostrarToast(`Borda "${nome}" salva com sucesso!`, "success");
  }

  // ==========================================
  // 10. ABA 4: CONFIGURAÇÕES DA LOJA
  // ==========================================
  function preencherFormularioConfiguracoes() {
    const conf = state.configuracoes || {};
    if (DOM.cfgStoreName) DOM.cfgStoreName.value = conf.nomePizzaria || "Olimpo Pizzaria";
    if (DOM.cfgWhatsApp) DOM.cfgWhatsApp.value = conf.telefoneWhatsApp || "";
    if (DOM.cfgDeliveryFee) DOM.cfgDeliveryFee.value = conf.taxaEntrega !== undefined ? conf.taxaEntrega : 7.00;
    if (DOM.cfgDeliveryTime) DOM.cfgDeliveryTime.value = conf.tempoEntrega || "35 a 50 min";
    if (DOM.cfgOpenHours) DOM.cfgOpenHours.value = conf.horarioFuncionamento || "";
    if (DOM.cfgPixKey) DOM.cfgPixKey.value = conf.chavePix || "";
    if (DOM.cfgPixType) DOM.cfgPixType.value = conf.tipoChavePix || "E-mail";
    if (DOM.cfgHalfRule) DOM.cfgHalfRule.value = conf.regraMeiaAMeia || "maior";
  }

  async function salvarFormularioConfiguracoes(e) {
    e.preventDefault();

    state.configuracoes.nomePizzaria = DOM.cfgStoreName.value.trim();
    state.configuracoes.telefoneWhatsApp = DOM.cfgWhatsApp.value.trim();
    state.configuracoes.taxaEntrega = parseFloat(DOM.cfgDeliveryFee.value) || 0;
    state.configuracoes.tempoEntrega = DOM.cfgDeliveryTime.value.trim();
    state.configuracoes.horarioFuncionamento = DOM.cfgOpenHours.value.trim();
    state.configuracoes.chavePix = DOM.cfgPixKey.value.trim();
    state.configuracoes.tipoChavePix = DOM.cfgPixType.value;
    state.configuracoes.regraMeiaAMeia = DOM.cfgHalfRule.value;

    await OlimpoDB.salvarConfiguracoes(state.configuracoes);
    renderizarCabecalho();
    mostrarToast("Configurações salvas e aplicadas em tempo real!", "success");
  }

  function restaurarDadosFabrica() {
    if (confirm("ATENÇÃO: Deseja restaurar o cardápio, as bordas e as configurações originais de fábrica?")) {
      OlimpoDB.restaurarDadosFabrica();
      mostrarToast("Dados de fábrica restaurados!", "success");
      setTimeout(() => window.location.reload(), 600);
    }
  }

  // ==========================================
  // 11. VINCULAÇÃO DE EVENTOS
  // ==========================================
  function configurarEventos() {
    // Formulário de Login
    if (DOM.loginForm) {
      DOM.loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        realizarLogin(DOM.loginUser.value, DOM.loginPass.value);
      });
    }

    if (DOM.btnQuickDemoLogin) {
      DOM.btnQuickDemoLogin.addEventListener("click", () => {
        realizarLogin("admin", "olimpo123");
      });
    }

    if (DOM.btnLogout) {
      DOM.btnLogout.addEventListener("click", encerrarSessao);
    }

    // Toggle Aberto/Fechado no cabeçalho
    if (DOM.btnToggleStoreStatus) {
      DOM.btnToggleStoreStatus.addEventListener("click", alternarStatusLoja);
    }

    // Troca de Abas
    DOM.navTabs.forEach(btn => {
      btn.addEventListener("click", () => {
        DOM.navTabs.forEach(b => b.classList.remove("active"));
        DOM.tabContents.forEach(c => c.classList.remove("active"));

        btn.classList.add("active");
        const tabId = btn.getAttribute("data-tab");
        state.abaAtiva = tabId;

        const content = document.getElementById(`tabContent${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
        if (content) content.classList.add("active");
      });
    });

    // Filtros de Pedidos
    DOM.orderFilterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        DOM.orderFilterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.filtroStatusPedido = btn.getAttribute("data-status");
        renderizarPedidos();
      });
    });

    if (DOM.btnRefreshOrders) {
      DOM.btnRefreshOrders.addEventListener("click", async () => {
        state.pedidos = await OlimpoDB.obterPedidos();
        renderizarPedidos();
        mostrarToast("Lista de pedidos atualizada!", "info");
      });
    }

    // Modais de Produtos
    if (DOM.btnOpenNewProductModal) DOM.btnOpenNewProductModal.addEventListener("click", abrirModalNovoProduto);
    if (DOM.btnCloseProductForm) DOM.btnCloseProductForm.addEventListener("click", () => DOM.productFormModalOverlay.classList.remove("active"));
    if (DOM.productEditForm) DOM.productEditForm.addEventListener("submit", salvarFormularioProduto);

    if (DOM.chkHasSizes) {
      DOM.chkHasSizes.addEventListener("change", (e) => {
        DOM.boxSizesPrices.style.display = e.target.checked ? "block" : "none";
        DOM.boxFixedPrice.style.display = e.target.checked ? "none" : "block";
      });
    }

    // Modais de Bordas
    if (DOM.btnOpenNewCrustModal) DOM.btnOpenNewCrustModal.addEventListener("click", abrirModalNovaBorda);
    if (DOM.btnCloseCrustForm) DOM.btnCloseCrustForm.addEventListener("click", () => DOM.crustFormModalOverlay.classList.remove("active"));
    if (DOM.crustEditForm) DOM.crustEditForm.addEventListener("submit", salvarFormularioBorda);

    // Formulário de Configurações
    if (DOM.storeSettingsForm) DOM.storeSettingsForm.addEventListener("submit", salvarFormularioConfiguracoes);
    if (DOM.btnResetSeedData) DOM.btnResetSeedData.addEventListener("click", restaurarDadosFabrica);
  }

  // Executa verificação de sessão e eventos
  configurarEventos();
  verificarSessao();
});
