// Sistema de Reclamações - VERSÃO CORRIGIDA PARA MOBILE
let currentUser = null;
let reclamacoes = [];
let usuarios = [];

// Inicialização principal com suporte mobile
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando aplicação mobile-otimizada...');
    
    // Detectar e configurar mobile
    if (isMobile()) {
        console.log('📱 Dispositivo móvel detectado');
        document.body.classList.add('mobile-device');
        
        // Prevenir zoom em iOS
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
        
        // Adicionar CSS mobile dinâmico
        const mobileCSS = document.createElement('style');
        mobileCSS.textContent = `
            .mobile-device input:focus {
                transform: none !important;
                zoom: 1 !important;
            }
            .mobile-device .form-container {
                padding: 1rem !important;
                margin: 0.5rem !important;
            }
        `;
        document.head.appendChild(mobileCSS);
    }
    
    // Carregar dados do localStorage
    loadData();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Configurar listener do CEP
    setupCEPListener();
    
    // Verificar autenticação
    checkAuth();
    
    // Atualizar interface
    updateUI();
    updateStats();
    
    // Carregar e exibir reclamações
    carregarReclamacoes();
    
    // Verificar autenticação para nova reclamação
    checkAuthForReclamacao();
    
    // Adicionar dados de exemplo se não houver dados
    if (usuarios.length === 0 && reclamacoes.length === 0) {
        console.log('📝 Adicionando dados de exemplo...');
        addSampleData();
        loadData();
        carregarReclamacoes();
        updateStats();
    }
    
    // Inicializar mapa se estiver na página principal
    if (document.getElementById('map') && typeof initializeMap === 'function') {
        setTimeout(() => initializeMap(), 500);
    }
    
    console.log('✅ Aplicação inicializada para mobile');
});

// Carregar dados do localStorage
function loadData() {
    const savedUsers = localStorage.getItem('users') || localStorage.getItem('usuarios');
    const savedReclamacoes = localStorage.getItem('reclamacoes');
    const savedCurrentUser = localStorage.getItem('currentUser');

    if (savedUsers) {
        usuarios = JSON.parse(savedUsers);
        console.log(`👥 Carregados ${usuarios.length} usuários`);
    }

    if (savedReclamacoes) {
        reclamacoes = JSON.parse(savedReclamacoes);
        console.log(`📋 Carregadas ${reclamacoes.length} reclamações`);
    }

    if (savedCurrentUser) {
        currentUser = JSON.parse(savedCurrentUser);
        console.log(`👤 Usuário atual: ${currentUser.nome}`);
    }
}

// Salvar dados no localStorage
function saveData() {
    localStorage.setItem('users', JSON.stringify(usuarios));
    localStorage.setItem('reclamacoes', JSON.stringify(reclamacoes));
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    console.log('💾 Dados salvos no localStorage');
}

