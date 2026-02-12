# 🖥️ Configuração de Servidor Local - Meu Bairro Alerta

Guia completo para configurar um servidor local para desenvolvimento e testes.

## 🎯 Opções Disponíveis

| Método | Dificuldade | Tempo | Melhor Para |
|--------|-------------|-------|-------------|
| **Python** | Muito Fácil | 1 min | Teste rápido |
| **Node.js** | Fácil | 2 min | Desenvolvimento |
| **Live Server** | Muito Fácil | 30 seg | VS Code |
| **XAMPP** | Médio | 10 min | Ambiente completo |
| **Apache/Nginx** | Difícil | 30 min | Produção local |

---

## 🐍 Método 1: Python (RECOMENDADO)

### ✅ Vantagens:
- Python já vem instalado no Windows 10/11
- Comando simples
- Funciona imediatamente

### Passo a Passo:

#### 1. Verificar se Python está instalado
```bash
# Abra o Prompt de Comando (cmd) ou PowerShell
python --version
# ou
python3 --version
```

#### 2. Navegar até a pasta do projeto
```bash
# Exemplo: se o projeto está em C:\Users\Professor\Documents\Site3
cd C:\Users\Professor\Documents\Site3
```

#### 3. Iniciar servidor
```bash
# Python 3 (mais comum)
python -m http.server 8000

# Python 2 (se necessário)
python -m SimpleHTTPServer 8000
```

#### 4. Acessar o site
- Abra o navegador
- Vá para: `http://localhost:8000`
- Ou: `http://127.0.0.1:8000`

#### 5. Parar o servidor
- Pressione `Ctrl + C` no terminal

---

## 🟢 Método 2: Node.js

### ✅ Vantagens:
- Servidor mais robusto
- Muitas opções de configuração
- Hot reload disponível

### Passo a Passo:

