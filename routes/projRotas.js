const router = require('express').Router()
const Produto = require('../models/Produto');
const Pedido = require('../models/Pedido');
const uuid = require('uuid');
const Usuario = require('../models/Usuario');


router.post('/produto', async (req, res) => {

    const { nomeProduto, valorProduto, categoriaProduto, descricaoProduto, imagemProduto } = req.body

    let produto = {
        nomeProduto: nomeProduto,
        valorProduto: valorProduto,
        categoriaProduto: categoriaProduto,
        descricaoProduto: descricaoProduto,
        imagemProduto: imagemProduto
    }

    if (!nome) {
        res.status(400).json({ erro: 'Campo nome é requerido' })
        return
    }

    if (!valor) {
        res.status(400).json({ erro: 'Campo valor é requerido' })
        return
    }

    if (!imagem) {
        res.status(400).json({ erro: 'Campo imagem é requerido' })
        return
    }

    const produtoAntigo = await Produto.findOne({ nomeProduto: nomeProduto }).exec()

    if(produtoAntigo?._doc){
        res.status(422).json({ message: `Produto ${nomeProduto} já está cadastrado!` })
        return 
    }
    
    try {
        
        await Produto.create(produto)
        res.status(201).json({ produto, message: 'Produto cadastrado!' })
        return
    } catch (erro) {
        res.status(500).json({ erro: erro })
        return
    }
    
})

router.get('/produtos', async (req, res) => {
    try {

        let produtos = await Produto.find()

        res.status(200).json(produtos)
        return
    } catch (erro) {
        res.status(500).json({ erro: erro })
    }
})

router.get('/produto/:id', async (req, res) => {

    const idProduto = req.params.id

    try {

        const produto = await Produto.findOne({ idProduto: idProduto })

        if (!produto) {
            res.status(404).json({ message: `Produto ${idProduto} não encontrado` })
            return
        }

        res.status(200).json(produto)
        return
    } catch (erro) {

        res.status(500).json({ erro: erro })
        return
    }

})

router.get('/categoria/:categoria', async (req, res) => {

    const categoriaParam = req.params.categoria

    try {

        const produtoPorCategoria = await Produto.find({ categoriaProduto: categoriaParam }).exec()

        if (produtoPorCategoria.length == 0) {
            res.status(404).json({ message: `Categoria de ${categoriaParam} não encontrada` })
            return
        }

        res.status(200).json(produtoPorCategoria)
        return
    } catch (erro) {

        res.status(500).json({ erro: erro })
        return
    }

})

router.patch('/produto/:id', async (req, res) => {

    const idProduto = req.params.id
    const { nome, valor, categoria, descricao, imagem } = req.body

    const produtoAntigo = await Produto.findOne({ idProduto: idProduto })

    if (!produtoAntigo) {
        res.status(404).json({ erro: `Produto ${idProduto} não encontrado` })
        return
    }

    const produtoNovo = {
        nomeProduto: nome || produtoAntigo.nome,
        valorProduto: valor || produtoAntigo.valor,
        categoriaProduto: categoria || produtoAntigo.categoria,
        descricaoProduto: descricao || produtoAntigo.descricao,
        imagemProduto: imagem || produtoAntigo.imagem
    }

    try {

        await Produto.updateOne({ idProduto: idProduto }, produtoNovo)

        // if (produtoCancelado.matchedCount === 0) {
        //     res.status(404).json({ erro: `Produto ${id} não encontrado` })

        // }

        res.status(200).json(produtoNovo)
        return
    } catch (erro) {
        res.status(500).json({ erro: erro })
        return
    }

})

router.delete('/produto/:id', async (req, res) => {

    const idProduto = req.params.id

    const produto = await Produto.findOne({ idProduto: idProduto })

    if (!produto) {
        res.status(404).json({ message: `Produto não encontrado` })
        return
    }

    try {

        await Produto.deleteOne({ idProduto: idProduto })

        res.status(200).json({ produto, message: 'Produto removido' })
        return
    } catch (erro) {

        res.status(500).json({ erro: erro })
        return
    }


})

router.post('/pedido', async (req, res) => {

    const { listaProd, mesa } = req.body

    let pedido = {
        listaProd: listaProd,
        mesa: mesa,
        status: "Em preparo"
    }

    if (!listaProd) {
        res.status(422).json({ erro: 'Pedido vazio' })
        return
    }

    if (!mesa) {
        res.status(422).json({ erro: 'Número da mesa é requerido' })
        return
    }

    try {

        await Pedido.create(pedido)
        res.status(201).json({ pedido, message: 'Pedido em realizado!' })
        return
    } catch (erro) {
        res.status(500).json({ erro: erro })
        return
    }

})

