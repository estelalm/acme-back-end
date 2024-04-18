

const message = require('../modulo/config.js')
const paisesDAO = require('../model/DAO/pais.js')

const getListarPaises = async () => {

    try {

        let paisesJSON = {}
        let dadosPaises = await paisesDAO.selectAllPaises()

        if (dadosPaises) {

            if (dadosPaises.length > 0) {
                paisesJSON.paises = dadosPaises
                paisesJSON.quantidade = dadosPaises.length
                paisesJSON.status_code = 200

                return paisesJSON

            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }

}

const getBuscarPais = async (id) => {

    let idPais = id

    try {
        if (idPais == "" || idPais == undefined || isNaN(idPais)) {
            return message.ERROR_INVALID_ID
        } else {

            let paisesJSON = {}
            let dadosPaises = await paisesDAO.selectByIdPais(idPais)

            if (dadosPaises) {

                if (dadosPaises.length > 0) {
                    paisesJSON.paises = dadosPaises
                    paisesJSON.quantidade = dadosPaises.length
                    paisesJSON.status_code = 200

                    return paisesJSON

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

//para pegar a nacionalidade do ator e incluir no JSON da função "Get Atores"
const getPaisesPorAtor = async (id)=>{
    let idAtor = id

    try {
        if (idAtor == "" || idAtor == undefined || isNaN(idAtor)) {
            return [message.ERROR_INVALID_ID]
        } else {

            let paisArray = []

            let dadosPaises = await paisesDAO.selectByAtorPais(idAtor)

            dadosPaises.forEach(pais =>{
                paisArray.push(pais)
            })

            if (dadosPaises) {

                if (dadosPaises.length > 0) {
                    return paisArray

                } else {
                    return [message.ERROR_NOT_FOUND]
                }
            } else {
                return [message.ERROR_INTERNAL_SERVER_DB]
            }
        }

    } catch (error) {

        return [message.ERROR_INTERNAL_SERVER]
    }
}

const getPaisesPorDiretor = async (id)=>{
    let idDiretor = id

    try {
        if (idDiretor == "" || idDiretor == undefined || isNaN(idDiretor)) {
            return [message.ERROR_INVALID_ID]
        } else {

            let paisArray = []

            let dadosPaises = await paisesDAO.selectByDiretorPais(idDiretor)

            dadosPaises.forEach(pais =>{
                paisArray.push(pais)
            })

            if (dadosPaises) {

                if (dadosPaises.length > 0) {
                    return paisArray

                } else {
                    return [message.ERROR_NOT_FOUND]
                }
            } else {
                return [message.ERROR_INTERNAL_SERVER_DB]
            }
        }

    } catch (error) {

        return [message.ERROR_INTERNAL_SERVER]
    }
}
const getPaisPorFilme = async (id)=>{
    let idFilme = id

    try {
        if (idFilme == "" || idFilme == undefined || isNaN(idFilme)) {
            return [message.ERROR_INVALID_ID]
        } else {

            let paisArray = []

            let dadosPaises = await paisesDAO.selectByFilmePais(idFilme)


            dadosPaises.forEach(pais =>{
                paisArray.push(pais)
            })

            if (dadosPaises) {

                if (dadosPaises.length > 0) {
                    return paisArray

                } else {
                    return [message.ERROR_NOT_FOUND]
                }
            } else {
                return [message.ERROR_INTERNAL_SERVER_DB]
            }
        }

    } catch (error) {

        return [message.ERROR_INTERNAL_SERVER]
    }
}

const setInserirNovoPais = async (dadosPais, contentType) => {

    try {

        if (String(contentType).toLowerCase() == 'application/json') {

            let paisAtualizadoJSON = {}

            if (dadosPais.nome == "" || dadosPais.nome == undefined || 
                dadosPais.nome == null || dadosPais.nome.length > 80 ||
                dadosPais.gentilico == "" || dadosPais.gentilico == undefined || 
                dadosPais.gentilico == null || dadosPais.gentilico.length > 50 ||
                dadosPais.sigla == "" || dadosPais.sigla == undefined || dadosPais.sigla == null || dadosPais.sigla.length > 3
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let validateStatus = false

                if (dadosPais.data_relancamento != null && dadosPais.data_relancamento != "" && dadosPais.data_relancamento != undefined) {

                    if (dadosPais.data_relancamento.length != 500)
                        return message.ERROR_REQUIRED_FIELDS //400
                    else
                        validateStatus = true

                } else {
                    validateStatus = true
                }

                if(validateStatus){
                let novoPais = await paisesDAO.insertPais(dadosPais)
                let novoId = await paisesDAO.selectLastInsertId()

                if (novoPais) {

                    paisAtualizadoJSON.pais = dadosPais
                    paisAtualizadoJSON.pais.id = novoId
                    paisAtualizadoJSON.status = message.SUCCESS_CREATED_ITEM.status
                    paisAtualizadoJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    paisAtualizadoJSON.message = message.SUCCESS_CREATED_ITEM.message

                    return paisAtualizadoJSON
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB
                }
            }else{
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

const setAtualizarPais = async (id, dados, contentType) => {

    let idPais = id
    let dadosPais = dados

    try {
        if (String(contentType).toLowerCase() == 'application/json') {

            let paisAtualizadoJSON = {}
            if (idPais == "" || idPais == undefined || isNaN(idPais)) {
                //caso seja inválido, envia a mensagem da config                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                return message.ERROR_INVALID_ID
            } else {
                if (dadosPais.nome == "" || dadosPais.nome == undefined || 
                dadosPais.nome == null || dadosPais.nome.length > 80 ||
                dadosPais.gentilico == "" || dadosPais.gentilico == undefined || 
                dadosPais.gentilico == null || dadosPais.gentilico.length > 50 ||
                dadosPais.sigla == "" || dadosPais.sigla == undefined || dadosPais.sigla == null || dadosPais.sigla.length > 3
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let validateStatus = false

                if (dadosPais.bandeira != null && dadosPais.bandeira != "" && dadosPais.bandeira != undefined) {

                    if (dadosPais.bandeira.length != 500)
                        return message.ERROR_REQUIRED_FIELDS //400
                    else
                        validateStatus = true

                } else {
                    validateStatus = true
                }

                if(validateStatus){
                    let paisAtualizado = await paisesDAO.updatePais(idPais, dadosPais)

                    if (paisAtualizado) {

                        paisAtualizadoJSON.pais = dadosPais
                        paisAtualizadoJSON.pais.id = idPais
                        paisAtualizadoJSON.status = message.SUCCESS_UPDATED_ITEM.status
                        paisAtualizadoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                        paisAtualizadoJSON.message = message.SUCCESS_UPDATED_ITEM.message

                        return paisAtualizadoJSON
                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB
                    }
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

const setExcluirPais = async (id) => {

    let idPais = id

    try {

        if (idPais == "" || idPais == undefined || isNaN(idPais)) {
            return message.ERROR_INVALID_ID
        }else{
            let paisDeletado = await paisesDAO.deletePais(idPais)

            if(paisDeletado)
            return message.SUCCESS_DELETED_ITEM
            else
            return message.ERROR_INTERNAL_SERVER_DB
        }
        
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }

}



module.exports = {
    getListarPaises,
    getBuscarPais,
    getPaisesPorAtor,
    getPaisesPorDiretor,
    getPaisPorFilme,
    setInserirNovoPais,
    setExcluirPais,
    setAtualizarPais
}