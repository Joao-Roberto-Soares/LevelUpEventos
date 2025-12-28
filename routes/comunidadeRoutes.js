const express = require('express');
const router = express.Router();
const Comunidade = require('../models/Comunidade');
const auth = require('../auth');
const User = require('../models/User'); 

// --- 1. LISTAR TODAS AS COMUNIDADES ---
router.get('/', async (req, res) => {
    try {
        const comunidades = await Comunidade.find();
        res.json(comunidades);
    } catch (error) {
        res.status(500).json({ erro: "Erro ao listar comunidades" });
    }
});

// --- 2. RANKING ESPECÍFICO (Colocado acima das rotas genéricas) ---
router.get('/:id/ranking', async (req, res) => {
  try {
    const comunidadeId = req.params.id;
    const usuarios = await User.find({ "progresso.comunidade": comunidadeId })
      .select('nome progresso');

    const ranking = usuarios.map(u => {
      const prog = u.progresso.find(p => p.comunidade.toString() === comunidadeId);
      return {
        nome: u.nome,
        pontos: prog ? prog.pontos : 0
      };
    })
    .sort((a, b) => b.pontos - a.pontos);

    res.json(ranking);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao gerar ranking", detalhe: error.message });
  }
});

// --- 3. CRIAR COMUNIDADE ---
router.post('/', auth, async (req, res) => {
  try {
    const { nome, quizzes } = req.body;
    const novaComunidade = new Comunidade({ nome, quizzes });
    await novaComunidade.save();
    res.status(201).json({ mensagem: "🏰 Comunidade criada!", comunidade: novaComunidade });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar", detalhe: error.message });
  }
});

// --- 4. ENTRAR NA COMUNIDADE ---
router.post('/:id/entrar', auth, async (req, res) => {
  try {
    const comunidadeId = req.params.id;
    const usuarioId = req.usuarioId;

    const comunidade = await Comunidade.findById(comunidadeId);
    if (!comunidade) return res.status(404).json({ erro: "Comunidade não encontrada" });

    if (comunidade.membros.includes(usuarioId)) {
      return res.status(400).json({ mensagem: "Você já faz parte desta comunidade!" });
    }

    comunidade.membros.push(usuarioId);
    await comunidade.save();

    await User.findByIdAndUpdate(usuarioId, {
      $push: { progresso: { comunidade: comunidadeId, pontos: 0 } }
    });

    res.json({ mensagem: "🚀 Você entrou na comunidade!" });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// --- 5. RESPONDER E GANHAR PONTOS ---
router.post('/:id/responder', auth, async (req, res) => {
  try {
    const { perguntaIndex, resposta } = req.body;
    const comunidadeId = req.params.id;
    const comunidade = await Comunidade.findById(comunidadeId);

    if (!comunidade) return res.status(404).json({ erro: "Comunidade não encontrada" });

    // Segurança: Verificar se o usuário está na comunidade
    const usuario = await User.findById(req.usuarioId);
    const temVinculo = usuario.progresso.some(p => p.comunidade.toString() === comunidadeId);
    
    if (!temVinculo) {
        return res.status(403).json({ erro: "Você precisa entrar na comunidade antes de responder!" });
    }

    const pergunta = comunidade.quizzes[perguntaIndex];
    if (!pergunta) return res.status(404).json({ erro: "Pergunta não encontrada" });

    const eCorreta = pergunta.correta === resposta;

    if (eCorreta) {
      await User.findOneAndUpdate(
        { _id: req.usuarioId, "progresso.comunidade": comunidadeId },
        { $inc: { "pontos": 10, "progresso.$.pontos": 10 } }
      );
      res.json({ correto: true, mensagem: "🔥 Resposta correta! +10 pontos." });
    } else {
      res.json({ correto: false, mensagem: "❌ Errado! Tente novamente." });
    }
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// --- 6. ADICIONAR PERGUNTAS ---
router.put('/:id/adicionar-perguntas', auth, async (req, res) => {
  try {
    const { novasQuizzes } = req.body; 
    const comunidade = await Comunidade.findById(req.params.id);
    if (!comunidade) return res.status(404).json({ erro: "Comunidade não encontrada" });

    comunidade.quizzes.push(...novasQuizzes);
    await comunidade.save();
    res.json({ mensagem: "Perguntas adicionadas!", total: comunidade.quizzes.length });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

module.exports = router;