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
const setInserirNovoFilme = async function (dadosFilme, contentType) {

    try {

        if (String(contentType).toLowerCase() == 'application/json') {  //**

            //cria o objeto JSON para devolver os dados criados na requisição
            let novoFilmeJSON = {}

            //validação de campos obrigatórios ou com digitação inválida
            if (dadosFilme.nome == "" || dadosFilme.nome == undefined || dadosFilme.nome == null || dadosFilme.nome.length > 80 ||
                dadosFilme.sinopse == "" || dadosFilme.sinopse == undefined || dadosFilme.sinopse == null || dadosFilme.sinopse.length > 65000 ||
                dadosFilme.duracao == "" || dadosFilme.duracao == undefined || dadosFilme.duracao == null || dadosFilme.duracao.length > 8 ||
                dadosFilme.data_lancamento == "" || dadosFilme.data_lancamento == undefined || dadosFilme.data_lancamento == null || dadosFilme.data_lancamento.length != 10 ||
                dadosFilme.foto_capa == "" || dadosFilme.foto_capa == undefined || dadosFilme.foto_capa == null || dadosFilme.foto_capa.length > 200 ||
                dadosFilme.valor_unitario.length > 6
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {

                //validação da data de relançamento
                let validateStatus = false

                if (dadosFilme.data_relancamento != null && dadosFilme.data_relancamento != "" && dadosFilme.data_relancamento != undefined) {

                    if (dadosFilme.data_relancamento.length != 10)
                        return message.ERROR_REQUIRED_FIELDS //400
                    else
                        validateStatus = true

                } else {
                    validateStatus = true
                }

                //verificar se a variável é verdadeira
                if (validateStatus) {

                    //encaminhando os dados do filme para o DAO inserir no banco de dados
                    let novoFilme = await filmesDAO.insertFilme(dadosFilme)
                    let idNovoFilme = await filmesDAO.selectLastInsertId()


                    //validação para verificar se o DAO inseriu os dados no banco
                    if (novoFilme) {
                        //cria o JSON de retorno dos dados (201)
                        novoFilmeJSON.filme = dadosFilme
                        novoFilmeJSON.filme.id = idNovoFilme
                        novoFilmeJSON.status = message.SUCCESS_CREATED_ITEM.status
                        novoFilmeJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                        novoFilmeJSON.message = message.SUCCESS_CREATED_ITEM.message

                        return novoFilmeJSON //201
                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB //500
                    }

                }

            }

        } else {
            return message.ERROR_CONTENT_TYPE
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }

}

//função para atualizar um filme ????????????
const setAtualizarFilme = async function (id, dadosFilme, contentType) {

    try {
        
        let idFilme = id
        if (String(contentType).toLowerCase() == 'application/json') {
            if (idFilme == "" || idFilme == undefined || isNaN(idFilme)) {
                //caso seja inválido, envia a mensagem da config                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                return message.ERROR_INVALID_ID
            } else {

                if (dadosFilme.nome == "" || dadosFilme.nome == undefined || dadosFilme.nome == null || dadosFilme.nome.length > 80 ||
                    dadosFilme.sinopse == "" || dadosFilme.sinopse == undefined || dadosFilme.sinopse == null || dadosFilme.sinopse.length > 65000 ||
                    dadosFilme.duracao == "" || dadosFilme.duracao == undefined || dadosFilme.duracao == null || dadosFilme.duracao.length > 8 ||
                    dadosFilme.data_lancamento == "" || dadosFilme.data_lancamento == undefined || dadosFilme.data_lancamento == null || dadosFilme.data_lancamento.length != 10 ||
                    dadosFilme.foto_capa == "" || dadosFilme.foto_capa == undefined || dadosFilme.foto_capa == null || dadosFilme.foto_capa.length > 200 ||
                    dadosFilme.valor_unitario.length > 6
                ) {
                    return message.ERROR_REQUIRED_FIELDS
                } else {
                    let validateStatus = false

                    if (dadosFilme.data_relancamento != null && dadosFilme.data_relancamento != "" && dadosFilme.data_relancamento != undefined) {

                        if (dadosFilme.data_relancamento.length != 10)
                            return message.ERROR_REQUIRED_FIELDS //400
                        else
                            validateStatus = true

                    } else {
                        validateStatus = true
                    }

                    if(validateStatus){

                        let filmeAtualizado = await filmesDAO.updateFilme(idFilme, dadosFilme)

                        let filmeAtualizadoJSON = {}

                        if (filmeAtualizado){
                            filmeAtualizadoJSON.filme = dadosFilme
                            filmeAtualizadoJSON.status = message.SUCCESS_UPDATED_ITEM.status
                            filmeAtualizadoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                            filmeAtualizadoJSON.message = message.SUCCESS_UPDATED_ITEM.message

                            return filmeAtualizadoJSON
                        }else{
                            return message.ERROR_INTERNAL_SERVER_DB
                        }

                    }else{
                        return message.ERROR_INTERNAL_SERVER_DB
                    }

                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }

}

//função para deletar um filme
const setExcluirFilme = async function (id) {

    try {

        let filmeDeletadoJSON = {}

        let idFilme = id

        if (idFilme == "" || idFilme == undefined || isNaN(idFilme)) {
            //caso seja inválido, envia a mensagem da config                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
            return message.ERROR_INVALID_ID
        } else {
            let filmeDeletado = await filmesDAO.deleteFilme(idFilme)

            if (filmeDeletado) {
                return message.SUCCESS_DELETED_ITEM //201

            } else {
                return message.ERROR_INTERNAL_SERVER_DB //500: erro no banco de dados
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER //500: erro na controller
    }

}

//função para listar todos os filmes
const getListarFilmes = async function () {

    try {
        //cria um objeto json
        let filmesJSON = {}

        //chama a função do DAO que retorna os filmes do banco
        let dadosFilmes = await filmesDAO.selectAllFilmes()
        //validação para verificar se o DAO retornou dados
        if (dadosFilmes) {
            //cria os atributos para reornar ao app

            if (dadosFilmes.length > 0) {
                filmesJSON.filmes = dadosFilmes
                filmesJSON.quantidade = dadosFilmes.length
                filmesJSON.status_code = 200

                return filmesJSON
            } else {
                return message.ERROR_NOT_FOUND
            }

        } else {
            
            return message.ERROR_INTERNAL_SERVER_DB
        }
    } catch (error) {
        
        return message.ERROR_INTERNAL_SERVER //500: erro na controller
    }
}

//função para buscar um filme pelo id
const getBuscarFilme = async function (id) {

    try {
        let idFilme = id

        //validação do id
        if (idFilme == "" || idFilme == undefined || isNaN(idFilme)) {
            //caso seja inválido, envia a mensagem da confi                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
            return message.ERROR_INVALID_ID
        } else {

            //cria um objeto json
            let filmeJSON = {}

            //chama a função do DAO que retorna os filmes do banco
            let dadosFilme = await filmesDAO.selectByIdFilme(idFilme)
            //validação para verificar se o DAO retornou dados
            if (dadosFilme) {
                //cria os atributos para reornar ao app

                if (dadosFilme.length > 0) {

                    filmeJSON.filme = dadosFilme
                    filmeJSON.status_code = 200

                    return filmeJSON

                } else {
                    return message.ERROR_NOT_FOUND
                }

            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500: erro na controller
    }
}

const getBuscarNomeFilme = async function (nome) {

    try {


        let nomeFilme = nome
        if (nomeFilme == "") {
            return message.ERROR_INVALID_VALUE
        } else {
            let filmesJSON = {}

            let dadosFilmes = await filmesDAO.selectByNomeFilme(nomeFilme)

            if (dadosFilmes) {

                if (dadosFilmes.length > 0) {
                    filmesJSON.filmes = dadosFilmes
                    filmesJSON.quantidade = dadosFilmes.length
                    filmesJSON.status_code = 200

                    return filmesJSON
                } else {
                    return message.ERROR_NOT_FOUND
                }

            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500: erro na controller
    }

}

const getFiltrarFilmes = async function (parametros) {

    try {
        if (parametros == "") {
            return message.ERROR_INVALID_VALUE
        } else {
            let filmesJSON = {}

            let dadosFilmes = await filmesDAO.selectByFiltro(parametros)

            if (dadosFilmes) {

                if (dadosFilmes.length > 0) {
                    filmesJSON.filmes = dadosFilmes
                    filmesJSON.quantidade = dadosFilmes.length
                    filmesJSON.status_code = 200

                    return filmesJSON
                } else {
                    return message.ERROR_NOT_FOUND
                }

            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500: erro na controller
    }
}

module.exports = {
    setInserirNovoFilme,
    setAtualizarFilme,
    setExcluirFilme,
    getListarFilmes,
    getBuscarFilme,
    getBuscarNomeFilme,
    getFiltrarFilmes,
    setExcluirFilme,
    setAtualizarFilme
}
