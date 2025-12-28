const mongoose = require('mongoose');

const ComunidadeSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    quizzes: [{
        pergunta: { type: String, required: true },
        opcoes: [String],
        correta: String
    }],
    membros: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Comunidade', ComunidadeSchema);