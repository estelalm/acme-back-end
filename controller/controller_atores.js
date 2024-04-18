const message = require('../modulo/config.js')
const atoresDAO = require('../model/DAO/ator.js')

const getListarAtores = async function () {

    try {
        let atoresJSON = {}

        let dadosAtores = await atoresDAO.selectAllAtores()

        if (dadosAtores) {
            if (dadosAtores.length > 0) {
                atoresJSON.atores = dadosAtores
                atoresJSON.quantidade = dadosAtores.length
                atoresJSON.status_code = 200

                return atoresJSON
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

const getBuscarAtor = async (id) =>{

    try {
        let idAtor = id

        if (idAtor == "" || idAtor == undefined || isNaN(idAtor)) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
            return message.ERROR_INVALID_ID
        } else {

            let atorJSON = {}

            let dadosAtor = await atoresDAO.selectByIdAtor(idAtor)

            if (dadosAtor) {

                if (dadosAtor.length > 0) {

                    atorJSON.ator = dadosAtor
                    atorJSON.status_code = 200

                    return atorJSON

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

const setInserirNovoAtor = async function (dadosAtor, contentType) {

    try {

        if (String(contentType).toLowerCase() == 'application/json') {  

            let novoAtorJSON = {}

            if (dadosAtor.nome == "" || dadosAtor.nome == undefined || dadosAtor.nome == null || dadosAtor.nome.length > 80 ||
                dadosAtor.cpf == "" || dadosAtor.cpf == undefined || dadosAtor.cpf == null || dadosAtor.cpf.length > 18 ||
                dadosAtor.telefone == "" || dadosAtor.telefone == undefined || dadosAtor.telefone == null || dadosAtor.telefone.length > 15 ||
                dadosAtor.email == "" || dadosAtor.email == undefined || dadosAtor.email == null || dadosAtor.email.length > 50 ||
                dadosAtor.senha == "" || dadosAtor.senha == undefined || dadosAtor.senha == null || dadosAtor.senha.length > 20
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {


                    let novoAtor = await atoresDAO.insertAtor(dadosAtor)
                    let idNovoAtor = await atoresDAO.selectLastInsertId()

                    if (novoAtor) {
                        novoAtorJSON.ator = dadosAtor
                        novoAtorJSON.ator.id = idNovoAtor
                        novoAtorJSON.status = message.SUCCESS_CREATED_ITEM.status
                        novoAtorJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                        novoAtorJSON.message = message.SUCCESS_CREATED_ITEM.message

                        return novoAtorJSON 
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

const setExcluirAtor = async function (id) {

    try {

        let idAtor = id

        if (idAtor == "" || idAtor == undefined || isNaN(idAtor)) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
            return message.ERROR_INVALID_ID
        } else {
            let atorDeletado = await atoresDAO.deleteAtor(idAtor)

            if (atorDeletado) {
                return message.SUCCESS_DELETED_ITEM 

            } else {
                return message.ERROR_INTERNAL_SERVER_DB 
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER 
    }

}

const setAtualizarAtor = async function (id, dados, contentType){

    try {
        
        let idAtor = id
        let dadosAtor = dados

        if (String(contentType).toLowerCase() == 'application/json') {
            if (idAtor == "" || idAtor == undefined || isNaN(idAtor)) {
                //caso seja inválido, envia a mensagem da config                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                return message.ERROR_INVALID_ID
            } else {

                if (dadosAtor.nome == "" || dadosAtor.nome == undefined || dadosAtor.nome == null || dadosAtor.nome.length > 80 ||
                dadosAtor.cpf == "" || dadosAtor.cpf == undefined || dadosAtor.cpf == null || dadosAtor.cpf.length > 18 ||
                dadosAtor.telefone == "" || dadosAtor.telefone == undefined || dadosAtor.telefone == null || dadosAtor.telefone.length > 15 ||
                dadosAtor.email == "" || dadosAtor.email == undefined || dadosAtor.email == null || dadosAtor.email.length > 50 ||
                dadosAtor.senha == "" || dadosAtor.senha == undefined || dadosAtor.senha == null || dadosAtor.senha.length > 20
                ) {
                    return message.ERROR_REQUIRED_FIELDS
                } else {


                        let atorAtualizado = await atoresDAO.updateAtor(idAtor, dadosAtor)

                        let atorAtualizadoJSON = {}

                        if (atorAtualizado){
                            atorAtualizadoJSON.ator = dadosAtor
                            atorAtualizadoJSON.status = message.SUCCESS_UPDATED_ITEM.status
                            atorAtualizadoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                            atorAtualizadoJSON.message = message.SUCCESS_UPDATED_ITEM.message

                            return atorAtualizadoJSON
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
    getListarAtores,
    getBuscarAtor,
    setInserirNovoAtor,
    setExcluirAtor,
    setAtualizarAtor
}