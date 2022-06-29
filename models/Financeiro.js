const mongoose = require('mongoose')
Schema = mongoose.Schema;

const Financeiro = new Schema({
  idPedido: {
    type: String,
    required: true
  },
  listaPedidos: {
    type: Array,
    required: true
  },  
  valorTotal: {
    type: Number,
    required: true
  },
  mesa: {
    type: Number,
    required: true
  }
})


module.exports = mongoose.model('Financeiro', Financeiro);
