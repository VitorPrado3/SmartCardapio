const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
Schema = mongoose.Schema;

const Produto = new Schema({
  idProduto: {
    type: Number
  },
  nome: {
    type: String,
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  categoria: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: false
  },
  imagem: {
    type: String,
    required: false
  }
})

Produto.plugin(AutoIncrement, { inc_field: 'idProduto' });

module.exports = mongoose.model('Produto', Produto);