#### 1. Instalar Node.js
1. Baixe em [nodejs.org](https://nodejs.org)
2. Instale a versão LTS
3. Reinicie o computador

#### 2. Instalar http-server
```bash
# Instalar globalmente
npm install -g http-server
```

#### 3. Navegar e iniciar
```bash
cd C:\Users\Professor\Documents\Site3
http-server -p 8000
```

#### 4. Opções avançadas
```bash
# Com hot reload
http-server -p 8000 --cors

# Abrir automaticamente no navegador
http-server -p 8000 -o

# Especificar pasta
http-server ./meu-projeto -p 8000
```

---

## 💻 Método 3: Live Server (VS Code)

### ✅ Vantagens:
- Mais fácil de todos
- Hot reload automático
- Integrado ao VS Code

### Passo a Passo:

#### 1. Instalar VS Code
- Baixe em [code.visualstudio.com](https://code.visualstudio.com)

#### 2. Instalar extensão Live Server
1. Abra VS Code
2. Vá em Extensions (Ctrl+Shift+X)
3. Procure "Live Server"
4. Instale a extensão do Ritwick Dey

#### 3. Usar Live Server
1. Abra a pasta do projeto no VS Code
2. Clique direito em `index.html`
3. Selecione "Open with Live Server"
4. Site abre automaticamente no navegador

#### 4. Configurações opcionais
```json
// settings.json do VS Code
{
    "liveServer.settings.port": 8000,
    "liveServer.settings.root": "/",
    "liveServer.settings.CustomBrowser": "chrome"
}
```

---

## 🔧 Método 4: XAMPP (Windows)

### ✅ Vantagens:
- Ambiente completo (Apache + MySQL + PHP)
- Interface gráfica
- Configuração de virtual hosts

### Passo a Passo:

#### 1. Baixar e Instalar XAMPP
1. Acesse [apachefriends.org](https://www.apachefriends.org)
2. Baixe a versão para Windows
3. Execute como administrador
4. Instale em `C:\xampp`

#### 2. Configurar o projeto
1. Copie todos os arquivos do projeto
2. Cole em: `C:\xampp\htdocs\meu-bairro-alerta\`

#### 3. Iniciar Apache
1. Abra XAMPP Control Panel
2. Clique "Start" ao lado de Apache
3. Aguarde ficar verde

#### 4. Acessar o site
- URL: `http://localhost/meu-bairro-alerta`

#### 5. Configurar Virtual Host (Opcional)
```apache
# Edite: C:\xampp\apache\conf\extra\httpd-vhosts.conf
<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/meu-bairro-alerta"
    ServerName meubairro.local
    <Directory "C:/xampp/htdocs/meu-bairro-alerta">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

```
# Edite: C:\Windows\System32\drivers\etc\hosts
# (Execute Notepad como administrador)
127.0.0.1 meubairro.local
```

Acesse: `http://meubairro.local`

---

## 🐧 Método 5: Apache/Nginx (Linux)

### Ubuntu/Debian - Apache

#### 1. Instalar Apache
```bash
sudo apt update
sudo apt install apache2
```

#### 2. Configurar site
```bash
# Criar diretório
sudo mkdir /var/www/meubairro

# Copiar arquivos
sudo cp -r /caminho/do/projeto/* /var/www/meubairro/

# Configurar permissões
sudo chown -R www-data:www-data /var/www/meubairro/
sudo chmod -R 755 /var/www/meubairro/
```

#### 3. Configurar Virtual Host
```apache
# Criar: /etc/apache2/sites-available/meubairro.conf
<VirtualHost *:80>
    ServerName localhost
    DocumentRoot /var/www/meubairro
    
    <Directory /var/www/meubairro>
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/meubairro_error.log
    CustomLog ${APACHE_LOG_DIR}/meubairro_access.log combined
</VirtualHost>
```

#### 4. Ativar site
```bash
sudo a2ensite meubairro.conf
sudo systemctl reload apache2
```

### Ubuntu/Debian - Nginx

#### 1. Instalar Nginx
```bash
sudo apt install nginx
```

#### 2. Configurar site
```nginx
# Criar: /etc/nginx/sites-available/meubairro
server {
    listen 80;
    server_name localhost;
    root /var/www/meubairro;
    index index.html index.htm;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Cache para arquivos estáticos
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 3. Ativar site
```bash
sudo ln -s /etc/nginx/sites-available/meubairro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔧 Configurações Avançadas

### Configurar HTTPS Local

#### 1. Gerar certificado SSL
```bash
# Usando mkcert (recomendado)
# Instalar mkcert primeiro
mkcert -install
mkcert localhost 127.0.0.1 ::1

# Ou usando OpenSSL
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

#### 2. Configurar servidor com SSL
```bash
# Node.js com HTTPS
npm install -g http-server
http-server -S -C cert.pem -K key.pem -p 8443
```

### Configurar Proxy Reverso

#### Nginx como proxy
```nginx
server {
    listen 80;
    server_name meubairro.local;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🚀 Scripts de Automação

### Windows Batch Script
```batch
@echo off
echo Iniciando Meu Bairro Alerta...
cd /d "C:\Users\Professor\Documents\Site3"
echo Servidor iniciado em http://localhost:8000
python -m http.server 8000
pause
```

### PowerShell Script
```powershell
# start-server.ps1
Set-Location "C:\Users\Professor\Documents\Site3"
Write-Host "Iniciando servidor local..." -ForegroundColor Green
Write-Host "Acesse: http://localhost:8000" -ForegroundColor Yellow
Start-Process "http://localhost:8000"
python -m http.server 8000
```

### Linux/Mac Script
```bash
#!/bin/bash
# start-server.sh
cd /caminho/para/projeto
echo "Servidor iniciado em http://localhost:8000"
open http://localhost:8000  # Mac
# xdg-open http://localhost:8000  # Linux
python3 -m http.server 8000
```

---

## 🔍 Solução de Problemas

### Porta já está em uso
```bash
# Verificar o que está usando a porta
netstat -ano | findstr :8000

# Usar porta diferente
python -m http.server 8080
```

### Python não encontrado
```bash
# Windows - instalar Python
# Baixe em python.org
# Marque "Add to PATH" durante instalação

# Verificar instalação
where python
```

### Permissões negadas (Linux)
```bash
# Dar permissões corretas
sudo chown -R $USER:$USER /caminho/projeto
chmod -R 755 /caminho/projeto
```

### Firewall bloqueando
```bash
# Windows - permitir Python no firewall
# Painel de Controle → Firewall → Permitir app

# Linux - abrir porta
sudo ufw allow 8000
```

---

## 📊 Comparação de Performance

| Método | Velocidade | Recursos | Configuração |
|--------|------------|----------|--------------|
| Python | Médio | Baixo | Mínima |
| Node.js | Rápido | Médio | Simples |
| Apache | Rápido | Alto | Complexa |
| Nginx | Muito Rápido | Baixo | Média |

---

## 🎯 Recomendação Final

### Para Desenvolvimento Rápido:
**Live Server (VS Code)** - Mais prático

### Para Testes Simples:
**Python HTTP Server** - Mais universal

### Para Ambiente Completo:
**XAMPP** - Mais recursos

### Para Produção Local:
**Nginx** - Mais performance

---

## 🚀 Início Rápido (30 segundos)

```bash
# 1. Abra terminal na pasta do projeto
cd C:\Users\Professor\Documents\Site3

# 2. Execute um comando:
python -m http.server 8000

# 3. Abra navegador:
http://localhost:8000

# Pronto! 🎉
```

---

## 👨‍💻 Desenvolvedor

**💻 Criado por ProfBorges**
*Guia completo de configuração de servidor local*

---

**Meu Bairro Alerta** - Conectando cidadãos e administração pública! 🏘️
