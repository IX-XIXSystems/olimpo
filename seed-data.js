const SEED_DATA = {
  configuracoes: {
    nomePizzaria: "Olimpo Pizzas Delivery",
    aberto: true,
    horarioFuncionamento: "Terça a Domingo · 18h30 às 23h30",
    tempoEntrega: "40–55 min",
    taxaEntrega: 7.00,
    pedidoMinimo: 24.00,
    endereco: "Rua Olavo Bilac, 303 · São José, Fraiburgo - SC",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua+Olavo+Bilac+303+Sao+Jose+Fraiburgo+SC",
    telefoneWhatsApp: "5549999156336",
    telefoneFormatado: "(49) 9915-6336",
    mensagemBoasVindas: "Pizzas artesanais, calzones e combos exclusivos em Fraiburgo - SC."
  },

  categorias: [
    { id: "promocoes", nome: "Promoção Olimpo", icone: "fa-fire", ordem: 1 },
    { id: "combos", nome: "Combo Olimpo", icone: "fa-layer-group", ordem: 2 },
    { id: "pizzas", nome: "Pizzas", icone: "fa-pizza-slice", ordem: 3 },
    { id: "calzones", nome: "Calzones", icone: "fa-crescent", ordem: 4 },
    { id: "bebidas", nome: "Bebidas", icone: "fa-bottle-water", ordem: 5 }
  ],

  produtos: [
    {
      id: "promo-pizza-pequena",
      nome: "Pizza Pequena Promocional",
      categoria: "promocoes",
      descricao: "Escolha entre os sabores tradicionais selecionados da casa. Massa artesanal assada na hora.",
      imagem: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
      destaque: "Oferta",
      disponivel: true,
      precoFixo: 39.90
    },
    {
      id: "combo-dupla-35",
      nome: "Combo 2 Pizzas Grandes (35cm)",
      categoria: "combos",
      descricao: "1 Pizza Grande 35cm com borda recheada + 1 Pizza Grande 35cm sem borda. Ideal para toda a família.",
      imagem: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
      destaque: "Mais Pedido",
      disponivel: true,
      precoFixo: 116.99
    },
    {
      id: "combo-dupla-30",
      nome: "Combo 2 Pizzas Médias (30cm) c/ Borda",
      categoria: "combos",
      descricao: "2 Pizzas Médias de 30cm, ambas com borda recheada à sua escolha.",
      imagem: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
      destaque: "Combo Olimpo",
      disponivel: true,
      precoFixo: 109.99
    },
    {
      id: "pizza-zeus",
      nome: "Zeus Suprema",
      categoria: "pizzas",
      descricao: "Molho artesanal, muçarela especial, pepperoni italiano fatiado, champignon salteado, azeitonas pretas e orégano.",
      imagem: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
      destaque: "Especial",
      disponivel: true,
      precos: {
        pequena: 50.00,
        media: 60.00,
        grande: 70.00,
        gigante: 80.00
      }
    },
    {
      id: "pizza-poseidon",
      nome: "Poseidon (Camarão & Catupiry)",
      categoria: "pizzas",
      descricao: "Molho da casa, muçarela, camarões selecionados salteados no azeite de ervas, alho-poró e requeijão cremoso.",
      imagem: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
      destaque: "Chef",
      disponivel: true,
      precos: {
        pequena: 55.00,
        media: 68.00,
        grande: 79.00,
        gigante: 89.00
      }
    },
    {
      id: "pizza-atena",
      nome: "Atena (Marguerita Especial)",
      categoria: "pizzas",
      descricao: "Molho de tomate pelati, muçarela, tomate cereja confitado, parmesão ralado na hora e manjericão fresco.",
      imagem: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80",
      destaque: "",
      disponivel: true,
      precos: {
        pequena: 50.00,
        media: 60.00,
        grande: 70.00,
        gigante: 80.00
      }
    },
    {
      id: "pizza-dionisio",
      nome: "Dionísio (Quatro Queijos)",
      categoria: "pizzas",
      descricao: "Muçarela, provolone defumado, gorgonzola nobre e autêntico requeijão cremoso sobre molho artesanal.",
      imagem: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
      destaque: "",
      disponivel: true,
      precos: {
        pequena: 50.00,
        media: 60.00,
        grande: 70.00,
        gigante: 80.00
      }
    },
    {
      id: "pizza-ares",
      nome: "Ares (Calabresa Acebolada)",
      categoria: "pizzas",
      descricao: "Molho de tomate, muçarela, calabresa fatiada dourada no forno, cebola roxa e orégano.",
      imagem: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80",
      destaque: "Clássica",
      disponivel: true,
      precos: {
        pequena: 50.00,
        media: 60.00,
        grande: 70.00,
        gigante: 80.00
      }
    },
    {
      id: "pizza-afrodite",
      nome: "Afrodite (Nutella com Morango)",
      categoria: "pizzas",
      descricao: "Massa doce crocante com creme de avelã Nutella, morangos frescos fatiados e raspas de chocolate.",
      imagem: "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=800&q=80",
      destaque: "Doce",
      disponivel: true,
      precos: {
        pequena: 50.00,
        media: 60.00,
        grande: 70.00,
        gigante: 80.00
      }
    },
    {
      id: "calzone-olimpo",
      nome: "Calzone Tradicional do Olimpo",
      categoria: "calzones",
      descricao: "Massa fechada recheada com muçarela, presunto, calabresa, tomate, orégano e toque de requeijão cremoso.",
      imagem: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
      destaque: "Artesanal",
      disponivel: true,
      precoFixo: 44.90
    },
    {
      id: "calzone-frango",
      nome: "Calzone Frango com Catupiry",
      categoria: "calzones",
      descricao: "Recheio generoso de peito de frango desfiado temperado, muçarela derretida e Catupiry legítimo.",
      imagem: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80",
      destaque: "",
      disponivel: true,
      precoFixo: 44.90
    },
    {
      id: "bebida-coca-2l",
      nome: "Coca-Cola 2 Litros",
      categoria: "bebidas",
      descricao: "Garrafa PET 2L bem gelada.",
      imagem: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80",
      destaque: "",
      disponivel: true,
      precoFixo: 15.00
    },
    {
      id: "bebida-guarana-2l",
      nome: "Guaraná Antarctica 2 Litros",
      categoria: "bebidas",
      descricao: "Garrafa PET 2L bem gelada.",
      imagem: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
      destaque: "",
      disponivel: true,
      precoFixo: 14.00
    }
  ],

  bordas: [
    { id: "borda-catupiry", nome: "Catupiry", descricao: "Requeijão cremoso", preco: 10.00, disponivel: true },
    { id: "borda-cheddar", nome: "Cheddar", descricao: "Cheddar cremoso", preco: 10.00, disponivel: true },
    { id: "borda-chocolate", nome: "Chocolate", descricao: "Chocolate ao leite", preco: 12.00, disponivel: true }
  ],

  pedidosIniciais: []
};

if (typeof window !== "undefined") {
  window.SEED_DATA = SEED_DATA;
}