router.get('/pedidos', async (req, res) => {
    try {

        let pedidos = await Pedido.find()

        res.status(200).json(pedidos)
        return
    } catch (erro) {
        res.status(500).json({ erro: erro })
        return
    }
})

router.patch('/cancelarPedido/:id', async (req, res) => {

    const idPedido = req.params.id

    const pedidoAntigo = await Pedido.findOne({ idPedido: idPedido })

    if (!pedidoAntigo) {
        res.status(404).json({ erro: `Pedido ${idPedido} não encontrado` })
        return
    }

    const pedidoNovo = {
        status: "Cancelado"
    }

    try {

        await Pedido.updateOne({ idPedido: idPedido }, pedidoNovo)

        res.status(200).json({ message: "Pedido cancelado" })
        return
    } catch (erro) {
        res.status(500).json({ erro: erro })
        return
    }

})

router.delete('/pedido/:id', async (req, res) => {

    const idPedido = req.params.id

    const pedido = await Pedido.findOne({ idPedido: idPedido })

    if (!pedido) {
        res.status(404).json({ message: `Pedido não encontrado` })
        return
    }

    try {

        await Pedido.deleteOne({ idPedido: idPedido })

        res.status(200).json({ pedido, message: 'Pedido removido' })
        return
    } catch (erro) {

        res.status(500).json({ erro: erro })
        return
    }


})

router.post('/usuario', async (req, res) => {

    const { user, senha, tipo } = req.body

    const usuarioExiste = await Usuario.findOne({ user: user })

    if (usuarioExiste) {
        res.status(422).json({ message: `Usuário ${user} já cadastrado` })
        return
    }

    const usuarioNovo = {
        "user": user,
        "senha": senha,
        "tipo": tipo
    }

    try {

        await Usuario.create(usuarioNovo)
        res.status(201).json({ message: `Usuário ${user} criado!` })
        return
    } catch (erro) {
        res.status(500).json({ erro: erro })
        return
    }

})

router.get('/usuarios', async (req, res) => {
    try {

        let usuarios = await Usuario.find()

        res.status(200).json(usuarios)
        return
    } catch (erro) {
        res.status(500).json({ erro: erro })
        return
    }
})

router.get('/usuario/:id', async (req, res) => {

    const idUsuario = req.params.id

    try {

        const usuario = await Usuario.findOne({ idUsuario: idUsuario })

        if (!usuario) {
            res.status(404).json({ message: `Usuário ${idUsuario} não encontrado` })
            return
        }

        res.status(200).json(usuario)
        return
    } catch (erro) {

        res.status(500).json({ erro: erro })
        return
    }

})

router.patch('/usuario/:id', async (req, res) => {

    const idUsuario = req.params.id
    const { user, senha, tipo } = req.body

    const usuarioAntigo = await Usuario.findOne({ idUsuario: idUsuario })

    if (!usuarioAntigo) {
        res.status(404).json({ erro: `Usuário ${idUsuario} não encontrado` })
        return
    }

    const usuarioNovo = {
        user: user || usuarioAntigo.user,
        senha: senha || usuarioNovo.senha,
        tipo: tipo || usuarioNovo.tipo
    }

    try {

        await Usuario.updateOne({ idUsuario: idUsuario }, usuarioNovo)

        res.status(200).json({ usuarioNovo, message: 'Usuário editado!' })
        return
    } catch (erro) {
        res.status(500).json({ erro: erro })
        return
    }

})

router.delete('/usuario/:id', async (req, res) => {

    const idUsuario = req.params.id

    const usuario = await Usuario.findOne({ idUsuario: idUsuario })

    if (!usuario) {
        res.status(404).json({ message: `Usuário ${idUsuario} não encontrado` })
        return
    }

    try {

        await Usuario.deleteOne({ idUsuario: idUsuario })

        res.status(200).json({ message: `Usuário ${usuario.user} removido` })
        return
    } catch (erro) {

        res.status(500).json({ erro: erro })
        return
    }
})

router.get('/auth', async (req, res) => {

    const { user, senha } = req.body

    const usuario = await Usuario.findOne({ user: user })

    if (!usuario) {
        res.status(404).json({ message: `Usuário ${user} não cadastrado!` })
        return
    }

    try {

        if (user === usuario.user && senha === usuario.senha) {
            res.status(204).json({message: "Ok"})
            return
        }

        if (user != usuario.user || senha != usuario.senha) {
            res.status(404).json({message: "Usuário ou senha incorreto"})
            return
        }

    } catch (erro) {

        res.status(500).json({ erro: erro })
        return
    }


})

module.exports = router