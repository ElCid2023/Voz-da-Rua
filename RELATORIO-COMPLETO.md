# 📋 Relatório Completo do Projeto Voz da Rua

## 📌 Informações do Projeto

**Nome:** Voz da Rua - Portal de Reclamações  
**Desenvolvedor:** ElCid2023  
**Repositório GitHub:** https://github.com/ElCid2023/Voz-da-Rua  
**Site Online:** https://elcid2023.github.io/Voz-da-Rua/  
**Data:** Janeiro 2025

---

## 🎯 Objetivo do Projeto

Sistema web para cidadãos registrarem reclamações sobre problemas urbanos em seus bairros, com:
- Sistema de autenticação (login/cadastro)
- Cadastro de reclamações com localização por CEP
- Visualização de reclamações em lista
- Mapa interativo mostrando localização das reclamações
- Painel administrativo

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização e responsividade mobile
- **JavaScript (ES6+)** - Lógica e interatividade

### Bibliotecas Externas
- **Font Awesome 6.0.0** - Ícones
- **Leaflet 1.9.4** - Mapas interativos
- **Leaflet MarkerCluster 1.4.1** - Agrupamento de marcadores
- **EmailJS 4.0** - Sistema de notificações por email

### APIs Utilizadas
- **ViaCEP** - Busca de endereços por CEP
- **OpenStreetMap** - Tiles do mapa
- **Nominatim** - Geocodificação (desabilitado por CORS)

### Armazenamento
- **LocalStorage** - Persistência de dados no navegador

### Hospedagem
- **GitHub** - Controle de versão
- **GitHub Pages** - Hospedagem gratuita

---

## 📂 Estrutura de Arquivos

```
Site3/
├── css/
│   ├── admin.css          # Estilos do painel admin
│   ├── style.css          # Estilos principais
│   └── tutorial.css       # Estilos dos tutoriais
├── js/
│   ├── admin.js           # Lógica administrativa
│   ├── app.js             # Lógica principal
│   ├── app-fixed.js       # Versão corrigida
│   ├── map.js             # Funções do mapa
│   ├── map-fixed.js       # Mapa corrigido
│   ├── mobile-simple.js   # Otimizações mobile
│   ├── notifications.js   # Sistema de notificações
│   └── tutorial.js        # Tutoriais interativos
├── index.html             # Página principal
├── admin.html             # Painel administrativo
├── favicon.svg            # Ícone do site
├── logo.svg               # Logo do projeto
├── README.md              # Documentação principal
├── README-ADMIN.md        # Documentação admin
├── README-GITHUB.md       # Guia GitHub
├── .gitignore             # Arquivos ignorados pelo Git
└── [outros arquivos de teste e documentação]
```

---

## 🔧 Comandos Git Utilizados

### Configuração Inicial
```bash
# Configurar identidade
git config --global user.name "ElCid2023"
git config --global user.email "profborges2016@gmail.com"

# Adicionar diretório como seguro
git config --global --add safe.directory "E:/Criações em IA/Site3"
```

### Inicialização do Repositório
```bash
# Inicializar repositório local
git init

# Adicionar todos os arquivos
git add .

# Primeiro commit
git commit -m "Primeiro commit: Sistema Voz da Rua completo"

# Renomear branch para main
git branch -M main

# Conectar ao GitHub
git remote add origin https://github.com/ElCid2023/Voz-da-Rua.git

# Enviar para GitHub
git push -u origin main
```

### Atualizações Subsequentes
```bash
# Adicionar mudanças
git add .

# Criar commit com descrição
git commit -m "Descrição da mudança"

# Enviar para GitHub
git push
```

### Commits Realizados
1. `Primeiro commit: Sistema Voz da Rua completo`
2. `Corrigido: Verificação de autenticação na nova reclamação`
3. `Corrigido: Preenchimento automático de CEP`
4. `Corrigido: Navegação do menu e visualização de reclamações`
5. `Adicionado: Mapa interativo para visualizar reclamações`
6. `Corrigido: CSS e estrutura do mapa`
7. `Corrigido: CORS no mapa - usando coordenadas conhecidas`

---

## 💻 Funcionalidades Implementadas

### 1. Sistema de Autenticação

#### Cadastro de Usuário
```javascript
function doCadastro() {
    // Coleta dados do formulário
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // ... outros campos
    
    // Validações
    if (!nome || !email || !password) {
        alert('Preencha todos os campos!');
        return;
    }
    
    // Salvar no localStorage
    usuarios.push({
        id: Date.now().toString(),
        nome, email, password,
        telefone, endereco, bairro, cidade
    });
    localStorage.setItem('users', JSON.stringify(usuarios));
}
```

#### Login
```javascript
function doLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = usuarios.find(u => 
        u.email === email && u.password === password
    );
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateHomeButtons();
        showSection('home');
    }
}
```

#### Logout
```javascript
function doLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateHomeButtons();
    showSection('home');
}
```

