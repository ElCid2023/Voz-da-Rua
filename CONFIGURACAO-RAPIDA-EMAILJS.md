# ⚡ Configuração Rápida EmailJS - 10 Minutos

Guia super rápido para configurar notificações por email no Meu Bairro Alerta.

## 🎯 O que você vai conseguir

Receber emails automáticos em **cidborgesead2020@gmail.com** sempre que uma nova reclamação for criada.

---

## 🚀 Passo 1: Criar Conta (2 min)

1. **Acesse:** [emailjs.com](https://www.emailjs.com)
2. **Clique:** "Sign Up"
3. **Preencha:**
   - Email: cidborgesead2020@gmail.com
   - Senha: (escolha uma segura)
   - Nome: Administrador Meu Bairro Alerta
4. **Confirme** o email

---

## 📧 Passo 2: Configurar Gmail (3 min)

1. **No painel EmailJS:** "Email Services"
2. **Clique:** "Add New Service"
3. **Escolha:** "Gmail"
4. **Conecte:** cidborgesead2020@gmail.com
5. **Autorize** o EmailJS
6. **📝 ANOTE:** Service ID (ex: service_abc123)

---

## 📝 Passo 3: Criar Template (3 min)

1. **Vá em:** "Email Templates"
2. **Clique:** "Create New Template"
3. **Configure:**

### Configurações Básicas:
```
Template Name: Nova Reclamação - Meu Bairro Alerta
Subject: 🚨 Nova Reclamação - {{reclamacao_titulo}}
From Name: Meu Bairro Alerta
To Email: {{to_email}}
```

### Conteúdo (copie e cole):
```
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

⚡ PRÓXIMOS PASSOS:
1. Analisar a reclamação em até 24 horas
2. Atualizar status para "Em Andamento"
3. Adicionar resposta oficial
4. Marcar como "Resolvida" quando concluir

---
Meu Bairro Alerta
Sistema de Gestão de Reclamações Urbanas
{{site_url}}

Este é um email automático. Não responda a esta mensagem.
```

4. **Salve** o template
5. **📝 ANOTE:** Template ID (ex: template_xyz789)

---

## 🔑 Passo 4: Obter Public Key (1 min)

1. **Vá em:** "Account" → "General"
2. **Encontre:** "Public Key"
3. **📝 ANOTE:** Public Key (ex: user_abcdefghijklmnop)

---

## ⚙️ Passo 5: Configurar no Sistema (1 min)

1. **Acesse:** [admin.html](admin.html)
2. **Login:** admin@meubairroalerta.com / admin123
3. **Clique:** "Notificações"
4. **Preencha:**
   - Service ID: (do passo 2)
   - Template ID: (do passo 3)
   - Public Key: (do passo 4)
   - Email Admin: cidborgesead2020@gmail.com
5. **Clique:** "Salvar Configuração"
6. **Teste:** "Enviar Teste"

---

## ✅ Verificação Final

### Checklist:
- [ ] Conta EmailJS criada
- [ ] Gmail conectado
- [ ] Template criado e salvo
- [ ] Public Key copiada
- [ ] Credenciais inseridas no sistema
- [ ] Email de teste recebido
- [ ] Notificações habilitadas

### Teste Completo:
1. Vá para o site principal
2. Crie uma reclamação de teste
3. Verifique se recebeu email automático

---

## 🔧 Suas Credenciais

**Anote aqui suas credenciais:**

```
Service ID: ____________________
Template ID: ____________________
Public Key: ____________________
Email Admin: cidborgesead2020@gmail.com
```

---

## 🚨 Solução de Problemas

### Email não chegou?
- ✅ Verifique spam/lixo eletrônico
- ✅ Confirme se Service ID está correto
- ✅ Verifique se Template ID está correto
- ✅ Teste com "Enviar Teste" na área admin

### Erro "Service not found"?
- ✅ Service ID incorreto
- ✅ Serviço não está ativo no EmailJS

### Erro "Template not found"?
- ✅ Template ID incorreto
- ✅ Template não foi salvo

### Erro "Invalid public key"?
- ✅ Public Key incorreta
- ✅ Conta EmailJS não verificada

---

## 📊 Limites Gratuitos

**EmailJS Gratuito:**
- 200 emails/mês
- 2 serviços de email
- 3 templates

**Suficiente para:**
- ~6 reclamações por dia
- Emails de teste
- Relatórios semanais

---

## 🎯 Resultado Final

Após a configuração, você receberá automaticamente:

✅ **Email imediato** quando nova reclamação for criada
✅ **Detalhes completos** da reclamação
✅ **Link direto** para área administrativa
✅ **Ações recomendadas** para resposta rápida

---

## 🔗 Links Úteis

- 📖 [Guia Completo](GUIA-EMAILJS.md)
- ⚙️ [Configuração Visual](configuracao-emailjs-passo-a-passo.html)
- 🎨 [Template HTML](template-emailjs-html.html)
- 🛡️ [Área Administrativa](admin.html)

---

## 🎉 Pronto!

Em 10 minutos você configurou um sistema profissional de notificações por email! 

**Próximo passo:** Teste criando uma reclamação e veja o email chegando automaticamente! 📧✨

---

**Meu Bairro Alerta** - Conectando cidadãos e administração pública! 🏘️

---

## 👨‍💻 Desenvolvedor

**💻 Criado por ProfBorges**
*Configuração rápida de notificações por email*
