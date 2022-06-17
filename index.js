const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config(); 

app.use(
    express.urlencoded({
        extended: true
    }),
)

app.use(express.json())

const projRotas = require ('./routes/routes')

app.use(projRotas)

mongoose.connect(
    process.env.URL_BANCO
)
.then(() => {
    
    console.log('Conectou no banco')
    app.listen(3000)

})
.catch((err) => console.log(err))