### 2. Sistema de Reclamações

#### Busca Automática de CEP
```javascript
async function buscarCEP(cep) {
    const cepLimpo = cep.replace(/\D/g, '');
    const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
    );
    const data = await response.json();
    
    if (!data.erro) {
        document.getElementById('rua').value = data.logradouro;
        document.getElementById('bairro').value = data.bairro;
        document.getElementById('cidade').value = data.localidade;
    }
}
```

#### Cadastro de Reclamação
```javascript
function doReclamacao() {
    // Validar autenticação
    if (!currentUser) {
        alert('Faça login primeiro!');
        return;
    }
    
    // Coletar dados
    const titulo = document.getElementById('titulo').value;
    const categoria = document.getElementById('categoria').value;
    // ... outros campos
    
    // Buscar coordenadas
    const coordenadas = coordenadasConhecidas[cepLimpo] || 
                        [-23.5505, -46.6333];
    
    // Salvar
    reclamacoes.push({
        id: Date.now().toString(),
        titulo, categoria, descricao,
        cep, rua, numero, bairro, cidade,
        coordenadas,
        usuario: currentUser.nome,
        data: new Date().toLocaleDateString('pt-BR')
    });
    
    localStorage.setItem('reclamacoes', JSON.stringify(reclamacoes));
}
```

### 3. Mapa Interativo

#### Inicialização do Mapa
```javascript
function inicializarMapa() {
    // Criar mapa centrado em São Paulo
    mapaObj = L.map('map').setView([-23.5505, -46.6333], 12);
    
    // Adicionar camada OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(mapaObj);
    
    // Criar camada de marcadores
    markersLayer = L.layerGroup().addTo(mapaObj);
    
    carregarMarcadores();
}
```

#### Carregar Marcadores
```javascript
async function carregarMarcadores() {
    markersLayer.clearLayers();
    
    const reclamacoes = JSON.parse(
        localStorage.getItem('reclamacoes') || '[]'
    );
    
    for (const rec of reclamacoes) {
        if (rec.coordenadas) {
            const [lat, lon] = rec.coordenadas;
            const cor = obterCorCategoria(rec.categoria);
            
            const marker = L.circleMarker([lat, lon], {
                radius: 8,
                fillColor: cor,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            });
            
            marker.bindPopup(`
                <h3>${rec.titulo}</h3>
                <p><strong>Categoria:</strong> ${rec.categoria}</p>
                <p>${rec.descricao}</p>
            `);
            
            marker.addTo(markersLayer);
        }
    }
}
```

#### Cores por Categoria
```javascript
function obterCorCategoria(categoria) {
    const cores = {
        'iluminacao': '#FFA500',  // Laranja
        'asfalto': '#8B4513',     // Marrom
        'limpeza': '#32CD32',     // Verde
        'seguranca': '#DC143C',   // Vermelho
        'transporte': '#4169E1',  // Azul
        'agua': '#1E90FF',        // Azul claro
        'outros': '#808080'       // Cinza
    };
    return cores[categoria] || '#808080';
}
```

### 4. Navegação entre Seções

```javascript
function showSection(sectionId) {
    // Remover active de todas as seções
    document.querySelectorAll('.section').forEach(s => 
        s.classList.remove('active')
    );
    
    // Ativar seção selecionada
    document.getElementById(sectionId).classList.add('active');
    
    // Verificar autenticação para nova reclamação
    if (sectionId === 'nova-reclamacao') {
        const authRequired = document.getElementById('authRequired');
        const reclamacaoForm = document.getElementById('reclamacaoForm');
        
        if (currentUser) {
            authRequired.classList.add('hidden');
            reclamacaoForm.classList.remove('hidden');
        } else {
            authRequired.classList.remove('hidden');
            reclamacaoForm.classList.add('hidden');
        }
    }
    
    // Carregar reclamações
    if (sectionId === 'reclamacoes') {
        carregarReclamacoes();
    }
    
    // Inicializar mapa
    if (sectionId === 'mapa') {
        setTimeout(() => inicializarMapa(), 300);
    }
}
```

---

## 🎨 Estilos CSS Principais

### Responsividade Mobile
```css
@media (max-width: 768px) {
    body {
        font-size: 14px;
        background: #f0f2f5;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        font-size: 16px !important; /* Evita zoom no iOS */
        min-height: 50px;
    }
    
    .btn {
        width: 100%;
        padding: 16px;
        min-height: 52px;
    }
}
```

### Seções Ativas
```css
.section {
    display: none;
}

.section.active {
    display: block;
}

.hidden {
    display: none !important;
}
```

### Mapa
```css
#map {
    width: 100%;
    height: 500px;
    border-radius: 8px;
    margin-top: 20px;
    z-index: 1;
}
```

---

## 🗄️ Estrutura de Dados

