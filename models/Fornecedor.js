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
    type: String,
    required: true
  },
  telefoneFornecedor: {
    type: String,
    required: true
  },
  celularFornecedor: {
    type: String,
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
