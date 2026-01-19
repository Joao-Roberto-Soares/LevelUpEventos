const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  titulo: { 
    type: String, 
    required: [true, "O título do evento é obrigatório"] 
  },
  descricao: { 
    type: String, 
    required: [true, "A descrição é obrigatória"] 
  },
  data: { 
    type: Date, 
    required: [true, "A data do evento é obrigatória"] 
  },
  local: { 
    type: String, 
    required: [true, "O local é obrigatório"] 
  },
  criadoPor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Referência ao model de Usuário
    required: true 
  }
}, { timestamps: true }); // Cria automaticamente os campos createdAt e updatedAt

module.exports = mongoose.model('Event', EventSchema);