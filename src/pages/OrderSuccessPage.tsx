import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Home } from "lucide-react";
import { motion } from "framer-motion";

const OrderSuccessPage = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  return (
    <div className="container flex items-center justify-center min-h-[70vh] py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <CheckCircle className="h-20 w-20 mx-auto text-primary" />
        </motion.div>

        <h1 className="font-display text-3xl font-bold">Pedido Confirmado!</h1>
        <p className="text-muted-foreground">
          Seu pedido foi realizado com sucesso. Você receberá um email com os detalhes.
        </p>

        <div className="p-4 rounded-lg border border-border bg-card">
          <p className="text-xs text-muted-foreground mb-1">Número do pedido</p>
          <p className="font-display text-xl font-bold text-primary">{orderNumber}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate("/perfil")} className="gap-2">
            <Package className="h-4 w-4" /> Meus Pedidos
          </Button>
          <Button onClick={() => navigate("/")} className="gold-gradient text-primary-foreground font-bold gap-2">
            <Home className="h-4 w-4" /> Voltar à Loja
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
