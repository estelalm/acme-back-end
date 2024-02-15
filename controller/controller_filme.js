/***********************************************************************
 * Objetivo: Arquivo responsável pelas validações e consistências de dados de 'filme'.
 * Data: 01/02/2023
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
***********************************************************************/

//
const filmesDAO = require('../model/DAO/filme.js')

//função para inserir um novo filme
const setInserirNovoFilme =async function (){

}  

//função para atualizar um filme
const setAtualizarFilme = async function (){
}

//função para deletar um filme
const setExcluirFilme = async function (){
}

//função para listar todos os filmes
const getListarFilmes = async function (){

    //cria um objeto json
     let filmesJSON = {}

     //chama a função do DAO que retorna os filmes do banco
     let dadosFilmes = await filmesDAO.selectAllFilmes()
     //validação para verificar se o DAO retornou dados
     if(dadosFilmes){
        //cria os atributos para reornar ao app
        filmesJSON.filmes = dadosFilmes
        filmesJSON.quantidade = dadosFilmes.length
        filmesJSON.status_code = 200
        
        return filmesJSON
    }else{
        return false
    }

}

//função para buscar um filme pelo id
const getBuscarFilme = async function (idFilme){
    //cria um objeto json
    let filmeJSON = {}

    //chama a função do DAO que retorna os filmes do banco
    let dadosFilme = await filmesDAO.selectByIdFilme(idFilme)
    //validação para verificar se o DAO retornou dados
    if(dadosFilme){
       //cria os atributos para reornar ao app
       filmeJSON.filmes = dadosFilme
       filmeJSON.status_code = 200
       
       return filmeJSON
   }else{
       return false
   }

}

const getBuscarNomeFilme = async function (nomeFilme){

    let filmesJSON = {}

    let dadosFilmes = await filmesDAO.selectByNomeFilme(nomeFilme)

    if(dadosFilmes){
        filmesJSON.filmes = dadosFilmes
        filmesJSON.quantidade = dadosFilmes.length
        filmesJSON.status_code = 200

        return filmesJSON
    }else{
        return false
    }
}

module.exports = {
    setInserirNovoFilme,
    setAtualizarFilme,
    setExcluirFilme,
    getListarFilmes,
    getBuscarFilme,
    getBuscarNomeFilme
}
