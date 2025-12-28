const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../auth'); // Ajuste o caminho se seu auth.js estiver em outra pasta

// ROTA: Criar um novo evento
// POST https://levelupeventos.onrender.com/eventos/criar
router.post('/criar', auth, async (req, res) => {
    try {
        const { titulo, descricao, data, local } = req.body;

        const novoEvento = new Event({
            titulo,
            descricao,
            data,
            local,
            criadoPor: req.usuarioId // O ID vem do Token através do middleware auth
        });

        await novoEvento.save();
        res.status(201).json({ mensagem: "✅ Evento criado com sucesso!", evento: novoEvento });
    } catch (erro) {
        res.status(500).json({ mensagem: "❌ Erro ao criar evento", erro: erro.message });
    }
});

// ROTA: Listar todos os eventos
// GET https://levelupeventos.onrender.com/eventos/todos
router.get('/todos', async (req, res) => {
    try {
        // O .populate('criadoPor', 'nome email') traz os dados do dono, não só o ID
        const eventos = await Event.find().populate('criadoPor', 'nome email');
        res.json(eventos);
    } catch (erro) {
        res.status(500).json({ mensagem: "❌ Erro ao buscar eventos", erro: erro.message });
    }
});

// ROTA: Deletar um evento
// DELETE https://levelupeventos.onrender.com/eventos/deletar/:id
router.delete('/deletar/:id', auth, async (req, res) => {
    try {
        const idEvento = req.params.id;
        const idUsuarioLogado = req.usuarioId; // Lembra que nosso auth.js já limpa o ID?

        const evento = await Event.findById(idEvento);

        if (!evento) {
            return res.status(404).json({ mensagem: "❌ Evento não encontrado." });
        }

        // TRAVA DE SEGURANÇA: Só o dono pode deletar
        if (evento.criadoPor.toString() !== idUsuarioLogado) {
            return res.status(403).json({ mensagem: "🚫 Acesso negado! Você não é o dono deste evento." });
        }

        await Event.findByIdAndDelete(idEvento);
        res.json({ mensagem: "🗑️ Evento removido com sucesso!" });

    } catch (erro) {
        res.status(500).json({ mensagem: "❌ Erro ao deletar evento", erro: erro.message });
    }
});

module.exports = router;