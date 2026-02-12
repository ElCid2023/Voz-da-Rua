// Tutorial JavaScript
let currentStep = 1;
const totalSteps = 9;
let completedSteps = new Set();

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeTutorial();
    setupEventListeners();
    updateProgress();
});

// Inicializar tutorial
function initializeTutorial() {
    // Carregar progresso salvo
    const savedProgress = localStorage.getItem('tutorialProgress');
    if (savedProgress) {
        completedSteps = new Set(JSON.parse(savedProgress));
    }
    
    // Verificar se há hash na URL
    const hash = window.location.hash.substring(1);
    if (hash && hash.startsWith('step')) {
        const stepNumber = parseInt(hash.replace('step', ''));
        if (stepNumber >= 1 && stepNumber <= totalSteps) {
            currentStep = stepNumber;
        }
    }
    
    showStep(currentStep);
    updateNavigationButtons();
}

// Configurar event listeners
function setupEventListeners() {
    // Links de navegação do índice
    document.querySelectorAll('.tutorial-nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const stepId = this.getAttribute('href').substring(1);
            const stepNumber = parseInt(stepId.replace('step', ''));
            goToStep(stepNumber);
        });
    });
    
    // Navegação por hash
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash && hash.startsWith('step')) {
            const stepNumber = parseInt(hash.replace('step', ''));
            if (stepNumber >= 1 && stepNumber <= totalSteps) {
                goToStep(stepNumber);
            }
        }
    });
    
    // Teclas de atalho
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' && currentStep > 1) {
            previousStep();
        } else if (e.key === 'ArrowRight' && currentStep < totalSteps) {
            nextStep();
        } else if (e.key === 'Escape') {
            // Voltar ao site principal
            window.location.href = 'index.html';
        }
    });
    
    // Marcar step como lido quando rolar até o final
    window.addEventListener('scroll', function() {
        const currentStepElement = document.querySelector('.tutorial-step.active');
        if (currentStepElement) {
            const rect = currentStepElement.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Se o usuário rolou até 80% do step, marcar como lido
            if (rect.bottom <= windowHeight * 1.2) {
                markStepAsCompleted(currentStep);
            }
        }
    });
}

// Mostrar step específico
function showStep(stepNumber) {
    // Esconder todos os steps
    document.querySelectorAll('.tutorial-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Mostrar step atual
    const targetStep = document.getElementById(`step${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
        currentStep = stepNumber;
        
        // Atualizar URL
        window.history.pushState(null, null, `#step${stepNumber}`);
        
        // Scroll para o topo
        window.scrollTo(0, 0);
        
        // Atualizar navegação
        updateNavigation();
        updateNavigationButtons();
        updateProgress();
    }
}

// Ir para step específico
function goToStep(stepNumber) {
    if (stepNumber >= 1 && stepNumber <= totalSteps) {
        showStep(stepNumber);
    }
}

// Próximo step
function nextStep() {
    if (currentStep < totalSteps) {
        markStepAsCompleted(currentStep);
        showStep(currentStep + 1);
    }
}

// Step anterior
function previousStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

// Marcar step como concluído
function markStepAsCompleted(stepNumber) {
    completedSteps.add(stepNumber);
    localStorage.setItem('tutorialProgress', JSON.stringify([...completedSteps]));
    updateNavigation();
    updateProgress();
}

// Atualizar navegação do índice
function updateNavigation() {
    document.querySelectorAll('.tutorial-nav-link').forEach((link, index) => {
        const stepNumber = index + 1;
        
        // Remover classes existentes
        link.classList.remove('active', 'completed');
        
        // Adicionar classe apropriada
        if (stepNumber === currentStep) {
            link.classList.add('active');
        } else if (completedSteps.has(stepNumber)) {
            link.classList.add('completed');
        }
    });
}

// Atualizar botões de navegação
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    }
    
    if (nextBtn) {
        if (currentStep === totalSteps) {
            nextBtn.innerHTML = '<i class="fas fa-home"></i> Ir para o Site';
            nextBtn.onclick = function() {
                window.location.href = 'index.html';
            };
        } else {
            nextBtn.innerHTML = 'Próximo <i class="fas fa-arrow-right"></i>';
            nextBtn.onclick = nextStep;
        }
    }
}

// Atualizar barra de progresso
function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill && progressText) {
        const progress = (completedSteps.size / totalSteps) * 100;
        const currentProgress = (currentStep / totalSteps) * 100;
        
        // Usar o maior entre progresso atual e steps concluídos
        const displayProgress = Math.max(progress, currentProgress);
        
        progressFill.style.width = `${displayProgress}%`;
        progressText.textContent = `${Math.round(displayProgress)}% Concluído`;
        
        // Adicionar efeito visual quando completar
        if (progress === 100) {
            progressFill.style.background = 'linear-gradient(90deg, #28a745, #20c997)';
            progressText.textContent = '🎉 Tutorial Concluído!';
            progressText.style.color = '#28a745';
            progressText.style.fontWeight = 'bold';
        }
    }
}

// Resetar progresso do tutorial
function resetTutorial() {
    if (confirm('Tem certeza que deseja resetar o progresso do tutorial?')) {
        completedSteps.clear();
        localStorage.removeItem('tutorialProgress');
        currentStep = 1;
        showStep(1);
        
        // Resetar barra de progresso
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill && progressText) {
            progressFill.style.background = 'linear-gradient(90deg, #007bff, #0056b3)';
            progressFill.style.width = '11.11%';
            progressText.textContent = '11% Concluído';
            progressText.style.color = '#666';
            progressText.style.fontWeight = '500';
        }
    }
}

// Pular para o final do tutorial
function skipToEnd() {
    if (confirm('Deseja pular para o final do tutorial?')) {
        // Marcar todos os steps como concluídos
        for (let i = 1; i <= totalSteps; i++) {
            completedSteps.add(i);
        }
        localStorage.setItem('tutorialProgress', JSON.stringify([...completedSteps]));
        
        // Ir para o último step
        showStep(totalSteps);
    }
}

// Compartilhar progresso
function shareProgress() {
    const progress = (completedSteps.size / totalSteps) * 100;
    const message = `Estou aprendendo a usar o Meu Bairro Alerta! Já concluí ${Math.round(progress)}% do tutorial. 🏘️`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Meu Bairro Alerta - Tutorial',
            text: message,
            url: window.location.href
        });
    } else {
        // Fallback para navegadores que não suportam Web Share API
        navigator.clipboard.writeText(message + ' ' + window.location.href).then(() => {
            alert('Link copiado para a área de transferência!');
        });
    }
}

// Adicionar funcionalidades extras ao tutorial
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar botão de reset (apenas para desenvolvimento/teste)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset Tutorial';
        resetBtn.className = 'btn btn-secondary';
        resetBtn.style.position = 'fixed';
        resetBtn.style.bottom = '20px';
        resetBtn.style.left = '20px';
        resetBtn.style.zIndex = '9999';
        resetBtn.onclick = resetTutorial;
        document.body.appendChild(resetBtn);
    }
    
    // Adicionar indicador de progresso no título
    const originalTitle = document.title;
    setInterval(() => {
        const progress = Math.round((completedSteps.size / totalSteps) * 100);
        document.title = `(${progress}%) ${originalTitle}`;
    }, 1000);
});

// Exportar funções para uso global
window.nextStep = nextStep;
window.previousStep = previousStep;
window.goToStep = goToStep;
window.resetTutorial = resetTutorial;
window.skipToEnd = skipToEnd;
window.shareProgress = shareProgress;
