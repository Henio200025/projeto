# 🤝 Uma Mãozinha - Frontend Angular

Plataforma de conexão entre clientes e freelancers para serviços diversos.

## 📋 Sobre o Projeto

Sistema web que permite:
- **Clientes**: Solicitar serviços, receber orçamentos e acompanhar trabalhos
- **Freelancers**: Oferecer serviços, enviar orçamentos e gerenciar trabalhos

## 🛠️ Tecnologias

- **Angular 18** (standalone components)
- **TypeScript**
- **TailwindCSS**
- **RxJS**
- **shadcn/ui** (componentes UI)

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Entrar na pasta do frontend
cd frontend-angular

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm start
```

O aplicativo estará disponível em `http://localhost:4200`

### Usuários de Teste (Mock)

**Cliente:**
- Email: `client@test`
- Senha: `test123`

**Freelancer:**
- Email: `freelancer@test`
- Senha: `test123`

## 📁 Estrutura do Projeto

```
frontend-angular/
├── src/
│   ├── app/
│   │   ├── components/       # Componentes reutilizáveis
│   │   │   ├── navbar/
│   │   │   ├── footer/
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── pages/           # Páginas da aplicação
│   │   │   ├── home/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── profile/
│   │   │   ├── browse-services/
│   │   │   ├── my-requests/    # Pedidos do cliente
│   │   │   └── my-jobs/        # Trabalhos do freelancer
│   │   ├── services/        # Serviços Angular
│   │   │   ├── auth.service.ts
│   │   │   ├── mock-api.service.ts
│   │   │   └── service-request-management.service.ts
│   │   └── models/          # Interfaces TypeScript
│   └── styles.css
└── tailwind.config.js
```

## 🔑 Funcionalidades Principais

### Fluxo do Cliente
1. Cadastro/Login
2. Buscar serviços por categoria
3. Solicitar orçamento para um serviço
4. Receber orçamento do freelancer
5. Aceitar ou rejeitar orçamento
6. Acompanhar progresso do trabalho
7. Avaliar trabalho concluído

### Fluxo do Freelancer
1. Cadastro/Login
2. Criar e gerenciar serviços
3. Receber solicitações de orçamento
4. Enviar orçamento com valor e prazo
5. Receber telefone do cliente após aceitação
6. Iniciar e concluir trabalhos

## 📱 Páginas

- `/` - Home (busca e categorias)
- `/login` - Login
- `/register` - Cadastro
- `/profile` - Perfil do usuário
- `/browse-services` - Explorar serviços
- `/my-requests` - Meus pedidos (cliente)
- `/my-jobs` - Meus trabalhos (freelancer)

## 🔐 Autenticação

- Sistema JWT com Bearer token
- Guards de rota por role (USER/FREELANCER)
- Interceptor HTTP automático
- Persistência em localStorage

## 🎨 UI/UX

- Design responsivo (mobile-first)
- Componentes shadcn/ui
- TailwindCSS para estilização
- Máscaras de input (telefone)
- Feedback visual (loading, erros, sucesso)

## 🔌 Integração Backend

O frontend está preparado para integração com backend Java Spring Boot.

**Ver:** `GUIA_INTEGRACAO_BACKEND.md` para instruções completas de integração.

### Status da Integração

✅ DTOs TypeScript alinhados com Java  
✅ Enums padronizados  
✅ MockApiService funcional  
⏳ BackendApiService (implementar quando backend estiver disponível)  
⏳ Configuração de environment  

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm start

# Build produção
npm run build

# Testes
npm test

# Linting
npm run lint
```

## 🐛 Debug

- Console do navegador (F12)
- Angular DevTools (extensão Chrome)
- Logs dos services no console

## 📄 Documentação Adicional

- **GUIA_INTEGRACAO_BACKEND.md** - Guia completo para integração com backend Java Spring Boot

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📞 Contato

- **Backend Repository**: https://github.com/ProgGusta/app-uma-maozinha-backend

---

**Última atualização:** Dezembro 2025
