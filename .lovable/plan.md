

# ⚽ FutShop — E-commerce de Camisas de Futebol

Loja virtual completa com visual **preto e dourado**, design premium e responsivo (mobile-first), usando **Lovable Cloud** para backend real.

---

## 🎨 Identidade Visual
- **Fundo escuro** (preto/cinza escuro) com **destaques dourados**
- Tipografia moderna e bold
- Cards com bordas sutis douradas
- Botões dourados com hover elegante
- Visual premium inspirado em lojas esportivas de alta qualidade

---

## 📄 Páginas e Funcionalidades

### 1. Autenticação
- **Cadastro** com nome completo, CPF, email, telefone e senha
- **Login** com email e senha
- **Recuperação de senha** via email
- Sessão persistente após login
- Perfil salvo automaticamente no banco (tabela `profiles`)

### 2. Perfil do Usuário
- Edição de dados pessoais (nome, CPF, telefone)
- Cadastro e edição de endereço de entrega (CEP, rua, número, complemento, bairro, cidade, estado)
- Histórico de pedidos com status e detalhes

### 3. Página Inicial (Home)
- Banner hero promocional com chamada atrativa
- Seção de camisas em destaque
- Filtros por time, tamanho e faixa de preço
- Barra de busca por nome do time
- Badges de "Promoção" e "Últimas unidades"

### 4. Página de Produto
- Nome do time e descrição detalhada
- Galeria de imagens (foto principal + miniaturas)
- Preço com destaque para promoções
- Seletor de tamanho obrigatório (P, M, G, GG)
- Seletor de quantidade
- Botão "Adicionar ao carrinho" (bloqueado sem tamanho selecionado)
- Informações de frete simuladas
- Avaliações por estrelas (mockadas)
- Indicador de estoque ("Últimas unidades!")

### 5. Carrinho de Compras
- Lista de itens com foto, nome, tamanho, quantidade, preço unitário e subtotal
- Alterar tamanho e quantidade de itens já adicionados
- Remover itens
- Total atualizado automaticamente
- Botão "Finalizar compra"
- Estado global do carrinho (React Context)

### 6. Checkout
- Resumo completo do pedido
- Endereço de entrega (com opção de alterar)
- Forma de pagamento simulada (Cartão ou Pix)
- Botão "Confirmar pedido"
- Geração de número do pedido
- Tela de sucesso com confirmação

---

## 🗄️ Backend (Lovable Cloud / Supabase)

- **Tabela `profiles`**: dados pessoais vinculados ao auth.users
- **Tabela `addresses`**: endereços de entrega por usuário
- **Tabela `orders`**: pedidos com status, total e método de pagamento
- **Tabela `order_items`**: itens de cada pedido
- **Produtos**: dados mockados no frontend inicialmente (preparado para migrar para banco)
- **RLS** em todas as tabelas (usuário acessa apenas seus dados)
- **Trigger** para criar perfil automaticamente no cadastro

---

## ✨ Diferenciais
- Badges visuais de "Promoção" e "Últimas unidades"
- Controle de estoque simulado
- Avaliações por estrelas (visual)
- Animações suaves e transições elegantes
- Layout 100% responsivo

