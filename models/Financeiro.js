const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
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

Financeiro.plugin(AutoIncrement, { inc_field: 'idFinanceiro' });

module.exports = mongoose.model('Financeiro', Financeiro);