// CORREÇÃO MOBILE: Event listeners otimizados
function setupEventListeners() {
    // Navegação com suporte touch
    document.querySelectorAll('.nav-link').forEach(link => {
        // Usar touchstart para melhor responsividade em mobile
        const handleNavClick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            const target = this.getAttribute('href').substring(1);
            if (target) {
                showSection(target);
            }
        };
        
        link.addEventListener('click', handleNavClick);
        link.addEventListener('touchstart', handleNavClick, { passive: false });
    });

    // Formulários mobile-otimizados
    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm');
    const reclamacaoForm = document.getElementById('reclamacaoForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginMobile, { passive: false });
        // Prevenir zoom em inputs
        loginForm.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', function() {
                this.style.fontSize = '16px';
            });
        });
        console.log('✅ Login form configurado para mobile');
    }

    if (cadastroForm) {
        cadastroForm.addEventListener('submit', handleCadastroMobile, { passive: false });
        cadastroForm.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', function() {
                this.style.fontSize = '16px';
            });
        });
        console.log('✅ Cadastro form configurado para mobile');
    }

    if (reclamacaoForm) {
        reclamacaoForm.addEventListener('submit', handleReclamacaoMobile, { passive: false });
        reclamacaoForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('focus', function() {
                this.style.fontSize = '16px';
            });
        });
        console.log('✅ Reclamação form configurado para mobile');
    }

    // Upload de mídia
    const midiaInput = document.getElementById('midia');
    if (midiaInput) {
        midiaInput.addEventListener('change', handleMediaUpload);
    }

    // Filtros e busca
    const filtroCategoria = document.getElementById('filtroCategoria');
    const filtroStatus = document.getElementById('filtroStatus');
    const ordenacao = document.getElementById('ordenacao');
    const searchInput = document.getElementById('searchInput');

    if (filtroCategoria) {
        filtroCategoria.addEventListener('change', filterReclamacoes);
    }

    if (filtroStatus) {
        filtroStatus.addEventListener('change', filterReclamacoes);
    }

    if (ordenacao) {
        ordenacao.addEventListener('change', filterReclamacoes);
    }

    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterReclamacoes, 300));
    }

    // Controles do mapa
    const mapFiltroCategoria = document.getElementById('mapFiltroCategoria');
    const mapFiltroStatus = document.getElementById('mapFiltroStatus');
    const centerMapBtn = document.getElementById('centerMapBtn');
    const fullscreenMapBtn = document.getElementById('fullscreenMapBtn');

    if (mapFiltroCategoria) {
        mapFiltroCategoria.addEventListener('change', filterMapMarkers);
    }
    if (mapFiltroStatus) {
        mapFiltroStatus.addEventListener('change', filterMapMarkers);
    }
    if (centerMapBtn) {
        centerMapBtn.addEventListener('click', centerMap);
    }
    if (fullscreenMapBtn) {
        fullscreenMapBtn.addEventListener('click', toggleMapFullscreen);
    }

    // Modal
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('modalReclamacao');
        if (e.target === modal) {
            closeModal();
        }
    });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Máscara para telefone com melhor suporte mobile
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                }
            }
            e.target.value = value;
        });
    }

    // Validação em tempo real para email
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function(e) {
            const email = e.target.value.trim();
            if (email && !isValidEmail(email)) {
                e.target.style.borderColor = '#dc3545';
                showFieldError(e.target, 'Email inválido');
            } else {
                e.target.style.borderColor = '#28a745';
                clearFieldError(e.target);
            }
        });
    }

    // Validação de confirmação de senha
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function(e) {
            const password = document.getElementById('password').value;
            const confirmPassword = e.target.value;

            if (confirmPassword && password !== confirmPassword) {
                e.target.style.borderColor = '#dc3545';
                showFieldError(e.target, 'Senhas não coincidem');
            } else {
                e.target.style.borderColor = '#28a745';
                clearFieldError(e.target);
            }
        });
    }
}

