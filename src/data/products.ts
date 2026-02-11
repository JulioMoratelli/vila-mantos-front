export interface Product {
  id: string;
  name: string;
  team: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  sizes: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  isPromotion: boolean;
  category: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Camisa Flamengo I 2024",
    team: "Flamengo",
    description: "Camisa oficial do Flamengo para a temporada 2024. Produzida com tecnologia de alta performance, tecido leve e respirável. Ideal para torcer com estilo e conforto.",
    price: 199.90,
    originalPrice: 299.90,
    images: [
      "https://images.unsplash.com/photo-1551854304-dbbb1c3a6fba?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&h=600&fit=crop",
    ],
    sizes: ["P", "M", "G", "GG"],
    stock: 3,
    rating: 4.8,
    reviewCount: 234,
    isPromotion: true,
    category: "Brasileiro",
  },
  {
    id: "2",
    name: "Camisa Corinthians I 2024",
    team: "Corinthians",
    description: "A camisa titular do Corinthians 2024 combina tradição e modernidade. Design clássico em preto e branco com detalhes exclusivos.",
    price: 249.90,
    images: [
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=600&fit=crop",
    ],
    sizes: ["P", "M", "G", "GG"],
    stock: 15,
    rating: 4.6,
    reviewCount: 189,
    isPromotion: false,
    category: "Brasileiro",
  },
  {
    id: "3",
    name: "Camisa Barcelona I 2024",
    team: "Barcelona",
    description: "Camisa oficial do FC Barcelona temporada 2024/25. As tradicionais listras azul e grená em um design moderno e inovador.",
    price: 349.90,
    originalPrice: 449.90,
    images: [
      "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&h=600&fit=crop",
    ],
    sizes: ["P", "M", "G", "GG"],
    stock: 8,
    rating: 4.9,
    reviewCount: 412,
    isPromotion: true,
    category: "Europeu",
  },
  {
    id: "4",
    name: "Camisa Real Madrid I 2024",
    team: "Real Madrid",
    description: "A elegante camisa branca do Real Madrid para 2024/25. Símbolo de grandeza e tradição no futebol mundial.",
    price: 349.90,
    images: [
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=600&fit=crop",
    ],
    sizes: ["P", "M", "G", "GG"],
    stock: 20,
    rating: 4.7,
    reviewCount: 356,
    isPromotion: false,
    category: "Europeu",
  },
  {
    id: "5",
    name: "Camisa Palmeiras I 2024",
    team: "Palmeiras",
    description: "Camisa oficial do Palmeiras 2024. O verde alviverde em um design que une tradição e inovação tecnológica.",
    price: 229.90,
    originalPrice: 279.90,
    images: [
      "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&h=600&fit=crop",
    ],
    sizes: ["P", "M", "G", "GG"],
    stock: 2,
    rating: 4.5,
    reviewCount: 178,
    isPromotion: true,
    category: "Brasileiro",
  },
  {
    id: "6",
    name: "Camisa São Paulo I 2024",
    team: "São Paulo",
    description: "A clássica camisa tricolor do São Paulo FC para 2024. Branca com a faixa horizontal vermelha e preta.",
    price: 239.90,
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1516475429286-465d815a0df7?w=600&h=600&fit=crop",
    ],
    sizes: ["P", "M", "G", "GG"],
    stock: 12,
    rating: 4.4,
    reviewCount: 145,
    isPromotion: false,
    category: "Brasileiro",
  },
  {
    id: "7",
    name: "Camisa Manchester City I 2024",
    team: "Manchester City",
    description: "Camisa titular do Manchester City 2024/25. O azul celeste dos campeões em tecido de última geração.",
    price: 379.90,
    originalPrice: 449.90,
    images: [
      "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=600&h=600&fit=crop",
    ],
    sizes: ["P", "M", "G", "GG"],
    stock: 5,
    rating: 4.8,
    reviewCount: 267,
    isPromotion: true,
    category: "Europeu",
  },
  {
    id: "8",
    name: "Camisa Seleção Brasil I 2024",
    team: "Brasil",
    description: "A amarelinha oficial da Seleção Brasileira. O manto sagrado do futebol brasileiro para vestir com orgulho.",
    price: 299.90,
    images: [
      "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=600&fit=crop",
    ],
    sizes: ["P", "M", "G", "GG"],
    stock: 25,
    rating: 4.9,
    reviewCount: 523,
    isPromotion: false,
    category: "Seleções",
  },
];

export const teams = [...new Set(products.map((p) => p.team))];
export const categories = [...new Set(products.map((p) => p.category))];
