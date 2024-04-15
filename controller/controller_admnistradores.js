
const message = require('../modulo/config.js')
const admnistradoresDAO = require('../model/DAO/admnistrador.js')

const getListarAdmnistradores = async function () {

    try {
        let admnistradoresJSON = {}

        let dadosAdmnistradores = await admnistradoresDAO.selectAllAdmnistradores()

        if (dadosAdmnistradores) {
            if (dadosAdmnistradores.length > 0) {
                admnistradoresJSON.admnistradores = dadosAdmnistradores
                admnistradoresJSON.quantidade = dadosAdmnistradores.length
                admnistradoresJSON.status_code = 200

                return admnistradoresJSON
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

const getBuscarAdmnistrador = async (id) =>{

    try {
        let idAdmnistrador = id

        if (idAdmnistrador == "" || idAdmnistrador == undefined || isNaN(idAdmnistrador)) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
            return message.ERROR_INVALID_ID
        } else {

            let admnistradorJSON = {}

            let dadosAdmnistrador = await admnistradoresDAO.selectByIdAdmnistrador(idAdmnistrador)

            if (dadosAdmnistrador) {

                if (dadosAdmnistrador.length > 0) {

                    admnistradorJSON.admnistrador = dadosAdmnistrador
                    admnistradorJSON.status_code = 200

                    return admnistradorJSON

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

const setInserirNovoAdmnistrador = async function (dadosAdmnistrador, contentType) {

    try {

        if (String(contentType).toLowerCase() == 'application/json') {  

            let novoAdmnistradorJSON = {}

            if (dadosAdmnistrador.nome == "" || dadosAdmnistrador.nome == undefined || dadosAdmnistrador.nome == null || dadosAdmnistrador.nome.length > 80 ||
                dadosAdmnistrador.login == "" || dadosAdmnistrador.login == undefined || dadosAdmnistrador.login == null || dadosAdmnistrador.login.length > 50 ||
                dadosAdmnistrador.senha == "" || dadosAdmnistrador.senha == undefined || dadosAdmnistrador.senha == null || dadosAdmnistrador.senha.length > 20
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {


                    let novoAdmnistrador = await admnistradoresDAO.insertAdmnistrador(dadosAdmnistrador)
                    let idNovoAdmnistrador = await admnistradoresDAO.selectLastInsertId()

                    if (novoAdmnistrador) {
                        novoAdmnistradorJSON.admnistrador = dadosAdmnistrador
                        novoAdmnistradorJSON.admnistrador.id = idNovoAdmnistrador
                        novoAdmnistradorJSON.status = message.SUCCESS_CREATED_ITEM.status
                        novoAdmnistradorJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                        novoAdmnistradorJSON.message = message.SUCCESS_CREATED_ITEM.message

                        return novoAdmnistradorJSON 
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

const setExcluirAdmnistrador = async function (id) {

    try {

        let idAdmnistrador = id

        if (idAdmnistrador == "" || idAdmnistrador == undefined || isNaN(idAdmnistrador)) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
            return message.ERROR_INVALID_ID
        } else {
            let admnistradorDeletado = await admnistradoresDAO.deleteAdmnistrador(idAdmnistrador)

            if (admnistradorDeletado) {
                return message.SUCCESS_DELETED_ITEM 

            } else {
                return message.ERROR_INTERNAL_SERVER_DB 
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER 
    }

}

const setAtualizarAdmnistrador = async function (id, dados, contentType){

    try {
        
        let idAdmnistrador = id
        let dadosAdmnistrador = dados

        if (String(contentType).toLowerCase() == 'application/json') {
            if (idAdmnistrador == "" || idAdmnistrador == undefined || isNaN(idAdmnistrador)) {
                //caso seja inválido, envia a mensagem da config                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                return message.ERROR_INVALID_ID
            } else {

                if (dadosAdmnistrador.nome == "" || dadosAdmnistrador.nome == undefined || dadosAdmnistrador.nome == null || dadosAdmnistrador.nome.length > 80 ||
                dadosAdmnistrador.login == "" || dadosAdmnistrador.login == undefined || dadosAdmnistrador.login == null || dadosAdmnistrador.login.length > 50 ||
                dadosAdmnistrador.senha == "" || dadosAdmnistrador.senha == undefined || dadosAdmnistrador.senha == null || dadosAdmnistrador.senha.length > 20
                ) {
                    return message.ERROR_REQUIRED_FIELDS
                } else {


                        let admnistradorAtualizado = await admnistradoresDAO.updateAdmnistrador(idAdmnistrador, dadosAdmnistrador)

                        let admnistradorAtualizadoJSON = {}

                        if (admnistradorAtualizado){
                            admnistradorAtualizadoJSON.admnistrador = dadosAdmnistrador
                            admnistradorAtualizadoJSON.status = message.SUCCESS_UPDATED_ITEM.status
                            admnistradorAtualizadoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                            admnistradorAtualizadoJSON.message = message.SUCCESS_UPDATED_ITEM.message

                            return admnistradorAtualizadoJSON
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


module.exports = {
    getListarAdmnistradores,
    getBuscarAdmnistrador,
    setInserirNovoAdmnistrador,
    setExcluirAdmnistrador,
    setAtualizarAdmnistrador
}