/************************************************************
 * Objetivo: Projeto para a empresa de Filmes Online Acme
 * Data: 25/01/2024
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
 ***********************************************************/

/**
 * Para realizar a integração com o banco de dados, devemos utiizar uma das seguintes bibliotecas:
 *      Sequelize - mais antiga
 *      Prisma ORM - mais atual, que será utlizada no projeto
 *      Fastfy ORM
 * 
 *      Para a instalação do PRISMA ORM:
 *      npm install prisma --save  (responsável pela conexão com o banco de dados)
 *      npm install @prisma/client (responável por executar scripts SQL no banco)
 *       - Para inicializar : 
 *      npx prisma init
 */


const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use((request,response,next) =>{

    response.header('Access-Control-Allow-origin', '*')
    response.header('Acesss-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    request.header('Content-Type', 'application/json')
    app.use(cors())

    next()
})


//---------------------  import dos aquivos de controller do projeto ----------------------------------//
const filmes_funcoes = require('./controller/filmes_funcoes.js')
const controllerFilmes = require('./controller/controller_filme.js')
const controllerGeneros = require('./controller/controller_generos.js')
const controllerClassificacoes = require('./controller/controller_classificacao.js')
const controllerPaises = require('./controller/controller_paises.js')
const controllerProdutoras = require('./controller/controller_produtoras.js')
const controllerAtores = require('./controller/controller_atores.js')
const controllerDiretores = require('./controller/controller_diretores.js')
const controllerUsuarios = require('./controller/controller_usuario.js')
const contollerAdmnistradores = require('./controller/controller_admnistradores.js')
const controllerAvaliacoes = require('./controller/controller_avaliacao.js')
//---------------------  import dos aquivos de controller do projeto ----------------------------------//

//criando um objeto para controlar a chegada dos dados da reqisição em formato JSON
const bodyParserJSON = bodyParser.json()

//----------------------------------------- ENDPOINTS -----------------------------------------//
//EndPoint: Versão 1.0 que retorna os dados de um arquivo de filmes
//Período de utilização: 01/2024 - 02/2024
app.get('/v1/AcmeFilmes/filmes', cors(), async function(request, response, next){

    let listaDeFilmes = filmes_funcoes.getFilmes()

    if(listaDeFilmes){
        response.json(listaDeFilmes)
        response.status(200)
    }else{
        response.json({erro:'itens não encontrados'})
        response.status(404)
    }

    next()
})
app.get('/v1/AcmeFilmes/filme/:id', cors(), async function( request, response, next) {

    let idFilme = request.params.id
    let filmeListado = filmes_funcoes.getFilmesId(idFilme)

    if(filmeListado){
        response.json(filmeListado)
        response.status(200)
    }else{
        response.json({erro:'itens não encontrados'})
        response.status(404)
    }

    next()
})

//EndPoint: Versão 2.0 que retorna os dados de filmes do banco de dados
//Período de utilização: 02/2024

/////////// FILMES ///////////////////

app.get('/v2/AcmeFilmes/filmes', cors(), async function (request, response) {

    //chama a função da controller para listar todos os filmes
    let dadosFilmes = await controllerFilmes.getListarFilmes()

    //validação para verficar se existem dados a serem retornados

    if(dadosFilmes){
        response.json(dadosFilmes)
        response.status(200)
    }else{

        response.json({message: 'Nenhum registro encontrado'})
        response.status(404)

    }

})

app.get('/v2/AcmeFilmes/filme/:id', cors(), async function (request, response) {

    let idFilme = request.params.id

    //chama a função da controller para listar o filme com id correspondente
    let dadosFilme = await controllerFilmes.getBuscarFilme(idFilme)

        response.status(dadosFilme.status_code)
        response.json(dadosFilme)

})

app.get('/v2/AcmeFilmes/filmes/filtro', cors(), async function(request, response){

    let nomeFilme = request.query.nome

    //chama a função da controller para listar o filme com nome correspondente
    let dadosFilmes = await controllerFilmes.getBuscarNomeFilme(nomeFilme)

        response.json(dadosFilmes)
        response.status(200)
})

app.get('/v2/AcmeFilmes/filmes/filtros/', cors(), async function(request, response){

    let params = request.query

    let dadosFilmes = await controllerFilmes.getFiltrarFilmes(params)

        response.json(dadosFilmes)
        response.status(200)
})

app.get('/v2/AcmeFilmes/filmes/filtro/genero/:genero', cors(), async function(request, response){

    let generoFilme = request.params.genero

    //chama a função da controller para listar os filmes  com genero correspondente
    let dadosFilmes = await controllerFilmes.getFiltrarFilmesGenero(generoFilme)

        response.json(dadosFilmes)
        response.status(200)
})


//insert
app.post('/v2/AcmeFilmes/filme', cors(), bodyParserJSON, async function(request, response){

    //recebe o content type da requisição
    let contentType = request.header('content-type')

    //recebe todos os dados enviados na requisição pelo body
    let dadosBody = request.body

    //encaminha os dados para a controller enviar para o DAO
    let resultDadosNovoFilme = await controllerFilmes.setInserirNovoFilme(dadosBody, contentType)
    
    response.status(resultDadosNovoFilme.status_code)
    response.json(resultDadosNovoFilme)

})

//delete
app.delete('/v2/AcmeFilmes/filme/:id', cors(), bodyParserJSON, async function(request, response){

    let idFilme = request.params.id

    let filmeDeletado = await controllerFilmes.setExcluirFilme(idFilme)

    response.json(filmeDeletado)
    response.status(filmeDeletado.status_code)
})


app.put('/v2/AcmeFilmes/filme/:id', cors(), bodyParserJSON, async function(request, response){
    let idFilme = request.params.id

    let contentType = request.header('content-type')

    let dadosBody = request.body

    let filmeAtualizado = await controllerFilmes.setAtualizarFilme(idFilme, dadosBody, contentType)

    response.json(filmeAtualizado)
    response.status(filmeAtualizado.status_code)


})


//filmes  do usuário

app.get('/v2/AcmeFilmes/filmes/comprados/usuario/:id', cors(), async function (request, response) {

    let idUsuario = request.params.id

    //chama a função da controller para listar o filme com id correspondente
    let dadosFilme = await controllerFilmes.getFilmesCompradosUsuario(idUsuario)

        response.status(dadosFilme.status_code)
        response.json(dadosFilme)

})
app.post('/v2/AcmeFilmes/filme/comprado/usuario', cors(), bodyParserJSON, async function(request, response){

    let idUsuario = request.query.id_usuario
    let idFilme = request.query.id_filme

    //encaminha os dados para a controller enviar para o DAO
    let resultDadosNovoFilmeComprado = await controllerFilmes.setInserirNovoFilmeComprado(idUsuario, idFilme)
    
    response.status(resultDadosNovoFilmeComprado.status_code)
    response.json(resultDadosNovoFilmeComprado)

})

app.delete('/v2/AcmeFilmes/filme/comprado/usuario', cors(), bodyParserJSON, async function(request, response){

    let idUsuario = request.query.id_usuario
    let idFilme = request.query.id_filme

    let filmeDeletado = await controllerFilmes.setExcluirFilmeComprado(idUsuario, idFilme)

    response.json(filmeDeletado)
    response.status(filmeDeletado.status_code)
})

app.get('/v2/AcmeFilmes/filmes/salvos/usuario/:id', cors(), async function (request, response) {

    let idUsuario = request.params.id

    //chama a função da controller para listar o filme com id correspondente
    let dadosFilme = await controllerFilmes.getFilmesSalvosUsuario(idUsuario)

        response.status(dadosFilme.status_code)
        response.json(dadosFilme)

})
app.post('/v2/AcmeFilmes/filme/salvo/usuario', cors(), bodyParserJSON, async function(request, response){

    let idUsuario = request.query.id_usuario
    let idFilme = request.query.id_filme

    //encaminha os dados para a controller enviar para o DAO
    let resultDadosNovoFilmeSalvo = await controllerFilmes.setInserirNovoFilmeSalvo(idUsuario, idFilme)
    
    response.status(resultDadosNovoFilmeSalvo.status_code)
    response.json(resultDadosNovoFilmeSalvo)

})

app.delete('/v2/AcmeFilmes/filme/salvo/usuario', cors(), bodyParserJSON, async function(request, response){

    let idUsuario = request.query.id_usuario
    let idFilme = request.query.id_filme

    let filmeDeletado = await controllerFilmes.setExcluirFilmeSalvo(idUsuario, idFilme)

    response.json(filmeDeletado)
    response.status(filmeDeletado.status_code)
})

//avaliação do filme
app.get('/v2/AcmeFilmes/filme/avaliacao/:id', cors(), async function (request, response) {

    let idFilme = request.params.id

    //chama a função da controller para listar o filme com id correspondente
    let dadosFilme = await controllerFilmes.getAvaliacaoFilme(idFilme)

        response.status(dadosFilme.status_code)
        response.json(dadosFilme)

})
app.post('/v2/AcmeFilmes/filme/avaliacao/:id', cors(), bodyParserJSON, async function(request, response){

    let idFilme = request.params.id
    let dadosAvaliacao = request.body
    let contentType = request.header('content-type')
    //encaminha os dados para a controller enviar para o DAO
    let resultDadosAvaliacao = await controllerFilmes.setInserirAvaliacaoFilme(idFilme, contentType, dadosAvaliacao)
    
    response.status(resultDadosAvaliacao.status_code)
    response.json(resultDadosAvaliacao)

})

app.put('/v2/AcmeFilmes/filme/avaliacao/:id', cors(), bodyParserJSON, async function(request, response){

    let idFilme = request.params.id
    let dadosAvaliacao = request.body
    let contentType = request.header('content-type')
    //encaminha os dados para a controller enviar para o DAO
    let resultDadosAvaliacao = await controllerFilmes.setAtualizarAvaliacaoFilme(idFilme, contentType, dadosAvaliacao)
    
    response.status(resultDadosAvaliacao.status_code)
    response.json(resultDadosAvaliacao)

})

app.delete('/v2/AcmeFilmes/filme/avaliacoes/:id', cors(), bodyParserJSON, async function(request, response){

    let idFilme = request.params.id

    let avaliacaoDeletada = await controllerFilmes.setExcluirAvaliacaoFilme(idFilme)

    response.json(avaliacaoDeletada)
    response.status(avaliacaoDeletada.status_code)
})

//avaliação de filmes por cada usuário
app.get('/v2/AcmeFilmes/filme/avaliacao/usuario/:id', cors(), async function (request, response) {

    let idUsuario = request.params.id

    //chama a função da controller para listar o filme com id correspondente
    let dadosFilme = await controllerAvaliacoes.getListarFilmesAvaliadosUsuario(idUsuario)

        response.status(dadosFilme.status_code)
        response.json(dadosFilme)

})


///////////////////// GÊNEROS ///////////////////////////

app.get('/v2/AcmeFilmes/generos', cors(), async function (request, response){

    let listaDeGeneros = await controllerGeneros.getListarGeneros()

    if(listaDeGeneros){
        response.json(listaDeGeneros)
        response.status(200)
    }else{
        response.json({erro:'itens não encontrados'})
        response.status(404)
    }

})

app.get('/v2/AcmeFilmes/genero/:id', cors(), async function (request, response){

    let idGenero = request.params.id

    let genero = await controllerGeneros.getBuscarGenero(idGenero)

    if(genero){
        response.json(genero)
        response.status(200)
    }else{
        response.json({erro:'itens não encontrados'})
        response.status(404)
    }

})

app.post('/v2/AcmeFilmes/genero', cors(), bodyParserJSON, async function(request, response){

    let contentType = request.header('content-type')

    let dadosBody = request.body

    let resultNovoGenero = await controllerGeneros.setInserirNovoGenero(dadosBody, contentType)

    // response.status(resultNovoGenero.status_code)
    response.json(resultNovoGenero)
})

app.put('/v2/AcmeFilmes/genero/:id', cors(), bodyParserJSON, async  function(request, response){

    let idGenero = request.params.id

    let contentType = request.header('content-type')

    let dadosBody = request.body

    let generoAtualizado = await controllerGeneros.setAtualizarGenero(idGenero, dadosBody, contentType)

    response.json(generoAtualizado)
    response.status(generoAtualizado.status_code)

})

app.delete('/v2/AcmeFilmes/genero/:id', cors(), bodyParserJSON, async function(request, response){

    let idGenero = request.params.id

    let generoDeletado = await controllerGeneros.setExcluirGenero(idGenero)

    response.json(generoDeletado)
    response.status(generoDeletado.status_code)

})

///////////////////////CLASSIFICAÇÕES INDICATIVAS ///////////////////////////////////////////////

app.get('/v2/AcmeFilmes/classificacoes', cors(), async (request, response) =>{

    let listaDeClassificacoes = await controllerClassificacoes.getListarClassificacoes()

    if(listaDeClassificacoes){
        response.json(listaDeClassificacoes)
        response.status(200)
    }else{
        response.json({erro:'itens não encontrados'})
        response.status(404)
    }

})

app.get('/v2/AcmeFilmes/classificacao/:id', cors(), async function (request, response){

    let idClassificacao = request.params.id

    let classificacao = await controllerClassificacoes.getBuscarClassificacao(idClassificacao)

    if(classificacao){
        response.json(classificacao)
        response.status(200)
    }else{
        response.json({erro:'itens não encontrados'})
        response.status(404)
    }

})

app.post('/v2/AcmeFilmes/classificacoes', cors(), bodyParserJSON, async function(request, response){

    //recebe o content type da requisição
    let contentType = request.header('content-type')

    //recebe todos os dados enviados na requisição pelo body
    let dadosBody = request.body

    //encaminha os dados para a controller enviar para o DAO
    let resultDadosNovaClassificacaco = await controllerClassificacoes.setInserirNovaClassificacao(dadosBody, contentType)
    
    response.status(resultDadosNovaClassificacaco.status_code)
    response.json(resultDadosNovaClassificacaco)

})

app.delete('/v2/AcmeFilmes/classificacao/:id', cors(), bodyParserJSON, async function(request, response){

    let idClassificacao = request.params.id

    let classificacaoDeletada = await controllerClassificacoes.setExcluirClassificacao(idClassificacao)

    response.json(classificacaoDeletada)
    response.status(classificacaoDeletada.status_code)
})

app.put('/v2/AcmeFilmes/classificacao/:id', cors(), bodyParserJSON, async function(request, response){

    let idClassificacao = request.params.id

    let contentType = request.header('content-type')

    let dadosBody = request.body

    let classificacaoAtualizada = await controllerClassificacoes.setAtualizarClassificacao(idClassificacao, dadosBody, contentType)

    response.json(classificacaoAtualizada)
    response.status(classificacaoAtualizada.status_code)


})

/////////////////////// PAÍSES /////////////////////////////
app.get('/v2/AcmeFilmes/paises', cors(), async (request, response) =>{

    let listaDePaises = await controllerPaises.getListarPaises()

    if(listaDePaises){
        response.json(listaDePaises)
        response.status(200)
    }else{
        response.json({erro:'itens não encontrados'})
        response.status(404)
    }

})

app.get('/v2/AcmeFilmes/pais/:id', cors(), async function (request, response){

    let idPais = request.params.id

    let pais = await controllerPaises.getBuscarPais(idPais)

    if(pais){
        response.json(pais)
        response.status(200)
    }else{
        response.json({erro:'itens não encontrados'})
        response.status(404)
    }

})

app.post('/v2/AcmeFilmes/paises', cors(), bodyParserJSON, async function(request, response){

    //recebe o content type da requisição
    let contentType = request.header('content-type')

    //recebe todos os dados enviados na requisição pelo body
    let dadosBody = request.body

    //encaminha os dados para a controller enviar para o DAO
    let resultDadosNovoPais = await controllerPaises.setInserirNovoPais(dadosBody, contentType)
    
    response.status(resultDadosNovoPais.status_code)
    response.json(resultDadosNovoPais)

})

app.delete('/v2/AcmeFilmes/pais/:id', cors(), bodyParserJSON, async function(request, response){

    let idPais = request.params.id

    let paisDeletado = await controllerPaises.setExcluirPais(idPais)

    response.json(paisDeletado)
    response.status(paisDeletado.status_code)
})

app.put('/v2/AcmeFilmes/pais/:id', cors(), bodyParserJSON, async function(request, response){

    let idPais = request.params.id

    let contentType = request.header('content-type')

    let dadosBody = request.body

    let paisAtualizado = await controllerPaises.setAtualizarPais(idPais, dadosBody, contentType)

    response.json(paisAtualizado)
    response.status(paisAtualizado.status_code)


})

///////////////////// PRODUTORAS /////////////////

app.get('/v2/AcmeFilmes/produtoras', cors(), async function (request, response){

    let listaDeProdutoras = await controllerProdutoras.getListarProdutoras()

    if(listaDeProdutoras){
        response.json(listaDeProdutoras)
        response.status(200)
    }else{
        response.json({erro:'itens não encontrados'})
        response.status(404)
    }

})

app.get('/v2/AcmeFilmes/produtora/:id', cors(), async function (request, response){

    let idProdutora = request.params.id

    let produtora = await controllerProdutoras.getBuscarProdutora(idProdutora)

    if(produtora){
        response.json(produtora)
        response.status(200)
    }else{
        response.json({erro:'itens não encontrados'})
        response.status(404)
    }

})

app.post('/v2/AcmeFilmes/produtoras', cors(), bodyParserJSON, async function(request, response){

    let contentType = request.header('content-type')

    let dadosBody = request.body

    let resultNovaProdutora = await controllerProdutoras.setInserirNovaProdutora(dadosBody, contentType)

    // response.status(resultNovoGenero.status_code)
    response.json(resultNovaProdutora)
})

app.put('/v2/AcmeFilmes/produtora/:id', cors(), bodyParserJSON, async  function(request, response){

    let idProdutora = request.params.id

    let contentType = request.header('content-type')

    let dadosBody = request.body

    let produtoraAtualizada = await controllerProdutoras.setAtualizarProdutora(idProdutora, dadosBody, contentType)

    response.json(produtoraAtualizada)
    response.status(produtoraAtualizada.status_code)

})

app.delete('/v2/AcmeFilmes/produtora/:id', cors(), bodyParserJSON, async function(request, response){

    let idProdutora = request.params.id

    let produtoraDeletada = await controllerProdutoras.setExcluirProdutora(idProdutora)

    response.json(produtoraDeletada)
    response.status(produtoraDeletada.status_code)

})

///////////////////////////////////// ATORES //////////////////////////////

app.get('/v2/AcmeFilmes/atores', cors(), async (request, response) =>{

    let listaDeAtores = await controllerAtores.getListarAtores()

    if(listaDeAtores){
        response.json(listaDeAtores)
        response.status(200)
    }else{
        response.json({erro:'itens não encontrados'})
        response.status(404)
    }

})

app.get('/v2/AcmeFilmes/ator/:id', cors(), async function (request, response) {

    let idAtor = request.params.id

    //chama a função da controller para listar o filme com id correspondente
    let dadosAtor = await controllerAtores.getBuscarAtor(idAtor)
        response.status(dadosAtor.status_code)
        response.json(dadosAtor)

})

app.post('/v2/AcmeFilmes/ator', cors(), bodyParserJSON, async function(request, response){

    //recebe o content type da requisição
    let contentType = request.header('content-type')

    //recebe todos os dados enviados na requisição pelo body
    let dadosBody = request.body

    //encaminha os dados para a controller enviar para o DAO
    let resultDadosNovoAtor = await controllerAtores.setInserirNovoAtor(dadosBody, contentType)
    
    response.status(resultDadosNovoAtor.status_code)
    response.json(resultDadosNovoAtor)

})

app.delete('/v2/AcmeFilmes/ator/:id', cors(), bodyParserJSON, async function(request, response){

    let idAtor = request.params.id

    let atorDeletado = await controllerAtores.setExcluirAtor(idAtor)

    response.json(atorDeletado)
    response.status(atorDeletado.status_code)
})

app.put('/v2/AcmeFilmes/ator/:id', cors(), bodyParserJSON, async function(request, response){

    let idAtor = request.params.id

    let contentType = request.header('content-type')

    let dadosBody = request.body

    let atorAtualizado = await controllerAtores.setAtualizarAtor(idAtor, dadosBody, contentType)

    response.json(atorAtualizado)
    response.status(atorAtualizado.status_code)


})

///////////////////////////////////////// DIRETORES /////////////////////////////
app.get('/v2/AcmeFilmes/diretores', cors(), async (request, response) =>{

    let listaDeDiretores = await controllerDiretores.getListarDiretores()

    if(listaDeDiretores){
        response.json(listaDeDiretores)
        response.status(200)
    }else{
        response.json({erro:'itens não encontrados'})
        response.status(404)
    }

})

app.get('/v2/AcmeFilmes/diretor/:id', cors(), async function (request, response) {

    let idDiretor = request.params.id

    //chama a função da controller para listar o filme com id correspondente
    let dadosDiretor = await controllerDiretores.getBuscarDiretor(idDiretor)
        response.status(dadosDiretor.status_code)
        response.json(dadosDiretor)

})

app.post('/v2/AcmeFilmes/diretor', cors(), bodyParserJSON, async function(request, response){

    //recebe o content type da requisição
    let contentType = request.header('content-type')

    //recebe todos os dados enviados na requisição pelo body
    let dadosBody = request.body

    //encaminha os dados para a controller enviar para o DAO
    let resultDadosNovoDiretor = await controllerDiretores.setInserirNovoDiretor(dadosBody, contentType)
    
    response.status(resultDadosNovoDiretor.status_code)
    response.json(resultDadosNovoDiretor)

})

app.delete('/v2/AcmeFilmes/diretor/:id', cors(), bodyParserJSON, async function(request, response){

    let idDiretor = request.params.id

    let diretorDeletado = await controllerDiretores.setExcluirDiretor(idDiretor)

    response.json(diretorDeletado)
    response.status(diretorDeletado.status_code)
})

app.put('/v2/AcmeFilmes/diretor/:id', cors(), bodyParserJSON, async function(request, response){

    let idDiretor = request.params.id

    let contentType = request.header('content-type')

    let dadosBody = request.body

    let diretorAtualizado = await controllerDiretores.setAtualizarDiretor(idDiretor, dadosBody, contentType)

    response.json(diretorAtualizado)
    response.status(diretorAtualizado.status_code)


})



//////////////////// USUÁRIOS ///////////////////

app.get('/v2/AcmeFilmes/usuarios', cors(), async (request, response) =>{

    let listaDeUsuarios = await controllerUsuarios.getListarUsuarios()

    if(listaDeUsuarios){
        response.json(listaDeUsuarios)
        response.status(200)
    }else{
        response.json({erro:'itens não encontrados'})
        response.status(404)
    }

})

app.get('/v2/AcmeFilmes/usuario/:id', cors(), async function (request, response) {

    let idUsuario = request.params.id

    //chama a função da controller para listar o filme com id correspondente
    let dadosUsuario = await controllerUsuarios.getBuscarUsuario(idUsuario)
        response.status(dadosUsuario.status_code)
        response.json(dadosUsuario)

})

app.post('/v2/AcmeFilmes/usuario', cors(), bodyParserJSON, async function(request, response){

    //recebe o content type da requisição
    let contentType = request.header('content-type')

    //recebe todos os dados enviados na requisição pelo body
    let dadosBody = request.body

    //encaminha os dados para a controller enviar para o DAO
    let resultDadosNovoUsuario = await controllerUsuarios.setInserirNovoUsuario(dadosBody, contentType)
    
    response.status(resultDadosNovoUsuario.status_code)
    response.json(resultDadosNovoUsuario)

})

app.delete('/v2/AcmeFilmes/usuario/:id', cors(), bodyParserJSON, async function(request, response){

    let idUsuario = request.params.id

    let usuarioDeletado = await controllerUsuarios.setExcluirUsuario(idUsuario)

    response.json(usuarioDeletado)
    response.status(usuarioDeletado.status_code)
})

app.put('/v2/AcmeFilmes/usuario/:id', cors(), bodyParserJSON, async function(request, response){

    let idUsuario = request.params.id

    let contentType = request.header('content-type')

    let dadosBody = request.body

    let usuarioAtualizado = await controllerUsuarios.setAtualizarUsuario(idUsuario, dadosBody, contentType)

    response.json(usuarioAtualizado)
    response.status(usuarioAtualizado.status_code)


})

//////////////////// ADMNISTRADORES /////////////////////

app.get('/v2/AcmeFilmes/admnistradores', cors(), async (request, response) =>{

    let listaDeAdmnistradores = await contollerAdmnistradores.getListarAdmnistradores()

    if(listaDeAdmnistradores){
        response.json(listaDeAdmnistradores)
        response.status(200)
    }else{
        response.json({erro:'itens não encontrados'})
        response.status(404)
    }

})

app.get('/v2/AcmeFilmes/admnistrador/:id', cors(), async function (request, response) {

    let idAdmnistrador = request.params.id

    //chama a função da controller para listar o filme com id correspondente
    let dadosAdmnistrador = await contollerAdmnistradores.getBuscarAdmnistrador(idAdmnistrador)
        response.status(dadosAdmnistrador.status_code)
        response.json(dadosAdmnistrador)

})

app.post('/v2/AcmeFilmes/admnistradores', cors(), bodyParserJSON, async function(request, response){

    //recebe o content type da requisição
    let contentType = request.header('content-type')

    //recebe todos os dados enviados na requisição pelo body
    let dadosBody = request.body

    //encaminha os dados para a controller enviar para o DAO
    let resultDadosNovoUsuario = await contollerAdmnistradores.setInserirNovoAdmnistrador(dadosBody, contentType)
    
    response.status(resultDadosNovoUsuario.status_code)
    response.json(resultDadosNovoUsuario)

})

app.delete('/v2/AcmeFilmes/admnistrador/:id', cors(), bodyParserJSON, async function(request, response){

    let idAdmnistrador = request.params.id

    let admnistradorDeletado = await contollerAdmnistradores.setExcluirAdmnistrador(idAdmnistrador)

    response.json(admnistradorDeletado)
    response.status(admnistradorDeletado.status_code)
})

app.put('/v2/AcmeFilmes/admnistrador/:id', cors(), bodyParserJSON, async function(request, response){

    let idAdmnistrador = request.params.id

    let contentType = request.header('content-type')

    let dadosBody = request.body

    let admnistradorAtualizado = await contollerAdmnistradores.setAtualizarAdmnistrador(idAdmnistrador, dadosBody, contentType)

    response.json(admnistradorAtualizado)
    response.status(admnistradorAtualizado.status_code)


})


//app.listen na porta 8080
app.listen('8080', () =>{
    console.log('API funcionando')
})

