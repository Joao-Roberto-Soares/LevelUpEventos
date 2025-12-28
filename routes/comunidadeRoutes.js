const express = require('express');
const router = express.Router();
const Comunidade = require('../models/Comunidade');

// POST /comunidades
router.post('/', async (req, res) => {
    try {
        const { nome, quizzes } = req.body;
        const novaComunidade = new Comunidade({ nome, quizzes });
        await novaComunidade.save();
        res.status(201).json(novaComunidade);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

module.exports = router;