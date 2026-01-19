const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  senha: {
    type: String,
    required: true
  },

  // 👑 PAPEL DO USUÁRIO
  // Por padrão todo usuário é "user"
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  pontos: {
    type: Number,
    default: 0
  },

  progresso: [
    {
      comunidade: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comunidade'
      },
      pontos: {
        type: Number,
        default: 0
      }
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

/* =====================================================
   HASH DA SENHA (MONGOOSE 9+)
===================================================== */
UserSchema.pre('save', async function () {
  if (!this.isModified('senha')) return;

  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

module.exports = mongoose.model('User', UserSchema);
