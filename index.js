const express = require('express');
const app = express();
const mongoose = require('mongoose');


app.use(
    express.urlencoded({
        extended: true
    }),
)

app.use(express.json())

const projRotas = require ('./routes/projRotas')

app.use(projRotas)

mongoose.connect(
    'mongodb+srv://admin:admin@cluster0.h18g2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
)
.then(() => {

    console.log('Conectou no banco')
    app.listen(3000)

})
.catch((err) => console.log(err))



