const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
Schema = mongoose.Schema;

const Produto = new Schema({
  idProduto: {
    type: Number
  },
  nomeProduto: {
    type: String,
    required: true
  },
  valorProduto: {
    type: Number,
    required: true
  },
  categoriaProduto: {
    type: String,
    required: true
  },
  descricaoProduto: {
    type: String,
    required: false
  },
  imagemProduto: {
    type: String,
    required: false
  }
})

Produto.plugin(AutoIncrement, { inc_field: 'idProduto' });

module.exports = mongoose.model('Produto', Produto);
