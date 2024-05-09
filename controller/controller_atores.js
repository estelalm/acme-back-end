const message = require('../modulo/config.js')
const atoresDAO = require('../model/DAO/ator.js')
const controllerAtores = require('../controller/controller_atores.js')
const controllerPaises = require('../controller/controller_paises.js')


const getListarAtores = async function () {
    try {
        let atoresJSON = {};
        let dadosAtores = await atoresDAO.selectAllAtores();

        //faz tudo ser executado antes de passar para a próxima ação -> map devolve um array atualizado como resultado
        //da função, sem precisar do .push
        await Promise.all(dadosAtores.map(async (ator) => {
            let nacionalidadeAtor = await controllerPaises.getPaisesPorAtor(ator.id);
            ator.nacionalidade = nacionalidadeAtor;
        }));

        if (dadosAtores) {
            if (dadosAtores.length > 0) {
                atoresJSON.atores = dadosAtores;
                atoresJSON.quantidade = dadosAtores.length;
                atoresJSON.status_code = 200;
                return atoresJSON;
            } else {
                return message.ERROR_NOT_FOUND;
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB;
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER;
    }
};


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
                    dadosAtor[0].nacionalidade = await controllerPaises.getPaisesPorAtor(id);
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
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }

}

const getAtorPorFilme = async (id)=>{
    let idFilme = id

    try {
        if (idFilme == "" || idFilme == undefined || isNaN(idFilme)) {
            return [message.ERROR_INVALID_ID]
        } else {

            let atorArray = []

            let dadosAtores = await atoresDAO.selectByFilmeAtor(idFilme)

            await Promise.all(dadosAtores.map(async (ator) => {
                let nacionalidadeAtor = await controllerPaises.getPaisesPorAtor(ator.id);
                ator.nacionalidade = nacionalidadeAtor;
            }));

            dadosAtores.forEach(ator =>{
                atorArray.push(ator)
            })

            if (dadosAtores) {

                if (dadosAtores.length > 0) {
                    return atorArray

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

const setInserirNovoAtor = async function (dadosAtor, contentType) {

    try {
        
        if (String(contentType).toLowerCase() == 'application/json') {  

            let novoAtorJSON = {}

            if (dadosAtor.nome == "" || dadosAtor.nome == undefined || dadosAtor.nome == null || dadosAtor.nome.length > 80 ||
            dadosAtor.nome_artistico == "" || dadosAtor.nome_artistico == undefined || dadosAtor.nome_artistico == null || dadosAtor.nome_artistico.length > 18 ||
            dadosAtor.data_nascimento == "" || dadosAtor.data_nascimento == undefined || dadosAtor.data_nascimento == null || dadosAtor.data_nascimento.length > 15  ||
            dadosAtor.biografia == "" || dadosAtor.biografia == undefined || dadosAtor.biografia == null || 
            dadosAtor.nacionalidade.length == 0
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                
                let validateFalecimento = false
                let validateFoto = false

                //verificar a quantidade de caracteres da data de falecimento
                if (dadosAtor.data_falecimento != null && dadosAtor.data_falecimento != "" && dadosAtor.data_falecimento != undefined) {
                    if (dadosAtor.data_falecimento.length != 10){
                        return message.ERROR_REQUIRED_FIELDS //400
                    }else
                        validateFalecimento = true
                } else {
                    validateFalecimento = true
                }
                //verificar a quantidade de caracteres da foto
                if (dadosAtor.foto != null && dadosAtor.foto != "" && dadosAtor.foto != undefined) {
                    if (dadosAtor.foto.length > 200){
                        return message.ERROR_REQUIRED_FIELDS //400
                    }

                    else
                        validateFoto = true
                } else {
                    validateFoto = true
                }
                
                    if(validateFalecimento && validateFoto){
                        
                        let novoAtor = await atoresDAO.insertAtor(dadosAtor)
                        let idNovoAtor = await atoresDAO.selectLastInsertId()

                        let novaNacionalidadeAtor 
                        dadosAtor.nacionalidade.forEach(async idNacionalidade =>{
                            if(!isNaN(idNacionalidade))
                            novaNacionalidadeAtor = await atoresDAO.insertNacionalidadeAtor(idNovoAtor, idNacionalidade)
                            else
                            return message.ERROR_INVALID_VALUE
                        })

                        let atorInserido = await atoresDAO.selectByIdAtor(idNovoAtor)
    
                        if (novoAtor && novaNacionalidadeAtor) {
                            novoAtorJSON.ator = atorInserido
                            novoAtorJSON.status = message.SUCCESS_CREATED_ITEM.status
                            novoAtorJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                            novoAtorJSON.message = message.SUCCESS_CREATED_ITEM.message
    
                            return novoAtorJSON 
                        } else {
                            
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

const setExcluirAtor = async function (id) {

    try {

        let idAtor = id

        if (idAtor == "" || idAtor == undefined || isNaN(idAtor)) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
            return message.ERROR_INVALID_ID
        } else {

            let nacionalidadeAtorDeletada = await atoresDAO.deleteNacionalidadeAtor(idAtor)
            let atorDeletado = await atoresDAO.deleteAtor(idAtor)
            
            if (atorDeletado && nacionalidadeAtorDeletada) {
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
                dadosAtor.nome_artistico == "" || dadosAtor.nome_artistico == undefined || dadosAtor.nome_artistico == null || dadosAtor.nome_artistico.length > 18 ||
                dadosAtor.data_nascimento == "" || dadosAtor.data_nascimento == undefined || dadosAtor.data_nascimento == null || dadosAtor.data_nascimento.length > 15 ||
                dadosAtor.biografia == "" || dadosAtor.biografia == undefined || dadosAtor.biografia == null 
                ) {

                    return message.ERROR_REQUIRED_FIELDS
                } else {

                        let nacionalidadesAntigas = await controllerPaises.getPaisesPorAtor(idAtor)
                        let atorAtualizado = await atoresDAO.updateAtor(idAtor, dadosAtor)

                        let count = 0
                        let nacionalidadeAtorAtualizada
                        nacionalidadesAntigas.forEach(async nacionalidadeAntiga =>{
                            nacionalidadeAtorAtualizada = await atoresDAO.updateNacionalidadeAtor(idAtor, dadosAtor.nacionalidade[count], nacionalidadeAntiga.id)
                            count ++
                        })

                        let dadosAtorAtualiazado = await getBuscarAtor(idAtor)

                        let atorAtualizadoJSON = {}

                        if (atorAtualizado && nacionalidadeAtorAtualizada){
                            atorAtualizadoJSON.ator = dadosAtorAtualiazado.ator
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
    setAtualizarAtor,
    getAtorPorFilme
}