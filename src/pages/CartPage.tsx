import { useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const sizes = ["P", "M", "G", "GG"];

const CartPage = () => {
  const { items, removeItem, updateQuantity, updateSize, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error("Faça login para continuar!");
      navigate("/auth");
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">Seu carrinho está vazio</h2>
        <p className="text-muted-foreground mb-6">Explore nossas camisas e encontre a sua!</p>
        <Button onClick={() => navigate("/")} className="gold-gradient text-primary-foreground font-bold">
          Ver Camisas
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 text-muted-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" /> Continuar comprando
      </Button>

      <h1 className="font-display text-2xl font-bold mb-6">Carrinho de Compras</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={`${item.productId}-${item.size}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex gap-4 p-4 rounded-lg border border-border bg-card"
              >
                <img src={item.image} alt={item.name} className="w-20 h-20 md:w-24 md:h-24 rounded-md object-cover" />
                <div className="flex-1 min-w-0 space-y-2">
                  <h3 className="font-semibold text-sm md:text-base truncate">{item.name}</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Select value={item.size} onValueChange={(val) => updateSize(item.productId, item.size, val)}>
                      <SelectTrigger className="w-20 h-8 text-xs bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sizes.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(item.productId, item.size)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      R$ {item.price.toFixed(2).replace(".", ",")} un.
                    </span>
                    <span className="font-bold text-primary">
                      R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-lg border border-border bg-card p-6 space-y-4">
            <h2 className="font-display text-lg font-bold">Resumo</h2>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Frete</span>
              <span className={totalPrice >= 300 ? "text-green-500" : ""}>
                {totalPrice >= 300 ? "Grátis" : "R$ 29,90"}
              </span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">
                R$ {(totalPrice + (totalPrice >= 300 ? 0 : 29.9)).toFixed(2).replace(".", ",")}
              </span>
            </div>
            <Button
              size="lg"
              className="w-full gold-gradient text-primary-foreground font-bold hover:opacity-90"
              onClick={handleCheckout}
            >
              Finalizar Compra
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
