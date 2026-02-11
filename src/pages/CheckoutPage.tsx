import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreditCard, QrCode, MapPin, ArrowLeft } from "lucide-react";

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<any>(null);
  const [editAddress, setEditAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    cep: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "",
  });

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    if (items.length === 0) { navigate("/carrinho"); return; }

    supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_default", true)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setAddress(data);
          setAddressForm({
            cep: data.cep, street: data.street, number: data.number,
            complement: data.complement || "", neighborhood: data.neighborhood,
            city: data.city, state: data.state,
          });
        } else {
          setEditAddress(true);
        }
      });
  }, [user, items, navigate]);

  const shipping = totalPrice >= 300 ? 0 : 29.9;
  const total = totalPrice + shipping;

  const handleConfirm = async () => {
    if (!user) return;

    if (!address && !addressForm.street) {
      toast.error("Preencha o endereço de entrega!");
      return;
    }

    setLoading(true);
    try {
      // Save address if editing
      let shippingAddress = address ? {
        cep: address.cep, street: address.street, number: address.number,
        complement: address.complement, neighborhood: address.neighborhood,
        city: address.city, state: address.state,
      } : addressForm;

      if (editAddress && addressForm.street) {
        if (address?.id) {
          await supabase.from("addresses").update(addressForm).eq("id", address.id);
        } else {
          await supabase.from("addresses").insert({
            user_id: user.id, ...addressForm, is_default: true,
          });
        }
        shippingAddress = addressForm;
      }

      const orderNumber = `FS-${Date.now().toString(36).toUpperCase()}`;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          total,
          payment_method: paymentMethod,
          shipping_address: shippingAddress,
          status: "confirmed",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.name,
        product_image: item.image,
        size: item.size,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      navigate(`/pedido-confirmado/${orderNumber}`);
    } catch (err: any) {
      toast.error(err.message || "Erro ao confirmar pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-6 max-w-2xl">
      <Button variant="ghost" onClick={() => navigate("/carrinho")} className="mb-4 text-muted-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" /> Voltar ao carrinho
      </Button>

      <h1 className="font-display text-2xl font-bold mb-6">Finalizar Compra</h1>

      <div className="space-y-6">
        {/* Order summary */}
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-lg">Resumo do Pedido</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.name} ({item.size}) x{item.quantity}
                </span>
                <span>R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}</span>
              </div>
            ))}
            <div className="border-t border-border pt-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Frete</span>
              <span className={shipping === 0 ? "text-green-500" : ""}>
                {shipping === 0 ? "Grátis" : `R$ ${shipping.toFixed(2).replace(".", ",")}`}
              </span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">R$ {total.toFixed(2).replace(".", ",")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Endereço
            </CardTitle>
            {address && !editAddress && (
              <Button variant="ghost" size="sm" onClick={() => setEditAddress(true)}>Alterar</Button>
            )}
          </CardHeader>
          <CardContent>
            {!editAddress && address ? (
              <p className="text-sm text-muted-foreground">
                {address.street}, {address.number}
                {address.complement ? ` - ${address.complement}` : ""}<br />
                {address.neighborhood} - {address.city}/{address.state}<br />
                CEP: {address.cep}
              </p>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">CEP</Label>
                    <Input value={addressForm.cep} onChange={(e) => setAddressForm({ ...addressForm, cep: e.target.value })} className="bg-secondary border-border h-9 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Estado</Label>
                    <Input value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="bg-secondary border-border h-9 text-sm" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Rua</Label>
                  <Input value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} className="bg-secondary border-border h-9 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Número</Label>
                    <Input value={addressForm.number} onChange={(e) => setAddressForm({ ...addressForm, number: e.target.value })} className="bg-secondary border-border h-9 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Complemento</Label>
                    <Input value={addressForm.complement} onChange={(e) => setAddressForm({ ...addressForm, complement: e.target.value })} className="bg-secondary border-border h-9 text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Bairro</Label>
                    <Input value={addressForm.neighborhood} onChange={(e) => setAddressForm({ ...addressForm, neighborhood: e.target.value })} className="bg-secondary border-border h-9 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Cidade</Label>
                    <Input value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="bg-secondary border-border h-9 text-sm" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment */}
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-lg">Pagamento</CardTitle></CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-md border border-border cursor-pointer hover:border-primary/50 transition-colors">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CreditCard className="h-4 w-4 text-primary" /> Cartão de Crédito
                </Label>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-md border border-border cursor-pointer hover:border-primary/50 transition-colors">
                <RadioGroupItem value="pix" id="pix" />
                <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer flex-1">
                  <QrCode className="h-4 w-4 text-primary" /> Pix
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Button
          size="lg"
          className="w-full gold-gradient text-primary-foreground font-bold hover:opacity-90"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "Processando..." : "Confirmar Pedido"}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPage;