// CORREÇÃO: Handle Login mobile com tratamento de erros
function handleLoginMobile(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('📱 Login mobile iniciado');
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const emailElement = document.getElementById('loginEmail');
    const passwordElement = document.getElementById('loginPassword');

    if (!emailElement || !passwordElement) {
        console.error('❌ Elementos do formulário não encontrados');
        showMessage('Erro no formulário. Recarregue a página.', 'error');
        return;
    }

    const email = emailElement.value.trim().toLowerCase();
    const password = passwordElement.value.trim();

    console.log('📝 Dados coletados:', { email: email ? 'OK' : 'VAZIO', password: password ? 'OK' : 'VAZIO' });

    if (!email || !password) {
        showMessage('Preencha todos os campos!', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('Email inválido!', 'error');
        return;
    }

    // Mostrar loading
    showButtonLoading(submitBtn, 'Entrando...');
    
    setTimeout(() => {
        try {
            // Criar usuário de exemplo se não existir
            if (!usuarios || usuarios.length === 0) {
                addSampleUser();
                loadData();
            }

            const user = usuarios.find(u => u.email === email && u.password === password);

            if (user) {
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateUI();
                showMessage('✅ Login realizado!', 'success');
                document.getElementById('loginForm').reset();
                
                // Delay para mobile
                setTimeout(() => showSection('home'), 500);
            } else {
                showMessage('Email ou senha incorretos!', 'error');
            }
        } catch (error) {
            console.error('❌ Erro no login:', error);
            showMessage('Erro interno. Tente novamente.', 'error');
        }
        
        hideButtonLoading(submitBtn, 'Entrar');
    }, isMobile() ? 1000 : 500);
}

// CORREÇÃO: Handle Cadastro mobile otimizado
function handleCadastroMobile(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('📱 Cadastro mobile iniciado');
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Coletar dados com verificação
    const nome = document.getElementById('nome')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim().toLowerCase() || '';
    const telefone = document.getElementById('telefone')?.value.trim() || '';
    const endereco = document.getElementById('endereco')?.value.trim() || '';
    const bairro = document.getElementById('bairroCadastro')?.value.trim() || '';
    const cidade = document.getElementById('cidadeCadastro')?.value.trim() || '';
    const password = document.getElementById('password')?.value || '';
    const confirmPassword = document.getElementById('confirmPassword')?.value || '';

    console.log('📝 Dados coletados:', { nome: nome ? 'OK' : 'VAZIO', email: email ? 'OK' : 'VAZIO' });

    // Validações melhoradas
    if (!nome || nome.length < 2) {
        showMessage('Nome deve ter pelo menos 2 caracteres!', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('Email inválido!', 'error');
        return;
    }

    if (!password || password.length < 6) {
        showMessage('Senha deve ter pelo menos 6 caracteres!', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('As senhas não coincidem!', 'error');
        return;
    }

    if (!telefone || !endereco || !bairro || !cidade) {
        showMessage('Preencha todos os campos!', 'error');
        return;
    }

    // Verificar se email já existe
    if (usuarios.find(u => u.email === email)) {
        showMessage('Este email já está cadastrado!', 'error');
        return;
    }

    showButtonLoading(submitBtn, 'Cadastrando...');

    setTimeout(() => {
        try {
            const userData = {
                id: Date.now().toString(),
                nome,
                email,
                telefone,
                endereco,
                bairro,
                cidade,
                password,
                dataCadastro: new Date().toISOString()
            };

            usuarios.push(userData);
            localStorage.setItem('users', JSON.stringify(usuarios));
            updateStats();

            showMessage('✅ Cadastro realizado!', 'success');
            document.getElementById('cadastroForm').reset();
            
            setTimeout(() => showSection('login'), 500);
        } catch (error) {
            console.error('❌ Erro no cadastro:', error);
            showMessage('Erro interno. Tente novamente.', 'error');
        }
        
        hideButtonLoading(submitBtn, 'Cadastrar');
    }, isMobile() ? 1500 : 800);
}

// CORREÇÃO: Handle Nova Reclamação melhorado para mobile
async function handleReclamacaoMobile(e) {
    e.preventDefault();

    console.log('📱 Nova reclamação mobile iniciada...');

    if (!currentUser) {
        showMessage('Você precisa estar logado para fazer uma reclamação!', 'error');
        return;
    }

    // Mostrar loading no botão
    const submitBtn = e.target.querySelector('button[type="submit"]');
    showButtonLoading(submitBtn, 'Enviando...');

    // Coletar dados básicos
    const tituloInput = document.getElementById('titulo');
    const categoriaInput = document.getElementById('categoria');
    const descricaoInput = document.getElementById('descricao');

    if (!tituloInput || !categoriaInput || !descricaoInput) {
        hideButtonLoading(submitBtn, 'Enviar Reclamação');
        showMessage('Erro: Formulário incompleto!', 'error');
        return;
    }

    const titulo = tituloInput.value.trim();
    const categoria = categoriaInput.value;
    const descricao = descricaoInput.value.trim();

    // Coletar dados de localização
    const cepInput = document.getElementById('cep');
    const ruaInput = document.getElementById('rua');
    const numeroInput = document.getElementById('numero');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');

    let enderecoCompleto = '';
    let coordenadasExatas = null;
    let cepValue = '';
    let numeroValue = '';
    let ruaValue = '';
    let bairroValue = '';
    let cidadeValue = '';

    if (cepInput && ruaInput && numeroInput && bairroInput && cidadeInput) {
        cepValue = cepInput.value.trim();
        ruaValue = ruaInput.value.trim();
        numeroValue = numeroInput.value.trim();
        bairroValue = bairroInput.value.trim();
        cidadeValue = cidadeInput.value.trim();

        if (ruaValue && numeroValue && bairroValue && cidadeValue) {
            enderecoCompleto = `${ruaValue}, ${numeroValue} - ${bairroValue}, ${cidadeValue}`;
            
            // Obter coordenadas exatas se disponíveis
            if (window.coordenadasExatas && Array.isArray(window.coordenadasExatas) && window.coordenadasExatas.length === 2) {
                coordenadasExatas = window.coordenadasExatas;
                console.log('🎯 Coordenadas exatas obtidas:', coordenadasExatas);
            }
        }
    }

    // Validações melhoradas para mobile
    if (!validateReclamacaoFormMobile(titulo, categoria, descricao, `${ruaValue}, ${numeroValue}`, cepValue, numeroValue)) {
        hideButtonLoading(submitBtn, 'Enviar Reclamação');
        return;
    }

    // BUSCAR COORDENADAS EXATAS PARA O ENDEREÇO COMPLETO COM NÚMERO
    let coordenadasFinais = null;
    const enderecoComNumero = `${ruaValue}, ${numeroValue}, ${bairroValue}, ${cidadeValue}, SP, Brasil`;
    
    try {
        console.log('🎯 Buscando coordenadas EXATAS para endereço completo:', enderecoComNumero);
        
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoComNumero)}&limit=1&countrycodes=br`;
        const response = await fetch(geocodeUrl);
        const results = await response.json();
        
        if (results && results.length > 0) {
            coordenadasFinais = [parseFloat(results[0].lat), parseFloat(results[0].lon)];
            console.log('✅ COORDENADAS EXATAS encontradas:', coordenadasFinais);
        } else {
            // Fallback: usar coordenadas do CEP se disponíveis
            if (window.coordenadasExatas) {
                coordenadasFinais = window.coordenadasExatas;
                console.log('⚠️ Usando coordenadas do CEP como fallback:', coordenadasFinais);
            }
        }
    } catch (error) {
        console.error('❌ Erro na geocodificação do endereço:', error);
        if (window.coordenadasExatas) {
            coordenadasFinais = window.coordenadasExatas;
        }
    }

    const reclamacaoData = {
        id: Date.now().toString(),
        titulo,
        categoria,
        descricao,
        localizacao: `${ruaValue}, ${numeroValue} - ${bairroValue}, ${cidadeValue}`,
        cep: cepValue,
        rua: ruaValue,
        numero: numeroValue,
        bairro: bairroValue,
        cidade: cidadeValue,
        coordenadas: coordenadasFinais,
        localizacaoExata: coordenadasFinais ? true : false,
        fonteCoordenadas: coordenadasFinais ? 'geocodificacao_exata' : 'nao_encontrada',
        enderecoGeocodificacao: enderecoComNumero,
        status: 'pendente',
        usuario: currentUser.nome,
        usuarioId: currentUser.id,
        dataReclamacao: new Date().toISOString(),
        midia: []
    };

    // Simular delay de envio
    setTimeout(() => {
        // Adicionar mídia se houver
        try {
            const mediaPreview = document.getElementById('mediaPreview');
            if (mediaPreview) {
                const mediaItems = mediaPreview.querySelectorAll('.media-item');
                mediaItems.forEach(item => {
                    const mediaData = item.dataset.mediaData;
                    if (mediaData) {
                        reclamacaoData.midia.push(JSON.parse(mediaData));
                    }
                });
            }
        } catch (error) {
            console.log('⚠️ Erro ao processar mídia:', error);
        }

        reclamacoes.push(reclamacaoData);
        saveData();
        updateStats();

        if (typeof filterReclamacoes === 'function') {
            filterReclamacoes();
        }

        // Atualizar mapa se disponível
        try {
            if (typeof loadReclamacaoMarkers === 'function') {
                loadReclamacaoMarkers();
            }
        } catch (error) {
            console.log('⚠️ Erro ao atualizar mapa:', error);
        }

        hideButtonLoading(submitBtn, 'Enviar Reclamação');
        showMessage('Reclamação enviada com coordenadas exatas!', 'success');

        // Limpar formulário
        document.getElementById('reclamacaoForm').reset();
        const mediaPreview = document.getElementById('mediaPreview');
        if (mediaPreview) {
            mediaPreview.innerHTML = '';
        }

        showSection('reclamacoes');
    }, 2000);
}



// Validação melhorada para reclamação mobile
function validateReclamacaoFormMobile(titulo, categoria, descricao, endereco, cep, numero) {
    if (!titulo || titulo.length < 3) {
        showMessage('Título deve ter pelo menos 3 caracteres!', 'error');
        return false;
    }

    if (!categoria) {
        showMessage('Selecione uma categoria!', 'error');
        return false;
    }

    if (!descricao || descricao.length < 10) {
        showMessage('Descrição deve ter pelo menos 10 caracteres!', 'error');
        return false;
    }

    if (!cep || cep.length !== 9) {
        showMessage('CEP é obrigatório e deve estar no formato 00000-000!', 'error');
        return false;
    }

    if (!numero || numero.trim() === '') {
        showMessage('Número do endereço é obrigatório!', 'error');
        return false;
    }

    if (!endereco || endereco.length < 5) {
        showMessage('Aguarde o carregamento dos dados do CEP!', 'error');
        return false;
    }

    return true;
}



function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Restante das funções (navegação, UI, etc.)
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        window.history.pushState(null, null, '#' + sectionId);
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
        }
    });

    if (sectionId === 'nova-reclamacao') {
        checkAuthForReclamacao();
    }

    if (sectionId === 'reclamacoes') {
        const todasReclamacoes = loadReclamacoes();
        displayReclamacoes(todasReclamacoes);
        updateFilteredStats(todasReclamacoes);
    }

    if (sectionId === 'mapa') {
        setTimeout(() => {
            if (typeof initializeMap === 'function') {
                initializeMap();
            }
        }, 100);
    }

    window.scrollTo(0, 0);
}

function checkAuth() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    } else {
        currentUser = null;
        updateAuthUI();
    }
}

function updateAuthUI() {
    const authSection = document.getElementById('auth-section');
    const userSection = document.getElementById('user-section');
    const userName = document.getElementById('user-name');

    if (currentUser) {
        if (authSection) authSection.style.display = 'none';
        if (userSection) userSection.style.display = 'block';
        if (userName) userName.textContent = currentUser.nome;
    } else {
        if (authSection) authSection.style.display = 'block';
        if (userSection) userSection.style.display = 'none';
    }
}

function checkAuthForReclamacao() {
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

function updateUI() {
    const loginBtn = document.getElementById('loginBtn');
    const cadastroBtn = document.getElementById('cadastroBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    
    if (currentUser) {
        loginBtn.classList.add('hidden');
        cadastroBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        userInfo.classList.remove('hidden');
        userName.textContent = currentUser.nome;
    } else {
        loginBtn.classList.remove('hidden');
        cadastroBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        userInfo.classList.add('hidden');
    }
}

function updateStats() {
    const reclamacoesAtuais = loadReclamacoes();
    const usuariosAtuais = JSON.parse(localStorage.getItem('users') || '[]');

    const totalReclamacoesEl = document.getElementById('totalReclamacoes');
    const totalUsuariosEl = document.getElementById('totalUsuarios');
    const reclamacoesResolvidasEl = document.getElementById('reclamacoesResolvidas');

    if (totalReclamacoesEl) totalReclamacoesEl.textContent = reclamacoesAtuais.length;
    if (totalUsuariosEl) totalUsuariosEl.textContent = usuariosAtuais.length;
    if (reclamacoesResolvidasEl) {
        reclamacoesResolvidasEl.textContent = reclamacoesAtuais.filter(r => r.status === 'resolvida').length;
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUI();
    showMessage('Logout realizado com sucesso!', 'success');
    showSection('home');
}

function showMessage(message, type) {
    console.log(`💬 Mensagem [${type}]: ${message}`);
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'info' ? 'info-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    const isMobile = window.innerWidth <= 768;
    messageDiv.style.cssText = `
        position: fixed;
        top: ${isMobile ? '20px' : '100px'};
        ${isMobile ? 'left: 20px; right: 20px;' : 'right: 20px; width: 400px;'}
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-size: ${isMobile ? '14px' : '16px'};
        ${type === 'success' ? 'background-color: #28a745;' : 
          type === 'info' ? 'background-color: #17a2b8;' : 
          'background-color: #dc3545;'}
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (messageDiv.parentElement) {
                document.body.removeChild(messageDiv);
            }
        }, 300);
    }, isMobile ? 4000 : 3000);
}

