// Admin System
let currentAdmin = null;
let reclamacoes = [];
let usuarios = [];
let currentReportData = null;

// Credenciais de admin (em produção, isso seria em um servidor seguro)
const ADMIN_CREDENTIALS = {
    email: 'admin@meubairroalerta.com',
    password: 'admin123'
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupEventListeners();
    
    // Verificar se admin já está logado
    const savedAdmin = localStorage.getItem('currentAdmin');
    if (savedAdmin) {
        currentAdmin = JSON.parse(savedAdmin);
        showAdminDashboard();
    }
});

// Carregar dados
function loadData() {
    const savedUsers = localStorage.getItem('usuarios');
    const savedReclamacoes = localStorage.getItem('reclamacoes');
    
    if (savedUsers) {
        usuarios = JSON.parse(savedUsers);
    }
    
    if (savedReclamacoes) {
        reclamacoes = JSON.parse(savedReclamacoes);
    }
}

// Salvar dados
function saveData() {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    localStorage.setItem('reclamacoes', JSON.stringify(reclamacoes));
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
    
    // Menu navigation
    document.querySelectorAll('.admin-menu-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.dataset.section;
            showAdminSection(section);
        });
    });
    
    // Filters
    document.getElementById('adminFiltroStatus').addEventListener('change', filterReclamacoes);
    document.getElementById('adminFiltroCategoria').addEventListener('change', filterReclamacoes);
    document.getElementById('adminFiltroData').addEventListener('change', filterReclamacoes);
    
    // Report type change
    document.getElementById('reportType').addEventListener('change', function() {
        const reportType = this.value;
        const endDateInput = document.getElementById('reportEndDate');
        
        if (reportType === 'custom') {
            endDateInput.classList.remove('hidden');
        } else {
            endDateInput.classList.add('hidden');
            setDefaultReportDate(reportType);
        }
    });
    
    // Restore file
    document.getElementById('restoreFile').addEventListener('change', handleRestoreFile);
    
    // Set default date
    setDefaultReportDate('daily');
}

// Handle admin login
function handleAdminLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        currentAdmin = {
            email: email,
            name: 'Administrador',
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentAdmin', JSON.stringify(currentAdmin));
        showAdminDashboard();
        showMessage('Login realizado com sucesso!', 'success');
    } else {
        showMessage('Credenciais inválidas!', 'error');
    }
}

// Show admin dashboard
function showAdminDashboard() {
    document.getElementById('adminLogin').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    
    // Update admin name
    document.getElementById('adminUserName').textContent = currentAdmin.name;
    
    // Load dashboard data
    loadDashboardData();
    loadReclamacoesTable();
    loadUsuariosTable();
}

// Show admin section
function showAdminSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`admin-${sectionName}`).classList.add('active');
    
    // Update menu
    document.querySelectorAll('.admin-menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Load section specific data
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'reclamacoes':
            loadReclamacoesTable();
            break;
        case 'usuarios':
            loadUsuariosTable();
            break;
        case 'notificacoes':
            loadNotificationSettings();
            break;
    }
}

// Load dashboard data
function loadDashboardData() {
    // Update stats
    const totalReclamacoes = reclamacoes.length;
    const pendentes = reclamacoes.filter(r => r.status === 'pendente').length;
    const emAndamento = reclamacoes.filter(r => r.status === 'em-andamento').length;
    const resolvidas = reclamacoes.filter(r => r.status === 'resolvida').length;
    const totalUsuarios = usuarios.length;
    
    // Reclamações de hoje
    const hoje = new Date().toDateString();
    const hojeCount = reclamacoes.filter(r => 
        new Date(r.dataReclamacao).toDateString() === hoje
    ).length;
    
    document.getElementById('totalReclamacoesAdmin').textContent = totalReclamacoes;
    document.getElementById('pendentesAdmin').textContent = pendentes;
    document.getElementById('emAndamentoAdmin').textContent = emAndamento;
    document.getElementById('resolvidasAdmin').textContent = resolvidas;
    document.getElementById('totalUsuariosAdmin').textContent = totalUsuarios;
    document.getElementById('hojeAdmin').textContent = hojeCount;
    
    // Load charts
    loadStatusChart();
    loadCategoryChart();
    loadRecentActivity();
}

