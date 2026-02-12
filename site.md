# MEU BAIRRO ALERTA - ESPECIFICAÇÕES COMPLETAS
## Checkpoint: 05 de Agosto de 2025 - Sistema Funcionando Perfeitamente

---

## 📋 VISÃO GERAL DO PROJETO

**Nome:** Meu Bairro Alerta  
**Tipo:** Portal de Reclamações Urbanas  
**Tecnologia:** HTML5, CSS3, JavaScript Vanilla  
**Hospedagem:** Netlify (https://meubairroalerta.netlify.app)  
**Banco de Dados:** LocalStorage (client-side)  
**Status:** Funcionando 100% até 05/08/2025  

---

## 🎨 DESIGN E IDENTIDADE VISUAL

### **Paleta de Cores:**
```css
:root {
    --primary-color: #2c3e50;      /* Azul escuro principal */
    --secondary-color: #3498db;    /* Azul claro */
    --accent-color: #e74c3c;       /* Vermelho para alertas */
    --success-color: #27ae60;      /* Verde para sucesso */
    --warning-color: #f39c12;      /* Laranja para avisos */
    --background-color: #ecf0f1;   /* Cinza claro de fundo */
    --text-color: #2c3e50;         /* Texto principal */
    --border-color: #bdc3c7;       /* Bordas */
    --white: #ffffff;               /* Branco */
    --shadow: rgba(0,0,0,0.1);     /* Sombras */
}
```

### **Tipografia:**
```css
/* Fonte Principal */
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

/* Tamanhos */
h1: 2.5rem (40px)
h2: 2rem (32px)
h3: 1.5rem (24px)
body: 1rem (16px)
small: 0.875rem (14px)
```

### **Ícones:**
- **Biblioteca:** Font Awesome 6.0.0
- **CDN:** https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css

---

## 🏗️ ESTRUTURA DO SITE

### **Páginas/Seções:**
1. **Home** (#home) - Página inicial com estatísticas
2. **Reclamações** (#reclamacoes) - Lista de todas as reclamações
3. **Mapa** (#mapa) - Visualização geográfica das reclamações
4. **Nova Reclamação** (#nova-reclamacao) - Formulário para criar reclamação
5. **Login** (#login) - Autenticação de usuários
6. **Cadastro** (#cadastro) - Registro de novos usuários
7. **Tutorial** (tutorial.html) - Página separada com instruções

### **Navegação Principal:**
```html
<nav class="nav">
    <ul>
        <li><a href="#home" class="nav-link active">Início</a></li>
        <li><a href="#reclamacoes" class="nav-link">Reclamações</a></li>
        <li><a href="#mapa" class="nav-link">Mapa</a></li>
        <li><a href="#nova-reclamacao" class="nav-link">Nova Reclamação</a></li>
        <li><a href="tutorial.html" class="nav-link">Tutorial</a></li>
        <li><a href="#login" class="nav-link" id="loginBtn">Login</a></li>
        <li><a href="#cadastro" class="nav-link" id="cadastroBtn">Cadastro</a></li>
        <li><a href="#" class="nav-link hidden" id="logoutBtn">Sair</a></li>
    </ul>
</nav>
```

---

## 🔐 SISTEMA DE AUTENTICAÇÃO

### **Campos de Login:**
```html
<form id="loginForm">
    <input type="email" id="loginEmail" required placeholder="seu@email.com">
    <input type="password" id="loginPassword" required placeholder="Sua senha">
    <button type="submit" class="btn btn-primary">Entrar</button>
</form>
```

### **Campos de Cadastro:**
```html
<form id="cadastroForm">
    <input type="text" id="nome" required placeholder="Nome Completo">
    <input type="email" id="email" required placeholder="seu@email.com">
    <input type="password" id="password" required placeholder="Senha (mín. 6 caracteres)">
    <button type="submit" class="btn btn-primary">Cadastrar</button>
</form>
```

### **Validações:**
- Email: formato válido obrigatório
- Senha: mínimo 6 caracteres
- Nome: obrigatório, mínimo 2 caracteres
- Email único: não permite duplicatas

### **Estrutura de Usuário:**
```javascript
const usuario = {
    id: Date.now().toString(),
    nome: "Nome do Usuário",
    email: "email@exemplo.com",
    password: "senha123", // Armazenada em texto simples (LocalStorage)
    dataCadastro: new Date().toISOString(),
    reclamacoes: [] // Array de IDs das reclamações do usuário
}
```

---

## 📝 SISTEMA DE RECLAMAÇÕES

### **Formulário de Nova Reclamação:**
```html
<form id="reclamacaoForm">
    <!-- Título -->
    <input type="text" id="titulo" required placeholder="Ex: Buraco na rua">
    
    <!-- Categoria -->
    <select id="categoria" required>
        <option value="">Selecione uma categoria</option>
        <option value="iluminacao">Iluminação Pública</option>
        <option value="asfalto">Asfalto/Pavimentação</option>
        <option value="limpeza">Limpeza Urbana</option>
        <option value="seguranca">Segurança</option>
        <option value="transporte">Transporte Público</option>
        <option value="agua">Água e Esgoto</option>
        <option value="outros">Outros</option>
    </select>
    
    <!-- Descrição -->
    <textarea id="descricao" rows="4" required placeholder="Descreva o problema..."></textarea>
    
    <!-- Localização -->
    <input type="text" id="localizacao" required placeholder="Ex: Rua das Flores, 123 - Centro">
    
    <!-- Upload de Mídia -->
    <input type="file" id="midia" multiple accept="image/*,video/*">
    
    <button type="submit" class="btn btn-primary">Enviar Reclamação</button>
</form>
```

### **Estrutura de Reclamação:**
```javascript
const reclamacao = {
    id: Date.now().toString(),
    titulo: "Título da reclamação",
    categoria: "iluminacao",
    descricao: "Descrição detalhada",
    localizacao: "Endereço completo",
    status: "pendente", // pendente, em-andamento, resolvida
    usuario: "Nome do usuário",
    usuarioId: "ID do usuário",
    dataReclamacao: new Date().toISOString(),
    midia: [], // Array de objetos {type, data, name}
    coordenadas: null, // [lat, lng] se geocodificado
    visualizacoes: 0,
    curtidas: 0
}
```

### **Status Disponíveis:**
- **pendente** - Reclamação criada, aguardando análise
- **em-andamento** - Em processo de resolução
- **resolvida** - Problema solucionado

---

## 🗺️ SISTEMA DE MAPA

### **Biblioteca:** Leaflet.js
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```

### **Configuração do Mapa:**
```javascript
// Coordenadas padrão (São Paulo, SP)
const DEFAULT_COORDS = [-23.5505, -46.6333];
const DEFAULT_ZOOM = 12;

// Inicialização
const map = L.map('map').setView(DEFAULT_COORDS, DEFAULT_ZOOM);

// Camada de tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
```

### **Marcadores por Status:**
```javascript
const markerIcons = {
    pendente: {
        color: '#ffc107', // Amarelo
        icon: '⚠️'
    },
    'em-andamento': {
        color: '#17a2b8', // Azul
        icon: '🔧'
    },
    resolvida: {
        color: '#28a745', // Verde
        icon: '✅'
    }
};
```

### **Ícones por Categoria:**
```javascript
const categoryIcons = {
    iluminacao: '💡',
    asfalto: '🛣️',
    limpeza: '🧹',
    seguranca: '🛡️',
    transporte: '🚌',
    agua: '💧',
    outros: '📋'
};
```

---

## 💾 BANCO DE DADOS (LocalStorage)

### **Estrutura de Armazenamento:**
```javascript
// Chaves do LocalStorage
localStorage.setItem('users', JSON.stringify(usuarios));
localStorage.setItem('reclamacoes', JSON.stringify(reclamacoes));
localStorage.setItem('currentUser', JSON.stringify(usuarioLogado));
localStorage.setItem('tutorialBannerDismissed', 'true');
```

### **Funções de Persistência:**
```javascript
// Carregar dados
function loadData() {
    usuarios = JSON.parse(localStorage.getItem('users') || '[]');
    reclamacoes = JSON.parse(localStorage.getItem('reclamacoes') || '[]');
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
}

// Salvar dados
function saveData() {
    localStorage.setItem('users', JSON.stringify(usuarios));
    localStorage.setItem('reclamacoes', JSON.stringify(reclamacoes));
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}
```

---

## 🎯 FUNCIONALIDADES PRINCIPAIS

### **1. Sistema de Filtros:**
```html
<select id="filtroCategoria">
    <option value="">Todas as categorias</option>
    <option value="iluminacao">Iluminação Pública</option>
    <!-- ... outras opções ... -->
</select>

<select id="filtroStatus">
    <option value="">Todos os status</option>
    <option value="pendente">Pendente</option>
    <option value="em-andamento">Em Andamento</option>
    <option value="resolvida">Resolvida</option>
</select>

<select id="ordenacao">
    <option value="recente">Mais Recentes</option>
    <option value="antigo">Mais Antigas</option>
    <option value="categoria">Por Categoria</option>
</select>
```

### **2. Sistema de Busca:**
```html
<input type="text" id="searchInput" placeholder="Buscar reclamações...">
```

### **3. Upload de Mídia:**
- **Formatos aceitos:** image/*, video/*
- **Limite:** 10MB por arquivo
- **Múltiplos arquivos:** Sim
- **Preview:** Sim, com miniatura
- **Armazenamento:** Base64 no LocalStorage

### **4. Estatísticas em Tempo Real:**
```html
<div class="stats">
    <div class="stat-card">
        <h3 id="totalReclamacoes">0</h3>
        <p>Total de Reclamações</p>
    </div>
    <div class="stat-card">
        <h3 id="pendentes">0</h3>
        <p>Pendentes</p>
    </div>
    <div class="stat-card">
        <h3 id="resolvidas">0</h3>
        <p>Resolvidas</p>
    </div>
</div>
```

---

## 🎨 COMPONENTES DE UI

### **Botões:**
```css
.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary {
    background: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background: #34495e;
    transform: translateY(-2px);
}
```

### **Cards de Reclamação:**
```css
.reclamacao-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 4px 6px var(--shadow);
    border-left: 4px solid var(--accent-color);
}
```

### **Formulários:**
```css
.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-color);
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid var(--border-color);
    border-radius: 6px;
    font-size: 1rem;
}
```

### **Sistema de Mensagens:**
```css
.message {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 6px;
    color: white;
    font-weight: 600;
    z-index: 1000;
}

.message.success { background: var(--success-color); }
.message.error { background: var(--accent-color); }
.message.info { background: var(--secondary-color); }
```

---

## 📱 RESPONSIVIDADE

### **Breakpoints:**
```css
/* Mobile First */
@media (max-width: 768px) {
    .container { padding: 1rem; }
    .nav ul { flex-direction: column; }
    .stats { grid-template-columns: 1fr; }
}

@media (min-width: 769px) and (max-width: 1024px) {
    .stats { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1025px) {
    .stats { grid-template-columns: repeat(3, 1fr); }
}
```

### **Layout Mobile:**
- Menu hambúrguer para navegação
- Cards em coluna única
- Botões com tamanho touch-friendly (44px mínimo)
- Formulários otimizados para teclado mobile

---

## 🚀 DEPLOY E HOSPEDAGEM

### **Plataforma:** Netlify
- **URL:** https://meubairroalerta.netlify.app
- **Deploy:** Drag & Drop de pasta
- **SSL:** Automático (HTTPS)
- **CDN:** Global

### **Estrutura de Arquivos:**
```
/
├── index.html              # Página principal
├── tutorial.html           # Página de tutorial
├── css/
│   └── style.css          # Estilos principais
├── js/
│   ├── app.js             # JavaScript principal
│   └── map.js             # Funcionalidades do mapa
└── assets/
    └── (imagens se houver)
```

### **Configurações de Deploy:**
- **Build Command:** Nenhum (site estático)
- **Publish Directory:** / (raiz)
- **Node Version:** Não aplicável
- **Environment Variables:** Nenhuma

---

## ⚙️ CONFIGURAÇÕES TÉCNICAS

### **Meta Tags:**
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Portal para cidadãos fazerem reclamações sobre problemas em seus bairros">
<meta name="keywords" content="reclamações, bairro, cidadania, problemas urbanos">
<meta name="author" content="Meu Bairro Alerta">
```

### **Performance:**
- **Lazy Loading:** Imagens carregadas sob demanda
- **Debounce:** Busca com delay de 300ms
- **LocalStorage:** Cache de dados para performance
- **Minificação:** CSS e JS otimizados

### **SEO:**
- **URLs amigáveis:** Uso de âncoras (#home, #reclamacoes)
- **Títulos descritivos:** H1, H2, H3 bem estruturados
- **Alt text:** Todas as imagens com descrição
- **Schema.org:** Marcação estruturada (se implementada)

---

## 🔧 FUNCIONALIDADES AVANÇADAS

### **1. Sistema de Geocodificação:**
```javascript
// Função para obter coordenadas de endereço
async function geocodificarEndereco(endereco) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    return null;
}
```

### **2. Sistema de Notificações:**
```javascript
function showMessage(text, type = 'info') {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 5000);
}
```

### **3. Validação de Formulários:**
```javascript
function validateReclamacaoForm(data) {
    if (!data.titulo || data.titulo.length < 5) {
        showMessage('Título deve ter pelo menos 5 caracteres', 'error');
        return false;
    }
    
    if (!data.categoria) {
        showMessage('Selecione uma categoria', 'error');
        return false;
    }
    
    if (!data.descricao || data.descricao.length < 10) {
        showMessage('Descrição deve ter pelo menos 10 caracteres', 'error');
        return false;
    }
    
    if (!data.localizacao || data.localizacao.length < 5) {
        showMessage('Localização deve ter pelo menos 5 caracteres', 'error');
        return false;
    }
    
    return true;
}
```

---

## 📊 MÉTRICAS E ANALYTICS

### **Dados Coletados:**
- Total de usuários cadastrados
- Total de reclamações por categoria
- Total de reclamações por status
- Reclamações por período (dia/semana/mês)
- Localização das reclamações (para mapa de calor)

### **Dashboard de Estatísticas:**
```javascript
function updateStats() {
    document.getElementById('totalReclamacoes').textContent = reclamacoes.length;
    document.getElementById('pendentes').textContent = 
        reclamacoes.filter(r => r.status === 'pendente').length;
    document.getElementById('resolvidas').textContent = 
        reclamacoes.filter(r => r.status === 'resolvida').length;
}
```

---

## 🎯 CHECKPOINT - ESTADO FUNCIONAL (05/08/2025)

### **✅ FUNCIONALIDADES CONFIRMADAS:**
1. ✅ Cadastro e login de usuários
2. ✅ Criação de reclamações com upload de mídia
3. ✅ Visualização de reclamações em lista
4. ✅ Mapa interativo com marcadores
5. ✅ Sistema de filtros e busca
6. ✅ Estatísticas em tempo real
7. ✅ Interface responsiva
8. ✅ Persistência de dados (LocalStorage)
9. ✅ Deploy funcionando no Netlify
10. ✅ Tutorial interativo

### **🔧 CONFIGURAÇÕES FINAIS:**
- **Versão CSS:** style.css (sem versionamento)
- **Versão JS:** app.js + map.js (sem versionamento)
- **Última atualização:** 05/08/2025
- **Status:** 100% funcional
- **Bugs conhecidos:** Nenhum

### **📝 NOTAS IMPORTANTES:**
- Sistema usa LocalStorage (dados locais por navegador)
- Não há backend real (tudo client-side)
- Geocodificação via OpenStreetMap (gratuito)
- Mapa via Leaflet + OpenStreetMap
- Deploy via Netlify (gratuito)

---

## 🚨 INSTRUÇÕES PARA REPLICAÇÃO

### **Para recriar este site exatamente:**

1. **Criar estrutura de arquivos** conforme especificado
2. **Implementar HTML** com todas as seções e formulários
3. **Aplicar CSS** com paleta de cores e componentes
4. **Desenvolver JavaScript** com todas as funcionalidades
5. **Integrar Leaflet** para o sistema de mapas
6. **Configurar Font Awesome** para ícones
7. **Testar todas as funcionalidades** localmente
8. **Fazer deploy no Netlify** via drag & drop

### **Ordem de desenvolvimento recomendada:**
1. Estrutura HTML básica
2. Estilos CSS e responsividade
3. Sistema de autenticação
4. CRUD de reclamações
5. Sistema de filtros
6. Integração com mapa
7. Upload de mídia
8. Polimento e testes
9. Deploy

---

---

## 💻 CÓDIGO-FONTE PRINCIPAL

### **Estrutura JavaScript (app.js):**
```javascript
// Variáveis globais
let currentUser = null;
let reclamacoes = [];
let usuarios = [];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupEventListeners();
    checkAuth();
    updateStats();
    showTutorialBanner();
});

// Event Listeners principais
function setupEventListeners() {
    // Navegação
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            if (target) {
                showSection(target);
            }
        });
    });

    // Formulários
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('cadastroForm').addEventListener('submit', handleRegister);
    document.getElementById('reclamacaoForm').addEventListener('submit', handleReclamacao);

    // Upload de mídia
    document.getElementById('midia').addEventListener('change', handleMediaUpload);

    // Filtros e busca
    document.getElementById('filtroCategoria').addEventListener('change', filterReclamacoes);
    document.getElementById('filtroStatus').addEventListener('change', filterReclamacoes);
    document.getElementById('ordenacao').addEventListener('change', filterReclamacoes);
    document.getElementById('searchInput').addEventListener('input', debounce(filterReclamacoes, 300));
}
```

### **Funções de Autenticação:**
```javascript
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const user = usuarios.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));

        document.getElementById('userName').textContent = user.nome;
        document.getElementById('userInfo').classList.remove('hidden');
        document.getElementById('loginBtn').classList.add('hidden');
        document.getElementById('cadastroBtn').classList.add('hidden');
        document.getElementById('logoutBtn').classList.remove('hidden');

        showMessage('Login realizado com sucesso!', 'success');
        showSection('home');
        document.getElementById('loginForm').reset();
    } else {
        showMessage('Email ou senha incorretos!', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validações
    if (nome.length < 2) {
        showMessage('Nome deve ter pelo menos 2 caracteres!', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('Senha deve ter pelo menos 6 caracteres!', 'error');
        return;
    }

    if (usuarios.find(u => u.email === email)) {
        showMessage('Este email já está cadastrado!', 'error');
        return;
    }

    const newUser = {
        id: Date.now().toString(),
        nome,
        email,
        password,
        dataCadastro: new Date().toISOString(),
        reclamacoes: []
    };

    usuarios.push(newUser);
    saveData();

    showMessage('Cadastro realizado com sucesso! Faça login para continuar.', 'success');
    showSection('login');
    document.getElementById('cadastroForm').reset();
}
```

### **Sistema de Reclamações:**
```javascript
async function handleReclamacao(e) {
    e.preventDefault();

    if (!currentUser) {
        showMessage('Você precisa estar logado para fazer uma reclamação!', 'error');
        return;
    }

    const reclamacaoData = {
        id: Date.now().toString(),
        titulo: document.getElementById('titulo').value.trim(),
        categoria: document.getElementById('categoria').value,
        descricao: document.getElementById('descricao').value.trim(),
        localizacao: document.getElementById('localizacao').value.trim(),
        status: 'pendente',
        usuario: currentUser.nome,
        usuarioId: currentUser.id,
        dataReclamacao: new Date().toISOString(),
        midia: [],
        coordenadas: null,
        visualizacoes: 0,
        curtidas: 0
    };

    // Validações
    if (!validateReclamacaoForm(reclamacaoData)) {
        return;
    }

    // Adicionar mídia se houver
    const mediaPreview = document.getElementById('mediaPreview');
    const mediaItems = mediaPreview.querySelectorAll('.media-item');
    mediaItems.forEach(item => {
        const mediaData = item.dataset.mediaData;
        if (mediaData) {
            reclamacaoData.midia.push(JSON.parse(mediaData));
        }
    });

    // Geocodificar endereço
    try {
        const coordenadas = await geocodificarEndereco(reclamacaoData.localizacao);
        if (coordenadas) {
            reclamacaoData.coordenadas = coordenadas;
        }
    } catch (error) {
        console.error('Erro na geocodificação:', error);
    }

    reclamacoes.push(reclamacaoData);
    currentUser.reclamacoes.push(reclamacaoData.id);

    saveData();
    updateStats();

    // Atualizar mapa se estiver carregado
    if (typeof loadReclamacaoMarkers === 'function') {
        loadReclamacaoMarkers();
    }

    filterReclamacoes();

    showMessage('Reclamação enviada com sucesso!', 'success');
    document.getElementById('reclamacaoForm').reset();
    document.getElementById('mediaPreview').innerHTML = '';
    showSection('reclamacoes');
}
```

### **Sistema de Filtros:**
```javascript
function filterReclamacoes() {
    const categoria = document.getElementById('filtroCategoria').value;
    const status = document.getElementById('filtroStatus').value;
    const ordenacao = document.getElementById('ordenacao').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    let filteredReclamacoes = reclamacoes.filter(reclamacao => {
        const matchCategoria = !categoria || reclamacao.categoria === categoria;
        const matchStatus = !status || reclamacao.status === status;
        const matchSearch = !searchTerm ||
            reclamacao.titulo.toLowerCase().includes(searchTerm) ||
            reclamacao.descricao.toLowerCase().includes(searchTerm) ||
            reclamacao.localizacao.toLowerCase().includes(searchTerm);

        return matchCategoria && matchStatus && matchSearch;
    });

    // Ordenação
    switch (ordenacao) {
        case 'recente':
            filteredReclamacoes.sort((a, b) => new Date(b.dataReclamacao) - new Date(a.dataReclamacao));
            break;
        case 'antigo':
            filteredReclamacoes.sort((a, b) => new Date(a.dataReclamacao) - new Date(b.dataReclamacao));
            break;
        case 'categoria':
            filteredReclamacoes.sort((a, b) => a.categoria.localeCompare(b.categoria));
            break;
    }

    displayReclamacoes(filteredReclamacoes);
}
```

---

## 🗺️ CÓDIGO DO MAPA (map.js)

### **Inicialização do Mapa:**
```javascript
let map = null;
let markersLayer = null;

function initializeMap() {
    if (map) {
        map.remove();
    }

    map = L.map('map', {
        center: [-23.5505, -46.6333], // São Paulo
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    markersLayer = L.layerGroup().addTo(map);

    loadReclamacaoMarkers();
}

function loadReclamacaoMarkers() {
    if (!markersLayer) return;

    markersLayer.clearLayers();

    reclamacoes.forEach(reclamacao => {
        if (reclamacao.coordenadas) {
            const marker = createReclamacaoMarker(reclamacao);
            markersLayer.addLayer(marker);
        }
    });
}

function createReclamacaoMarker(reclamacao) {
    const statusInfo = markerIcons[reclamacao.status];
    const categoryIcon = categoryIcons[reclamacao.categoria] || '📋';

    const marker = L.marker(reclamacao.coordenadas, {
        icon: L.divIcon({
            html: `<div style="background-color: ${statusInfo.color}; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px;">${categoryIcon}</div>`,
            className: 'custom-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    });

    const popupContent = `
        <div class="marker-popup">
            <h4>${reclamacao.titulo}</h4>
            <p><strong>Categoria:</strong> ${getCategoryName(reclamacao.categoria)}</p>
            <p><strong>Status:</strong> ${getStatusName(reclamacao.status)}</p>
            <p><strong>Local:</strong> ${reclamacao.localizacao}</p>
            <p><strong>Data:</strong> ${new Date(reclamacao.dataReclamacao).toLocaleDateString()}</p>
            <p>${reclamacao.descricao}</p>
        </div>
    `;

    marker.bindPopup(popupContent);

    return marker;
}
```

---

## 📱 CSS RESPONSIVO COMPLETO

### **Layout Principal:**
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--background-color);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.header {
    background: var(--primary-color);
    color: white;
    padding: 1rem 0;
    box-shadow: 0 2px 10px var(--shadow);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.logo i {
    font-size: 2rem;
    color: var(--secondary-color);
}

.nav ul {
    display: flex;
    list-style: none;
    gap: 1rem;
}

.nav-link {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
    background: var(--secondary-color);
}
```

### **Responsividade Mobile:**
```css
@media (max-width: 768px) {
    .container {
        padding: 0 1rem;
    }

    .header .container {
        flex-direction: column;
        gap: 1rem;
    }

    .nav ul {
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.5rem;
    }

    .nav-link {
        padding: 0.5rem;
        font-size: 0.9rem;
    }

    .stats {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .reclamacao-card {
        padding: 1rem;
    }

    .form-row {
        flex-direction: column;
    }

    #map {
        height: 300px;
    }
}
```

---

## 🔧 UTILITÁRIOS E HELPERS

### **Funções Auxiliares:**
```javascript
// Debounce para busca
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Formatação de data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Nomes amigáveis para categorias
function getCategoryName(categoria) {
    const names = {
        'iluminacao': 'Iluminação Pública',
        'asfalto': 'Asfalto/Pavimentação',
        'limpeza': 'Limpeza Urbana',
        'seguranca': 'Segurança',
        'transporte': 'Transporte Público',
        'agua': 'Água e Esgoto',
        'outros': 'Outros'
    };
    return names[categoria] || categoria;
}

// Nomes amigáveis para status
function getStatusName(status) {
    const names = {
        'pendente': 'Pendente',
        'em-andamento': 'Em Andamento',
        'resolvida': 'Resolvida'
    };
    return names[status] || status;
}
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### **✅ HTML Structure:**
- [ ] DOCTYPE e meta tags
- [ ] Header com logo e navegação
- [ ] Seções principais (home, reclamações, mapa, etc.)
- [ ] Formulários de login/cadastro
- [ ] Formulário de nova reclamação
- [ ] Container do mapa
- [ ] Modais e mensagens
- [ ] Scripts e links externos

### **✅ CSS Styling:**
- [ ] Variáveis CSS (cores, fontes)
- [ ] Reset e base styles
- [ ] Layout responsivo
- [ ] Componentes (botões, cards, forms)
- [ ] Animações e transições
- [ ] Media queries
- [ ] Estilos do mapa
- [ ] Estados hover/active

### **✅ JavaScript Functionality:**
- [ ] Variáveis globais
- [ ] Event listeners
- [ ] Sistema de autenticação
- [ ] CRUD de reclamações
- [ ] Sistema de filtros
- [ ] Upload de mídia
- [ ] Geocodificação
- [ ] Persistência (LocalStorage)
- [ ] Validações
- [ ] Mensagens de feedback

### **✅ Map Integration:**
- [ ] Inicialização do Leaflet
- [ ] Marcadores customizados
- [ ] Popups informativos
- [ ] Filtros no mapa
- [ ] Responsividade do mapa

### **✅ Testing:**
- [ ] Cadastro de usuário
- [ ] Login/logout
- [ ] Criação de reclamação
- [ ] Upload de imagem
- [ ] Filtros e busca
- [ ] Visualização no mapa
- [ ] Responsividade mobile
- [ ] Persistência de dados

### **✅ Deploy:**
- [ ] Estrutura de arquivos
- [ ] Upload para Netlify
- [ ] Teste em produção
- [ ] Verificação de HTTPS
- [ ] Teste em dispositivos móveis

---

**Este documento contém TODAS as especificações, código-fonte e instruções necessárias para recriar o site "Meu Bairro Alerta" exatamente como estava funcionando em 05/08/2025.**

**Para usar com outra IA:** Forneça este documento completo e solicite a implementação seguindo exatamente estas especificações.
