# 📧 Guia SIMPLIFICADO - EmailJS (Atualizado 2025)

## ⚡ Configuração Rápida em 5 Passos

---

## 🔹 PASSO 1: Criar Conta

1. Acesse: **https://dashboard.emailjs.com/sign-up**
2. Preencha:
   - Email
   - Senha
3. Clique em **"Sign Up"**
4. Confirme seu email (verifique caixa de entrada/spam)
5. Faça login em: **https://dashboard.emailjs.com/sign-in**

✅ **Pronto!** Você está no Dashboard.

---

## 🔹 PASSO 2: Adicionar Serviço de Email

1. No menu lateral, clique em **"Email Services"**
2. Clique no botão **"Add New Service"**
3. Escolha seu provedor:
   - **Gmail** (recomendado) ✅
   - Outlook
   - Yahoo
   - Outro

### Se escolheu Gmail:
4. Clique em **"Connect Account"**
5. Faça login com sua conta Google
6. Autorize o EmailJS
7. Você verá: **"Service ID: service_xxxxxxx"**
8. **COPIE** este Service ID (ex: `service_abc1234`)

📝 **Anote:** Service ID = `service_abc1234`

---

## 🔹 PASSO 3: Criar Template

1. No menu lateral, clique em **"Email Templates"**
2. Clique em **"Create New Template"**
3. Você verá um editor com 3 campos:

### Campo 1: Template Name
```
Confirmação Reclamação Voz da Rua
```

### Campo 2: Subject (Assunto)
```
Confirmação de Reclamação #{{protocolo}} - Voz da Rua
```

### Campo 3: Content (Corpo do Email)
Cole este texto:

```
Olá {{to_name}},

Sua reclamação foi registrada com sucesso em nosso sistema!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETALHES DA RECLAMAÇÃO
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

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Este é um email automático. Não responda esta mensagem.
```

4. Clique em **"Save"** (canto superior direito)
5. Você verá: **"Template ID: template_xxxxxxx"**
6. **COPIE** este Template ID (ex: `template_xyz7890`)

📝 **Anote:** Template ID = `template_xyz7890`

---

## 🔹 PASSO 4: Obter Public Key

1. No menu lateral, clique em **"Account"**
2. Você verá: **"Public Key: xxxxxxxxxxxxxxx"**
3. **COPIE** esta Public Key (ex: `AbC123XyZ789`)

📝 **Anote:** Public Key = `AbC123XyZ789`

---

## 🔹 PASSO 5: Configurar no Código

Agora você tem 3 chaves:
- ✅ Service ID: `service_abc1234`
- ✅ Template ID: `template_xyz7890`
- ✅ Public Key: `AbC123XyZ789`

### Editar o arquivo index.html:

1. Abra: `E:\Criações em IA\Site3\index.html`
2. Procure por: `YOUR_PUBLIC_KEY` (use Ctrl+F)
3. Substitua:

**ANTES:**
```javascript
emailjs.init({
    publicKey: "YOUR_PUBLIC_KEY",
});
```

**DEPOIS:**
```javascript
emailjs.init({
    publicKey: "AbC123XyZ789",  // Sua Public Key aqui
});
```

4. Procure por: `service_id` (use Ctrl+F)
5. Substitua:

**ANTES:**
```javascript
emailjs.send('service_id', 'template_id', templateParams)
```

**DEPOIS:**
```javascript
emailjs.send('service_abc1234', 'template_xyz7890', templateParams)
```

6. **Salve o arquivo** (Ctrl+S)

---

## 🔹 PASSO 6: Enviar para GitHub

Abra o terminal na pasta do projeto e execute:

```bash
cd "E:\Criações em IA\Site3"
git add .
git commit -m "Configurado EmailJS - envio real de emails"
git push
```

Aguarde 2-3 minutos para o GitHub Pages atualizar.

---

## ✅ TESTAR

1. Acesse: https://elcid2023.github.io/Voz-da-Rua/
2. Faça login
3. Cadastre uma reclamação
4. **Verifique seu email!** 📧

---

## 🆘 PROBLEMAS COMUNS

### ❌ "Email não chegou"
- Verifique a caixa de SPAM
- Confirme que copiou as 3 chaves corretamente
- Verifique se salvou o arquivo index.html
- Aguarde 5 minutos (pode demorar)

### ❌ "Erro no console"
- Abra o Console (F12)
- Veja a mensagem de erro
- Verifique se as chaves estão entre aspas: `"sua_chave"`

### ❌ "Service ID inválido"
- Volte no EmailJS Dashboard
- Copie novamente o Service ID
- Cole no código SEM espaços extras

---

## 📊 RESUMO VISUAL

```
EmailJS Dashboard
    ↓
1. Email Services → Add New Service → Gmail → COPIAR Service ID
    ↓
2. Email Templates → Create New → Colar template → COPIAR Template ID
    ↓
3. Account → COPIAR Public Key
    ↓
4. Editar index.html → Colar as 3 chaves
    ↓
5. git add . → git commit → git push
    ↓
6. Aguardar 2 minutos → TESTAR
```

---

## 💡 DICA PRO

Se ainda tiver dificuldade, me envie:
1. Print do Dashboard do EmailJS
2. As 3 chaves que você copiou (pode ocultar parte delas)
3. A mensagem de erro do Console (F12)

---

## 🎯 ALTERNATIVA MAIS SIMPLES

Se o EmailJS estiver complicado, você pode:

1. **Usar WhatsApp** - Enviar mensagem automática via WhatsApp Web
2. **Usar Telegram** - Bot do Telegram para notificações
3. **Apenas mostrar na tela** - Protocolo grande e visível

Quer que eu implemente alguma dessas alternativas?

---

**Criado por:** Prof. Borges
**Projeto:** Voz da Rua
**Data:** Janeiro 2025
