/**
 * OLIMPO PIZZARIA — CONFIGURAÇÃO DO FIREBASE & CAMADA DE DADOS
 * ==============================================================================
 * COMO USAR:
 * 1. Para testar agora mesmo: Você NÃO precisa fazer nada! O site funciona
 *    automaticamente em modo Demonstração Local (LocalStorage).
 * 2. Para conectar ao seu Firebase gratuito na nuvem:
 *    - Acesse https://console.firebase.google.com/
 *    - Crie um projeto gratuito e adicione um aplicativo Web.
 *    - Copie as credenciais do seu projeto e cole no objeto `firebaseConfig` abaixo.
 *    - Ative o "Firestore Database" (no modo de teste ou com regras públicas).
 *    - Ative o "Authentication" (método E-mail/Senha).
 * ==============================================================================
 */

// ==========================================
// 1. SUAS CREDENCIAIS DO FIREBASE
// Substitua os textos abaixo pelas chaves do seu projeto Firebase:
// ==========================================
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "seu-projeto-olimpo.firebaseapp.com",
  projectId: "seu-projeto-olimpo",
  storageBucket: "seu-projeto-olimpo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// ==========================================
// 2. INICIALIZAÇÃO INTELIGENTE (FIREBASE OU LOCAL)
// ==========================================
let firebaseApp = null;
let firestoreDb = null;
let firebaseAuth = null;
let isFirebaseActive = false;

// Verifica se as credenciais do Firebase foram preenchidas de verdade
function checkFirebaseConfig() {
  const isDummy = !firebaseConfig.apiKey || 
                  firebaseConfig.apiKey.includes("SUA_API_KEY") || 
                  firebaseConfig.projectId.includes("seu-projeto");
  return !isDummy && typeof firebase !== "undefined";
}

try {
  if (checkFirebaseConfig()) {
    firebaseApp = firebase.initializeApp(firebaseConfig);
    firestoreDb = firebase.firestore();
    firebaseAuth = firebase.auth();
    isFirebaseActive = true;
    console.log("🔥 [Olimpo Pizzaria] Conectado ao Firebase Cloud Firestore com sucesso!");
  } else {
    console.log("⚡ [Olimpo Pizzaria] Operando em Modo Demonstração Local (LocalStorage). Dados salvos localmente em seu navegador.");
  }
} catch (error) {
  console.warn("⚠️ [Olimpo Pizzaria] Não foi possível conectar ao Firebase. Usando armazenamento local.", error);
  isFirebaseActive = false;
}

// Chaves para o LocalStorage
const STORAGE_KEYS = {
  CONFIG: "olimpo_configuracoes_v1",
  PRODUTOS: "olimpo_produtos_v1",
  BORDAS: "olimpo_bordas_v1",
  PEDIDOS: "olimpo_pedidos_v1",
  ADMIN_SESSION: "olimpo_admin_autenticado_v1"
};

