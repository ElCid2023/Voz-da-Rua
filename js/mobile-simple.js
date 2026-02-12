// FUNÇÕES SIMPLES PARA MOBILE - ANDROID COMPATÍVEL
let currentUser = null;
let usuarios = JSON.parse(localStorage.getItem('users') || '[]');
let reclamacoes = JSON.parse(localStorage.getItem('reclamacoes') || '[]');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🤖 Sistema mobile simples carregado');
    
    // Carregar usuário atual
    const saved = localStorage.getItem('currentUser');
    if (saved) {
        currentUser = JSON.parse(saved);
        updateUI();
    }
    
    // Adicionar usuário de exemplo se não existir
    if (usuarios.length === 0) {
        usuarios.push({
            id: '1',
            nome: 'Usuário Exemplo',
            email: 'usuario@exemplo.com',
            password: '123456',
            telefone: '(11) 99999-9999',
            endereco: 'Rua Exemplo, 123',
            bairro: 'Centro',
            cidade: 'São Paulo'
        });
        localStorage.setItem('users', JSON.stringify(usuarios));
    }
    
    // Configurar CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            e.target.value = value;
            
            if (value.length === 9) {
                buscarCEP(value);
            }
        });
    }
});

// Login simples
function doLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    if (!email || !password) {
        showMessage('Preencha todos os campos!', 'error');
        return;
    }
    
    const user = usuarios.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUI();
        showMessage('Login realizado!', 'success');
        
        // Limpar campos
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        
        showSection('home');
    } else {
        showMessage('Email ou senha incorretos!', 'error');
    }
}

// Cadastro simples
function doCadastro() {
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const bairro = document.getElementById('bairroCadastro').value.trim();
    const cidade = document.getElementById('cidadeCadastro').value.trim();
    
    if (!nome || !email || !password || !telefone || !endereco || !bairro || !cidade) {
        showMessage('Preencha todos os campos!', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('As senhas não coincidem!', 'error');
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
    
    const novoUsuario = {
        id: Date.now().toString(),
        nome,
        email,
        password,
        telefone,
        endereco,
        bairro,
        cidade
    };
    
    usuarios.push(novoUsuario);
    localStorage.setItem('users', JSON.stringify(usuarios));
    
    showMessage('Cadastro realizado!', 'success');
    
    // Limpar formulário
    document.getElementById('cadastroForm').reset();
    
    showSection('login');
}

// Reclamação simples
async function doReclamacao() {
    if (!currentUser) {
        showMessage('Você precisa estar logado!', 'error');
        return;
    }
    
    const titulo = document.getElementById('titulo').value.trim();
    const categoria = document.getElementById('categoria').value;
    const descricao = document.getElementById('descricao').value.trim();
    const cep = document.getElementById('cep').value.trim();
    const rua = document.getElementById('rua').value.trim();
    const numero = document.getElementById('numero').value.trim();
    const bairro = document.getElementById('bairro').value.trim();
    const cidade = document.getElementById('cidade').value.trim();
    
    if (!titulo || !categoria || !descricao || !cep || !numero) {
        showMessage('Preencha todos os campos obrigatórios!', 'error');
        return;
    }
    
    // Buscar coordenadas exatas
    let coordenadas = null;
    try {
        const enderecoCompleto = `${rua}, ${numero}, ${bairro}, ${cidade}, SP, Brasil`;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}&limit=1&countrycodes=br`);
        const results = await response.json();
        
        if (results && results.length > 0) {
            coordenadas = [parseFloat(results[0].lat), parseFloat(results[0].lon)];
        }
    } catch (error) {
        console.log('Erro na geocodificação:', error);
    }
    
    const novaReclamacao = {
        id: Date.now().toString(),
        titulo,
        categoria,
        descricao,
        localizacao: `${rua}, ${numero} - ${bairro}, ${cidade}`,
        cep,
        rua,
        numero,
        bairro,
        cidade,
        coordenadas,
        status: 'pendente',
        usuario: currentUser.nome,
        usuarioId: currentUser.id,
        dataReclamacao: new Date().toISOString()
    };
    
    reclamacoes.push(novaReclamacao);
    localStorage.setItem('reclamacoes', JSON.stringify(reclamacoes));
    
    showMessage('Reclamação enviada com sucesso!', 'success');
    
    // Limpar formulário
    document.getElementById('reclamacaoForm').reset();
    
    showSection('reclamacoes');
}

// Buscar CEP
async function buscarCEP(cep) {
    try {
        const cepNumeros = cep.replace(/\D/g, '');
        const response = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
            document.getElementById('rua').value = data.logradouro || '';
            document.getElementById('bairro').value = data.bairro || '';
            document.getElementById('cidade').value = data.localidade || '';
            
            // Preencher campos do cadastro também
            const bairroCad = document.getElementById('bairroCadastro');
            const cidadeCad = document.getElementById('cidadeCadastro');
            if (bairroCad && !bairroCad.value) bairroCad.value = data.bairro || '';
            if (cidadeCad && !cidadeCad.value) cidadeCad.value = data.localidade || '';
            
            showMessage('CEP encontrado!', 'success');
        }
    } catch (error) {
        showMessage('Erro ao buscar CEP', 'error');
    }
}

// Atualizar UI
function updateUI() {
    const loginBtn = document.getElementById('loginBtn');
    const cadastroBtn = document.getElementById('cadastroBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const authRequired = document.getElementById('authRequired');
    const reclamacaoForm = document.getElementById('reclamacaoForm');
    
    if (currentUser) {
        if (loginBtn) loginBtn.classList.add('hidden');
        if (cadastroBtn) cadastroBtn.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        if (userInfo) userInfo.classList.remove('hidden');
        if (userName) userName.textContent = currentUser.nome;
        if (authRequired) authRequired.classList.add('hidden');
        if (reclamacaoForm) reclamacaoForm.classList.remove('hidden');
    } else {
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (cadastroBtn) cadastroBtn.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
        if (userInfo) userInfo.classList.add('hidden');
        if (authRequired) authRequired.classList.remove('hidden');
        if (reclamacaoForm) reclamacaoForm.classList.add('hidden');
    }
}

// Logout
function doLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUI();
    showMessage('Logout realizado!', 'success');
    showSection('home');
}

// Mostrar mensagem
function showMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${text}</span>
        </div>
    `;
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        right: 20px;
        padding: 15px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        ${type === 'success' ? 'background-color: #28a745;' : 'background-color: #dc3545;'}
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        if (messageDiv.parentElement) {
            document.body.removeChild(messageDiv);
        }
    }, 3000);
}