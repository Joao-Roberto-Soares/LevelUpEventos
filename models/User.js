const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  senha: { type: String, required: true },
  
  // ESTRUTURA PARA O PASSO 4 E 5: 
  // Armazena a pontuação do usuário em cada comunidade específica
  progresso: [{
    comunidade: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Comunidade' 
    },
    pontos: { type: Number, default: 0 }
  }],

  createdAt: { type: Date, default: Date.now },
});

// Criptografia usando Async/Await
UserSchema.pre('save', async function() {
  if (!this.isModified('senha')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

module.exports = mongoose.model('User', UserSchema);