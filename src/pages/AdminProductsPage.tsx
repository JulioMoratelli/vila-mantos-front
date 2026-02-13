import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ProductForm {
  name: string;
  team: string;
  description: string;
  price: string;
  original_price: string;
  image: string;
  category: string;
  is_featured: boolean;
  is_new: boolean;
  sizes: string;
  size_stock: Record<string, string>;
}

const emptyForm: ProductForm = {
  name: "",
  team: "",
  description: "",
  price: "",
  original_price: "",
  image: "",
  category: "brasileiro",
  is_featured: false,
  is_new: false,
  sizes: "P,M,G,GG",
  size_stock: { P: "10", M: "10", G: "10", GG: "10" },
};

interface DBProduct {
  id: string;
  name: string;
  team: string;
  description: string;
  price: number;
  original_price: number | null;
  image: string;
  category: string;
  is_featured: boolean | null;
  is_new: boolean | null;
  stock: number | null;
  sizes: string[] | null;
  created_at: string;
}

const AdminProductsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Erro ao carregar produtos");
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (p: DBProduct) => {
    const parsedSizeStock: Record<string, string> = {};
    const sizes = p.sizes ?? ["P", "M", "G", "GG"];
    const sizeStockData = (p as any).size_stock as Record<string, number> | null;
    sizes.forEach((s) => {
      parsedSizeStock[s] = String(sizeStockData?.[s] ?? p.stock ?? 0);
    });
    setForm({
      name: p.name,
      team: p.team,
      description: p.description,
      price: String(p.price),
      original_price: p.original_price ? String(p.original_price) : "",
      image: p.image,
      category: p.category,
      is_featured: p.is_featured ?? false,
      is_new: p.is_new ?? false,
      sizes: sizes.join(","),
      size_stock: parsedSizeStock,
    });
    setEditingId(p.id);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const sizesArray = form.sizes.split(",").map((s) => s.trim()).filter(Boolean);
    const sizeStockObj: Record<string, number> = {};
    sizesArray.forEach((s) => {
      sizeStockObj[s] = parseInt(form.size_stock[s]) || 0;
    });
    const totalStock = Object.values(sizeStockObj).reduce((a, b) => a + b, 0);

    const payload = {
      name: form.name,
      team: form.team,
      description: form.description,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      image: form.image,
      category: form.category,
      is_featured: form.is_featured,
      is_new: form.is_new,
      stock: totalStock,
      sizes: sizesArray,
      size_stock: sizeStockObj,
    };

    if (editingId) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingId);
      if (error) toast.error("Erro ao atualizar produto");
      else toast.success("Produto atualizado!");
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) toast.error("Erro ao cadastrar produto");
      else toast.success("Produto cadastrado!");
    }

    setSaving(false);
    setDialogOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error("Erro ao excluir produto");
    else {
      toast.success("Produto excluído!");
      fetchProducts();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container py-20 text-center text-muted-foreground">Carregando...</div>
    );
  }

  return (
    <div className="container py-8 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Package className="h-7 w-7 text-primary" />
            <h1 className="font-display text-3xl gold-text">Gerenciar Produtos</h1>
          </div>
          <Button onClick={openCreate} className="gold-gradient text-primary-foreground font-bold">
            <Plus className="h-4 w-4 mr-1" /> Novo Produto
          </Button>
        </div>

        {products.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-16 text-center text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Nenhum produto cadastrado ainda.</p>
              <Button onClick={openCreate} variant="outline" className="mt-4">
                Cadastrar primeiro produto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {products.map((p) => (
              <Card key={p.id} className="bg-card border-border">
                <CardContent className="flex items-center gap-4 py-4">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded-md border border-border" />
                  ) : (
                    <div className="w-16 h-16 bg-secondary rounded-md flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{p.name}</h3>
                    <p className="text-sm text-muted-foreground">{p.team} · {p.category}</p>
                    <p className="text-sm font-bold text-primary">R$ {Number(p.price).toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" onClick={() => openEdit(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="text-destructive" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display gold-text">
              {editingId ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team">Time</Label>
                <Input id="team" name="team" value={form.team} onChange={handleChange} required className="bg-secondary border-border" placeholder="Ex: Santos" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" value={form.description} onChange={handleChange} className="bg-secondary border-border" rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input id="price" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required className="bg-secondary border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="original_price">Preço Original (opcional)</Label>
                <Input id="original_price" name="original_price" type="number" step="0.01" value={form.original_price} onChange={handleChange} className="bg-secondary border-border" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL da Imagem</Label>
              <Input id="image" name="image" value={form.image} onChange={handleChange} className="bg-secondary border-border" placeholder="https://..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brasileiro">Brasileiro</SelectItem>
                  <SelectItem value="europeu">Europeu</SelectItem>
                  <SelectItem value="frances">Francês</SelectItem>
                  <SelectItem value="selecoes">Seleções</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sizes">Tamanhos (separados por vírgula)</Label>
              <Input
                id="sizes"
                name="sizes"
                value={form.sizes}
                onChange={(e) => {
                  const newSizes = e.target.value;
                  const sizesArr = newSizes.split(",").map((s) => s.trim()).filter(Boolean);
                  const newSizeStock = { ...form.size_stock };
                  sizesArr.forEach((s) => {
                    if (!(s in newSizeStock)) newSizeStock[s] = "0";
                  });
                  setForm({ ...form, sizes: newSizes, size_stock: newSizeStock });
                }}
                className="bg-secondary border-border"
                placeholder="P,M,G,GG"
              />
            </div>

            <div className="space-y-2">
              <Label>Estoque por Tamanho</Label>
              <div className="grid grid-cols-4 gap-2">
                {form.sizes.split(",").map((s) => s.trim()).filter(Boolean).map((size) => (
                  <div key={size} className="space-y-1">
                    <Label className="text-xs text-muted-foreground">{size}</Label>
                    <Input
                      type="number"
                      min="0"
                      value={form.size_stock[size] ?? "0"}
                      onChange={(e) =>
                        setForm({ ...form, size_stock: { ...form.size_stock, [size]: e.target.value } })
                      }
                      className="bg-secondary border-border"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_featured} onCheckedChange={(v) => setForm({ ...form, is_featured: v })} />
                <Label>Destaque</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_new} onCheckedChange={(v) => setForm({ ...form, is_new: v })} />
                <Label>Novidade</Label>
              </div>
            </div>

            <Button type="submit" disabled={saving} className="w-full gold-gradient text-primary-foreground font-bold">
              {saving ? "Salvando..." : editingId ? "Salvar Alterações" : "Cadastrar Produto"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProductsPage;
