const mongoose = require('mongoose')
Schema = mongoose.Schema;

const Estoque = new Schema({
  nomeProduto: {
    type: String,
    required: true
  },
  quantidadeProduto: {
    type: Number,
    required: true
  },
  fornecedor: {
    type: String,
    required: true
  },
  inclusao: {
    type: String,
    required: true
  },
})


module.exports = mongoose.model('Estoque', Estoque);
