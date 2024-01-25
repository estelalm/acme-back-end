/************************************************************
 * Objetivo: Projeto para a empresa de Filmes Online Acme
 * Data: 25/01/2024
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
 ***********************************************************/

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const filmes_funcoes = require('./controller/filmes_funcoes.js')

const app = express()

app.use(express.json())
app.use((request,response,next) =>{

    response.header('Access-Control-Allow-origin', '*')
    response.header('Acesss-Control-Allow-Methods', 'GET')
    request.header('Content-Type', 'application/json')
    app.use(cors())

    next()
})

app.get('/v1/AcmeFilmes/filmes', cors(), async function(request, response, next){

    let listaDeFilmes = filmes_funcoes.getFilmes()

    if(listaDeFilmes){
        response.json(listaDeFilmes)
        response.status(200)
    }else{
        response.json({erro:'itens não encntrados'})
        response.status(404)
    }

    next()
})

app.get('/v1/AcmeFilmes/filmes/id/:id', cors(), async function( request, response, next) {

    let idFilme = request.params.id
    let filmeListado = filmes_funcoes.getFilmesId(idFilme)

    if(filmeListado){
        response.json(filmeListado)
        response.status(200)
    }else{
        response.json({erro:'itens não encntrados'})
        response.status(404)
    }

    next()
})

app.listen('8080', () =>{
    console.log('API funcionando')
})

