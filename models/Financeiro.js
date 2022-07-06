const mongoose = require('mongoose')
Schema = mongoose.Schema;

const Financeiro = new Schema({
  idFinanceiro: {
    type: Number,
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
  },
  autor: {
    type: String,
    required: true
  },
  dataFinalizacao: {
    type: Date,
    required: true
  },
})


module.exports = mongoose.model('Financeiro', Financeiro);