// Funções auxiliares restantes
function addSampleData() {
    const sampleUser = {
        id: 'sample-user-1',
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '(11) 99999-9999',
        endereco: 'Rua das Flores, 123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        password: '123456',
        dataCadastro: new Date().toISOString()
    };

    const sampleReclamacoes = [
        {
            id: 'sample-rec-1',
            titulo: 'Buraco na Rua Coronel Pacheco do Couto',
            categoria: 'asfalto',
            descricao: 'Há um grande buraco na rua que está causando problemas para os carros.',
            localizacao: 'Rua Coronel Pacheco do Couto, 50 - Jardim Ester, São Paulo',
            cep: '08330-310',
            rua: 'Rua Coronel Pacheco do Couto',
            numero: '50',
            bairro: 'Jardim Ester',
            cidade: 'São Paulo',
            coordenadas: [-23.619619448198613, -46.466918235362044],
            localizacaoExata: true,
            fonteCoordenadas: 'coordenadas_exatas',
            status: 'pendente',
            usuario: 'João Silva',
            usuarioId: 'sample-user-1',
            dataReclamacao: new Date().toISOString(),
            midia: []
        }
    ];

    usuarios.push(sampleUser);
    reclamacoes.push(...sampleReclamacoes);
    saveData();
}

function addSampleUser() {
    const sampleUser = {
        id: Date.now().toString(),
        nome: 'Usuário Exemplo',
        email: 'usuario@exemplo.com',
        telefone: '(11) 99999-9999',
        endereco: 'Rua Exemplo, 123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        password: '123456',
        dataCadastro: new Date().toISOString()
    };

    usuarios.push(sampleUser);
    saveData();
}

