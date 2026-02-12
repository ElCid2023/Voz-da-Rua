// Sistema de Notificações por Email
class EmailNotificationSystem {
    constructor() {
        this.emailjsConfig = {
            serviceId: 'service_meubairo', // Será configurado
            templateId: 'template_nova_reclamacao', // Será configurado
            publicKey: 'YOUR_PUBLIC_KEY' // Será configurado
        };
        
        this.adminEmail = 'cidborgesead2020@gmail.com';
        this.isEnabled = false;
        this.lastNotificationTime = 0;
        this.notificationCooldown = 60000; // 1 minuto entre notificações
        
        this.loadConfig();
        this.initializeEmailJS();
    }
    
    // Carregar configurações salvas
    loadConfig() {
        const savedConfig = localStorage.getItem('emailNotificationConfig');
        if (savedConfig) {
            const config = JSON.parse(savedConfig);
            this.emailjsConfig = { ...this.emailjsConfig, ...config.emailjsConfig };
            this.adminEmail = config.adminEmail || this.adminEmail;
            this.isEnabled = config.isEnabled || false;
        }
    }
    
    // Salvar configurações
    saveConfig() {
        const config = {
            emailjsConfig: this.emailjsConfig,
            adminEmail: this.adminEmail,
            isEnabled: this.isEnabled
        };
        localStorage.setItem('emailNotificationConfig', JSON.stringify(config));
    }
    
    // Inicializar EmailJS
    initializeEmailJS() {
        if (typeof emailjs !== 'undefined' && this.emailjsConfig.publicKey !== 'YOUR_PUBLIC_KEY') {
            emailjs.init(this.emailjsConfig.publicKey);
        }
    }
    
    // Configurar EmailJS
    configureEmailJS(serviceId, templateId, publicKey) {
        this.emailjsConfig = {
            serviceId: serviceId,
            templateId: templateId,
            publicKey: publicKey
        };
        this.saveConfig();
        this.initializeEmailJS();
    }
    
    // Habilitar/Desabilitar notificações
    toggleNotifications(enabled) {
        this.isEnabled = enabled;
        this.saveConfig();
        return this.isEnabled;
    }
    
    // Verificar se pode enviar notificação (cooldown)
    canSendNotification() {
        const now = Date.now();
        return (now - this.lastNotificationTime) > this.notificationCooldown;
    }
    
    // Enviar notificação de nova reclamação
    async sendNewReclamacaoNotification(reclamacao) {
        if (!this.isEnabled || !this.canSendNotification()) {
            return { success: false, reason: 'Notificações desabilitadas ou em cooldown' };
        }
        
        if (this.emailjsConfig.publicKey === 'YOUR_PUBLIC_KEY') {
            return { success: false, reason: 'EmailJS não configurado' };
        }
        
        try {
            const templateParams = {
                to_email: this.adminEmail,
                admin_name: 'Administrador',
                reclamacao_titulo: reclamacao.titulo,
                reclamacao_categoria: this.getCategoriaLabel(reclamacao.categoria),
                reclamacao_descricao: reclamacao.descricao,
                reclamacao_localizacao: reclamacao.localizacao,
                usuario_nome: reclamacao.usuario,
                data_reclamacao: this.formatDate(reclamacao.dataReclamacao),
                site_url: window.location.origin,
                admin_url: `${window.location.origin}/admin.html`
            };
            
            const response = await emailjs.send(
                this.emailjsConfig.serviceId,
                this.emailjsConfig.templateId,
                templateParams
            );
            
            this.lastNotificationTime = Date.now();
            this.saveConfig();
            
            return { 
                success: true, 
                response: response,
                message: 'Notificação enviada com sucesso!'
            };
            
        } catch (error) {
            console.error('Erro ao enviar notificação:', error);
            return { 
                success: false, 
                error: error,
                message: 'Erro ao enviar notificação: ' + error.text
            };
        }
    }
    
