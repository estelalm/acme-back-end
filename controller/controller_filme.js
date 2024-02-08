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
const getBuscarFilme = async function (){
}

module.exports = {
    setInserirNovoFilme,
    setAtualizarFilme,
    setExcluirFilme,
    getListarFilmes,
    getBuscarFilme
}