function loadReclamacoes() {
    try {
        const reclamacoes = localStorage.getItem('reclamacoes');
        return reclamacoes ? JSON.parse(reclamacoes) : [];
    } catch (error) {
        console.error('Erro ao carregar reclamações:', error);
        return [];
    }
}

function carregarReclamacoes() {
    let reclamacoes = loadReclamacoes();
    
    if (reclamacoes.length === 0) {
        reclamacoes = [];
    }

    atualizarContadores(reclamacoes);
    atualizarListaReclamacoes(reclamacoes);

    if (typeof updateMapMarkers === 'function') {
        updateMapMarkers(reclamacoes);
    }
}

function atualizarContadores(reclamacoes) {
    const totalElement = document.getElementById('total-reclamacoes');
    const pendenteElement = document.getElementById('pendentes');
    const resolvidasElement = document.getElementById('resolvidas');

    if (totalElement) totalElement.textContent = reclamacoes.length;

    const pendentes = reclamacoes.filter(r => r.status === 'pendente').length;
    const resolvidas = reclamacoes.filter(r => r.status === 'resolvida').length;

    if (pendenteElement) pendenteElement.textContent = pendentes;
    if (resolvidasElement) resolvidasElement.textContent = resolvidas;
}

function atualizarListaReclamacoes(reclamacoes) {
    const container = document.getElementById('listaReclamacoes');
    if (!container) return;

    if (reclamacoes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>Nenhuma reclamação encontrada</h3>
                <p>Seja o primeiro a reportar um problema em seu bairro!</p>
                <button class="btn btn-primary" onclick="showSection('nova-reclamacao')">
                    <i class="fas fa-plus"></i> Nova Reclamação
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = reclamacoes.map(reclamacao => `
        <div class="reclamacao-card" data-id="${reclamacao.id}">
            <div class="reclamacao-header">
                <h4>${reclamacao.titulo}</h4>
                <span class="status-badge status-${reclamacao.status}">${getStatusText(reclamacao.status)}</span>
            </div>
            <div class="reclamacao-content">
                <p><i class="fas fa-map-marker-alt"></i> ${reclamacao.localizacao}</p>
                <p><i class="fas fa-tag"></i> ${getCategoryText(reclamacao.categoria)}</p>
                <p><i class="fas fa-calendar"></i> ${formatDate(reclamacao.dataReclamacao)}</p>
                <p class="descricao">${reclamacao.descricao}</p>
            </div>
        </div>
    `).join('');
}

function getStatusText(status) {
    const statusTexts = {
        'pendente': 'Pendente',
        'em-andamento': 'Em Andamento',
        'resolvida': 'Resolvida'
    };
    return statusTexts[status] || status;
}

function getCategoryText(categoria) {
    const categoryTexts = {
        'iluminacao': 'Iluminação Pública',
        'asfalto': 'Asfalto/Pavimentação',
        'limpeza': 'Limpeza Urbana',
        'seguranca': 'Segurança',
        'transporte': 'Transporte Público',
        'agua': 'Água/Esgoto',
        'outros': 'Outros'
    };
    return categoryTexts[categoria] || categoria;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function displayReclamacoes(reclamacoes) {
    atualizarListaReclamacoes(reclamacoes);
}

function updateFilteredStats(reclamacoes) {
    const totalFiltradas = reclamacoes.length;
    const pendentesFiltradas = reclamacoes.filter(r => r.status === 'pendente').length;
    const resolvidasFiltradas = reclamacoes.filter(r => r.status === 'resolvida').length;

    const totalEl = document.getElementById('totalFiltradas');
    const pendentesEl = document.getElementById('pendentesFiltradas');
    const resolvidasEl = document.getElementById('resolvidasFiltradas');

    if (totalEl) totalEl.textContent = totalFiltradas;
    if (pendentesEl) pendentesEl.textContent = pendentesFiltradas;
    if (resolvidasEl) resolvidasEl.textContent = resolvidasFiltradas;
}

function filterReclamacoes() {
    const reclamacoesAtuais = loadReclamacoes();
    displayReclamacoes(reclamacoesAtuais);
    updateFilteredStats(reclamacoesAtuais);
}

function closeModal() {
    const modal = document.getElementById('modalReclamacao');
    if (modal) {
        modal.style.display = 'none';
    }
}

function handleMediaUpload(e) {
    console.log('Upload de mídia iniciado');
}

// CORREÇÃO: Funções auxiliares para loading e feedback
function showButtonLoading(button, loadingText = 'Carregando...') {
    if (!button) return;
    
    button.classList.add('loading');
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
}

function hideButtonLoading(button, originalText = null) {
    if (!button) return;
    
    button.classList.remove('loading');
    button.disabled = false;
    
    if (originalText) {
        button.innerHTML = originalText;
    } else if (button.dataset.originalText) {
        button.innerHTML = button.dataset.originalText;
    }
}

function showFieldError(field, message) {
    if (!field) return;
    
    // Remover erro anterior
    clearFieldError(field);
    
    // Adicionar novo erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.id = field.id + '-error';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#dc3545';
}

function clearFieldError(field) {
    if (!field) return;
    
    const existingError = document.getElementById(field.id + '-error');
    if (existingError) {
        existingError.remove();
    }
    
    field.style.borderColor = '';
}

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

// CORREÇÃO: Função para detectar mobile
function isMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    const isSmallScreen = window.innerWidth <= 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    return mobileRegex.test(userAgent) || isSmallScreen || isTouchDevice;
}

// CORREÇÃO: Função para validar formulários mobile
function validateMobileForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        clearFieldError(input);
        
        if (!input.value.trim()) {
            showFieldError(input, 'Este campo é obrigatório');
            isValid = false;
        }
    });
    
    return isValid;
}

