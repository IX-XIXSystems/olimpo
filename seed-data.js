/**
 * OLIMPO PIZZARIA — DADOS INICIAIS (SEED DATA)
 * -------------------------------------------------------------
 * Este arquivo contém o cardápio padrão, bordas recheadas,
 * bebidas e configurações iniciais da Olimpo Pizzaria em PT-BR.
 *
 * Ele é carregado automaticamente quando o banco de dados
 * ainda estiver vazio ou quando o site for aberto em modo
 * demonstração local (sem precisar configurar o Firebase de imediato).
 */

const SEED_DATA = {
  // Configurações gerais da pizzaria
  configuracoes: {
    nomePizzaria: "Olimpo Pizzaria",
    aberto: true,
    horarioFuncionamento: "Terça a Domingo: das 18:00 às 23:45",
    tempoEntrega: "35 a 50 min",
    taxaEntrega: 7.00,
    telefoneWhatsApp: "5511999999999", // Altere para o seu número com DDD (ex: 5511987654321)
    chavePix: "contato@olimpopizzaria.com.br",
    tipoChavePix: "E-mail", // Opções: CPF, CNPJ, Telefone, E-mail, Aleatória
    nomeBeneficiarioPix: "Olimpo Pizzaria Gourmet Ltda",
    regraMeiaAMeia: "maior", // 'maior' = cobra pelo maior valor dos sabores | 'media' = cobra a média aritmética
    mensagemBoasVindas: "Os deuses da pizza criaram os sabores mais nobres para você!"
  },

  // Categorias disponíveis no cardápio
  categorias: [
    { id: "especiais", nome: "Pizzas Especiais do Olimpo", icone: "fa-bolt", ordem: 1 },
    { id: "tradicionais", nome: "Pizzas Tradicionais", icone: "fa-pizza-slice", ordem: 2 },
    { id: "doces", nome: "Pizzas Doces", icone: "fa-ice-cream", ordem: 3 },
    { id: "bebidas", nome: "Bebidas Geladas", icone: "fa-wine-bottle", ordem: 4 },
    { id: "combos", nome: "Combos & Promoções", icone: "fa-gift", ordem: 5 }
  ],

  // Produtos: 8 Pizzas do Olimpo + 4 Bebidas + 2 Combos
  produtos: [
    {
      id: "pizza-zeus",
      nome: "Pizza Zeus (Suprema Imperial)",
      categoria: "especiais",
      descricao: "Molho de tomate pelati artesanal, muçarela especial, fatias de pepperoni nobre italiano, cogumelos champignon salteados, azeitonas pretas azapa e orégano fresco.",
      imagem: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
      destaque: "Mais Pedida",
      disponivel: true,
      permiteMeia: true,
      precos: {
        brotinho: 42.90, // 4 fatias
        media: 58.90,    // 6 fatias
        grande: 72.90,   // 8 fatias
        familia: 86.90   // 12 fatias
      }
    },
    {
      id: "pizza-poseidon",
      nome: "Pizza Poseidon (Frutos do Mar)",
      categoria: "especiais",
      descricao: "Molho especial da casa, muçarela derretida, camarões médios salteados no azeite de ervas finas, alho-poró crocante e toques de requeijão Catupiry legítimo.",
      imagem: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
      destaque: "Especial do Chef",
      disponivel: true,
      permiteMeia: true,
      precos: {
        brotinho: 48.90,
        media: 68.90,
        grande: 84.90,
        familia: 98.90
      }
    },
    {
      id: "pizza-atena",
      nome: "Pizza Atena (Marguerita Imperial)",
      categoria: "tradicionais",
      descricao: "Molho de tomate rústico, muçarela de búfala fresca, tomates cereja confitados no azeite extravirgem, pesto de manjericão e folhas frescas de manjericão gigante.",
      imagem: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80",
      destaque: "Clássica",
      disponivel: true,
      permiteMeia: true,
      precos: {
        brotinho: 36.90,
        media: 49.90,
        grande: 62.90,
        familia: 74.90
      }
    },
    {
      id: "pizza-dionisio",
      nome: "Pizza Dionísio (Quatro Queijos Nobres)",
      categoria: "tradicionais",
      descricao: "Molho de tomate encorpado, generosa camada de muçarela, provolone curado defumado, gorgonzola importado e autêntico requeijão Catupiry cremoso.",
      imagem: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
      destaque: "Tradicional",
      disponivel: true,
      permiteMeia: true,
      precos: {
        brotinho: 39.90,
        media: 54.90,
        grande: 67.90,
        familia: 79.90
      }
    },
    {
      id: "pizza-ares",
      nome: "Pizza Ares (Calabresa Picante Artesanal)",
      categoria: "tradicionais",
      descricao: "Molho de tomate picante com toque de páprica defumada, muçarela, linguiça calabresa artesanal fatiada fina, cebola roxa marinada e pimenta calabresa em flocos.",
      imagem: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80",
      destaque: "Apimentada",
      disponivel: true,
      permiteMeia: true,
      precos: {
        brotinho: 35.90,
        media: 48.90,
        grande: 59.90,
        familia: 72.90
      }
    },
    {
      id: "pizza-apolo",
      nome: "Pizza Apolo (Frango com Catupiry Dourado)",
      categoria: "tradicionais",
      descricao: "Molho de tomate suave, muçarela, peito de frango nobre desfiado temperado com ervas do Olimpo, generosa cobertura de Catupiry original e milho verde fresco.",
      imagem: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80",
      destaque: "Favorita",
      disponivel: true,
      permiteMeia: true,
      precos: {
        brotinho: 38.90,
        media: 52.90,
        grande: 65.90,
        familia: 77.90
      }
    },
    {
      id: "pizza-afrodite",
      nome: "Pizza Afrodite (Doce Tentação Nutella com Morangos)",
      categoria: "doces",
      descricao: "Massa fininha e crocante coberta com puro creme de avelã Nutella, morangos frescos fatiados na hora, raspas de chocolate belga e leite em pó polvilhado.",
      imagem: "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=800&q=80",
      destaque: "Doce Especial",
      disponivel: true,
      permiteMeia: true,
      precos: {
        brotinho: 39.90,
        media: 54.90,
        grande: 69.90,
        familia: 82.90
      }
    },
    {
      id: "pizza-hades",
      nome: "Pizza Hades (Chocolate Vulcânico com Ninho)",
      categoria: "doces",
      descricao: "Ganache de chocolate meio amargo 50% cacau, camada aveludada de brigadeiro gourmet, coberta com Leite Ninho original e bombons de chocolate picados.",
      imagem: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80",
      destaque: "Doce Supremo",
      disponivel: true,
      permiteMeia: true,
      precos: {
        brotinho: 38.90,
        media: 53.90,
        grande: 68.90,
        familia: 79.90
      }
    },
    {
      id: "bebida-coca-2l",
      nome: "Coca-Cola Original 2 Litros",
      categoria: "bebidas",
      descricao: "Refrigerante Coca-Cola garrafa pet 2L, entregue bem gelada.",
      imagem: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80",
      destaque: "Gelada",
      disponivel: true,
      permiteMeia: false,
      precoFixo: 14.90
    },
    {
      id: "bebida-guarana-2l",
      nome: "Guaraná Antarctica 2 Litros",
      categoria: "bebidas",
      descricao: "Refrigerante Guaraná Antarctica garrafa pet 2L, entregue super gelado.",
      imagem: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
      destaque: "Gelada",
      disponivel: true,
      permiteMeia: false,
      precoFixo: 13.90
    },
    {
      id: "bebida-suco-laranja",
      nome: "Suco Natural de Laranja 500ml",
      categoria: "bebidas",
      descricao: "Suco 100% natural de laranja da fruta, prensado a frio, sem adição de açúcar e sem conservantes.",
      imagem: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
      destaque: "Natural",
      disponivel: true,
      permiteMeia: false,
      precoFixo: 11.90
    },
    {
      id: "bebida-heineken",
      nome: "Cerveja Heineken Long Neck 330ml",
      categoria: "bebidas",
      descricao: "Cerveja puro malte premium lager 330ml, estupidamente gelada (Venda proibida para menores de 18 anos).",
      imagem: "https://images.unsplash.com/photo-1608270199042-45be8a301416?auto=format&fit=crop&w=800&q=80",
      destaque: "Puro Malte",
      disponivel: true,
      permiteMeia: false,
      precoFixo: 12.90
    },
    {
      id: "combo-banquete-olimpico",
      nome: "Banquete Olímpico (1 Grande + 1 Doce Média + 1 Refri 2L)",
      categoria: "combos",
      descricao: "1 Pizza Grande Salgada (qualquer sabor especial ou tradicional) + 1 Pizza Média Doce (Afrodite ou Hades) + 1 Refrigerante 2 Litros gelado.",
      imagem: "https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=800&q=80",
      destaque: "Super Economia",
      disponivel: true,
      permiteMeia: false,
      precoFixo: 119.90
    },
    {
      id: "combo-casal-dos-deuses",
      nome: "Combo Casal dos Deuses (1 Média + 1 Brotinho Doce + 2 Sucos)",
      categoria: "combos",
      descricao: "1 Pizza Média Salgada + 1 Pizza Brotinho Doce + 2 Sucos Naturais 500ml gelados. A combinação perfeita para duas pessoas.",
      imagem: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
      destaque: "Para Dois",
      disponivel: true,
      permiteMeia: false,
      precoFixo: 89.90
    }
  ],

  // Bordas Recheadas
  bordas: [
    {
      id: "borda-sem",
      nome: "Sem Borda Recheada (Massa Tradicional)",
      descricao: "Borda tradicional fofinha e crocante assada no forno de pedra.",
      preco: 0.00,
      disponivel: true
    },
    {
      id: "borda-catupiry",
      nome: "Borda de Catupiry Legítimo",
      descricao: "Recheada com o autêntico requeijão cremoso Catupiry.",
      preco: 9.90,
      disponivel: true
    },
    {
      id: "borda-cheddar",
      nome: "Borda de Cheddar Cremoso Especial",
      descricao: "Cheddar cremoso bem marcante e derretido na medida certa.",
      preco: 9.90,
      disponivel: true
    },
    {
      id: "borda-chocolate",
      nome: "Borda de Chocolate ao Leite Gourmet",
      descricao: "Recheada generosamente com chocolate cremoso ao leite.",
      preco: 12.90,
      disponivel: true
    },
    {
      id: "borda-doce-de-leite",
      nome: "Borda de Doce de Leite com Canela",
      descricao: "Doce de leite artesanal argentino com um toque sutil de canela.",
      preco: 11.90,
      disponivel: true
    }
  ],

  // Pedidos de demonstração iniciais para o admin não iniciar vazio
  pedidosIniciais: [
    {
      id: "ORD-9421",
      dataHora: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      cliente: {
        nome: "Guilherme Santos",
        telefone: "11988887766"
      },
      tipoEntrega: "delivery", // 'delivery' ou 'retirada'
      endereco: {
        rua: "Av. Paulista",
        numero: "1578",
        bairro: "Bela Vista",
        complemento: "Apt 82"
      },
      itens: [
        {
          produtoId: "pizza-zeus",
          nome: "Pizza Zeus (Suprema Imperial)",
          tamanhoId: "grande",
          tamanhoNome: "Grande (8 fatias)",
          meiaAMeia: true,
          segundoSaborNome: "Pizza Poseidon (Frutos do Mar)",
          bordaNome: "Borda de Catupiry Legítimo",
          bordaPreco: 9.90,
          observacoes: "Massa bem crocante por favor",
          quantidade: 1,
          precoUnitario: 94.80,
          subtotal: 94.80
        },
        {
          produtoId: "bebida-coca-2l",
          nome: "Coca-Cola Original 2 Litros",
          tamanhoId: null,
          tamanhoNome: "2 Litros",
          meiaAMeia: false,
          segundoSaborNome: null,
          bordaNome: null,
          bordaPreco: 0,
          observacoes: "",
          quantidade: 1,
          precoUnitario: 14.90,
          subtotal: 14.90
        }
      ],
      subtotal: 109.70,
      taxaEntrega: 7.00,
      total: 116.70,
      formaPagamento: "pix",
      trocoPara: null,
      status: "em_preparo" // 'pendente', 'em_preparo', 'saiu_para_entrega', 'concluido', 'cancelado'
    },
    {
      id: "ORD-9418",
      dataHora: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
      cliente: {
        nome: "Mariana Alencar",
        telefone: "11977776655"
      },
      tipoEntrega: "retirada",
      endereco: null,
      itens: [
        {
          produtoId: "pizza-atena",
          nome: "Pizza Atena (Marguerita Imperial)",
          tamanhoId: "media",
          tamanhoNome: "Média (6 fatias)",
          meiaAMeia: false,
          segundoSaborNome: null,
          bordaNome: "Sem Borda Recheada (Massa Tradicional)",
          bordaPreco: 0,
          observacoes: "Sem cebola",
          quantidade: 1,
          precoUnitario: 49.90,
          subtotal: 49.90
        }
      ],
      subtotal: 49.90,
      taxaEntrega: 0.00,
      total: 49.90,
      formaPagamento: "cartao",
      trocoPara: null,
      status: "saiu_para_entrega"
    }
  ]
};

// Torna disponível globalmente para o navegador
if (typeof window !== "undefined") {
  window.SEED_DATA = SEED_DATA;
}
