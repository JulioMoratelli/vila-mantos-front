import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import StarRating from "./StarRating";
import type { Product } from "@/data/products";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={`/produto/${product.id}`} className="block group">
        <div className="rounded-lg border border-border bg-card overflow-hidden card-hover">
          <div className="relative aspect-square overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isPromotion && (
                <Badge className="gold-gradient text-primary-foreground border-0 text-xs font-bold">
                  -{discount}%
                </Badge>
              )}
              {product.stock <= 5 && (
                <Badge variant="destructive" className="text-xs font-bold">
                  Últimas unidades!
                </Badge>
              )}
            </div>
          </div>
          <div className="p-4 space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.team}</p>
            <h3 className="font-display text-sm font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size={12} />
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
