/***********************************************************************
 * Objetivo: Arquivo responsável pelas validações e consistências de dados de 'usuario'.
 * Data: 01/02/2023
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
***********************************************************************/

const message = require('../modulo/config.js')
const usuariosDAO = require('../model/DAO/usuario.js')

const getListarUsuarios = async function () {

    try {
        let usuariosJSON = {}

        let dadosUsuarios = await usuariosDAO.selectAllUsuarios()

        if (dadosUsuarios) {
            if (dadosUsuarios.length > 0) {
                usuariosJSON.usuarios = dadosUsuarios
                usuariosJSON.quantidade = dadosUsuarios.length
                usuariosJSON.status_code = 200

                return usuariosJSON
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

const getBuscarUsuario = async (id) =>{

    try {
        let idUsuario = id

        if (idUsuario == "" || idUsuario == undefined || isNaN(idUsuario)) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
            return message.ERROR_INVALID_ID
        } else {

            let usuarioJSON = {}

            let dadosUsuario = await usuariosDAO.selectByIdUsuario(idUsuario)

            if (dadosUsuario) {

                if (dadosUsuario.length > 0) {

                    usuarioJSON.usuario = dadosUsuario
                    usuarioJSON.status_code = 200

                    return usuarioJSON

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

const setInserirNovoUsuario = async function (dadosUsuario, contentType) {

    try {

        if (String(contentType).toLowerCase() == 'application/json') {  

            let novoUsuarioJSON = {}

            if (dadosUsuario.nome == "" || dadosUsuario.nome == undefined || dadosUsuario.nome == null || dadosUsuario.nome.length > 80 ||
                dadosUsuario.cpf == "" || dadosUsuario.cpf == undefined || dadosUsuario.cpf == null || dadosUsuario.cpf.length > 18 ||
                dadosUsuario.telefone == "" || dadosUsuario.telefone == undefined || dadosUsuario.telefone == null || dadosUsuario.telefone.length > 15 ||
                dadosUsuario.email == "" || dadosUsuario.email == undefined || dadosUsuario.email == null || dadosUsuario.email.length > 50 ||
                dadosUsuario.senha == "" || dadosUsuario.senha == undefined || dadosUsuario.senha == null || dadosUsuario.senha.length > 20
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {


                    let novoUsuario = await usuariosDAO.insertUsuario(dadosUsuario)
                    let idNovoUsuario = await usuariosDAO.selectLastInsertId()

                    if (novoUsuario) {
                        novoUsuarioJSON.usuario = dadosUsuario
                        novoUsuarioJSON.usuario.id = idNovoUsuario
                        novoUsuarioJSON.status = message.SUCCESS_CREATED_ITEM.status
                        novoUsuarioJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                        novoUsuarioJSON.message = message.SUCCESS_CREATED_ITEM.message

                        return novoUsuarioJSON 
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

const setExcluirUsuario = async function (id) {

    try {

        let idUsuario = id

        if (idUsuario == "" || idUsuario == undefined || isNaN(idUsuario)) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
            return message.ERROR_INVALID_ID
        } else {
            let usuarioDeletado = await usuariosDAO.deleteUsuario(idUsuario)

            if (usuarioDeletado) {
                return message.SUCCESS_DELETED_ITEM 

            } else {
                return message.ERROR_INTERNAL_SERVER_DB 
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER 
    }

}

const setAtualizarUsuario = async function (id, dados, contentType){

    try {
        
        let idUsuario = id
        let dadosUsuario = dados

        if (String(contentType).toLowerCase() == 'application/json') {
            if (idUsuario == "" || idUsuario == undefined || isNaN(idUsuario)) {
                //caso seja inválido, envia a mensagem da config                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                return message.ERROR_INVALID_ID
            } else {

                if (dadosUsuario.nome == "" || dadosUsuario.nome == undefined || dadosUsuario.nome == null || dadosUsuario.nome.length > 80 ||
                dadosUsuario.cpf == "" || dadosUsuario.cpf == undefined || dadosUsuario.cpf == null || dadosUsuario.cpf.length > 18 ||
                dadosUsuario.telefone == "" || dadosUsuario.telefone == undefined || dadosUsuario.telefone == null || dadosUsuario.telefone.length > 15 ||
                dadosUsuario.email == "" || dadosUsuario.email == undefined || dadosUsuario.email == null || dadosUsuario.email.length > 50 ||
                dadosUsuario.senha == "" || dadosUsuario.senha == undefined || dadosUsuario.senha == null || dadosUsuario.senha.length > 20
                ) {
                    return message.ERROR_REQUIRED_FIELDS
                } else {


                        let usuarioAtualizado = await usuariosDAO.updateUsuario(idUsuario, dadosUsuario)

                        let usuarioAtualizadoJSON = {}

                        if (usuarioAtualizado){
                            usuarioAtualizadoJSON.usuario = dadosUsuario
                            usuarioAtualizadoJSON.status = message.SUCCESS_UPDATED_ITEM.status
                            usuarioAtualizadoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                            usuarioAtualizadoJSON.message = message.SUCCESS_UPDATED_ITEM.message

                            return usuarioAtualizadoJSON
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
    getListarUsuarios,
    getBuscarUsuario,
    setInserirNovoUsuario,
    setExcluirUsuario,
    setAtualizarUsuario
}