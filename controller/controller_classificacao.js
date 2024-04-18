

const message = require('../modulo/config.js')
const classificacaoDAO = require('../model/DAO/classificacao.js')

const getListarClassificacoes = async () => {

    try {
        let classificacoesJSON = {}
        let dadosClassificacoes = await classificacaoDAO.selectAllClassificacoes()

        if (dadosClassificacoes) {

            if (dadosClassificacoes.length > 0) {
                classificacoesJSON.classificacoes = dadosClassificacoes
                classificacoesJSON.quantidade = dadosClassificacoes.length
                classificacoesJSON.status_code = 200

                return classificacoesJSON
            } else {
                return message.ERROR_NOT_FOUND
            }

        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const getBuscarClassificacao = async (id) => {

    let idClassificacao = id

    try {
        if (idClassificacao == "" || idClassificacao == undefined || isNaN(idClassificacao)) {
            return message.ERROR_INVALID_ID
        } else {

            let classificacaoJSON = {}
            let dadosClassificacao = await classificacaoDAO.selectByIdClassificacao(idClassificacao)

            if (dadosClassificacao) {

                if (dadosClassificacao.length > 0) {
                    classificacaoJSON.classificacao = dadosClassificacao
                    classificacaoJSON.quantidade = dadosClassificacao.length
                    classificacaoJSON.status_code = 200

                    return classificacaoJSON

                } else {
                    return message.ERROR_NOT_FOUND
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }
}

const getBuscarClassficacaoFilme = async (id) => {

    let idFilme = id

    try {
        if (idFilme == "" || idFilme == undefined || isNaN(idFilme)) {
            return message.ERROR_INVALID_ID
        } else {

            let classificacaoJSON = {}
            let dadosFilme = await classificacaoDAO.selectByFilmeClassificacao(idFilme)

            if (dadosFilme) {

                if (dadosFilme.length > 0) {
                    classificacaoJSON.classificacao = dadosFilme
                    classificacaoJSON.quantidade = dadosFilme.length
                    classificacaoJSON.status_code = 200

                    return classificacaoJSON

                } else {
                    return message.ERROR_NOT_FOUND
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }
}

const setInserirNovaClassificacao = async (dadosClassificacao, contentType) => {

    try {
        if(String(contentType).toLowerCase() == 'application/json'){
        let novaClassificacaoJSON = {}

        if (dadosClassificacao.nome == "" || dadosClassificacao.nome == undefined ||
            dadosClassificacao.nome == null || dadosClassificacao.nome.length > 45) {
            return message.ERROR_REQUIRED_FIELDS
        } else {
            let novaClassificacao = await classificacaoDAO.insertClassificacao(dadosClassificacao)
            let novaId = await classificacaoDAO.selectLastInsertId()

            if (novaClassificacao) {

                novaClassificacaoJSON.classificacao = dadosClassificacao
                novaClassificacaoJSON.classificacao.id = novaId
                novaClassificacaoJSON.status = message.SUCCESS_CREATED_ITEM.status
                novaClassificacaoJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                novaClassificacaoJSON.message = message.SUCCESS_CREATED_ITEM.message

                return novaClassificacaoJSON
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
        }else {
            return message.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        
        return message.ERROR_INTERNAL_SERVER
    }
}

const setAtualizarClassificacao = async (id, dadosClassificacao, contentType) =>{

    try {
       let idClassificacao = id
        if (String(contentType).toLowerCase() == 'application/json') {
            if (idClassificacao == "" || idClassificacao == undefined || isNaN(idClassificacao)) {
                //caso seja inválido, envia a mensagem da config                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                return message.ERROR_INVALID_ID
            }else{

                if(dadosClassificacao.nome == "" || dadosClassificacao.nome == undefined || dadosClassificacao.nome == null || dadosClassificacao.nome.length > 45){
                    return message.ERROR_INVALID_ID
                }else{
                    let classificacaoAtualizado = await classificacaoDAO.updateClassificacao(idClassificacao, dadosClassificacao)

                    let classificacaoAtualizadoJSON = {}

                    if(classificacaoAtualizado){
                        classificacaoAtualizadoJSON.classificacao = dadosClassificacao
                        classificacaoAtualizadoJSON.status = message.SUCCESS_UPDATED_ITEM.status
                        classificacaoAtualizadoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                        classificacaoAtualizadoJSON.message = message.SUCCESS_UPDATED_ITEM.message

                        return classificacaoAtualizadoJSON
                    }else{
                        return message.ERROR_INTERNAL_SERVER_DB
                    }
                }
            }
        }else{
            return message.ERROR_CONTENT_TYPE
        }

        
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }

}

const setExcluirClassificacao = async (id) =>{

    let idClassificacao = id

    try {

        if (idClassificacao == "" || idClassificacao == undefined || isNaN(idClassificacao)) {
            return message.ERROR_INVALID_ID
        }else{
            let classificacaoDeletado = await classificacaoDAO.deleteClassificacao(idClassificacao)

            if(classificacaoDeletado)
            return message.SUCCESS_DELETED_ITEM
            else
            return message.ERROR_INTERNAL_SERVER_DB
        }
        
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }

}


module.exports = {
    getListarClassificacoes,
    getBuscarClassificacao,
    setInserirNovaClassificacao,
    setAtualizarClassificacao,
    getBuscarClassficacaoFilme,
    setExcluirClassificacao
}