import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import { products, teams } from "@/data/products";
import { motion } from "framer-motion";

const sizes = ["P", "M", "G", "GG"];
const priceRanges = [
  { label: "Até R$200", min: 0, max: 200 },
  { label: "R$200-R$300", min: 200, max: 300 },
  { label: "R$300+", min: 300, max: Infinity },
];

const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.team.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedTeam && p.team !== selectedTeam) return false;
      if (selectedSize && !p.sizes.includes(selectedSize)) return false;
      if (selectedPriceRange !== null) {
        const range = priceRanges[selectedPriceRange];
        if (p.price < range.min || p.price >= range.max) return false;
      }
      return true;
    });
  }, [search, selectedTeam, selectedSize, selectedPriceRange]);

  const clearFilters = () => {
    setSearch("");
    setSelectedTeam(null);
    setSelectedSize(null);
    setSelectedPriceRange(null);
  };

  const hasFilters = search || selectedTeam || selectedSize || selectedPriceRange !== null;

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
              onClick={() => document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" })}
            >
              Ver Camisas
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <section id="produtos" className="container py-10">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por time ou camisa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Filters */}
        <div className="space-y-3 mb-8">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground self-center mr-1">Time:</span>
            {teams.map((team) => (
              <Badge
                key={team}
                variant={selectedTeam === team ? "default" : "outline"}
                className={`cursor-pointer transition-all ${selectedTeam === team ? "gold-gradient text-primary-foreground border-0" : "hover:border-primary"}`}
                onClick={() => setSelectedTeam(selectedTeam === team ? null : team)}
              >
                {team}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground self-center mr-1">Tamanho:</span>
            {sizes.map((size) => (
              <Badge
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                className={`cursor-pointer transition-all ${selectedSize === size ? "gold-gradient text-primary-foreground border-0" : "hover:border-primary"}`}
                onClick={() => setSelectedSize(selectedSize === size ? null : size)}
              >
                {size}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground self-center mr-1">Preço:</span>
            {priceRanges.map((range, idx) => (
              <Badge
                key={range.label}
                variant={selectedPriceRange === idx ? "default" : "outline"}
                className={`cursor-pointer transition-all ${selectedPriceRange === idx ? "gold-gradient text-primary-foreground border-0" : "hover:border-primary"}`}
                onClick={() => setSelectedPriceRange(selectedPriceRange === idx ? null : idx)}
              >
                {range.label}
              </Badge>
            ))}
          </div>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground">
              Limpar filtros
            </Button>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">Nenhuma camisa encontrada.</p>
            <Button variant="ghost" onClick={clearFilters} className="mt-2">Limpar filtros</Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
