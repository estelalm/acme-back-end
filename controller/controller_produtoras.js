

const message = require('../modulo/config.js')
const produtorasDAO = require('../model/DAO/produtora.js')

const getListarProdutoras = async () => {

    try {

        let produtorasJSON = {}
        let dadosProdutoras = await produtorasDAO.selectAllProdutoras()

        if (dadosProdutoras) {

            if (dadosProdutoras.length > 0) {
                produtorasJSON.produtoras = dadosProdutoras
                produtorasJSON.quantidade = dadosProdutoras.length
                produtorasJSON.status_code = 200

                return produtorasJSON

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

const getBuscarProdutora = async (id) => {

    let idProdutora = id

    try {
        if (idProdutora == "" || idProdutora == undefined || isNaN(idProdutora)) {
            return message.ERROR_INVALID_ID
        } else {

            let produtorasJSON = {}
            let dadosProdutoras = await produtorasDAO.selectByIdProdutora(idProdutora)

            if (dadosProdutoras) {

                if (dadosProdutoras.length > 0) {
                    produtorasJSON.produtoras = dadosProdutoras
                    produtorasJSON.quantidade = dadosProdutoras.length
                    produtorasJSON.status_code = 200

                    return produtorasJSON

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

const getProdutoraPorFilme = async (id)=>{
    let idFilme = id

    try {
        if (idFilme == "" || idFilme == undefined || isNaN(idFilme)) {
            return [message.ERROR_INVALID_ID]
        } else {

            let produtoraArray = []

            let dadosProdutoras = await produtorasDAO.selectByFilmeProdutora(idFilme)

            dadosProdutoras.forEach(produtora =>{
                produtoraArray.push(produtora)
            })

            if (dadosProdutoras) {

                if (dadosProdutoras.length > 0) {
                    return produtoraArray

                } else {
                    return [message.ERROR_NOT_FOUND]
                }
            } else {
                
                return [message.ERROR_INTERNAL_SERVER_DB]
            }
        }

    } catch (error) {
        console.log(error)
        return [message.ERROR_INTERNAL_SERVER]
    }
}

const setInserirNovaProdutora = async (dadosProdutora, contentType) => {

    try {

        if (String(contentType).toLowerCase() == 'application/json') {

            let produtoraAtualizadoJSON = {}

            if (dadosProdutora.nome == "" || dadosProdutora.nome == undefined ||
                dadosProdutora.nome == null || dadosProdutora.nome.length > 100 ||
                dadosProdutora.descricao == "" || dadosProdutora.descricao == undefined || dadosProdutora.descricao == null) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let novoProdutora = await produtorasDAO.insertProdutora(dadosProdutora)
                let novoId = await produtorasDAO.selectLastInsertId()

                if (novoProdutora) {

                    produtoraAtualizadoJSON.produtora = dadosProdutora
                    produtoraAtualizadoJSON.produtora.id = novoId
                    produtoraAtualizadoJSON.status = message.SUCCESS_CREATED_ITEM.status
                    produtoraAtualizadoJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                    produtoraAtualizadoJSON.message = message.SUCCESS_CREATED_ITEM.message

                    return produtoraAtualizadoJSON
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

const setAtualizarProdutora = async (id, dados, contentType) => {

    let idProdutora = id
    let dadosProdutora = dados

    try {
        console.log(contentType)
        if (String(contentType).toLowerCase() == 'application/json') {

            let produtoraAtualizadoJSON = {}
            if (idProdutora == "" || idProdutora == undefined || isNaN(idProdutora)) {
                //caso seja inválido, envia a mensagem da config                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                return message.ERROR_INVALID_ID
            } else {
                if (dadosProdutora.nome == "" || dadosProdutora.nome == undefined ||
                dadosProdutora.nome == null || dadosProdutora.nome.length > 100 ||
                dadosProdutora.descricao == "" || dadosProdutora.descricao == undefined || dadosProdutora.descricao == null) {
                    return message.ERROR_REQUIRED_FIELDS
                } else {
                    let produtoraAtualizado = await produtorasDAO.updateProdutora(idProdutora, dadosProdutora)

                    if (produtoraAtualizado) {

                        produtoraAtualizadoJSON.produtora = dadosProdutora
                        produtoraAtualizadoJSON.produtora.id = idProdutora
                        produtoraAtualizadoJSON.status = message.SUCCESS_UPDATED_ITEM.status
                        produtoraAtualizadoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                        produtoraAtualizadoJSON.message = message.SUCCESS_UPDATED_ITEM.message

                        return produtoraAtualizadoJSON
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

const setExcluirProdutora = async (id) => {

    let idProdutora = id

    try {

        if (idProdutora == "" || idProdutora == undefined || isNaN(idProdutora)) {
            return message.ERROR_INVALID_ID
        }else{
            let produtoraDeletado = await produtorasDAO.deleteProdutora(idProdutora)

            if(produtoraDeletado)
            return message.SUCCESS_DELETED_ITEM
            else
            return message.ERROR_INTERNAL_SERVER_DB
        }
        
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }

}



module.exports = {
    getListarProdutoras,
    getBuscarProdutora,
    getProdutoraPorFilme,
    setInserirNovaProdutora,
    setExcluirProdutora,
    setAtualizarProdutora
}