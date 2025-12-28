require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 1. Importação do CORS
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('./auth'); 

// 1. Importação das Rotas Modulares
const eventoRoutes = require('./routes/eventoRoutes');
const comunidadeRoutes = require('./routes/comunidadeRoutes');

const app = express();

// --- CONFIGURAÇÕES ESSENCIAIS ---
app.use(cors()); // 2. Ativação do CORS (Libera acesso para o Front-end)
app.use(express.json());

// CONEXÃO COM BANCO
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB Atlas!"))
  .catch(err => console.error("❌ Erro de conexão:", err.message));

// --- REGISTRO DE ROTAS MODULARES ---
app.use('/eventos', eventoRoutes);
app.use('/comunidades', comunidadeRoutes);

// --- ROTA: USUÁRIOS (Dashboard) ---
// Adicionada para que o fetch('.../usuarios') do seu script.js funcione
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await User.find().select('nome pontos');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar usuários para o dashboard." });
  }
});

// --- ROTA: CADASTRO ---
app.post('/usuarios/cadastro', async (req, res) => {
  console.log("📝 Recebendo novo cadastro...");
  try {
    const { nome, email, senha } = req.body;
    if (await User.findOne({ email })) {
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
  try {
    const { email, senha } = req.body;
    const usuario = await User.findOne({ email });

    if (!usuario) return res.status(400).json({ erro: "E-mail ou senha incorretos." });

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return res.status(400).json({ erro: "E-mail ou senha incorretos." });

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ mensagem: "Login realizado com sucesso!", token });
  } catch (error) {
    res.status(500).json({ erro: "Erro no servidor" });
  }
});

// --- ROTA: RANKING GLOBAL ---
app.get('/usuarios/ranking', async (req, res) => {
  try {
    const ranking = await User.find()
      .select('nome pontos') 
      .sort({ pontos: -1 })
      .limit(10);
      
    res.json(ranking);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao carregar ranking." });
  }
});

// --- ROTA: DELETAR ---
app.delete('/usuarios/deletar/:id', auth, async (req, res) => {
  const idDaUrl = req.params.id; 
  const idDoToken = req.usuarioId;

  try {
    if (idDaUrl !== idDoToken) {
      return res.status(403).json({ erro: "Acesso negado!", mensagem: "Você só pode deletar sua própria conta." });
    }

    const usuarioDeletado = await User.findByIdAndDelete(idDaUrl);
    if (!usuarioDeletado) return res.status(404).json({ erro: "Usuário não encontrado." });

    res.json({ mensagem: "Sua conta foi removida com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao deletar usuário" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));