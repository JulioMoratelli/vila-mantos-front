import { Link } from "react-router-dom";
import { ArrowRight, Eye, Star, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { featuredProducts, mostViewedProducts, categories } from "@/data/products";
import { motion } from "framer-motion";

const categoryIcons: Record<string, string> = {
  Brasileiro: "🇧🇷",
  Europeu: "🇪🇺",
  Seleções: "🌍",
  Francês: "🇫🇷",
};

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 gold-gradient opacity-5" />
        <div className="container py-16 md:py-24 relative">
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
            <p className="text-lg text-muted-foreground mb-6">
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
                className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-6 md:p-8 card-hover group"
              >
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
