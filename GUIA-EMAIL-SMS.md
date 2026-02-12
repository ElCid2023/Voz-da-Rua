# 📧 Guia de Configuração do EmailJS

## Como Ativar o Envio Real de Emails

### Passo 1: Criar Conta no EmailJS
1. Acesse: https://www.emailjs.com/
2. Clique em **"Sign Up"** (é gratuito - 200 emails/mês)
3. Confirme seu email

### Passo 2: Configurar Serviço de Email
1. No dashboard, clique em **"Email Services"**
2. Clique em **"Add New Service"**
3. Escolha seu provedor (Gmail, Outlook, etc.)
4. Conecte sua conta de email
5. Copie o **Service ID** (ex: `service_abc123`)

### Passo 3: Criar Template de Email
1. Clique em **"Email Templates"**
2. Clique em **"Create New Template"**
3. Use este template:

```
Assunto: Confirmação de Reclamação #{{protocolo}} - Voz da Rua

Olá {{to_name}},

Sua reclamação foi registrada com sucesso!

DETALHES DA RECLAMAÇÃO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Protocolo: #{{protocolo}}
Data: {{data}}
Título: {{titulo}}
Categoria: {{categoria}}
Endereço: {{endereco}}
CEP: {{cep}}

Descrição:
{{descricao}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Acompanhe o status da sua reclamação em:
{{site_url}}

Atenciosamente,
Equipe Voz da Rua
by Prof. Borges
```

4. Salve e copie o **Template ID** (ex: `template_xyz789`)

### Passo 4: Obter Chave Pública
1. Clique em **"Account"** → **"General"**
2. Copie a **Public Key** (ex: `abc123xyz789`)

### Passo 5: Configurar no Código

Abra o arquivo `index.html` e substitua:

```javascript
// Linha ~730
emailjs.init({
    publicKey: "SUA_PUBLIC_KEY_AQUI", // Cole sua Public Key
});

// Linha ~820
emailjs.send('SEU_SERVICE_ID', 'SEU_TEMPLATE_ID', templateParams)
```

**Exemplo:**
```javascript
emailjs.init({
    publicKey: "abc123xyz789",
});

emailjs.send('service_abc123', 'template_xyz789', templateParams)
```

### Passo 6: Testar

1. Salve o arquivo
2. Faça commit e push:
```bash
git add .
git commit -m "Configurado EmailJS"
git push
```

3. Aguarde 2 minutos
4. Teste no site: https://elcid2023.github.io/Voz-da-Rua/

---

## 📱 Alternativa: SMS via Twilio

Para enviar SMS, use Twilio:

1. Crie conta em: https://www.twilio.com/
2. Obtenha número de telefone
3. Use a API REST do Twilio

**Código exemplo:**
```javascript
fetch('https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json', {
    method: 'POST',
    headers: {
        'Authorization': 'Basic ' + btoa('YOUR_ACCOUNT_SID:YOUR_AUTH_TOKEN'),
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
        'To': '+5511999999999',
        'From': '+15555555555',
        'Body': `Reclamação #${protocolo} registrada! Voz da Rua`
    })
});
```

---

## ✅ Status Atual

**Sistema implementado com:**
- ✅ Simulação visual de email (funciona agora)
- ✅ Protocolo único para cada reclamação
- ✅ Notificação na tela
- ✅ Log completo no console
- ⚠️ EmailJS pronto (precisa configurar chaves)

**Para ativar email real:**
- Configure as 3 chaves no código (5 minutos)

---

## 🎯 Benefícios

**Com email ativo:**
- ✅ Usuário recebe confirmação automática
- ✅ Protocolo para acompanhamento
- ✅ Profissionalismo
- ✅ Histórico por email

**Custo:** GRATUITO (até 200 emails/mês)

---

**Dúvidas?** Consulte: https://www.emailjs.com/docs/
