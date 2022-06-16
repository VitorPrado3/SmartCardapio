const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
Schema = mongoose.Schema;

const Pedido = new Schema({
  id: {
    type: Number
  },
  listaProd: {
    type: Array,
    required: true
  },
  mesa: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  }
})


Pedido.plugin(AutoIncrement, { inc_field: 'idPedido' });

module.exports = mongoose.model('Pedido', Pedido);
