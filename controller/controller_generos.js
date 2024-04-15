

const message = require('../modulo/config.js')
const generosDAO = require('../model/DAO/genero.js')

const getListarGeneros = async () => {

    try {

        let generosJSON = {}
        let dadosGeneros = await generosDAO.selectAllGeneros()

        if (dadosGeneros) {

            if (dadosGeneros.length > 0) {
                generosJSON.generos = dadosGeneros
                generosJSON.quantidade = dadosGeneros.length
                generosJSON.status_code = 200

                return generosJSON

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

const getBuscarGenero = async (id) => {

    let idGenero = id

    try {
        if (idGenero == "" || idGenero == undefined || isNaN(idGenero)) {
            return message.ERROR_INVALID_ID
        } else {

            let generosJSON = {}
            let dadosGeneros = await generosDAO.selectByIdGenero(idGenero)

            if (dadosGeneros) {

                if (dadosGeneros.length > 0) {
                    generosJSON.generos = dadosGeneros
                    generosJSON.quantidade = dadosGeneros.length
                    generosJSON.status_code = 200

                    return generosJSON

                } else {
                    return message.ERROR_NOT_FOUND
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }

}

const setInserirNovoGenero = async (dadosGenero, contentType) => {

    try {

        if (String(contentType).toLowerCase() == 'application/json') {

            let generoAtualizadoJSON = {}

            if (dadosGenero.nome == "" || dadosGenero.nome == undefined ||
                dadosGenero.nome == null || dadosGenero.nome.length > 45) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let novoGenero = await generosDAO.insertGenero(dadosGenero)
                let novoId = await generosDAO.selectLastInsertId()

                if (novoGenero) {

                    generoAtualizadoJSON.genero = dadosGenero
                    generoAtualizadoJSON.genero.id = novoId
                    generoAtualizadoJSON.status = message.SUCCESS_CREATED_ITEM.status
                    generoAtualizadoJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    generoAtualizadoJSON.message = message.SUCCESS_CREATED_ITEM.message

                    return generoAtualizadoJSON
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }
        } else {
            return message.ERROR_CONTENT_TYPE
        }

    } catch (error) {

        return message.ERROR_INTERNAL_SERVER
    }

}

const setAtualizarGenero = async (id, dados, contentType) => {

    let idGenero = id
    let dadosGenero = dados

    try {
        console.log(contentType)
        if (String(contentType).toLowerCase() == 'application/json') {

            let generoAtualizadoJSON = {}
            if (idGenero == "" || idGenero == undefined || isNaN(idGenero)) {
                //caso seja inválido, envia a mensagem da config                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                return message.ERROR_INVALID_ID
            } else {
                if (dadosGenero.nome == "" || dadosGenero.nome == undefined ||
                    dadosGenero.nome == null || dadosGenero.nome.length > 45) {
                    return message.ERROR_REQUIRED_FIELDS
                } else {
                    let generoAtualizado = await generosDAO.updateGenero(idGenero, dadosGenero)

                    if (generoAtualizado) {

                        generoAtualizadoJSON.genero = dadosGenero
                        generoAtualizadoJSON.genero.id = idGenero
                        generoAtualizadoJSON.status = message.SUCCESS_UPDATED_ITEM.status
                        generoAtualizadoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                        generoAtualizadoJSON.message = message.SUCCESS_UPDATED_ITEM.message

                        return generoAtualizadoJSON
                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB
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

const setExcluirGenero = async (id) => {

    let idGenero = id

    try {

        if (idGenero == "" || idGenero == undefined || isNaN(idGenero)) {
            return message.ERROR_INVALID_ID
        }else{
            let generoDeletado = await generosDAO.deleteGenero(idGenero)

            if(generoDeletado)
            return message.SUCCESS_DELETED_ITEM
            else
            return message.ERROR_INTERNAL_SERVER_DB
        }
        
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }

}



module.exports = {
    getListarGeneros,
    getBuscarGenero,
    setInserirNovoGenero,
    setExcluirGenero,
    setAtualizarGenero
}