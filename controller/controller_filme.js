/***********************************************************************
 * Objetivo: Arquivo responsável pelas validações e consistências de dados de 'filme'.
 * Data: 01/02/2023
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
***********************************************************************/

//import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
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

        if(dadosFilmes.length > 0){
            filmesJSON.filmes = dadosFilmes
            filmesJSON.quantidade = dadosFilmes.length
            filmesJSON.status_code = 200
            
            return filmesJSON
        }else{
            return message.ERROR_NOT_FOUND
        }

    }else{
        return message.ERROR_INTERNAL_SERVER_DB
    }

}

//função para buscar um filme pelo id
const getBuscarFilme = async function (id){
    
    let idFilme = id

    //validação do id
    if(idFilme == "" || idFilme == undefined || isNaN(idFilme)){
        //caso seja inválido, envia a mensagem da confi                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
        return message.ERROR_INVALID_ID
    }else{
    
    //cria um objeto json
    let filmeJSON = {}

    //chama a função do DAO que retorna os filmes do banco
    let dadosFilme = await filmesDAO.selectByIdFilme(idFilme)
    //validação para verificar se o DAO retornou dados
    if(dadosFilme){
       //cria os atributos para reornar ao app

       if(dadosFilme.length > 0){

        filmeJSON.filme = dadosFilme
        filmeJSON.status_code = 200

        return filmeJSON
    
       }else{
        return message.ERROR_NOT_FOUND
       }
       
   }else{
       return message.ERROR_INTERNAL_SERVER_DB
   }
}

}

const getBuscarNomeFilme = async function (nome){

    let nomeFilme = nome
    if(nomeFilme == ""){
        return message.ERROR_INVALID_VALUE
    }else{
        let filmesJSON = {}

        let dadosFilmes = await filmesDAO.selectByNomeFilme(nomeFilme)
    
        if(dadosFilmes){
    
            if(dadosFilmes.length > 0){
                filmesJSON.filmes = dadosFilmes
                filmesJSON.quantidade = dadosFilmes.length
                filmesJSON.status_code = 200
        
                return filmesJSON
            }else{
                return message.ERROR_NOT_FOUND
            }
    
        }else{
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
   
}

const getFiltrarFilmes = async function(parametros){
    if(parametros == ""){
        return message.ERROR_INVALID_VALUE
    }else{
        let filmesJSON = {}

        let dadosFilmes = await filmesDAO.selectByFiltro(parametros)
    
        if(dadosFilmes){
    
            if(dadosFilmes.length > 0){
                filmesJSON.filmes = dadosFilmes
                filmesJSON.quantidade = dadosFilmes.length
                filmesJSON.status_code = 200

                return filmesJSON
            }else{
                return message.ERROR_NOT_FOUND
            }
    
        }else{
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }

}

module.exports = {
    setInserirNovoFilme,
    setAtualizarFilme,
    setExcluirFilme,
    getListarFilmes,
    getBuscarFilme,
    getBuscarNomeFilme,
    getFiltrarFilmes
}
