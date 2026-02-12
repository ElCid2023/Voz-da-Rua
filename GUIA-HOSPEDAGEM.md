# 🌐 Guia Completo de Hospedagem - Voz da Rua

Este guia apresenta várias opções para hospedar o site, desde soluções gratuitas na nuvem até configuração de servidor local.

## 🎯 Resumo das Opções

| Opção | Custo | Dificuldade | Tempo Setup | Recomendado Para |
|-------|-------|-------------|-------------|------------------|
| **GitHub Pages** | Gratuito | Fácil | 10 min | Projetos públicos |
| **Netlify** | Gratuito | Muito Fácil | 5 min | Deploy rápido |
| **Vercel** | Gratuito | Fácil | 5 min | Projetos modernos |
| **Firebase Hosting** | Gratuito | Médio | 15 min | Integração Google |
| **Servidor Local** | Gratuito | Médio | 20 min | Desenvolvimento/Teste |
| **VPS** | Pago | Difícil | 60 min | Produção profissional |

---

## 🚀 Opção 1: GitHub Pages (RECOMENDADO)

**✅ Vantagens:**
- Totalmente gratuito
- SSL automático
- Integração com Git
- URL personalizada disponível
- Backup automático

**❌ Desvantagens:**
- Repositório deve ser público
- Apenas sites estáticos

### Passo a Passo:

