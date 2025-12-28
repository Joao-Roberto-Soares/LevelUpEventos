const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  senha: { type: String, required: true },
  
  // Pontuação total do usuário em todas as comunidades
  pontos: { type: Number, default: 0 },

  // PASSO 4 e 5: Progresso individual por comunidade
  progresso: [{
    comunidade: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Comunidade' // Referência ao modelo de Comunidade
    },
    pontos: { type: Number, default: 0 }
  }],

  createdAt: { type: Date, default: Date.now },
});

// Hash da senha antes de salvar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);