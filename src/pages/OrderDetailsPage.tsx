import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { ArrowLeft, Package, CreditCard, MapPin } from "lucide-react";

const OrderDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Database["public"]["Tables"]["orders"]["Row"] | null>(null);
  const [items, setItems] = useState<Database["public"]["Tables"]["order_items"]["Row"][]>([]);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [{ data: orderData, error: orderError }, { data: itemsData, error: itemsError }] = await Promise.all([
          supabase.from("orders").select("*").eq("id", id).maybeSingle(),
          supabase.from("order_items").select("*").eq("order_id", id),
        ]);
        if (orderError) throw orderError;
        if (itemsError) throw itemsError;
        if (!orderData) {
          toast.error("Pedido não encontrado");
          navigate("/perfil");
          return;
        }
        setOrder(orderData);
        setItems(itemsData || []);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Erro ao carregar detalhes do pedido";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const totalItems = items.reduce((sum, it) => sum + (Number(it.unit_price) * Number(it.quantity)), 0);

  if (loading) {
    return <div className="container py-16 text-center text-muted-foreground">Carregando...</div>;
  }

  if (!order) {
    return <div className="container py-16 text-center text-muted-foreground">Pedido não encontrado</div>;
  }

  const address = (order.shipping_address ?? {}) as Record<string, unknown>;

  return (
    <div className="container py-6 max-w-3xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 text-muted-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
      </Button>

      <h1 className="font-display text-2xl font-bold mb-6">Detalhes do Pedido</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Pedido #{order.order_number}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data</span>
                <span>{new Date(order.created_at).toLocaleString("pt-BR")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="text-primary capitalize">{order.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pagamento</span>
                <span className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> {order.payment_method === "card" ? "Cartão" : order.payment_method}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>R$ {Number(order.total).toFixed(2).replace(".", ",")}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Itens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.length === 0 ? (
                <p className="text-muted-foreground text-sm">Nenhum item encontrado para este pedido.</p>
              ) : (
                items.map((it) => (
                  <div key={it.id} className="flex items-center gap-4 p-3 rounded-md border border-border">
                    {it.product_image && (
                      <img src={it.product_image} alt={it.product_name} className="h-16 w-16 rounded object-cover" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-sm">{it.product_name}</span>
                        <span className="text-sm">R$ {(Number(it.unit_price) * Number(it.quantity)).toFixed(2).replace(".", ",")}</span>
                      </div>
                      <div className="text-xs text-muted-foreground flex gap-3">
                        <span>Tam. {it.size}</span>
                        <span>Qtd. {it.quantity}</span>
                        <span>Preço unit. R$ {Number(it.unit_price).toFixed(2).replace(".", ",")}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div className="flex justify-between border-t border-border pt-2 text-sm">
                <span className="text-muted-foreground">Subtotal itens</span>
                <span>R$ {totalItems.toFixed(2).replace(".", ",")}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              {address ? (
                <div className="space-y-1">
                  {typeof address.street === "string" && (
                    <div>
                      <span className="font-medium">{address.street}</span>{" "}
                      <span>{typeof address.number === "string" ? address.number : ""}</span>
                    </div>
                  )}
                  {typeof address.complement === "string" && <div>{address.complement}</div>}
                  <div>
                    {typeof address.neighborhood === "string" && <span>{address.neighborhood} </span>}
                    {typeof address.city === "string" && <span>- {address.city} </span>}
                    {typeof address.state === "string" && <span>/ {address.state}</span>}
                  </div>
                  {typeof address.cep === "string" && <div>CEP {address.cep}</div>}
                </div>
              ) : (
                <p className="text-muted-foreground">Endereço não informado</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;