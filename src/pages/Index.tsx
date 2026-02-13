import { Link } from "react-router-dom";
import { ArrowRight, Eye, Star, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/data/products";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/products";

const categoryIcons: Record<string, string> = {
  Brasileiro: "🇧🇷",
  Europeu: "🇪🇺",
  Francês: "🇫🇷",
  Seleções: "🌍",

};

const categoryBackgrounds: Record<string, string> = {
  Brasileiro: "https://flagcdn.com/w640/br.png",
  Europeu: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg",
  Francês: "https://flagcdn.com/w640/fr.png",
  Seleções: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&h=600&fit=crop",
};

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [mostViewedProducts, setMostViewedProducts] = useState<Product[]>([]);
  const heroImages = [
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1920&h=900&fit=crop",
    "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1920&h=900&fit=crop",
    "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1920&h=900&fit=crop",
  ];
  const [heroIndex, setHeroIndex] = useState(0);
  const HERO_ROTATION_MS = 5000;

  useEffect(() => {
    const mapProduct = (p): Product => ({
      id: p.id,
      name: p.name,
      team: p.team,
      description: p.description,
      price: Number(p.price),
      originalPrice: p.original_price ? Number(p.original_price) : undefined,
      images: [p.image, ...(p.images || [])].filter(Boolean),
      sizes: p.sizes || ["P", "M", "G", "GG"],
      stock: p.stock ?? 0,
      rating: Number(p.rating ?? 4.5),
      reviewCount: p.review_count ?? 0,
      isPromotion: !!p.original_price,
      category: p.category,
      isFeatured: p.is_featured ?? false,
      viewCount: p.view_count ?? 0,
    });

    const load = async () => {
      const [feat, most] = await Promise.all([
        supabase.from("products").select("*").eq("is_featured", true).order("created_at", { ascending: false }).limit(8),
        supabase.from("products").select("*").order("view_count", { ascending: false }).limit(4),
      ]);

      if (!feat.error && feat.data) setFeaturedProducts(feat.data.map(mapProduct));
      if (!most.error && most.data) setMostViewedProducts(most.data.map(mapProduct));
    };

    load();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length);
    }, HERO_ROTATION_MS);
    return () => clearInterval(id);
  }, [heroImages.length, HERO_ROTATION_MS]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          {heroImages.map((src, idx) => (
            <div
              key={src}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${idx === heroIndex ? "opacity-100" : "opacity-0"}`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
        </div>
        <div className="absolute inset-0 gold-gradient opacity-10 z-10" />
        <div className="container py-16 md:py-24 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Vista a camisa do seu{" "}
              <span className="gold-text">time do coração</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-6 text-black">
              As melhores camisas de futebol do Brasil e do mundo com qualidade premium e entrega rápida.
            </p>
            <Button
              size="lg"
              className="gold-gradient text-primary-foreground font-bold hover:opacity-90 transition-opacity"
              asChild
            >
              <Link to="/camisas">Ver Todas as Camisas</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-10">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">Explore por Categoria</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
            >
              <Link
                to={`/camisas?categoria=${cat}`}
                className="relative overflow-hidden flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-6 md:p-8 card-hover group"
              >
                <div
                  className="absolute inset-0 pointer-events-none opacity-20 bg-cover bg-center"
                  style={{ backgroundImage: `url(${categoryBackgrounds[cat] || categoryBackgrounds["Seleções"]})` }}
                />
                <span className="text-3xl">{categoryIcons[cat] || "⚽"}</span>
                <span className="font-display font-semibold text-lg group-hover:text-primary transition-colors">
                  {cat}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl md:text-3xl font-bold">Destaques</h2>
          </div>
          <Link to="/camisas" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </section>

      {/* Most Viewed */}
      <section className="container py-10 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl md:text-3xl font-bold">Mais Vistas</h2>
          </div>
          <Link to="/camisas" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {mostViewedProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