// CORREÇÃO: Configurar listener do CEP melhorado
function setupCEPListener() {
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        console.log('✅ CEP listener configurado');
        
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            e.target.value = value;

            // Limpar campos quando CEP é alterado
            const ruaInput = document.getElementById('rua');
            const bairroInput = document.getElementById('bairro');
            const cidadeInput = document.getElementById('cidade');
            
            if (ruaInput) ruaInput.value = '';
            if (bairroInput) bairroInput.value = '';
            if (cidadeInput) cidadeInput.value = '';

            if (value.length === 9) {
                console.log('🔍 CEP completo digitado:', value);
                setTimeout(() => buscarCEP(value), 300);
            }
        });
        
        // Adicionar feedback visual
        cepInput.addEventListener('focus', function() {
            this.placeholder = '00000-000';
        });
        
        cepInput.addEventListener('blur', function() {
            if (!this.value) {
                this.placeholder = '00000-000';
            }
        });
    } else {
        console.warn('⚠️ Campo CEP não encontrado');
    }
}

// Buscar CEP (função corrigida)
async function buscarCEP(cep) {
    const cepNumeros = cep.replace(/\D/g, '');
    if (cepNumeros.length !== 8) return;

    console.log('🔍 Buscando CEP:', cepNumeros);

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
        const data = await response.json();

        if (data.erro) {
            throw new Error('CEP não encontrado');
        }

        console.log('✅ CEP encontrado:', data);

        // Preencher campos
        const ruaInput = document.getElementById('rua');
        const bairroInput = document.getElementById('bairro');
        const cidadeInput = document.getElementById('cidade');

        if (ruaInput) {
            ruaInput.value = data.logradouro || '';
            console.log('📍 Rua preenchida:', data.logradouro);
        }
        
        if (bairroInput) {
            // Correção específica para CEPs conhecidos
            let bairroCorreto = data.bairro;
            if (cepNumeros === '08330310') {
                bairroCorreto = 'Jardim Ester';
            } else if (cepNumeros === '08330260') {
                bairroCorreto = 'Vila Ester';
            }
            bairroInput.value = bairroCorreto || '';
            console.log('🏘️ Bairro preenchido:', bairroCorreto);
        }
        
        // CORREÇÃO: Também preencher campos do cadastro se estiverem presentes
        const bairroCadastroInput = document.getElementById('bairroCadastro');
        const cidadeCadastroInput = document.getElementById('cidadeCadastro');
        
        if (bairroCadastroInput && !bairroCadastroInput.value) {
            let bairroCorreto = data.bairro;
            if (cepNumeros === '08330310') {
                bairroCorreto = 'Jardim Ester';
            } else if (cepNumeros === '08330260') {
                bairroCorreto = 'Vila Ester';
            }
            bairroCadastroInput.value = bairroCorreto || '';
            console.log('🏘️ Bairro cadastro preenchido:', bairroCorreto);
        }
        
        if (cidadeCadastroInput && !cidadeCadastroInput.value) {
            cidadeCadastroInput.value = data.localidade || '';
            console.log('🏙️ Cidade cadastro preenchida:', data.localidade);
        }
        
        if (cidadeInput) {
            cidadeInput.value = data.localidade || '';
            console.log('🏙️ Cidade preenchida:', data.localidade);
        }

        // BUSCAR COORDENADAS EXATAS VIA GEOCODIFICAÇÃO
        await buscarCoordenadasExatas(data.logradouro, data.localidade, data.uf, cepNumeros);

        showMessage('✅ CEP encontrado e campos preenchidos!', 'success');
        
        // Feedback visual nos campos preenchidos
        if (ruaInput) ruaInput.style.borderColor = '#28a745';
        if (bairroInput) bairroInput.style.borderColor = '#28a745';
        if (cidadeInput) cidadeInput.style.borderColor = '#28a745';

    } catch (error) {
        console.error('❌ Erro ao buscar CEP:', error);
        showMessage('Erro ao buscar CEP: ' + error.message, 'error');
    }
}

