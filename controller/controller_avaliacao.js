
const avaliacaoDAO = require('../model/DAO/avaliacao.js')
const controllerFilme = require('./controller_filme.js')
const message = require('../modulo/config.js')

const getListarFilmesAvaliadosUsuario = async function (idUsuario){

    try {
        //cria um objeto json
        let filmesJSON = {}

        //chama a função do DAO que retorna os filmes do banco
        let dadosFilmesAvaliados = await avaliacaoDAO.selectFilmesAvaliadosUsuario(idUsuario)

        console.log(dadosFilmesAvaliados)
        await Promise.all(dadosFilmesAvaliados.map(async avaliado =>{
            let filmeAvaliado = await controllerFilme.getBuscarFilme(avaliado.filme)
            avaliado.filme = filmeAvaliado.filme;
        }))

        //validação para verificar se o DAO retornou dados
        if (dadosFilmesAvaliados) {
            //cria os atributos para reornar ao app

            if (dadosFilmesAvaliados.length > 0) {
                filmesJSON.filmes = dadosFilmesAvaliados
                filmesJSON.quantidade = dadosFilmesAvaliados.length
                filmesJSON.status_code = 200

                return filmesJSON
            } else {
                return message.ERROR_NOT_FOUND
            }

        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER //500: erro na controller
    }
}

module.exports ={
    getListarFilmesAvaliadosUsuario
}