require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('./auth'); 

// 1. Importando as rotas de Eventos
const eventoRoutes = require('./routes/eventoRoutes');

const app = express();
app.use(express.json());

// CONEXÃO COM BANCO
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB Atlas!"))
  .catch(err => console.error("❌ Erro de conexão:", err.message));

// --- ROTAS DE EVENTOS (MODULARIZADAS) ---
// Isso faz com que todas as rotas em eventoRoutes comecem com /eventos
app.use('/eventos', eventoRoutes);

// --- ROTA: CADASTRO ---
app.post('/usuarios/cadastro', async (req, res) => {
  console.log("📝 Recebendo novo cadastro...");
  try {
    const { nome, email, senha } = req.body;
    if (await User.findOne({ email })) {
      console.log(`⚠️ Cadastro negado: O e-mail ${email} já existe.`);
      return res.status(400).json({ erro: "E-mail já cadastrado." });
    }

    const novoUsuario = await User.create({ nome, email, senha });
    const token = jwt.sign({ id: novoUsuario._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    console.log("✅ Sucesso: Usuário criado com ID:", novoUsuario._id);
    return res.status(201).json({ mensagem: "Usuário criado com sucesso!", token });
  } catch (error) {
    console.error("❌ Erro no cadastro:", error.message);
    return res.status(500).json({ erro: "Erro no cadastro" });
  }
});

// --- ROTA: LOGIN ---
app.post('/usuarios/login', async (req, res) => {
  console.log("🔑 Alguém tentando entrar...");
  try {
    const { email, senha } = req.body;
    const usuario = await User.findOne({ email });

    if (!usuario) {
      console.log("❌ Falha: E-mail não encontrado.");
      return res.status(400).json({ erro: "E-mail ou senha incorretos." });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      console.log("❌ Falha: Senha errada para o usuário", email);
      return res.status(400).json({ erro: "E-mail ou senha incorretos." });
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log("✅ Login OK! Token gerado para ID:", usuario._id);
    return res.json({ mensagem: "Login realizado com sucesso!", token });
  } catch (error) {
    console.error("❌ Erro no login:", error.message);
    return res.status(500).json({ erro: "Erro no servidor" });
  }
});

// --- ROTA: LISTAR TODOS ---
app.get('/usuarios/todos', async (req, res) => {
  console.log("📋 Listando todos os usuários do banco...");
  try {
    const usuarios = await User.find().select('-senha');
    console.log(`✅ Consulta finalizada. Total: ${usuarios.length} usuários.`);
    res.json(usuarios);
  } catch (error) {
    console.error("❌ Erro ao listar:", error.message);
    res.status(500).json({ erro: "Erro ao buscar a lista." });
  }
});

// --- ROTA: DELETAR (COM TRAVA DE SEGURANÇA) ---
app.delete('/usuarios/deletar/:id', auth, async (req, res) => {
  const idDaUrl = req.params.id; 
  // AJUSTE AQUI: req.usuarioId já contém o ID direto devido ao novo auth.js
  const idDoToken = req.usuarioId; 

  console.log(`🗑️ Tentativa de DELETE | Alvo: ${idDaUrl} | Logado: ${idDoToken}`);

  try {
    // Verificação simples entre duas strings
    if (idDaUrl !== idDoToken) {
      console.log("🚫 BLOQUEADO: Tentativa de deletar conta de terceiros!");
      return res.status(403).json({ 
        erro: "Acesso negado!", 
        mensagem: "Você só tem permissão para deletar sua própria conta." 
      });
    }

    const usuarioDeletado = await User.findByIdAndDelete(idDaUrl);

    if (!usuarioDeletado) {
      console.log("⚠️ Erro: Usuário não existe mais.");
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    console.log("✅ Sucesso: Conta removida.");
    res.json({ mensagem: "Sua conta foi removida com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao deletar:", error.message);
    res.status(500).json({ erro: "Erro ao deletar usuário" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));