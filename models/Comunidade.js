const mongoose = require('mongoose');

const ComunidadeSchema = new mongoose.Schema({
  nome: { type: String, required: true, unique: true },
  
  // PASSO 2: Cada comunidade nasce com seus quizzes
  quizzes: [{
    pergunta: { type: String, required: true },
    alternativas: [{ type: String, required: true }], // Array de opções
    correta: { type: String, required: true }        // A resposta certa
  }],

  // PASSO 3: Lista de IDs de usuários vinculados
  membros: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comunidade', ComunidadeSchema);