#### 1. Criar Conta no GitHub
1. Acesse [github.com](https://github.com)
2. Clique em "Sign up"
3. Crie sua conta gratuita

#### 2. Criar Repositório
1. Clique em "New repository"
2. Nome: `voz-da-rua`
3. Marque "Public"
4. Marque "Add a README file"
5. Clique "Create repository"

#### 3. Upload dos Arquivos
```bash
# Opção A: Via interface web
1. Clique em "uploading an existing file"
2. Arraste todos os arquivos do projeto
3. Commit changes

# Opção B: Via Git (se tiver instalado)
git clone https://github.com/SEU_USUARIO/voz-da-rua.git
cd voz-da-rua
# Copie todos os arquivos do projeto para esta pasta
git add .
git commit -m "Primeiro deploy do Voz da Rua"
git push origin main
```

#### 4. Ativar GitHub Pages
1. Vá em "Settings" do repositório
2. Scroll até "Pages"
3. Source: "Deploy from a branch"
4. Branch: "main"
5. Folder: "/ (root)"
6. Clique "Save"

#### 5. Acessar o Site
- URL será: `https://SEU_USUARIO.github.io/voz-da-rua`
- Aguarde 5-10 minutos para ativação

---

## ⚡ Opção 2: Netlify (MAIS FÁCIL)

**✅ Vantagens:**
- Deploy em segundos
- SSL automático
- Formulários funcionam
- Preview de branches
- Domínio personalizado gratuito

### Passo a Passo:

#### 1. Preparar Arquivos
1. Compacte todos os arquivos em um ZIP
2. Ou conecte com GitHub (recomendado)

#### 2. Deploy no Netlify
1. Acesse [netlify.com](https://netlify.com)
2. Clique "Sign up" (pode usar GitHub)
3. **Opção A - Drag & Drop:**
   - Arraste o ZIP para a área de deploy
   - Site fica online instantaneamente
4. **Opção B - GitHub:**
   - "New site from Git"
   - Conecte GitHub
   - Selecione repositório
   - Deploy automático

#### 3. Configurar Domínio
1. Site settings → Domain management
2. Clique "Add custom domain"
3. Use subdomínio gratuito: `voz-da-rua.netlify.app`

---

## 🔥 Opção 3: Vercel

**✅ Vantagens:**
- Deploy ultra-rápido
- Otimização automática
- Analytics gratuito
- Edge functions

### Passo a Passo:

#### 1. Deploy no Vercel
1. Acesse [vercel.com](https://vercel.com)
2. "Sign up" com GitHub
3. "New Project"
4. Selecione repositório
5. Deploy automático

#### 2. Configurações
- Framework: "Other"
- Build Command: (deixe vazio)
- Output Directory: (deixe vazio)
- Install Command: (deixe vazio)

---

## 🔧 Opção 4: Servidor Local

### A. Usando Python (Mais Simples)

```bash
# Python 3
cd /caminho/para/projeto
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Acesse: http://localhost:8000
```

### B. Usando Node.js

```bash
# Instalar http-server globalmente
npm install -g http-server

# No diretório do projeto
cd /caminho/para/projeto
http-server -p 8000

# Acesse: http://localhost:8000
```

### C. Usando PHP

```bash
# Se tiver PHP instalado
cd /caminho/para/projeto
php -S localhost:8000

# Acesse: http://localhost:8000
```

### D. Usando Live Server (VS Code)

1. Instale extensão "Live Server"
2. Clique direito em `index.html`
3. "Open with Live Server"
4. Abre automaticamente no navegador

---

## 🖥️ Opção 5: XAMPP/WAMP (Windows)

### XAMPP (Recomendado)

#### 1. Instalar XAMPP
1. Baixe em [apachefriends.org](https://www.apachefriends.org)
2. Instale (apenas Apache necessário)
3. Inicie Apache no painel

#### 2. Configurar Site
1. Copie arquivos para: `C:\xampp\htdocs\voz-da-rua\`
2. Acesse: `http://localhost/voz-da-rua`

#### 3. Configurar Virtual Host (Opcional)
```apache
# Edite: C:\xampp\apache\conf\extra\httpd-vhosts.conf
<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/voz-da-rua"
    ServerName vozdarua.local
</VirtualHost>

# Edite: C:\Windows\System32\drivers\etc\hosts
127.0.0.1 vozdarua.local

# Acesse: http://vozdarua.local
```

---

## 🐧 Opção 6: Linux (Apache/Nginx)

### Apache (Ubuntu/Debian)

```bash
# Instalar Apache
sudo apt update
sudo apt install apache2

# Copiar arquivos
sudo cp -r /caminho/projeto/* /var/www/html/

# Configurar permissões
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/

# Acessar: http://localhost
```

### Nginx

```bash
# Instalar Nginx
sudo apt install nginx

# Configurar site
sudo nano /etc/nginx/sites-available/vozdarua

# Conteúdo do arquivo:
server {
    listen 80;
    server_name localhost;
    root /var/www/vozdarua;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}

# Ativar site
sudo ln -s /etc/nginx/sites-available/vozdarua /etc/nginx/sites-enabled/
sudo systemctl reload nginx

# Copiar arquivos
sudo mkdir /var/www/vozdarua
sudo cp -r /caminho/projeto/* /var/www/vozdarua/
```

---

## 🌍 Configuração de Domínio Personalizado

### Domínio Gratuito
- **Freenom** (.tk, .ml, .ga, .cf)
- **No-IP** (subdomínio dinâmico)

### Domínio Pago (Recomendado)
- **Registro.br** (.com.br) - R$ 40/ano
- **Namecheap** (.com) - $10/ano
- **GoDaddy** (.com) - $15/ano

### Configurar DNS
```
# Para GitHub Pages
CNAME: www.seudominio.com → seu-usuario.github.io

# Para Netlify
CNAME: www.seudominio.com → seu-site.netlify.app

# Para Vercel
CNAME: www.seudominio.com → seu-projeto.vercel.app
```

---

## 📊 Comparação Detalhada

### GitHub Pages
```
✅ Gratuito para sempre
✅ SSL automático
✅ Integração Git
✅ Backup automático
❌ Apenas repositórios públicos
❌ Sem processamento server-side
```

### Netlify
```
✅ Deploy instantâneo
✅ Formulários funcionam
✅ Redirects e headers
✅ Preview de branches
❌ Limite de 100GB bandwidth/mês
❌ Limite de 300 minutos build/mês
```

### Vercel
```
✅ Performance excelente
✅ Analytics incluído
✅ Edge functions
✅ Otimização automática
❌ Limite de 100GB bandwidth/mês
❌ Foco em frameworks modernos
```

### Servidor Local
```
✅ Controle total
✅ Sem limites
✅ Desenvolvimento rápido
✅ Testes offline
❌ Não acessível externamente
❌ Requer configuração
```

---

## 🎯 Recomendação Final

### Para Teste/Desenvolvimento:
**Servidor Local** com Python ou Live Server

### Para Produção Simples:
**Netlify** - Deploy em 2 minutos

### Para Projeto Público:
**GitHub Pages** - Gratuito e confiável

### Para Máximo Controle:
**VPS** com Apache/Nginx

---

## 🚀 Deploy Rápido (5 minutos)

### Opção Mais Rápida - Netlify:
1. Acesse [netlify.com](https://netlify.com)
2. Arraste pasta do projeto
3. Site online instantaneamente!
4. URL: `https://random-name.netlify.app`

### Personalizar URL:
1. Site settings
2. Change site name
3. `voz-da-rua.netlify.app`

**Pronto! Seu site está online e acessível mundialmente!** 🌍✨

---

## 👨‍💻 Desenvolvedor

**💻 Criado por ProfBorges**
*Guia completo de hospedagem para o Voz da Rua*

---

**Voz da Rua** - Conectando cidadãos e administração pública! 🏘️
