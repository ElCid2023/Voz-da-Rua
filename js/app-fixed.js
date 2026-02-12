// Sistema de Reclamações - VERSÃO CORRIGIDA PARA MOBILE
let currentUser = null;
let reclamacoes = [];
let usuarios = [];

// Inicialização principal
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando aplicação corrigida...');
    
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
        initializeMap();
    }
    
    console.log('✅ Aplicação inicializada');
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

// CORREÇÃO: Configurar event listeners com melhor suporte mobile
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

    // Formulários com validação melhorada para mobile
    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm');
    const reclamacaoForm = document.getElementById('reclamacaoForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginMobile);
        console.log('✅ Login form configurado para mobile');
    }

    if (cadastroForm) {
        cadastroForm.addEventListener('submit', handleCadastroMobile);
        console.log('✅ Cadastro form configurado para mobile');
    }

    if (reclamacaoForm) {
        reclamacaoForm.addEventListener('submit', handleReclamacaoMobile);
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

// CORREÇÃO: Handle Login melhorado para mobile
function handleLoginMobile(e) {
    e.preventDefault();
    
    console.log('📱 Login mobile iniciado...');
    
    // Mostrar loading no botão
    const submitBtn = e.target.querySelector('button[type="submit"]');
    showButtonLoading(submitBtn, 'Entrando...');
    
    // Verificar se os elementos existem
    const emailElement = document.getElementById('loginEmail');
    const passwordElement = document.getElementById('loginPassword');

    if (!emailElement || !passwordElement) {
        hideButtonLoading(submitBtn, 'Entrar');
        showMessage('Erro no sistema de login. Recarregue a página.', 'error');
        return;
    }

    const email = emailElement.value.trim().toLowerCase();
    const password = passwordElement.value;

    // Validações básicas
    if (!email || !password) {
        hideButtonLoading(submitBtn, 'Entrar');
        showMessage('Por favor, preencha todos os campos!', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        hideButtonLoading(submitBtn, 'Entrar');
        showMessage('Email inválido!', 'error');
        return;
    }

    // Simular delay de rede para melhor UX
    setTimeout(() => {
        // Verificar se há usuários cadastrados
        if (!usuarios || usuarios.length === 0) {
            console.log('Nenhum usuário encontrado, criando usuário de exemplo...');
            addSampleUser();
            hideButtonLoading(submitBtn, 'Entrar');
            showMessage('Sistema inicializado. Tente: usuario@exemplo.com / 123456', 'info');
            return;
        }

        const user = usuarios.find(u => u.email === email && u.password === password);

        if (user) {
            currentUser = user;
            saveData();
            updateUI();
            hideButtonLoading(submitBtn, 'Entrar');
            showMessage('Login realizado com sucesso!', 'success');
            showSection('home');
            document.getElementById('loginForm').reset();
        } else {
            hideButtonLoading(submitBtn, 'Entrar');
            showMessage('Email ou senha incorretos!', 'error');
        }
    }, 1000);
}

// CORREÇÃO: Handle Cadastro melhorado para mobile
function handleCadastroMobile(e) {
    e.preventDefault();

    console.log('📱 Cadastro mobile iniciado...');
    
    // Mostrar loading no botão
    const submitBtn = e.target.querySelector('button[type="submit"]');
    showButtonLoading(submitBtn, 'Cadastrando...');

    try {
        // Verificar se os elementos existem
        const elementos = ['nome', 'email', 'telefone', 'endereco', 'bairro', 'cidade', 'password', 'confirmPassword'];
        const elementosEncontrados = {};

        for (const elemento of elementos) {
            const el = document.getElementById(elemento);
            if (!el) {
                hideButtonLoading(submitBtn, 'Cadastrar');
                showMessage(`Campo ${elemento} não encontrado. Recarregue a página.`, 'error');
                return;
            }
            elementosEncontrados[elemento] = el;
        }

        const userData = {
            id: Date.now().toString(),
            nome: elementosEncontrados.nome.value.trim(),
            email: elementosEncontrados.email.value.trim().toLowerCase(),
            telefone: elementosEncontrados.telefone.value.trim(),
            endereco: elementosEncontrados.endereco.value.trim(),
            bairro: elementosEncontrados.bairro.value.trim(),
            cidade: elementosEncontrados.cidade.value.trim(),
            password: elementosEncontrados.password.value,
            confirmPassword: elementosEncontrados.confirmPassword.value,
            dataCadastro: new Date().toISOString()
        };

        // Validações melhoradas para mobile
        if (!validateCadastroFormMobile(userData)) {
            hideButtonLoading(submitBtn, 'Cadastrar');
            return;
        }

        // Verificar se email já existe
        if (usuarios.find(u => u.email === userData.email)) {
            hideButtonLoading(submitBtn, 'Cadastrar');
            showMessage('Este email já está cadastrado!', 'error');
            return;
        }

        // Simular delay de rede
        setTimeout(() => {
            // Remover confirmPassword antes de salvar
            delete userData.confirmPassword;

            // Adicionar usuário
            usuarios.push(userData);
            saveData();
            updateStats();

            hideButtonLoading(submitBtn, 'Cadastrar');
            showMessage('Cadastro realizado com sucesso!', 'success');
            
            // Limpar formulário
            document.getElementById('cadastroForm').reset();
            
            // Redirecionar para login
            showSection('login');
        }, 1500);

    } catch (error) {
        console.error('❌ Erro durante cadastro:', error);
        hideButtonLoading(submitBtn, 'Cadastrar');
        showMessage('Erro inesperado durante o cadastro. Tente novamente.', 'error');
    }
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
    if (!validateReclamacaoFormMobile(titulo, categoria, descricao, enderecoCompleto, cepValue, numeroValue)) {
        hideButtonLoading(submitBtn, 'Enviar Reclamação');
        return;
    }

    const reclamacaoData = {
        id: Date.now().toString(),
        titulo: titulo,
        categoria: categoria,
        descricao: descricao,
        localizacao: enderecoCompleto,
        cep: cepValue,
        rua: ruaValue,
        numero: numeroValue,
        bairro: bairroValue,
        cidade: cidadeValue,
        coordenadas: coordenadasExatas,
        localizacaoExata: coordenadasExatas ? true : false,
        fonteCoordenadas: coordenadasExatas ? 'busca_exata_cep' : 'aproximada',
        enderecoGeocodificacao: window.enderecoGeocodificacao || enderecoCompleto,
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
        showMessage('Reclamação enviada com sucesso!', 'success');

        // Limpar formulário
        document.getElementById('reclamacaoForm').reset();
        const mediaPreview = document.getElementById('mediaPreview');
        if (mediaPreview) {
            mediaPreview.innerHTML = '';
        }

        showSection('reclamacoes');
    }, 2000);
}

// Validação melhorada para cadastro mobile
function validateCadastroFormMobile(userData) {
    // Validar nome
    if (!userData.nome || userData.nome.length < 2) {
        showMessage('Nome deve ter pelo menos 2 caracteres!', 'error');
        return false;
    }

    // Validar email
    if (!userData.email || !isValidEmail(userData.email)) {
        showMessage('Email inválido!', 'error');
        return false;
    }

    // Validar telefone (mais flexível para mobile)
    if (!userData.telefone || userData.telefone.replace(/\D/g, '').length < 10) {
        showMessage('Telefone deve ter pelo menos 10 dígitos!', 'error');
        return false;
    }

    // Validar senha
    if (!userData.password || userData.password.length < 6) {
        showMessage('Senha deve ter pelo menos 6 caracteres!', 'error');
        return false;
    }

    if (userData.password !== userData.confirmPassword) {
        showMessage('As senhas não coincidem!', 'error');
        return false;
    }

    // Validar campos obrigatórios
    const requiredFields = [
        { field: 'endereco', label: 'Endereço' },
        { field: 'bairro', label: 'Bairro' },
        { field: 'cidade', label: 'Cidade' }
    ];
    
    for (let { field, label } of requiredFields) {
        if (!userData[field] || userData[field].trim().length < 2) {
            showMessage(`${label} é obrigatório!`, 'error');
            return false;
        }
    }

    return true;
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

// Funções auxiliares para melhor UX mobile
function showButtonLoading(button, text) {
    if (button) {
        button.disabled = true;
        button.classList.add('loading');
        button.textContent = text;
    }
}

function hideButtonLoading(button, originalText) {
    if (button) {
        button.disabled = false;
        button.classList.remove('loading');
        button.textContent = originalText;
    }
}

function showFieldError(field, message) {
    // Remover erro anterior se existir
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
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

// Configurar listener do CEP (função simplificada)
function setupCEPListener() {
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            e.target.value = value;

            if (value.length === 9) {
                setTimeout(() => buscarCEP(value), 500);
            }
        });
    }
}

// Buscar CEP (função simplificada)
async function buscarCEP(cep) {
    const cepNumeros = cep.replace(/\D/g, '');
    if (cepNumeros.length !== 8) return;

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
        const data = await response.json();

        if (data.erro) {
            throw new Error('CEP não encontrado');
        }

        const ruaInput = document.getElementById('rua');
        const bairroInput = document.getElementById('bairro');
        const cidadeInput = document.getElementById('cidade');

        if (ruaInput) ruaInput.value = data.logradouro || '';
        if (bairroInput) bairroInput.value = data.bairro || '';
        if (cidadeInput) cidadeInput.value = data.localidade || '';

        // Definir coordenadas exatas se for um CEP conhecido
        if (cepNumeros === '08330310') {
            window.coordenadasExatas = [-23.619619448198613, -46.466918235362044];
            window.enderecoGeocodificacao = 'Rua Coronel Pacheco do Couto, Jardim Ester, São Paulo, SP';
        }

    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        showMessage('Erro ao buscar CEP: ' + error.message, 'error');
    }
}