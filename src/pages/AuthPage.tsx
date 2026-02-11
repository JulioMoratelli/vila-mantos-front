import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

type AuthMode = "login" | "register" | "reset";

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    cpf: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(form.email, form.password);
        if (error) throw error;
        toast.success("Login realizado com sucesso!");
        navigate("/");
      } else if (mode === "register") {
        const { error } = await signUp(form.email, form.password, {
          full_name: form.fullName,
        });
        if (error) throw error;

        toast.success("Conta criada! Verifique seu email para confirmar.");
      } else {
        const { error } = await resetPassword(form.email);
        if (error) throw error;
        toast.success("Email de recuperação enviado!");
      }
    } catch (err: any) {
      toast.error(err.message || "Ocorreu um erro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="bg-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl gold-text">
              {mode === "login" ? "Entrar" : mode === "register" ? "Criar Conta" : "Recuperar Senha"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Acesse sua conta FutShop"
                : mode === "register"
                ? "Crie sua conta e comece a comprar"
                : "Enviaremos um link de recuperação"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome completo</Label>
                    <Input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} required className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" name="cpf" value={form.cpf} onChange={handleChange} placeholder="000.000.000-00" required className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="(00) 00000-0000" required className="bg-secondary border-border" />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="bg-secondary border-border" />
              </div>
              {mode !== "reset" && (
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} className="bg-secondary border-border" />
                </div>
              )}
              <Button type="submit" disabled={loading} className="w-full gold-gradient text-primary-foreground font-bold">
                {loading
                  ? "Carregando..."
                  : mode === "login"
                  ? "Entrar"
                  : mode === "register"
                  ? "Criar Conta"
                  : "Enviar Email"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm space-y-2">
              {mode === "login" && (
                <>
                  <button onClick={() => setMode("reset")} className="text-primary hover:underline block mx-auto">
                    Esqueceu a senha?
                  </button>
                  <p className="text-muted-foreground">
                    Não tem conta?{" "}
                    <button onClick={() => setMode("register")} className="text-primary hover:underline">
                      Criar conta
                    </button>
                  </p>
                </>
              )}
              {mode === "register" && (
                <p className="text-muted-foreground">
                  Já tem conta?{" "}
                  <button onClick={() => setMode("login")} className="text-primary hover:underline">
                    Entrar
                  </button>
                </p>
              )}
              {mode === "reset" && (
                <button onClick={() => setMode("login")} className="text-primary hover:underline">
                  Voltar ao login
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthPage;