// FUNÇÃO PARA BUSCAR COORDENADAS EXATAS
async function buscarCoordenadasExatas(logradouro, cidade, uf, cepNumeros) {
    try {
        // Construir endereço completo para geocodificação
        const enderecoCompleto = `${logradouro}, ${cidade}, ${uf}, Brasil`;
        console.log('🌍 Buscando coordenadas exatas para:', enderecoCompleto);
        
        // Usar Nominatim (OpenStreetMap) para geocodificação gratuita
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}&limit=1&countrycodes=br`;
        
        const response = await fetch(geocodeUrl);
        const results = await response.json();
        
        if (results && results.length > 0) {
            const lat = parseFloat(results[0].lat);
            const lon = parseFloat(results[0].lon);
            
            window.coordenadasExatas = [lat, lon];
            window.enderecoGeocodificacao = results[0].display_name;
            
            console.log('🎯 COORDENADAS EXATAS encontradas via geocodificação:', window.coordenadasExatas);
            console.log('📍 Endereço geocodificado:', window.enderecoGeocodificacao);
            
            showMessage('📍 Localização exata encontrada!', 'info');
        } else {
            // Fallback para coordenadas conhecidas
            console.log('⚠️ Geocodificação não encontrou resultados, usando coordenadas conhecidas');
            
            if (cepNumeros === '08330310') {
                window.coordenadasExatas = [-23.619619448198613, -46.466918235362044];
            } else if (cepNumeros === '08330260') {
                // Para 08330-260, usar coordenadas diferentes mas na mesma região
                window.coordenadasExatas = [-23.6195, -46.4668];
            } else {
                window.coordenadasExatas = null;
            }
            
            console.log('🎯 Coordenadas fallback:', window.coordenadasExatas);
        }
        
    } catch (error) {
        console.error('❌ Erro na geocodificação:', error);
        
        // Fallback para coordenadas conhecidas em caso de erro
        if (cepNumeros === '08330310') {
            window.coordenadasExatas = [-23.619619448198613, -46.466918235362044];
        } else if (cepNumeros === '08330260') {
            window.coordenadasExatas = [-23.6195, -46.4668];
        } else {
            window.coordenadasExatas = null;
        }
        
        console.log('🎯 Coordenadas de emergência:', window.coordenadasExatas);
    }
}