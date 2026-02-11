import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({ full_name: "", cpf: "", phone: "" });
  const [address, setAddress] = useState({
    id: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [profileRes, addressRes, ordersRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("addresses").select("*").eq("user_id", user.id).eq("is_default", true).maybeSingle(),
        supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);

      if (profileRes.data) {
        setProfile({
          full_name: profileRes.data.full_name || "",
          cpf: profileRes.data.cpf || "",
          phone: profileRes.data.phone || "",
        });
      }

      if (addressRes.data) {
        setAddress({
          id: addressRes.data.id,
          cep: addressRes.data.cep || "",
          street: addressRes.data.street || "",
          number: addressRes.data.number || "",
          complement: addressRes.data.complement || "",
          neighborhood: addressRes.data.neighborhood || "",
          city: addressRes.data.city || "",
          state: addressRes.data.state || "",
        });
      }

      if (ordersRes.data) {
        setOrders(ordersRes.data);
      }
    };

    fetchData();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update(profile)
      .eq("user_id", user.id);
    if (error) toast.error("Erro ao salvar perfil");
    else toast.success("Perfil atualizado!");
    setSaving(false);
  };

  const saveAddress = async () => {
    if (!user) return;
    setSaving(true);
    if (address.id) {
      const { error } = await supabase
        .from("addresses")
        .update({
          cep: address.cep,
          street: address.street,
          number: address.number,
          complement: address.complement,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
        })
        .eq("id", address.id);
      if (error) toast.error("Erro ao salvar endereço");
      else toast.success("Endereço atualizado!");
    } else {
      const { data, error } = await supabase
        .from("addresses")
        .insert({
          user_id: user.id,
          cep: address.cep,
          street: address.street,
          number: address.number,
          complement: address.complement,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
          is_default: true,
        })
        .select()
        .single();
      if (error) toast.error("Erro ao salvar endereço");
      else {
        toast.success("Endereço salvo!");
        if (data) setAddress({ ...address, id: data.id });
      }
    }
    setSaving(false);
  };

  if (authLoading) return <div className="container py-16 text-center text-muted-foreground">Carregando...</div>;

  return (
    <div className="container py-6 max-w-2xl">
      <h1 className="font-display text-2xl font-bold mb-6">Meu Perfil</h1>

      <Tabs defaultValue="dados">
        <TabsList className="w-full bg-secondary">
          <TabsTrigger value="dados" className="flex-1">Dados</TabsTrigger>
          <TabsTrigger value="endereco" className="flex-1">Endereço</TabsTrigger>
          <TabsTrigger value="pedidos" className="flex-1">Pedidos</TabsTrigger>
        </TabsList>

        <TabsContent value="dados">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-lg">Dados Pessoais</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome completo</Label>
                <Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label>CPF</Label>
                <Input value={profile.cpf} onChange={(e) => setProfile({ ...profile, cpf: e.target.value })} className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email || ""} disabled className="bg-secondary border-border opacity-60" />
              </div>
              <Button onClick={saveProfile} disabled={saving} className="gold-gradient text-primary-foreground font-bold">
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endereco">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-lg">Endereço de Entrega</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CEP</Label>
                  <Input value={address.cep} onChange={(e) => setAddress({ ...address, cep: e.target.value })} className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="bg-secondary border-border" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Rua</Label>
                <Input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="bg-secondary border-border" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Número</Label>
                  <Input value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Complemento</Label>
                  <Input value={address.complement} onChange={(e) => setAddress({ ...address, complement: e.target.value })} className="bg-secondary border-border" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bairro</Label>
                  <Input value={address.neighborhood} onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })} className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="bg-secondary border-border" />
                </div>
              </div>
              <Button onClick={saveAddress} disabled={saving} className="gold-gradient text-primary-foreground font-bold">
                {saving ? "Salvando..." : "Salvar Endereço"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pedidos">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-lg">Histórico de Pedidos</CardTitle></CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Nenhum pedido realizado ainda.</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="p-4 rounded-md border border-border space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm">Pedido #{order.order_number}</span>
                        <span className="text-xs text-primary capitalize">{order.status}</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{new Date(order.created_at).toLocaleDateString("pt-BR")}</span>
                        <span className="font-bold text-foreground">R$ {Number(order.total).toFixed(2).replace(".", ",")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
