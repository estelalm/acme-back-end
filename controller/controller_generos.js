

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

const setInserirNovogenero = async (dadosGenero, contentType) =>{

    try {
        if(String(contentType).toLowerCase == 'application/json'){

            let novoGeneroJSON = {}

            if(dadosGenero.nome == "" || dadosGenero.nome == undefined || 
            dadosGenero.nome == null || dadosGenero.nome.length > 45){
                return message.ERROR_REQUIRED_FIELDS
            }else{

                    let novoGenero = await generosDAO.insertGenero(dadosGenero)
                    let novoId = await generosDAO.selectLastInsertId()

                    if(novoGenero){

                        novoGeneroJSON.genero = novoGenero
                        novoGeneroJSON.genero.id = novoId
                        novoGeneroJSON.status = message.SUCCESS_CREATED_ITEM.status
                        novoGeneroJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                        novoGeneroJSON.message = message.SUCCESS_CREATED_ITEM.message

                        return novoGeneroJSON
                    }else{
                        return message.ERROR_INTERNAL_SERVER_DB
                    }
            }
        }
        
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }

}


module.exports = {
    getListarGeneros,
    getBuscarGenero,
    setInserirNovogenero
}