### Usuário
```javascript
{
    id: "1234567890",
    nome: "João Silva",
    email: "joao@email.com",
    password: "123456",
    telefone: "(11) 99999-9999",
    endereco: "Rua das Flores, 123",
    bairro: "Centro",
    cidade: "São Paulo",
    dataCadastro: "2025-01-06T12:00:00.000Z"
}
```

### Reclamação
```javascript
{
    id: "1234567890",
    titulo: "Buraco na rua",
    categoria: "asfalto",
    descricao: "Grande buraco causando problemas",
    cep: "08330-310",
    rua: "Rua Coronel Pacheco do Couto",
    numero: "50",
    bairro: "Vila Ester",
    cidade: "São Paulo",
    coordenadas: [-23.619619, -46.466918],
    usuario: "João Silva",
    data: "06/01/2025"
}
```

---

## 🐛 Problemas Resolvidos

### 1. Autenticação não Persistia
**Problema:** Ao clicar em "Nova Reclamação", pedia login mesmo estando logado.

**Solução:**
```javascript
function showSection(sectionId) {
    if (sectionId === 'nova-reclamacao') {
        if (currentUser) {
            authRequired.classList.add('hidden');
            reclamacaoForm.classList.remove('hidden');
        }
    }
}
```

### 2. CEP não Preenchia Campos
**Problema:** Campos com `readonly` não permitiam edição.

**Solução:** Remover atributo `readonly` dos campos:
```html
<input type="text" id="rua" placeholder="Será preenchido automaticamente">
```

### 3. Navegação não Funcionava
**Problema:** Links com `href="#..."` não acionavam JavaScript.

**Solução:** Trocar por `onclick`:
```html
<a href="javascript:void(0)" onclick="showSection('mapa')">Mapa</a>
```

### 4. Mapa não Aparecia
**Problema:** Faltava CSS para exibir seções.

**Solução:**
```css
.section { display: none; }
.section.active { display: block; }
```

### 5. Erro CORS no Mapa
**Problema:** Nominatim bloqueava requisições do GitHub Pages.

**Solução:** Usar base de coordenadas conhecidas:
```javascript
const coordenadasConhecidas = {
    '08330310': [-23.619619, -46.466918],
    '08330260': [-23.6195, -46.4668],
    '01310100': [-23.5505, -46.6333]
};
```

---

## 📱 Otimizações Mobile

### Prevenir Zoom em Inputs
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
```

```css
input, select, textarea {
    font-size: 16px !important; /* iOS não dá zoom se >= 16px */
}
```

### Touch-Friendly
```css
a, button, input, select, textarea {
    min-height: 44px; /* Área mínima de toque */
}
```

### Animações Suaves
```css
.btn {
    transition: all 0.2s ease;
}

.btn:active {
    transform: translateY(1px);
}
```

---

## 🔐 Segurança

### Limitações Atuais
⚠️ **IMPORTANTE:** Este é um projeto de demonstração. Para produção, implementar:

1. **Backend seguro** - Node.js, PHP, Python
2. **Banco de dados** - MySQL, PostgreSQL, MongoDB
3. **Criptografia de senhas** - bcrypt, argon2
4. **Autenticação JWT** - Tokens seguros
5. **HTTPS** - Certificado SSL
6. **Validação server-side** - Nunca confiar apenas no frontend
7. **Rate limiting** - Prevenir ataques
8. **Sanitização de inputs** - Prevenir XSS/SQL Injection

---

## 📊 Estatísticas do Projeto

- **Linhas de código:** ~2.500
- **Arquivos criados:** 50+
- **Commits no Git:** 7
- **Tempo de desenvolvimento:** 1 dia
- **Tecnologias:** 10+
- **APIs integradas:** 3

---

## 🚀 Como Usar

### Localmente
1. Clone o repositório:
```bash
git clone https://github.com/ElCid2023/Voz-da-Rua.git
```

2. Abra `index.html` no navegador

### Online
Acesse: https://elcid2023.github.io/Voz-da-Rua/

### Credenciais de Teste
- **Email:** usuario@exemplo.com
- **Senha:** 123456

---

## 📝 Próximas Melhorias

- [ ] Backend com Node.js/Express
- [ ] Banco de dados PostgreSQL
- [ ] Upload real de fotos/vídeos
- [ ] Sistema de comentários
- [ ] Notificações push
- [ ] Filtros avançados
- [ ] Exportar relatórios PDF
- [ ] Integração com redes sociais
- [ ] App mobile nativo
- [ ] Dashboard de estatísticas

---

## 📄 Licença

Este projeto é de código aberto para fins educacionais.

---

## 👤 Autor

**ElCid2023**
- GitHub: https://github.com/ElCid2023
- Email: profborges2016@gmail.com

---

## 🙏 Agradecimentos

- OpenStreetMap pela API de mapas
- ViaCEP pela API de CEPs
- Font Awesome pelos ícones
- GitHub pelo hosting gratuito

---

**Desenvolvido com ❤️ para melhorar a comunicação entre cidadãos e poder público**