// Load status chart
function loadStatusChart() {
    const ctx = document.getElementById('statusChart').getContext('2d');
    
    const pendentes = reclamacoes.filter(r => r.status === 'pendente').length;
    const emAndamento = reclamacoes.filter(r => r.status === 'em-andamento').length;
    const resolvidas = reclamacoes.filter(r => r.status === 'resolvida').length;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pendentes', 'Em Andamento', 'Resolvidas'],
            datasets: [{
                data: [pendentes, emAndamento, resolvidas],
                backgroundColor: ['#ffc107', '#17a2b8', '#28a745'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Load category chart
function loadCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    const categories = ['iluminacao', 'asfalto', 'limpeza', 'seguranca', 'transporte', 'agua', 'outros'];
    const categoryLabels = {
        'iluminacao': 'Iluminação',
        'asfalto': 'Asfalto',
        'limpeza': 'Limpeza',
        'seguranca': 'Segurança',
        'transporte': 'Transporte',
        'agua': 'Água/Esgoto',
        'outros': 'Outros'
    };
    
    const data = categories.map(cat => 
        reclamacoes.filter(r => r.categoria === cat).length
    );
    
    const labels = categories.map(cat => categoryLabels[cat]);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Reclamações',
                data: data,
                backgroundColor: '#667eea',
                borderColor: '#5a6fd8',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Load recent activity
function loadRecentActivity() {
    const container = document.getElementById('recentActivityList');
    
    // Ordenar reclamações por data (mais recentes primeiro)
    const recentReclamacoes = [...reclamacoes]
        .sort((a, b) => new Date(b.dataReclamacao) - new Date(a.dataReclamacao))
        .slice(0, 10);
    
    if (recentReclamacoes.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">Nenhuma atividade recente</p>';
        return;
    }
    
    container.innerHTML = recentReclamacoes.map(reclamacao => {
        const timeAgo = getTimeAgo(reclamacao.dataReclamacao);
        const iconClass = getActivityIcon(reclamacao.status);
        
        return `
            <div class="activity-item">
                <div class="activity-icon ${iconClass}">
                    <i class="fas fa-${getActivityIconName(reclamacao.status)}"></i>
                </div>
                <div class="activity-content">
                    <h4>${reclamacao.titulo}</h4>
                    <p>por ${reclamacao.usuario} - ${getCategoriaLabel(reclamacao.categoria)}</p>
                </div>
                <div class="activity-time">${timeAgo}</div>
            </div>
        `;
    }).join('');
}

// Get activity icon class
function getActivityIcon(status) {
    switch(status) {
        case 'pendente': return 'new';
        case 'em-andamento': return 'update';
        case 'resolvida': return 'resolved';
        default: return 'new';
    }
}

// Get activity icon name
function getActivityIconName(status) {
    switch(status) {
        case 'pendente': return 'exclamation-triangle';
        case 'em-andamento': return 'tools';
        case 'resolvida': return 'check-circle';
        default: return 'exclamation-triangle';
    }
}

// Load reclamações table
function loadReclamacoesTable() {
    const tbody = document.getElementById('reclamacoesTableBody');
    
    if (reclamacoes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #666;">Nenhuma reclamação encontrada</td></tr>';
        return;
    }
    
    tbody.innerHTML = reclamacoes.map(reclamacao => `
        <tr>
            <td>${reclamacao.id.substring(0, 8)}...</td>
            <td>${reclamacao.titulo}</td>
            <td>${getCategoriaLabel(reclamacao.categoria)}</td>
            <td><span class="status-badge ${reclamacao.status}">${getStatusLabel(reclamacao.status)}</span></td>
            <td>${reclamacao.usuario}</td>
            <td>${formatDate(reclamacao.dataReclamacao)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="editReclamacao('${reclamacao.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="viewReclamacao('${reclamacao.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteReclamacao('${reclamacao.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load usuários table
function loadUsuariosTable() {
    const tbody = document.getElementById('usuariosTableBody');

    if (usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #666;">Nenhum usuário encontrado</td></tr>';
        return;
    }

    tbody.innerHTML = usuarios.map(usuario => {
        const userReclamacoes = reclamacoes.filter(r => r.usuarioId === usuario.id).length;

        return `
            <tr>
                <td>${usuario.id.substring(0, 8)}...</td>
                <td>${usuario.nome}</td>
                <td>${usuario.email}</td>
                <td>${usuario.bairro}</td>
                <td>${usuario.cidade}</td>
                <td>${formatDate(usuario.dataCadastro)}</td>
                <td>${userReclamacoes}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-secondary" onclick="viewUsuario('${usuario.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteUsuario('${usuario.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Filter reclamações
function filterReclamacoes() {
    const statusFilter = document.getElementById('adminFiltroStatus').value;
    const categoriaFilter = document.getElementById('adminFiltroCategoria').value;
    const dataFilter = document.getElementById('adminFiltroData').value;

    let filtered = [...reclamacoes];

    if (statusFilter) {
        filtered = filtered.filter(r => r.status === statusFilter);
    }

    if (categoriaFilter) {
        filtered = filtered.filter(r => r.categoria === categoriaFilter);
    }

    if (dataFilter) {
        const filterDate = new Date(dataFilter).toDateString();
        filtered = filtered.filter(r =>
            new Date(r.dataReclamacao).toDateString() === filterDate
        );
    }

    // Update table with filtered data
    const tbody = document.getElementById('reclamacoesTableBody');

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #666;">Nenhuma reclamação encontrada com os filtros aplicados</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(reclamacao => `
        <tr>
            <td>${reclamacao.id.substring(0, 8)}...</td>
            <td>${reclamacao.titulo}</td>
            <td>${getCategoriaLabel(reclamacao.categoria)}</td>
            <td><span class="status-badge ${reclamacao.status}">${getStatusLabel(reclamacao.status)}</span></td>
            <td>${reclamacao.usuario}</td>
            <td>${formatDate(reclamacao.dataReclamacao)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="editReclamacao('${reclamacao.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="viewReclamacao('${reclamacao.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteReclamacao('${reclamacao.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Clear admin filters
function clearAdminFilters() {
    document.getElementById('adminFiltroStatus').value = '';
    document.getElementById('adminFiltroCategoria').value = '';
    document.getElementById('adminFiltroData').value = '';
    loadReclamacoesTable();
}

// Edit reclamação
function editReclamacao(reclamacaoId) {
    const reclamacao = reclamacoes.find(r => r.id === reclamacaoId);
    if (!reclamacao) return;

    const modal = document.getElementById('editReclamacaoModal');
    const content = document.getElementById('editModalContent');

    content.innerHTML = `
        <h2><i class="fas fa-edit"></i> Editar Reclamação</h2>
        <form id="editReclamacaoForm">
            <input type="hidden" id="editReclamacaoId" value="${reclamacao.id}">

            <div class="form-group">
                <label for="editTitulo">Título:</label>
                <input type="text" id="editTitulo" value="${reclamacao.titulo}" required>
            </div>

            <div class="form-group">
                <label for="editStatus">Status:</label>
                <select id="editStatus" required>
                    <option value="pendente" ${reclamacao.status === 'pendente' ? 'selected' : ''}>Pendente</option>
                    <option value="em-andamento" ${reclamacao.status === 'em-andamento' ? 'selected' : ''}>Em Andamento</option>
                    <option value="resolvida" ${reclamacao.status === 'resolvida' ? 'selected' : ''}>Resolvida</option>
                </select>
            </div>

            <div class="form-group">
                <label for="editCategoria">Categoria:</label>
                <select id="editCategoria" required>
                    <option value="iluminacao" ${reclamacao.categoria === 'iluminacao' ? 'selected' : ''}>Iluminação Pública</option>
                    <option value="asfalto" ${reclamacao.categoria === 'asfalto' ? 'selected' : ''}>Asfalto/Pavimentação</option>
                    <option value="limpeza" ${reclamacao.categoria === 'limpeza' ? 'selected' : ''}>Limpeza Urbana</option>
                    <option value="seguranca" ${reclamacao.categoria === 'seguranca' ? 'selected' : ''}>Segurança</option>
                    <option value="transporte" ${reclamacao.categoria === 'transporte' ? 'selected' : ''}>Transporte Público</option>
                    <option value="agua" ${reclamacao.categoria === 'agua' ? 'selected' : ''}>Água e Esgoto</option>
                    <option value="outros" ${reclamacao.categoria === 'outros' ? 'selected' : ''}>Outros</option>
                </select>
            </div>

            <div class="form-group">
                <label for="editDescricao">Descrição:</label>
                <textarea id="editDescricao" rows="4" required>${reclamacao.descricao}</textarea>
            </div>

            <div class="form-group">
                <label for="editLocalizacao">Localização:</label>
                <input type="text" id="editLocalizacao" value="${reclamacao.localizacao}" required>
            </div>

            <div class="form-group">
                <label for="adminResponse">Resposta do Administrador:</label>
                <textarea id="adminResponse" rows="3" placeholder="Adicione uma resposta oficial...">${reclamacao.adminResponse || ''}</textarea>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Salvar Alterações
                </button>
                <button type="button" class="btn btn-secondary" onclick="closeEditModal()">
                    <i class="fas fa-times"></i> Cancelar
                </button>
            </div>
        </form>
    `;

    // Setup form submission
    document.getElementById('editReclamacaoForm').addEventListener('submit', handleEditReclamacao);

    modal.style.display = 'block';
}

// Handle edit reclamação
function handleEditReclamacao(e) {
    e.preventDefault();

    const reclamacaoId = document.getElementById('editReclamacaoId').value;
    const reclamacaoIndex = reclamacoes.findIndex(r => r.id === reclamacaoId);

    if (reclamacaoIndex === -1) return;

    // Update reclamação
    reclamacoes[reclamacaoIndex] = {
        ...reclamacoes[reclamacaoIndex],
        titulo: document.getElementById('editTitulo').value,
        status: document.getElementById('editStatus').value,
        categoria: document.getElementById('editCategoria').value,
        descricao: document.getElementById('editDescricao').value,
        localizacao: document.getElementById('editLocalizacao').value,
        adminResponse: document.getElementById('adminResponse').value,
        lastModified: new Date().toISOString(),
        modifiedBy: currentAdmin.email
    };

    saveData();
    closeEditModal();
    loadReclamacoesTable();
    loadDashboardData();
    showMessage('Reclamação atualizada com sucesso!', 'success');
}

// View reclamação
function viewReclamacao(reclamacaoId) {
    const reclamacao = reclamacoes.find(r => r.id === reclamacaoId);
    if (!reclamacao) return;

    const modal = document.getElementById('editReclamacaoModal');
    const content = document.getElementById('editModalContent');

    let mediaHtml = '';
    if (reclamacao.midia && reclamacao.midia.length > 0) {
        mediaHtml = `
            <div class="view-media">
                <h4>Mídia Anexada:</h4>
                <div class="media-grid">
                    ${reclamacao.midia.map(media => {
                        if (media.type.startsWith('image/')) {
                            return `<img src="${media.data}" alt="Foto da reclamação" style="max-width: 200px; height: auto; border-radius: 5px;">`;
                        } else if (media.type.startsWith('video/')) {
                            return `<video src="${media.data}" controls style="max-width: 200px; height: auto; border-radius: 5px;"></video>`;
                        }
                        return '';
                    }).join('')}
                </div>
            </div>
        `;
    }

    content.innerHTML = `
        <h2><i class="fas fa-eye"></i> Visualizar Reclamação</h2>
        <div class="view-content">
            <div class="view-field">
                <strong>ID:</strong> ${reclamacao.id}
            </div>
            <div class="view-field">
                <strong>Título:</strong> ${reclamacao.titulo}
            </div>
            <div class="view-field">
                <strong>Status:</strong> <span class="status-badge ${reclamacao.status}">${getStatusLabel(reclamacao.status)}</span>
            </div>
            <div class="view-field">
                <strong>Categoria:</strong> ${getCategoriaLabel(reclamacao.categoria)}
            </div>
            <div class="view-field">
                <strong>Descrição:</strong> ${reclamacao.descricao}
            </div>
            <div class="view-field">
                <strong>Localização:</strong> ${reclamacao.localizacao}
            </div>
            <div class="view-field">
                <strong>Usuário:</strong> ${reclamacao.usuario}
            </div>
            <div class="view-field">
                <strong>Data:</strong> ${formatDate(reclamacao.dataReclamacao)}
            </div>
            ${reclamacao.adminResponse ? `
                <div class="view-field">
                    <strong>Resposta do Admin:</strong> ${reclamacao.adminResponse}
                </div>
            ` : ''}
            ${mediaHtml}
        </div>
        <div class="form-actions">
            <button type="button" class="btn btn-primary" onclick="editReclamacao('${reclamacao.id}'); closeEditModal();">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button type="button" class="btn btn-secondary" onclick="closeEditModal()">
                <i class="fas fa-times"></i> Fechar
            </button>
        </div>
    `;

    modal.style.display = 'block';
}

// Delete reclamação
function deleteReclamacao(reclamacaoId) {
    if (!confirm('Tem certeza que deseja excluir esta reclamação?')) return;

    const index = reclamacoes.findIndex(r => r.id === reclamacaoId);
    if (index !== -1) {
        reclamacoes.splice(index, 1);
        saveData();
        loadReclamacoesTable();
        loadDashboardData();
        showMessage('Reclamação excluída com sucesso!', 'success');
    }
}

// View usuário
function viewUsuario(usuarioId) {
    const usuario = usuarios.find(u => u.id === usuarioId);
    if (!usuario) return;

    const userReclamacoes = reclamacoes.filter(r => r.usuarioId === usuario.id);

    const modal = document.getElementById('editReclamacaoModal');
    const content = document.getElementById('editModalContent');

    content.innerHTML = `
        <h2><i class="fas fa-user"></i> Visualizar Usuário</h2>
        <div class="view-content">
            <div class="view-field">
                <strong>ID:</strong> ${usuario.id}
            </div>
            <div class="view-field">
                <strong>Nome:</strong> ${usuario.nome}
            </div>
            <div class="view-field">
                <strong>Email:</strong> ${usuario.email}
            </div>
            <div class="view-field">
                <strong>Telefone:</strong> ${usuario.telefone}
            </div>
            <div class="view-field">
                <strong>Endereço:</strong> ${usuario.endereco}
            </div>
            <div class="view-field">
                <strong>Bairro:</strong> ${usuario.bairro}
            </div>
            <div class="view-field">
                <strong>Cidade:</strong> ${usuario.cidade}
            </div>
            <div class="view-field">
                <strong>Data de Cadastro:</strong> ${formatDate(usuario.dataCadastro)}
            </div>
            <div class="view-field">
                <strong>Total de Reclamações:</strong> ${userReclamacoes.length}
            </div>
            ${userReclamacoes.length > 0 ? `
                <div class="view-field">
                    <strong>Reclamações:</strong>
                    <ul style="margin-top: 0.5rem;">
                        ${userReclamacoes.map(r => `
                            <li style="margin-bottom: 0.5rem;">
                                <strong>${r.titulo}</strong> -
                                <span class="status-badge ${r.status}">${getStatusLabel(r.status)}</span>
                                (${formatDate(r.dataReclamacao)})
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
        <div class="form-actions">
            <button type="button" class="btn btn-secondary" onclick="closeEditModal()">
                <i class="fas fa-times"></i> Fechar
            </button>
        </div>
    `;

    modal.style.display = 'block';
}

// Delete usuário
function deleteUsuario(usuarioId) {
    if (!confirm('Tem certeza que deseja excluir este usuário? Todas as reclamações dele também serão excluídas.')) return;

    // Remove user
    const userIndex = usuarios.findIndex(u => u.id === usuarioId);
    if (userIndex !== -1) {
        usuarios.splice(userIndex, 1);
    }

    // Remove user's reclamações
    reclamacoes = reclamacoes.filter(r => r.usuarioId !== usuarioId);

    saveData();
    loadUsuariosTable();
    loadReclamacoesTable();
    loadDashboardData();
    showMessage('Usuário e suas reclamações foram excluídos!', 'success');
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editReclamacaoModal').style.display = 'none';
}

// Set default report date
function setDefaultReportDate(reportType) {
    const today = new Date();
    const startDateInput = document.getElementById('reportStartDate');

    switch(reportType) {
        case 'daily':
            startDateInput.value = today.toISOString().split('T')[0];
            break;
        case 'weekly':
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            startDateInput.value = weekStart.toISOString().split('T')[0];
            break;
        case 'monthly':
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
            startDateInput.value = monthStart.toISOString().split('T')[0];
            break;
    }
}

// Generate report
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const startDate = new Date(document.getElementById('reportStartDate').value);
    let endDate = new Date();

    if (reportType === 'custom') {
        endDate = new Date(document.getElementById('reportEndDate').value);
    } else {
        // Set end date based on report type
        switch(reportType) {
            case 'daily':
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 1);
                break;
            case 'weekly':
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 7);
                break;
            case 'monthly':
                endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
                break;
        }
    }

    // Filter reclamações by date range
    const filteredReclamacoes = reclamacoes.filter(r => {
        const reclamacaoDate = new Date(r.dataReclamacao);
        return reclamacaoDate >= startDate && reclamacaoDate <= endDate;
    });

    // Generate report data
    currentReportData = {
        type: reportType,
        startDate: startDate,
        endDate: endDate,
        reclamacoes: filteredReclamacoes,
        stats: generateReportStats(filteredReclamacoes)
    };

    displayReport(currentReportData);
}

// Generate report stats
function generateReportStats(reclamacoes) {
    const stats = {
        total: reclamacoes.length,
        pendentes: reclamacoes.filter(r => r.status === 'pendente').length,
        emAndamento: reclamacoes.filter(r => r.status === 'em-andamento').length,
        resolvidas: reclamacoes.filter(r => r.status === 'resolvida').length,
        categorias: {},
        porDia: {}
    };

    // Count by category
    reclamacoes.forEach(r => {
        stats.categorias[r.categoria] = (stats.categorias[r.categoria] || 0) + 1;

        // Count by day
        const day = new Date(r.dataReclamacao).toDateString();
        stats.porDia[day] = (stats.porDia[day] || 0) + 1;
    });

    return stats;
}

// Display report
function displayReport(reportData) {
    const container = document.getElementById('reportContent');
    const { stats, reclamacoes, startDate, endDate, type } = reportData;

    const reportTypeLabel = {
        'daily': 'Diário',
        'weekly': 'Semanal',
        'monthly': 'Mensal',
        'custom': 'Personalizado'
    };

    container.innerHTML = `
        <div class="report-header">
            <h3><i class="fas fa-chart-line"></i> Relatório ${reportTypeLabel[type]}</h3>
            <p><strong>Período:</strong> ${formatDate(startDate.toISOString())} até ${formatDate(endDate.toISOString())}</p>
            <p><strong>Gerado em:</strong> ${formatDate(new Date().toISOString())} às ${new Date().toLocaleTimeString()}</p>
        </div>

        <div class="report-stats">
            <div class="report-stat-grid">
                <div class="report-stat-item">
                    <h4>${stats.total}</h4>
                    <p>Total de Reclamações</p>
                </div>
                <div class="report-stat-item">
                    <h4>${stats.pendentes}</h4>
                    <p>Pendentes</p>
                </div>
                <div class="report-stat-item">
                    <h4>${stats.emAndamento}</h4>
                    <p>Em Andamento</p>
                </div>
                <div class="report-stat-item">
                    <h4>${stats.resolvidas}</h4>
                    <p>Resolvidas</p>
                </div>
            </div>
        </div>

        <div class="report-section">
            <h4>Reclamações por Categoria</h4>
            <div class="category-stats">
                ${Object.entries(stats.categorias).map(([categoria, count]) => `
                    <div class="category-stat">
                        <span>${getCategoriaLabel(categoria)}</span>
                        <span class="count">${count}</span>
                    </div>
                `).join('')}
            </div>
        </div>

        ${reclamacoes.length > 0 ? `
            <div class="report-section">
                <h4>Lista de Reclamações</h4>
                <div class="report-table">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Título</th>
                                <th>Categoria</th>
                                <th>Status</th>
                                <th>Usuário</th>
                                <th>Localização</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reclamacoes.map(r => `
                                <tr>
                                    <td>${formatDate(r.dataReclamacao)}</td>
                                    <td>${r.titulo}</td>
                                    <td>${getCategoriaLabel(r.categoria)}</td>
                                    <td><span class="status-badge ${r.status}">${getStatusLabel(r.status)}</span></td>
                                    <td>${r.usuario}</td>
                                    <td>${r.localizacao}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        ` : '<p style="text-align: center; color: #666;">Nenhuma reclamação encontrada no período selecionado.</p>'}
    `;
}

// Export to PDF
function exportToPDF() {
    if (!currentReportData) {
        showMessage('Gere um relatório primeiro!', 'error');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text('Meu Bairro Alerta - Relatório', 20, 20);

    doc.setFontSize(12);
    doc.text(`Período: ${formatDate(currentReportData.startDate.toISOString())} até ${formatDate(currentReportData.endDate.toISOString())}`, 20, 35);
    doc.text(`Gerado em: ${formatDate(new Date().toISOString())} às ${new Date().toLocaleTimeString()}`, 20, 45);

    // Stats
    let yPos = 60;
    doc.setFontSize(16);
    doc.text('Estatísticas:', 20, yPos);

    yPos += 15;
    doc.setFontSize(12);
    doc.text(`Total de Reclamações: ${currentReportData.stats.total}`, 20, yPos);
    yPos += 10;
    doc.text(`Pendentes: ${currentReportData.stats.pendentes}`, 20, yPos);
    yPos += 10;
    doc.text(`Em Andamento: ${currentReportData.stats.emAndamento}`, 20, yPos);
    yPos += 10;
    doc.text(`Resolvidas: ${currentReportData.stats.resolvidas}`, 20, yPos);

    // Categories
    yPos += 20;
    doc.setFontSize(16);
    doc.text('Por Categoria:', 20, yPos);

    yPos += 15;
    doc.setFontSize(12);
    Object.entries(currentReportData.stats.categorias).forEach(([categoria, count]) => {
        doc.text(`${getCategoriaLabel(categoria)}: ${count}`, 20, yPos);
        yPos += 10;
    });

    // Save
    const filename = `relatorio_${currentReportData.type}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);

    showMessage('Relatório PDF exportado com sucesso!', 'success');
}

// Export to Excel
function exportToExcel() {
    if (!currentReportData) {
        showMessage('Gere um relatório primeiro!', 'error');
        return;
    }

    // Prepare data for Excel
    const worksheetData = [
        ['Meu Bairro Alerta - Relatório'],
        [`Período: ${formatDate(currentReportData.startDate.toISOString())} até ${formatDate(currentReportData.endDate.toISOString())}`],
        [`Gerado em: ${formatDate(new Date().toISOString())} às ${new Date().toLocaleTimeString()}`],
        [],
        ['ESTATÍSTICAS'],
        ['Total de Reclamações', currentReportData.stats.total],
        ['Pendentes', currentReportData.stats.pendentes],
        ['Em Andamento', currentReportData.stats.emAndamento],
        ['Resolvidas', currentReportData.stats.resolvidas],
        [],
        ['POR CATEGORIA']
    ];

    // Add category data
    Object.entries(currentReportData.stats.categorias).forEach(([categoria, count]) => {
        worksheetData.push([getCategoriaLabel(categoria), count]);
    });

    // Add reclamações data
    if (currentReportData.reclamacoes.length > 0) {
        worksheetData.push([]);
        worksheetData.push(['LISTA DE RECLAMAÇÕES']);
        worksheetData.push(['Data', 'Título', 'Categoria', 'Status', 'Usuário', 'Localização']);

        currentReportData.reclamacoes.forEach(r => {
            worksheetData.push([
                formatDate(r.dataReclamacao),
                r.titulo,
                getCategoriaLabel(r.categoria),
                getStatusLabel(r.status),
                r.usuario,
                r.localizacao
            ]);
        });
    }

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório');

    // Save file
    const filename = `relatorio_${currentReportData.type}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename);

    showMessage('Relatório Excel exportado com sucesso!', 'success');
}

// Backup data
function backupData() {
    const backupData = {
        usuarios: usuarios,
        reclamacoes: reclamacoes,
        timestamp: new Date().toISOString(),
        version: '1.0'
    };

    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `backup_meubairroalerta_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showMessage('Backup criado com sucesso!', 'success');
}

// Handle restore file
function handleRestoreFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!confirm('Tem certeza que deseja restaurar os dados? Todos os dados atuais serão substituídos!')) {
        e.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backupData = JSON.parse(e.target.result);

            if (backupData.usuarios && backupData.reclamacoes) {
                usuarios = backupData.usuarios;
                reclamacoes = backupData.reclamacoes;
                saveData();

                // Reload all data
                loadDashboardData();
                loadReclamacoesTable();
                loadUsuariosTable();

                showMessage('Dados restaurados com sucesso!', 'success');
            } else {
                showMessage('Arquivo de backup inválido!', 'error');
            }
        } catch (error) {
            showMessage('Erro ao ler arquivo de backup!', 'error');
        }
    };
    reader.readAsText(file);

    e.target.value = '';
}

// Clear all data
function clearAllData() {
    if (!confirm('ATENÇÃO: Esta ação irá apagar TODOS os dados do sistema. Tem certeza?')) return;
    if (!confirm('Esta ação é IRREVERSÍVEL. Confirma novamente?')) return;

    usuarios = [];
    reclamacoes = [];

    localStorage.removeItem('usuarios');
    localStorage.removeItem('reclamacoes');
    localStorage.removeItem('currentUser');

    // Reload all data
    loadDashboardData();
    loadReclamacoesTable();
    loadUsuariosTable();

    showMessage('Todos os dados foram apagados!', 'success');
}

// Admin logout
function adminLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
        currentAdmin = null;
        localStorage.removeItem('currentAdmin');

        document.getElementById('adminDashboard').classList.add('hidden');
        document.getElementById('adminLogin').classList.remove('hidden');

        // Reset form
        document.getElementById('adminLoginForm').reset();

        showMessage('Logout realizado com sucesso!', 'success');
    }
}

// Utility functions
function getCategoriaLabel(categoria) {
    const labels = {
        'iluminacao': 'Iluminação Pública',
        'asfalto': 'Asfalto/Pavimentação',
        'limpeza': 'Limpeza Urbana',
        'seguranca': 'Segurança',
        'transporte': 'Transporte Público',
        'agua': 'Água e Esgoto',
        'outros': 'Outros'
    };
    return labels[categoria] || categoria;
}

function getStatusLabel(status) {
    const labels = {
        'pendente': 'Pendente',
        'em-andamento': 'Em Andamento',
        'resolvida': 'Resolvida'
    };
    return labels[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function getTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return 'Agora mesmo';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} min atrás`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}h atrás`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} dia${days > 1 ? 's' : ''} atrás`;
    }
}

function showMessage(message, type) {
    // Usar a função do sistema principal se disponível
    if (typeof window.showMessage === 'function') {
        window.showMessage(message, type);
        return;
    }

    // Fallback para alert
    alert(message);
}

// Make functions global
window.clearAdminFilters = clearAdminFilters;
window.editReclamacao = editReclamacao;
window.viewReclamacao = viewReclamacao;
window.deleteReclamacao = deleteReclamacao;
window.viewUsuario = viewUsuario;
window.deleteUsuario = deleteUsuario;
window.closeEditModal = closeEditModal;
window.generateReport = generateReport;
window.exportToPDF = exportToPDF;
window.exportToExcel = exportToExcel;
window.backupData = backupData;
window.clearAllData = clearAllData;
window.adminLogout = adminLogout;

// Notification Management Functions
function loadNotificationSettings() {
    console.log('Carregando configurações de notificação...');

    if (typeof emailNotificationSystem === 'undefined') {
        console.error('Sistema de notificações não carregado');
        // Tentar carregar novamente após um delay
        setTimeout(() => {
            if (typeof emailNotificationSystem !== 'undefined') {
                loadNotificationSettings();
            } else {
                showMessage('Sistema de notificações não disponível. Verifique se o arquivo notifications.js foi carregado.', 'error');
            }
        }, 1000);
        return;
    }

    console.log('emailNotificationSystem disponível:', emailNotificationSystem);

    const status = emailNotificationSystem.getStatus();
    console.log('Status atual:', status);

    updateNotificationStatus(status);
    loadNotificationForm();
    setupNotificationEventListeners();
}

function updateNotificationStatus(status) {
    const statusCard = document.getElementById('notificationStatusCard');
    const statusIcon = document.getElementById('statusIcon');
    const statusTitle = document.getElementById('statusTitle');
    const statusDescription = document.getElementById('statusDescription');
    const notificationToggle = document.getElementById('notificationToggle');

    if (status.isConfigured && status.isEnabled) {
        statusIcon.innerHTML = '<i class="fas fa-bell"></i>';
        statusIcon.classList.add('enabled');
        statusTitle.textContent = 'Notificações Ativas';
        statusDescription.textContent = `Enviando alertas para ${status.adminEmail}`;
        notificationToggle.checked = true;
    } else if (status.isConfigured && !status.isEnabled) {
        statusIcon.innerHTML = '<i class="fas fa-bell-slash"></i>';
        statusIcon.classList.remove('enabled');
        statusTitle.textContent = 'Notificações Configuradas';
        statusDescription.textContent = 'EmailJS configurado, mas notificações desabilitadas';
        notificationToggle.checked = false;
    } else {
        statusIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        statusIcon.classList.remove('enabled');
        statusTitle.textContent = 'Configuração Necessária';
        statusDescription.textContent = 'Configure o EmailJS para receber alertas';
        notificationToggle.checked = false;
    }
}

function loadNotificationForm() {
    if (typeof emailNotificationSystem === 'undefined') {
        console.error('emailNotificationSystem não disponível em loadNotificationForm');
        return;
    }

    const config = emailNotificationSystem.emailjsConfig;
    const adminEmail = emailNotificationSystem.adminEmail;

    console.log('Carregando formulário com config:', config);

    const serviceIdField = document.getElementById('emailServiceId');
    const templateIdField = document.getElementById('emailTemplateId');
    const publicKeyField = document.getElementById('emailPublicKey');
    const adminEmailField = document.getElementById('adminEmailAddress');

    if (serviceIdField) serviceIdField.value = config.serviceId === 'service_meubairo' ? '' : config.serviceId;
    if (templateIdField) templateIdField.value = config.templateId === 'template_nova_reclamacao' ? '' : config.templateId;
    if (publicKeyField) publicKeyField.value = config.publicKey === 'YOUR_PUBLIC_KEY' ? '' : config.publicKey;
    if (adminEmailField) adminEmailField.value = adminEmail;
}

function setupNotificationEventListeners() {
    const notificationToggle = document.getElementById('notificationToggle');
    notificationToggle.addEventListener('change', function() {
        const enabled = this.checked;
        const result = emailNotificationSystem.toggleNotifications(enabled);

        if (result) {
            showMessage('Notificações habilitadas!', 'success');
        } else {
            showMessage('Notificações desabilitadas!', 'info');
        }

        updateNotificationStatus(emailNotificationSystem.getStatus());
    });
}

function saveEmailConfig() {
    console.log('Iniciando saveEmailConfig...');

    // Verificar se o sistema de notificações está disponível
    if (typeof emailNotificationSystem === 'undefined') {
        console.error('emailNotificationSystem não está disponível');
        showMessage('Sistema de notificações não carregado. Recarregue a página.', 'error');
        return;
    }

    const serviceId = document.getElementById('emailServiceId').value.trim();
    const templateId = document.getElementById('emailTemplateId').value.trim();
    const publicKey = document.getElementById('emailPublicKey').value.trim();
    const adminEmail = document.getElementById('adminEmailAddress').value.trim();

    console.log('Valores capturados:', { serviceId, templateId, publicKey, adminEmail });

    if (!serviceId || !templateId || !publicKey || !adminEmail) {
        showMessage('Preencha todos os campos!', 'error');
        return;
    }

    if (!adminEmail.includes('@')) {
        showMessage('Email inválido!', 'error');
        return;
    }

    try {
        // Configurar EmailJS
        emailNotificationSystem.configureEmailJS(serviceId, templateId, publicKey);
        emailNotificationSystem.adminEmail = adminEmail;
        emailNotificationSystem.saveConfig();

        console.log('Configuração salva:', emailNotificationSystem.getStatus());

        // Atualizar status
        updateNotificationStatus(emailNotificationSystem.getStatus());

        showMessage('Configuração salva com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao salvar configuração:', error);
        showMessage('Erro ao salvar configuração: ' + error.message, 'error');
    }
}

async function testEmailNotification() {
    const result = await emailNotificationSystem.sendTestEmail();

    if (result.success) {
        showMessage(result.message, 'success');
        addNotificationToHistory('Teste', 'Email de teste enviado com sucesso', true);
    } else {
        showMessage(result.message || result.reason, 'error');
        addNotificationToHistory('Teste', result.message || result.reason, false);
    }
}

function addNotificationToHistory(type, message, success) {
    const historyList = document.getElementById('notificationHistoryList');

    // Remover mensagem de "nenhuma notificação" se existir
    if (historyList.children.length === 1 && historyList.children[0].tagName === 'P') {
        historyList.innerHTML = '';
    }

    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';

    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR');

    historyItem.innerHTML = `
        <div class="history-icon ${success ? 'success' : 'error'}">
            <i class="fas fa-${success ? 'check' : 'times'}"></i>
        </div>
        <div class="history-content">
            <h4>${type} - ${success ? 'Sucesso' : 'Erro'}</h4>
            <p>${message}</p>
        </div>
        <div class="history-time">${timeString}</div>
    `;

    // Adicionar no início da lista
    historyList.insertBefore(historyItem, historyList.firstChild);

    // Manter apenas os últimos 10 itens
    while (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
}

// Integrar com criação de reclamações
function setupNotificationIntegration() {
    // Interceptar a função de adicionar reclamação
    const originalHandleNovaReclamacao = window.handleNovaReclamacao;
    if (originalHandleNovaReclamacao) {
        window.handleNovaReclamacao = async function(e) {
            // Chamar função original
            const result = originalHandleNovaReclamacao.call(this, e);

            // Se a reclamação foi criada com sucesso, enviar notificação
            if (result && typeof emailNotificationSystem !== 'undefined') {
                const reclamacoes = JSON.parse(localStorage.getItem('reclamacoes') || '[]');
                const ultimaReclamacao = reclamacoes[reclamacoes.length - 1];

                if (ultimaReclamacao && emailNotificationSystem.isEnabled) {
                    const notificationResult = await emailNotificationSystem.sendNewReclamacaoNotification(ultimaReclamacao);

                    if (notificationResult.success) {
                        console.log('Notificação enviada:', notificationResult.message);
                        addNotificationToHistory('Nova Reclamação', `Alerta enviado: ${ultimaReclamacao.titulo}`, true);
                    } else {
                        console.warn('Falha ao enviar notificação:', notificationResult.message || notificationResult.reason);
                        addNotificationToHistory('Nova Reclamação', notificationResult.message || notificationResult.reason, false);
                    }
                }
            }

            return result;
        };
    }
}

// Configurar integração quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(setupNotificationIntegration, 2000);
});

// Função de debug
function debugNotificationSystem() {
    console.log('=== DEBUG NOTIFICATION SYSTEM ===');
    console.log('emailNotificationSystem disponível:', typeof emailNotificationSystem !== 'undefined');
    if (typeof emailNotificationSystem !== 'undefined') {
        console.log('Status:', emailNotificationSystem.getStatus());
        console.log('Config:', emailNotificationSystem.emailjsConfig);
        console.log('Admin Email:', emailNotificationSystem.adminEmail);
        console.log('Enabled:', emailNotificationSystem.isEnabled);
    }
    console.log('EmailJS disponível:', typeof emailjs !== 'undefined');
    console.log('Campos do formulário:');
    console.log('- Service ID:', document.getElementById('emailServiceId')?.value);
    console.log('- Template ID:', document.getElementById('emailTemplateId')?.value);
    console.log('- Public Key:', document.getElementById('emailPublicKey')?.value);
    console.log('- Admin Email:', document.getElementById('adminEmailAddress')?.value);
    console.log('=== FIM DEBUG ===');
}

// Tornar funções globais
window.saveEmailConfig = saveEmailConfig;
window.testEmailNotification = testEmailNotification;
window.loadNotificationSettings = loadNotificationSettings;
window.debugNotificationSystem = debugNotificationSystem;
