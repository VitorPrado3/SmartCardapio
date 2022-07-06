const router = require('express').Router()
const Produto = require('../models/Produto');
const Pedido = require('../models/Pedido');
const Usuario = require('../models/Usuario');
const Fornecedor = require('../models/Fornecedor');

const moment = require('moment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Estoque = require('../models/Estoque');
moment.locale('pt-br');

const JWT_SECRET = 'smartcardapio'
const SALT_ROUNDS = 10
const ADMIN_PATHS = [
    '/produto',
    '/usuario',
    '/usuarios'
]

const ADMIN_TYPE = 'admin'

const authMiddleware = (req, res, next) => {

    const token = req.header('authorization')?.split('Bearer ')[1]

    if(!token){
        res.status(400).json({ erro: 'Token é obrigatório' })
        return
    }

    try{
    const { tipo } = jwt.verify(token, JWT_SECRET)    
    const path = req.path
    const isAllowed = tipo == ADMIN_TYPE || !ADMIN_PATHS.includes(path)

    if(!isAllowed){
        res.status(401).json({ erro: 'Acesso não autorizado' })
        return
    }
        next()
    }catch(e){
        // console.log(e)
        res.status(401).json({ erro: 'Token inválido' })
        return
    }
}

router.post('/produto', authMiddleware, async (req, res) => {

    const { nomeProduto, valorProduto, categoriaProduto, descricaoProduto, imagemProduto, carrossel, statusProduto } = req.body

    let produto = {
        nomeProduto: nomeProduto,
        valorProduto: valorProduto,
        categoriaProduto: categoriaProduto,
        descricaoProduto: descricaoProduto,
        imagemProduto: imagemProduto,
        carrossel: carrossel,
        statusProduto: statusProduto
    }

    if (!nomeProduto) {
        res.status(400).json({ erro: 'Campo nome é requerido' })
        return
    }

    if (!valorProduto) {
        res.status(400).json({ erro: 'Campo valor é requerido' })
        return
    }

    if (!imagemProduto) {
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

router.post('/estoque', authMiddleware, async (req, res) => {

    const { nomeProduto, quantidade, fornecedor } = req.body

    let produto = {
        nomeProduto: nomeProduto,
        quantidadeProduto: quantidade,
        fornecedor: fornecedor,
        inclusao: moment().format('DD/MM/YYYY HH:mm:ss'),

    }

    if (!nomeProduto) {
        res.status(400).json({ erro: 'Campo nome é requerido' })
        return
    }

    if (!quantidade) {
        res.status(400).json({ erro: 'Campo quantidade é requerido' })
        return
    }

    if (!fornecedor) {
        res.status(400).json({ erro: 'Campo fornecedor é requerido' })
        return
    }

    const produtoAntigo = await Estoque.findOne({ nomeProduto: nomeProduto }).exec()

    if(produtoAntigo?._doc){
        
        const novaQuantia = {
            quantidadeProduto: produtoAntigo._doc.quantidadeProduto + quantidade
        }

        await Estoque.updateOne({ nomeProduto: nomeProduto }, novaQuantia)
        res.status(201).json({ produto, message: 'Quantidade adicionada!' })
        return
    }
    
    try {
        
        await Estoque.create(produto)
        res.status(201).json({ produto, message: 'Quantidade adicionada!' })
        return
    } catch (erro) {
        res.status(500).json({ erro: erro })
        return
    }
    
})

router.get('/estoque', async (req, res) => {
    try {

        let produtos = await Estoque.find()

        res.status(200).json(produtos)
        return
    } catch (erro) {
        res.status(500).json({ erro: erro })
    }
})

router.patch('/estoque', authMiddleware, async (req, res) => {

    const { nomeProduto, quantidadeProduto } = req.body

    const produtoAntigo = await Estoque.findOne({ nomeProduto: nomeProduto })

    if (!produtoAntigo) {
        res.status(404).json({ erro: `Produto ${nomeProduto} não encontrado no estoque` })
        return
    }

    const produtoNovo = {
        nomeProduto: nomeProduto || produtoAntigo.nomeProduto,
        quantidadeProduto: quantidadeProduto + produtoAntigo.quantidadeProduto || produtoAntigo.quantidadeProduto
    }

    try {

        await Estoque.updateOne({ nomeProduto: nomeProduto }, produtoNovo)

        res.status(200).json(produtoNovo)
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

router.get('/produto/:id', authMiddleware, async (req, res) => {

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

router.patch('/produto/:id', authMiddleware, async (req, res) => {

    const idProduto = req.params.id
    const { nomeProduto, valorProduto, categoriaProduto, descricaoProduto, imagemProduto, carrossel, statusProduto } = req.body

    const produtoAntigo = await Produto.findOne({ idProduto: idProduto })

    if (!produtoAntigo) {
        res.status(404).json({ erro: `Produto ${idProduto} não encontrado` })
        return
    }

    const produtoNovo = {
        nomeProduto: nomeProduto || produtoAntigo.nomeProduto,
        valorProduto: valorProduto || produtoAntigo.valorProduto,
        categoriaProduto: categoriaProduto || produtoAntigo.categoriaProduto,
        descricaoProduto: descricaoProduto || produtoAntigo.descricaoProduto,
        imagemProduto: imagemProduto || produtoAntigo.imagemProduto,
        carrossel: carrossel || produtoAntigo.carrossel,
        statusProduto: statusProduto || produtoAntigo.statusProduto
    }

    try {

        await Produto.updateOne({ idProduto: idProduto }, produtoNovo)
        res.status(200).json(produtoNovo)
        return
    } catch (erro) {
        res.status(500).json({ erro: erro })
        return
    }

})

router.delete('/produto/:id', authMiddleware, async (req, res) => {

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

router.post('/pedido', authMiddleware, async (req, res) => {

    const { listaProd, mesa, autor } = req.body

    // const agora =  Date.now()
    // const agoraFormat = new Date(agora);

    let pedido = {
        listaProd: listaProd,
        mesa: mesa,
        status: "Em preparo",
        criacao: moment().format('DD/MM/YYYY HH:mm:ss'),
        alteracao: moment().format('DD/MM/YYYY HH:mm:ss'),
        autor: autor
    }

    if (!listaProd) {
        res.status(400).json({ erro: 'Pedido vazio' })
        return
    }

    if (!mesa) {
        res.status(400).json({ erro: 'Número da mesa é requerido' })
        return
    }

    if (!autor) {
        res.status(400).json({ erro: 'Autor é requerido' })
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

router.patch('/cancelarPedido/:id', authMiddleware, async (req, res) => {

    const idPedido = req.params.id

    const pedidoAntigo = await Pedido.findOne({ idPedido: idPedido })

    if (!pedidoAntigo) {
        res.status(404).json({ erro: `Pedido ${idPedido} não encontrado` })
        return
    }

    const pedidoNovo = {
        status: "Cancelado",
        alteracao: moment().format('DD/MM/YYYY HH:mm:ss')
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

router.patch('/pedidoPronto/:id', authMiddleware, async (req, res) => {

    const idPedido = req.params.id

    const pedidoAntigo = await Pedido.findOne({ idPedido: idPedido })

    if (!pedidoAntigo) {
        res.status(404).json({ erro: `Pedido ${idPedido} não encontrado` })
        return
    }

    const pedidoNovo = {
        status: "Pronto",
        alteracao: moment().format('DD/MM/YYYY HH:mm:ss')
    }

    const arrayProd = Object.values(pedidoAntigo.listaProd)

    for (const nomeProduto of arrayProd) {
        const estoqueAnt = await Estoque.findOne({nomeProduto}).exec()
        
        if(!estoqueAnt){
            res.status(404).json({ message: "Produto não encontrado" })
            return
        }

        const novoEstoque = {
            quantidadeProduto: estoqueAnt.quantidadeProduto - 1
        }
    
        const result = await Estoque.updateOne({nomeProduto: estoqueAnt.nomeProduto}, novoEstoque)

        if(!result?.matchedCount){
            res.status(500).json({ message: "Falha ao atualizar o produto" })
            return
        }
    }

    try {

        await Pedido.updateOne({ idPedido: idPedido }, pedidoNovo)

        res.status(200).json({ message: "Pedido pronto" })
        return
    } catch (erro) {
        res.status(500).json({ erro: erro })
        return
    }

})

router.patch('/pedidoFinalizado/:id', authMiddleware, async (req, res) => {

    const idPedido = req.params.id

    const pedidoAntigo = await Pedido.findOne({ idPedido: idPedido })

    if (!pedidoAntigo) {
        res.status(404).json({ erro: `Pedido ${idPedido} não encontrado` })
        return
    }

    const pedidoNovo = {
        status: "Finalizado",
        alteracao: moment().format('DD/MM/YYYY HH:mm:ss')
    }

    try {

        await Pedido.updateOne({ idPedido: idPedido }, pedidoNovo)

        res.status(200).json({ message: "Pedido finalizado" })
        return
    } catch (erro) {
        res.status(500).json({ erro: erro })
        return
    }

})

router.delete('/pedido/:id', authMiddleware, async (req, res) => {

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

router.post('/usuario', authMiddleware, async (req, res) => {

    const { user, senha, tipo } = req.body

    const usuarioExiste = await Usuario.findOne({ user: user })

    if (usuarioExiste) {
        res.status(422).json({ message: `Usuário ${user} já cadastrado` })
        return
    }

    const usuarioNovo = {
        "user": user,
        "senha": bcrypt.hashSync(senha, SALT_ROUNDS),
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

router.patch('/usuario/:id', authMiddleware, async (req, res) => {

    const idUsuario = req.params.id
    const { user, senha, tipo } = req.body

    const usuarioAntigo = await Usuario.findOne({ idUser: idUsuario })

    if (!usuarioAntigo) {
        res.status(404).json({ erro: `Usuário ${idUsuario} não encontrado` })
        return
    }

    const usuarioNovo = {
        user: user || usuarioAntigo.user,
        senha: bcrypt.hashSync(senha ||  usuarioNovo.senha, SALT_ROUNDS),
        tipo: tipo || usuarioNovo.tipo
    }
    try {

        await Usuario.updateOne({ idUser: idUsuario }, usuarioNovo)

        res.status(200).json({ usuarioNovo, message: 'Usuário editado!' })
        return
    } catch (erro) {
        res.status(500).json({ erro: erro })
        return
    }

})

router.delete('/usuario/:id', authMiddleware, async (req, res) => {

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

router.post('/auth', async (req, res) => {

    const { user, senha } = req.body

    const usuario = await Usuario.findOne({ user: user })

    if (!usuario) {
        res.status(404).json({ message: `Usuário ${user} não cadastrado!` })
        return
    }   

    try {

        if (user === usuario.user && bcrypt.compareSync(senha, usuario.senha)) {
            const token = jwt.sign({idUser: usuario.idUser, tipo: usuario.tipo}, JWT_SECRET)
            res.status(200).json({message: "Ok", accessToken: token})
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

router.post('/fornecedor', authMiddleware, async (req, res) => {

    const { nomeFornecedor, cnpjFornecedor, telefoneFornecedor, celularFornecedor, enderecoFornecedor, obsFornecedor } = req.body

    const fornecedorNovo = {
        "nomeFornecedor": nomeFornecedor,
        "cnpjFornecedor": cnpjFornecedor,
        "telefoneFornecedor": telefoneFornecedor,
        "celularFornecedor": celularFornecedor,
        "enderecoFornecedor": enderecoFornecedor,
        "obsFornecedor": obsFornecedor
    }

    try {

        await Fornecedor.create(fornecedorNovo)
        res.status(201).json({ message: `Fornecedor ${nome} cadastrado!` })
        return
    } catch (erro) {
        res.status(500).json({ erro: erro })
        return
    }

})

router.get('/fornecedores', async (req, res) => {
    try {

        let fornecedores = await Fornecedor.find()

        res.status(200).json(fornecedores)
        return
    } catch (erro) {
        res.status(500).json({ erro: erro })
        return
    }
})

router.patch('/fornecedor/:id', async (req, res) => {

    const idFornecedor = req.params.id
    const { nomeFornecedor, cnpjFornecedor, telefoneFornecedor, celularFornecedor, enderecoFornecedor, obsFornecedor } = req.body

    const fornecedorAntigo = await Fornecedor.findOne({ idFornecedor: idFornecedor })

    if (!fornecedorAntigo) {
        res.status(404).json({ erro: `Fornecedor ${idFornecedor} não encontrado` })
        return
    }

    const fornecedorNovo = {
        nomeFornecedor: nomeFornecedor || fornecedorAntigo.nomeFornecedor,
        cnpjFornecedor: cnpjFornecedor || fornecedorAntigo.cnpjFornecedor,
        telefoneFornecedor: telefoneFornecedor || fornecedorAntigo.telefoneFornecedor,
        celularFornecedor: celularFornecedor || fornecedorAntigo.celularFornecedor,
        enderecoFornecedor: enderecoFornecedor || fornecedorAntigo.enderecoFornecedor,
        obsFornecedor: obsFornecedor || fornecedorAntigo.obsFornecedor
    }

    try {

        await Fornecedor.updateOne({ idFornecedor: idFornecedor }, fornecedorNovo)
        res.status(200).json(fornecedorNovo)
        return
    } catch (erro) {
        res.status(500).json({ erro: erro })
        return
    }

})

router.delete('/fornecedor/:id', async (req, res) => {

    const idFornecedor = req.params.id

    const fornecedor = await Fornecedor.findOne({ idFornecedor: idFornecedor })

    if (!fornecedor) {
        res.status(404).json({ message: `Fornecedor não encontrado` })
        return
    }

    try {

        await Fornecedor.deleteOne({ idFornecedor: idFornecedor })

        res.status(200).json({ fornecedor, message: 'Fornecedor removido' })
        return
    } catch (erro) {

        res.status(500).json({ erro: erro })
        return
    }


})

module.exports = router