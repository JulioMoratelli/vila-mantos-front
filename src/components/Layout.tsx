import Header from "./Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-8 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p className="font-display text-lg gold-text mb-2">FutShop</p>
          <p>© 2024 FutShop. Todos os direitos reservados.</p>
          <p className="mt-1">Camisas de futebol com qualidade premium.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
