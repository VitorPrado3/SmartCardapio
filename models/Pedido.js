const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
Schema = mongoose.Schema;

const Pedido = new Schema({
  idPedido: {
    type: Number
  },
  listaProd: {
    type: [String],
    required: true
  },
  mesa: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  criacao: {
    type: String,
    required: true
  },
  alteracao: {
    type: String,
    required: true
  },
  autor: {
    type: String,
    required: true
  },
})


Pedido.plugin(AutoIncrement, { inc_field: 'idPedido' });

module.exports = mongoose.model('Pedido', Pedido);
