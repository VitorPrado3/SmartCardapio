const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
Schema = mongoose.Schema;

const Usuario = new Schema({
  idUser: {
    type: Number
  },
  user: {
    type: String,
    required: true
  },
  senha: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true
  }
})

Usuario.plugin(AutoIncrement, { inc_field: 'idUser' });

module.exports = mongoose.model('Usuario', Usuario);
