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
    response.header('Acesss-Control-Allow-Methods', 'GET')
    request.header('Content-Type', 'application/json')
    app.use(cors())

    next()
})

//---------------------  import dos aquivos de controller do projeto ----------------------------------//
const filmes_funcoes = require('./controller/filmes_funcoes.js')
const controllerFilmes = require('./controller/controller_filme.js')


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
app.get('v2/AcmeFilmes/filmes', cors(), async function (request, response) {

    //chama a função da controller para listar todos os filmes
    let dadosFilmes = controllerFilmes.getListarFilmes()

    //validação para verficar se existem dados a serem retornados
    if(dadosFilmes){
        response.json(dadosFilmes)
        response.status(200)
    }else{
        response.json({message: 'Nenhum registro encontrado'})
        response.status(404)
    }

})


app.listen('8080', () =>{
    console.log('API funcionando')
})