// ==========================================
// 3. CAMADA UNIFICADA DE DADOS (OlimpoDB)
// Métodos transparentes para ler e gravar dados tanto no Firebase quanto Local
// ==========================================
const OlimpoDB = {
  // Retorna se o Firebase está ativo ou se estamos em modo local
  isCloudActive() {
    return isFirebaseActive;
  },

  // Inicializa dados iniciais caso o banco esteja vazio
  async inicializarDadosSeNecessario() {
    if (typeof SEED_DATA === "undefined") return;

    if (isFirebaseActive && firestoreDb) {
      try {
        const configDoc = await firestoreDb.collection("configuracoes").doc("geral").get();
        if (!configDoc.exists) {
          await firestoreDb.collection("configuracoes").doc("geral").set(SEED_DATA.configuracoes);
          
          for (const prod of SEED_DATA.produtos) {
            await firestoreDb.collection("produtos").doc(prod.id).set(prod);
          }
          for (const borda of SEED_DATA.bordas) {
            await firestoreDb.collection("bordas").doc(borda.id).set(borda);
          }
          for (const ped of SEED_DATA.pedidosIniciais) {
            await firestoreDb.collection("pedidos").doc(ped.id).set(ped);
          }
          console.log("✅ Dados iniciais populados no Firestore!");
        }
      } catch (err) {
        console.error("Erro ao verificar Firestore:", err);
      }
    } else {
      // Modo LocalStorage
      if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(SEED_DATA.configuracoes));
      }
      if (!localStorage.getItem(STORAGE_KEYS.PRODUTOS)) {
        localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(SEED_DATA.produtos));
      }
      if (!localStorage.getItem(STORAGE_KEYS.BORDAS)) {
        localStorage.setItem(STORAGE_KEYS.BORDAS, JSON.stringify(SEED_DATA.bordas));
      }
      if (!localStorage.getItem(STORAGE_KEYS.PEDIDOS)) {
        localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(SEED_DATA.pedidosIniciais));
      }
    }
  },

  // --- CONFIGURAÇÕES DA LOJA ---
  async obterConfiguracoes() {
    if (isFirebaseActive && firestoreDb) {
      try {
        const doc = await firestoreDb.collection("configuracoes").doc("geral").get();
        if (doc.exists) return doc.data();
      } catch (e) {
        console.error("Erro ao buscar configurações no Firebase:", e);
      }
    }
    const local = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return local ? JSON.parse(local) : (typeof SEED_DATA !== "undefined" ? SEED_DATA.configuracoes : {});
  },

  async salvarConfiguracoes(novasConfiguracoes) {
    if (isFirebaseActive && firestoreDb) {
      await firestoreDb.collection("configuracoes").doc("geral").set(novasConfiguracoes, { merge: true });
    }
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(novasConfiguracoes));
    this.dispararEventoAtualizacao("configuracoes", novasConfiguracoes);
    return true;
  },

  // --- PRODUTOS / PIZZAS ---
  async obterProdutos() {
    if (isFirebaseActive && firestoreDb) {
      try {
        const snapshot = await firestoreDb.collection("produtos").get();
        if (!snapshot.empty) {
          const list = [];
          snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
          return list;
        }
      } catch (e) {
        console.error("Erro ao obter produtos do Firebase:", e);
      }
    }
    const local = localStorage.getItem(STORAGE_KEYS.PRODUTOS);
    return local ? JSON.parse(local) : (typeof SEED_DATA !== "undefined" ? SEED_DATA.produtos : []);
  },

  async salvarProduto(produto) {
    if (!produto.id) {
      produto.id = "prod-" + Date.now();
    }
    if (isFirebaseActive && firestoreDb) {
      await firestoreDb.collection("produtos").doc(produto.id).set(produto);
    }
    const produtos = await this.obterProdutos();
    const index = produtos.findIndex(p => p.id === produto.id);
    if (index >= 0) {
      produtos[index] = produto;
    } else {
      produtos.unshift(produto);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(produtos));
    this.dispararEventoAtualizacao("produtos", produtos);
    return produto;
  },

  async excluirProduto(id) {
    if (isFirebaseActive && firestoreDb) {
      await firestoreDb.collection("produtos").doc(id).delete();
    }
    let produtos = await this.obterProdutos();
    produtos = produtos.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(produtos));
    this.dispararEventoAtualizacao("produtos", produtos);
    return true;
  },

  async alternarDisponibilidadeProduto(id) {
    const produtos = await this.obterProdutos();
    const produto = produtos.find(p => p.id === id);
    if (produto) {
      produto.disponivel = !produto.disponivel;
      await this.salvarProduto(produto);
      return produto.disponivel;
    }
    return false;
  },

  // --- BORDAS RECHEADAS ---
  async obterBordas() {
    if (isFirebaseActive && firestoreDb) {
      try {
        const snapshot = await firestoreDb.collection("bordas").get();
        if (!snapshot.empty) {
          const list = [];
          snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
          return list;
        }
      } catch (e) {
        console.error("Erro ao obter bordas do Firebase:", e);
      }
    }
    const local = localStorage.getItem(STORAGE_KEYS.BORDAS);
    return local ? JSON.parse(local) : (typeof SEED_DATA !== "undefined" ? SEED_DATA.bordas : []);
  },

  async salvarBorda(borda) {
    if (!borda.id) {
      borda.id = "borda-" + Date.now();
    }
    if (isFirebaseActive && firestoreDb) {
      await firestoreDb.collection("bordas").doc(borda.id).set(borda);
    }
    const bordas = await this.obterBordas();
    const index = bordas.findIndex(b => b.id === borda.id);
    if (index >= 0) {
      bordas[index] = borda;
    } else {
      bordas.push(borda);
    }
    localStorage.setItem(STORAGE_KEYS.BORDAS, JSON.stringify(bordas));
    this.dispararEventoAtualizacao("bordas", bordas);
    return borda;
  },

  async excluirBorda(id) {
    if (isFirebaseActive && firestoreDb) {
      await firestoreDb.collection("bordas").doc(id).delete();
    }
    let bordas = await this.obterBordas();
    bordas = bordas.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BORDAS, JSON.stringify(bordas));
    this.dispararEventoAtualizacao("bordas", bordas);
    return true;
  },

  async alternarDisponibilidadeBorda(id) {
    const bordas = await this.obterBordas();
    const borda = bordas.find(b => b.id === id);
    if (borda) {
      borda.disponivel = !borda.disponivel;
      await this.salvarBorda(borda);
      return borda.disponivel;
    }
    return false;
  },

  // --- PEDIDOS ---
  async obterPedidos() {
    if (isFirebaseActive && firestoreDb) {
      try {
        const snapshot = await firestoreDb.collection("pedidos").orderBy("dataHora", "desc").get();
        if (!snapshot.empty) {
          const list = [];
          snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
          return list;
        }
      } catch (e) {
        console.error("Erro ao obter pedidos do Firebase:", e);
      }
    }
    const local = localStorage.getItem(STORAGE_KEYS.PEDIDOS);
    const pedidos = local ? JSON.parse(local) : (typeof SEED_DATA !== "undefined" ? SEED_DATA.pedidosIniciais : []);
    // Ordena do mais recente para o mais antigo
    return pedidos.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
  },

  async criarPedido(pedido) {
    if (!pedido.id) {
      const num = Math.floor(1000 + Math.random() * 9000);
      pedido.id = "ORD-" + num;
    }
    if (!pedido.dataHora) {
      pedido.dataHora = new Date().toISOString();
    }
    if (!pedido.status) {
      pedido.status = "pendente";
    }

    if (isFirebaseActive && firestoreDb) {
      await firestoreDb.collection("pedidos").doc(pedido.id).set(pedido);
    }
    const pedidos = await this.obterPedidos();
    pedidos.unshift(pedido);
    localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(pedidos));
    this.dispararEventoAtualizacao("pedidos", pedidos);
    return pedido;
  },

  async atualizarStatusPedido(id, novoStatus) {
    if (isFirebaseActive && firestoreDb) {
      await firestoreDb.collection("pedidos").doc(id).update({ status: novoStatus });
    }
    const pedidos = await this.obterPedidos();
    const pedido = pedidos.find(p => p.id === id);
    if (pedido) {
      pedido.status = novoStatus;
      localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(pedidos));
      this.dispararEventoAtualizacao("pedidos", pedidos);
      return true;
    }
    return false;
  },

  // --- SINCRONIZAÇÃO EM TEMPO REAL ---
  // Escuta alterações para atualizar as telas instantaneamente
  ouvirAtualizacoes(tipo, callback) {
    // 1. Escuta eventos customizados da mesma aba
    window.addEventListener(`olimpo_update_${tipo}`, (e) => {
      callback(e.detail);
    });

    // 2. Escuta alterações vindas de outras abas via StorageEvent
    window.addEventListener("storage", (e) => {
      if (tipo === "pedidos" && e.key === STORAGE_KEYS.PEDIDOS) {
        callback(JSON.parse(e.newValue || "[]"));
      } else if (tipo === "produtos" && e.key === STORAGE_KEYS.PRODUTOS) {
        callback(JSON.parse(e.newValue || "[]"));
      } else if (tipo === "configuracoes" && e.key === STORAGE_KEYS.CONFIG) {
        callback(JSON.parse(e.newValue || "{}"));
      } else if (tipo === "bordas" && e.key === STORAGE_KEYS.BORDAS) {
        callback(JSON.parse(e.newValue || "[]"));
      }
    });

    // 3. Se o Firebase estiver ativo, escuta via onSnapshot do Firestore
    if (isFirebaseActive && firestoreDb) {
      if (tipo === "pedidos") {
        firestoreDb.collection("pedidos").orderBy("dataHora", "desc").onSnapshot(snapshot => {
          const list = [];
          snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
          callback(list);
        });
      } else if (tipo === "produtos") {
        firestoreDb.collection("produtos").onSnapshot(snapshot => {
          const list = [];
          snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
          callback(list);
        });
      } else if (tipo === "configuracoes") {
        firestoreDb.collection("configuracoes").doc("geral").onSnapshot(doc => {
          if (doc.exists) callback(doc.data());
        });
      } else if (tipo === "bordas") {
        firestoreDb.collection("bordas").onSnapshot(snapshot => {
          const list = [];
          snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
          callback(list);
        });
      }
    }
  },

  dispararEventoAtualizacao(tipo, dados) {
    const evento = new CustomEvent(`olimpo_update_${tipo}`, { detail: dados });
    window.dispatchEvent(evento);
  },

  // Restaura dados para os originais de fábrica
  restaurarDadosFabrica() {
    if (typeof SEED_DATA !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(SEED_DATA.configuracoes));
      localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(SEED_DATA.produtos));
      localStorage.setItem(STORAGE_KEYS.BORDAS, JSON.stringify(SEED_DATA.bordas));
      localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(SEED_DATA.pedidosIniciais));
      this.dispararEventoAtualizacao("configuracoes", SEED_DATA.configuracoes);
      this.dispararEventoAtualizacao("produtos", SEED_DATA.produtos);
      this.dispararEventoAtualizacao("bordas", SEED_DATA.bordas);
      this.dispararEventoAtualizacao("pedidos", SEED_DATA.pedidosIniciais);
      return true;
    }
    return false;
  }
};

// Inicializa dados assim que o script é carregado
OlimpoDB.inicializarDadosSeNecessario();

// Torna global para scripts app.js e admin.js
if (typeof window !== "undefined") {
  window.OlimpoDB = OlimpoDB;
}
