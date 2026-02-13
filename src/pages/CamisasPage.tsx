import { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Search, ChevronLeft, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";

const sizes = ["P", "M", "G", "GG"];
const priceRanges = [
  { label: "Até R$200", min: 0, max: 200 },
  { label: "R$200-R$300", min: 200, max: 300 },
  { label: "R$300+", min: 300, max: Infinity },
];

const CamisasPage = () => {
  const { team } = useParams();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("categoria");

  const [search, setSearch] = useState("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from("products").select("*");

      if (team) query = query.eq("team", team);
      if (categoryParam) query = query.ilike("category", categoryParam);

      const { data, error } = await query.order("created_at", { ascending: false });

      if (!error && data) {
        setProducts(
          data.map((p) => ({
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
          }))
        );
      }
      setLoading(false);
    };
    fetchProducts();
  }, [team, categoryParam]);

  const pageTitle = team
    ? `Camisas do ${team}`
    : categoryParam
    ? `Camisas - ${categoryParam}`
    : "Todas as Camisas";

  // Get unique teams from fetched products for the team grid
  const availableTeams = useMemo(() => {
    if (!categoryParam || team) return [];
    return [...new Set(products.map((p) => p.team))];
  }, [products, categoryParam, team]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.team.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedSize && !p.sizes.includes(selectedSize)) return false;
      if (selectedPriceRange !== null) {
        const range = priceRanges[selectedPriceRange];
        if (p.price < range.min || p.price >= range.max) return false;
      }
      return true;
    });
  }, [products, search, selectedSize, selectedPriceRange]);

  const clearFilters = () => {
    setSearch("");
    setSelectedSize(null);
    setSelectedPriceRange(null);
  };

  const hasFilters = search || selectedSize || selectedPriceRange !== null;

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          Início
        </Link>
        {categoryParam && !team && (
          <span className="text-muted-foreground text-sm">/ {categoryParam}</span>
        )}
        {team && categoryParam && (
          <>
            <Link to={`/camisas?categoria=${categoryParam}`} className="text-muted-foreground hover:text-primary transition-colors text-sm">
              / {categoryParam}
            </Link>
            <span className="text-muted-foreground text-sm">/ {team}</span>
          </>
        )}
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl md:text-4xl font-bold mb-8"
      >
        {pageTitle}
      </motion.h1>

      {/* Team grid when viewing category without specific team */}
      {categoryParam && !team && availableTeams.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {availableTeams.map((t) => (
            <Link
              key={t}
              to={`/camisas/${t}?categoria=${categoryParam}`}
              className="rounded-lg border border-border bg-card p-6 text-center card-hover group"
            >
              <span className="font-display font-semibold group-hover:text-primary transition-colors">
                {t}
              </span>
            </Link>
          ))}
        </div>
      )}

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

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">Nenhuma camisa encontrada.</p>
          <Button variant="ghost" onClick={clearFilters} className="mt-2">Limpar filtros</Button>
        </div>
      )}
    </div>
  );
};

export default CamisasPage;
