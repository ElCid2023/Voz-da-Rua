// CORREÇÃO ESPECÍFICA PARA ANDROID 10 - TELA 384x699
document.addEventListener('DOMContentLoaded', function() {
    console.log('🤖 Aplicando correções para Android 10');
    
    // Detectar Android
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (!isAndroid) return;
    
    // Adicionar CSS específico para Android
    const androidCSS = document.createElement('style');
    androidCSS.textContent = `
        /* ANDROID 10 ESPECÍFICO */
        @media (max-width: 400px) {
            input, select, textarea {
                font-size: 16px !important;
                padding: 12px !important;
                border: 2px solid #007bff !important;
                background: white !important;
                -webkit-appearance: none !important;
                touch-action: manipulation !important;
            }
            
            button {
                font-size: 16px !important;
                padding: 15px !important;
                touch-action: manipulation !important;
                -webkit-tap-highlight-color: rgba(0,123,255,0.3) !important;
            }
            
            .nav-link {
                font-size: 14px !important;
                padding: 12px 16px !important;
                touch-action: manipulation !important;
            }
        }
    `;
    document.head.appendChild(androidCSS);
    
    // Melhorar event listeners para Android
    setTimeout(() => {
        // Formulários
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('touchstart', function() {}, { passive: true });
            
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('touchstart', function() {
                    this.focus();
                }, { passive: true });
            });
        });
        
        // Navegação
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('touchend', function(e) {
                e.preventDefault();
                const target = this.getAttribute('href').substring(1);
                if (target && typeof showSection === 'function') {
                    setTimeout(() => showSection(target), 150);
                }
            }, { passive: false });
        });
        
        console.log('✅ Correções Android aplicadas');
    }, 1000);
});