    // Enviar email de teste
    async sendTestEmail() {
        if (this.emailjsConfig.publicKey === 'YOUR_PUBLIC_KEY') {
            return { success: false, reason: 'EmailJS não configurado' };
        }
        
        try {
            const templateParams = {
                to_email: this.adminEmail,
                admin_name: 'Administrador',
                reclamacao_titulo: 'TESTE - Reclamação de Exemplo',
                reclamacao_categoria: 'Teste do Sistema',
                reclamacao_descricao: 'Esta é uma reclamação de teste para verificar se o sistema de notificações está funcionando corretamente.',
                reclamacao_localizacao: 'Endereço de Teste, 123',
                usuario_nome: 'Usuário de Teste',
                data_reclamacao: this.formatDate(new Date().toISOString()),
                site_url: window.location.origin,
                admin_url: `${window.location.origin}/admin.html`
            };
            
            const response = await emailjs.send(
                this.emailjsConfig.serviceId,
                this.emailjsConfig.templateId,
                templateParams
            );
            
            return { 
                success: true, 
                response: response,
                message: 'Email de teste enviado com sucesso!'
            };
            
        } catch (error) {
            console.error('Erro ao enviar email de teste:', error);
            return { 
                success: false, 
                error: error,
                message: 'Erro ao enviar email de teste: ' + error.text
            };
        }
    }
    
    // Enviar relatório diário por email
    async sendDailyReport(reportData) {
        if (!this.isEnabled) {
            return { success: false, reason: 'Notificações desabilitadas' };
        }
        
        if (this.emailjsConfig.publicKey === 'YOUR_PUBLIC_KEY') {
            return { success: false, reason: 'EmailJS não configurado' };
        }
        
        try {
            const templateParams = {
                to_email: this.adminEmail,
                admin_name: 'Administrador',
                report_date: this.formatDate(new Date().toISOString()),
                total_reclamacoes: reportData.stats.total,
                pendentes: reportData.stats.pendentes,
                em_andamento: reportData.stats.emAndamento,
                resolvidas: reportData.stats.resolvidas,
                novas_hoje: reportData.stats.total,
                site_url: window.location.origin,
                admin_url: `${window.location.origin}/admin.html`
            };
            
            const response = await emailjs.send(
                this.emailjsConfig.serviceId,
                'template_relatorio_diario', // Template específico para relatórios
                templateParams
            );
            
            return { 
                success: true, 
                response: response,
                message: 'Relatório diário enviado com sucesso!'
            };
            
        } catch (error) {
            console.error('Erro ao enviar relatório:', error);
            return { 
                success: false, 
                error: error,
                message: 'Erro ao enviar relatório: ' + error.text
            };
        }
    }
    
    // Utilitários
    getCategoriaLabel(categoria) {
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
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR');
    }
    
    // Obter status das notificações
    getStatus() {
        return {
            isEnabled: this.isEnabled,
            isConfigured: this.emailjsConfig.publicKey !== 'YOUR_PUBLIC_KEY',
            adminEmail: this.adminEmail,
            lastNotificationTime: this.lastNotificationTime,
            canSendNow: this.canSendNotification()
        };
    }
}

// Instância global do sistema de notificações
window.emailNotificationSystem = new EmailNotificationSystem();

// Função para integrar com o sistema principal
function setupEmailNotifications() {
    // Interceptar criação de novas reclamações
    const originalAddReclamacao = window.addReclamacao;
    if (originalAddReclamacao) {
        window.addReclamacao = function(reclamacao) {
            // Chamar função original
            const result = originalAddReclamacao.call(this, reclamacao);
            
            // Enviar notificação se habilitada
            if (result && emailNotificationSystem.isEnabled) {
                emailNotificationSystem.sendNewReclamacaoNotification(reclamacao)
                    .then(response => {
                        if (response.success) {
                            console.log('Notificação enviada:', response.message);
                        } else {
                            console.warn('Falha ao enviar notificação:', response.message || response.reason);
                        }
                    })
                    .catch(error => {
                        console.error('Erro na notificação:', error);
                    });
            }
            
            return result;
        };
    }
}

// Configurar notificações quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que outras funções estejam carregadas
    setTimeout(setupEmailNotifications, 1000);
});

// Exportar para uso global
window.setupEmailNotifications = setupEmailNotifications;
