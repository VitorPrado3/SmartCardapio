const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
Schema = mongoose.Schema;

const Fornecedor = new Schema({
  idFornecedor: {
    type: Number
  },
  nomeFornecedor: {
    type: String,
    required: true
  },
  cnpjFornecedor: {
    type: Number,
    required: true
  },
  telefoneFornecedor: {
    type: Number,
    required: true
  },
  celularFornecedor: {
    type: Number,
    required: true
  },
  enderecoFornecedor: {
    type: String,
    required: true
  },
  obsFornecedor: {
    type: String,
    required: false
  }
})

Fornecedor.plugin(AutoIncrement, { inc_field: 'idFornecedor' });

module.exports = mongoose.model('Fornecedor', Fornecedor);
