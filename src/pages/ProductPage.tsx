import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Truck, Shield, ArrowLeft, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StarRating from "@/components/StarRating";
import type { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

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
      if (!id) return;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        toast.error("Erro ao carregar produto");
      } else if (data) {
        setProduct(mapProduct(data));
      }
      setLoading(false);
    };

    load();
  }, [id]);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground text-lg">Carregando produto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground text-lg">Produto não encontrado.</p>
        <Button variant="ghost" onClick={() => navigate("/")} className="mt-4">Voltar</Button>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Selecione um tamanho!");
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images[0],
      size: selectedSize,
      quantity,
      price: product.price,
    });
    toast.success("Adicionado ao carrinho!");
  };

  return (
    <div className="container py-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 text-muted-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
          <div className="aspect-square rounded-lg overflow-hidden border border-border bg-card">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                  selectedImage === idx ? "border-primary" : "border-border"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.team}</p>
            <h1 className="font-display text-2xl md:text-3xl font-bold">{product.name}</h1>
          </div>

          <StarRating rating={product.rating} reviewCount={product.reviewCount} />

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                </span>
                <Badge className="gold-gradient text-primary-foreground border-0">-{discount}%</Badge>
              </>
            )}
          </div>

          {product.stock <= 5 && (
            <Badge variant="destructive" className="animate-pulse">
              🔥 Últimas {product.stock} unidades!
            </Badge>
          )}

          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Size selector */}
          <div>
            <p className="text-sm font-medium mb-2">Tamanho <span className="text-destructive">*</span></p>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-md border-2 font-bold text-sm transition-all ${
                    selectedSize === size
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <p className="text-sm font-medium mb-2">Quantidade</p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-bold">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to cart */}
          <Button
            size="lg"
            className="w-full gold-gradient text-primary-foreground font-bold hover:opacity-90 transition-opacity"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Adicionar ao Carrinho
          </Button>

          {/* Info cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 rounded-md border border-border">
              <Truck className="h-4 w-4 text-primary" />
              Frete grátis acima de R$300
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 rounded-md border border-border">
              <Shield className="h-4 w-4 text-primary" />
              Garantia de 30 dias
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductPage;
