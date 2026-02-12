# 📧 Guia de Configuração EmailJS - Meu Bairro Alerta

Este guia ensina como configurar o EmailJS para receber notificações automáticas por email quando novas reclamações forem criadas.

## 🎯 O que você vai conseguir

Após seguir este guia, você receberá um email automático no endereço **cidborgesead2020@gmail.com** sempre que:
- Uma nova reclamação for criada no sistema
- Você quiser testar o sistema de notificações
- Relatórios diários forem gerados

## 📋 Pré-requisitos

- Conta de email (Gmail, Outlook, Yahoo, etc.)
- Acesso à área administrativa do Meu Bairro Alerta
- 10 minutos para configuração

## 🚀 Passo a Passo

### 1. Criar Conta no EmailJS

1. **Acesse** [https://www.emailjs.com](https://www.emailjs.com)
2. **Clique** em "Sign Up" (Cadastrar)
3. **Preencha** seus dados:
   - Email: cidborgesead2020@gmail.com
   - Senha: (escolha uma senha segura)
   - Nome: Administrador Meu Bairro Alerta
4. **Confirme** seu email clicando no link enviado

### 2. Configurar Serviço de Email

1. **Faça login** no EmailJS
2. **Vá para** "Email Services"
3. **Clique** em "Add New Service"
4. **Escolha** seu provedor:
   - **Gmail** (recomendado)
   - Outlook
   - Yahoo
   - Outros
5. **Conecte** sua conta seguindo as instruções
6. **Anote** o **Service ID** (ex: service_xxxxxxx)

### 3. Criar Template de Email

1. **Vá para** "Email Templates"
2. **Clique** em "Create New Template"
3. **Configure** o template:

#### Configurações Básicas:
- **Template Name:** Nova Reclamação - Meu Bairro Alerta
- **Subject:** 🚨 Nova Reclamação - {{reclamacao_titulo}}

#### Conteúdo do Email:
```html
Olá Administrador,

Uma nova reclamação foi registrada no sistema Meu Bairro Alerta:

📋 DETALHES DA RECLAMAÇÃO:
• Título: {{reclamacao_titulo}}
• Categoria: {{reclamacao_categoria}}
• Descrição: {{reclamacao_descricao}}
• Localização: {{reclamacao_localizacao}}
• Usuário: {{usuario_nome}}
• Data: {{data_reclamacao}}

🔗 AÇÕES:
Acesse a área administrativa para gerenciar esta reclamação:
{{admin_url}}

---
Meu Bairro Alerta
Sistema de Gestão de Reclamações Urbanas
```

#### Configurações do Template:
- **To Email:** {{to_email}}
- **From Name:** Meu Bairro Alerta
- **Reply To:** noreply@meubairroalerta.com

4. **Salve** o template
5. **Anote** o **Template ID** (ex: template_xxxxxxx)

### 4. Obter Public Key

1. **Vá para** "Account" → "General"
2. **Encontre** a seção "Public Key"
3. **Copie** a chave (ex: user_xxxxxxxxxxxxxxxx)

### 5. Configurar no Sistema

1. **Acesse** a área administrativa: `admin.html`
2. **Faça login** com as credenciais de admin
3. **Clique** em "Notificações" no menu
4. **Preencha** os campos:
   - **Service ID:** (copiado do passo 2)
   - **Template ID:** (copiado do passo 3)
   - **Public Key:** (copiado do passo 4)
   - **Email do Administrador:** cidborgesead2020@gmail.com
5. **Clique** em "Salvar Configuração"
6. **Teste** clicando em "Enviar Teste"

## ✅ Verificação

### Teste Básico
1. Na área administrativa, clique em "Enviar Teste"
2. Verifique se recebeu o email em cidborgesead2020@gmail.com
3. Se não recebeu, verifique:
   - Caixa de spam
   - Configurações do EmailJS
   - Credenciais inseridas

### Teste Completo
1. Vá para o site principal
2. Crie uma nova reclamação de teste
3. Verifique se recebeu notificação automática

## 🔧 Solução de Problemas

### Email não chegou?
- ✅ Verifique a caixa de spam
- ✅ Confirme se o Service ID está correto
- ✅ Verifique se o Template ID está correto
- ✅ Confirme se a Public Key está correta
- ✅ Teste com outro email

### Erro "Service not found"?
- ✅ Verifique se o Service ID está correto
- ✅ Confirme se o serviço está ativo no EmailJS
- ✅ Verifique se a conta EmailJS está verificada

### Erro "Template not found"?
- ✅ Verifique se o Template ID está correto
- ✅ Confirme se o template foi salvo
- ✅ Verifique se todas as variáveis estão configuradas

### Erro "Invalid public key"?
- ✅ Copie novamente a Public Key do painel
- ✅ Verifique se não há espaços extras
- ✅ Confirme se a conta está ativa

## 📊 Limites do Plano Gratuito

O EmailJS oferece no plano gratuito:
- **200 emails por mês**
- **2 serviços de email**
- **3 templates**

Para um sistema de reclamações urbanas, isso é suficiente para:
- Aproximadamente 6-7 reclamações por dia
- Emails de teste
- Relatórios semanais

## 🔒 Segurança

### Boas Práticas:
- ✅ Use uma senha forte no EmailJS
- ✅ Não compartilhe suas credenciais
- ✅ Monitore o uso mensal
- ✅ Configure 2FA se disponível

### Dados Protegidos:
- As credenciais ficam apenas no seu navegador
- O EmailJS não armazena conteúdo dos emails
- Todas as comunicações são criptografadas

## 🎯 Próximos Passos

Após configurar o EmailJS:

1. **Teste** o sistema criando reclamações de exemplo
2. **Configure** relatórios automáticos (se desejar)
3. **Monitore** o funcionamento nos primeiros dias
4. **Ajuste** templates conforme necessário

## 📞 Suporte

### Documentação EmailJS:
- [Guia Oficial](https://www.emailjs.com/docs/)
- [Exemplos de Templates](https://www.emailjs.com/docs/examples/)
- [FAQ](https://www.emailjs.com/docs/faq/)

### Suporte do Sistema:
- Verifique o console do navegador para erros
- Teste com diferentes navegadores
- Confirme se JavaScript está habilitado

---

## 🎉 Conclusão

Com o EmailJS configurado, você terá:
- ✅ **Notificações automáticas** de novas reclamações
- ✅ **Emails de teste** para verificar funcionamento
- ✅ **Sistema profissional** de alertas
- ✅ **Gestão eficiente** das reclamações urbanas

O sistema está pronto para notificar **cidborgesead2020@gmail.com** sobre todas as atividades importantes do Meu Bairro Alerta! 📧✨

---

**Meu Bairro Alerta** - Conectando cidadãos e administração pública! 🏘️

---

## 👨‍💻 Desenvolvedor

**💻 Criado por ProfBorges**
*Sistema de notificações por email para gestão urbana*
