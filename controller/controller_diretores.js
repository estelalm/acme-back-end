const message = require('../modulo/config.js')
const diretoresDAO = require('../model/DAO/diretor.js')
const controllerPaises = require('../controller/controller_paises.js')



const getListarDiretores = async function () {
    try {
        let diretoresJSON = {};
        let dadosDiretores = await diretoresDAO.selectAllDiretores();

        //faz tudo ser executado antes de passar para a próxima ação -> map devolve um array atualizado como resultado
        //da função, sem precisar do .push
        await Promise.all(dadosDiretores.map(async (diretor) => {
            let nacionalidadeDiretor = await controllerPaises.getPaisesPorDiretor(diretor.id);
            diretor.nacionalidade = nacionalidadeDiretor;
        }));

        
        if (dadosDiretores) {
            if (dadosDiretores.length > 0) {
                diretoresJSON.diretores = dadosDiretores;
                diretoresJSON.quantidade = dadosDiretores.length;
                diretoresJSON.status_code = 200;
                return diretoresJSON;
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

const getBuscarDiretor = async (id) =>{

    try {
        let idDiretor = id

        if (idDiretor == "" || idDiretor == undefined || isNaN(idDiretor)) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
            return message.ERROR_INVALID_ID
        } else {

            let diretorJSON = {}

            let dadosDiretor = await diretoresDAO.selectByIdDiretor(idDiretor)
        
            if (dadosDiretor) {

                if (dadosDiretor.length > 0) {
                    diretorJSON.diretor = dadosDiretor
                    dadosDiretor[0].nacionalidade = await controllerPaises.getPaisesPorDiretor(id);
                    diretorJSON.status_code = 200

                    return diretorJSON

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

const getDiretorPorFilme = async (id)=>{
    let idFilme = id

    try {
        if (idFilme == "" || idFilme == undefined || isNaN(idFilme)) {
            return [message.ERROR_INVALID_ID]
        } else {

            let diretorArray = []

            let dadosDiretores = await diretoresDAO.selectByFilmeDiretor(idFilme)

            await Promise.all(dadosDiretores.map(async (diretor) => {
                let nacionalidadeDiretor = await controllerPaises.getPaisesPorDiretor(diretor.id);
                diretor.nacionalidade = nacionalidadeDiretor;
            }));

            dadosDiretores.forEach(diretor =>{
                diretorArray.push(diretor)
            })

            if (dadosDiretores) {

                if (dadosDiretores.length > 0) {
                    return diretorArray

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

const setInserirNovoDiretor = async function (dadosDiretor, contentType) {

    try {

        if (String(contentType).toLowerCase() == 'application/json') {  

            let novoDiretorJSON = {}

            if (dadosDiretor.nome == "" || dadosDiretor.nome == undefined || dadosDiretor.nome == null || dadosDiretor.nome.length > 80 ||
            dadosDiretor.nome_artistico == "" || dadosDiretor.nome_artistico == undefined || dadosDiretor.nome_artistico == null || dadosDiretor.nome_artistico.length > 18 ||
            dadosDiretor.data_nascimento == "" || dadosDiretor.data_nascimento == undefined || dadosDiretor.data_nascimento == null || dadosDiretor.data_nascimento.length > 15  ||
            dadosDiretor.biografia == "" || dadosDiretor.biografia == undefined || dadosDiretor.biografia == null || 
            dadosDiretor.nacionalidade.length == 0
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {

                let validateFalecimento = false
                let validateFoto = false

                //verificar a quantidade de caracteres da data de falecimento
                if (dadosDiretor.data_falecimento != null && dadosDiretor.data_falecimento != "" && dadosDiretor.data_falecimento != undefined) {
                    if (dadosDiretor.data_falecimento.length != 10){
                        return message.ERROR_REQUIRED_FIELDS //400
                    }else
                        validateFalecimento = true
                } else {
                    validateFalecimento = true
                }
                //verificar a quantidade de caracteres da foto
                if (dadosDiretor.foto != null && dadosDiretor.foto != "" && dadosDiretor.foto != undefined) {
                    if (dadosDiretor.foto.length > 200){
                        return message.ERROR_REQUIRED_FIELDS //400
                    }

                    else
                        validateFoto = true
                } else {
                    validateFoto = true
                }

                    if(validateFalecimento && validateFoto){
                        let novoDiretor = await diretoresDAO.insertDiretor(dadosDiretor)
                        let idNovoDiretor = await diretoresDAO.selectLastInsertId()

                        let novaNacionalidadeDiretor 
                        dadosDiretor.nacionalidade.forEach(async idNacionalidade =>{
                            if(!isNaN(idNacionalidade))
                            novaNacionalidadeDiretor = await diretoresDAO.insertNacionalidadeDiretor(idNovoDiretor, idNacionalidade)
                            else
                            return message.ERROR_INVALID_VALUE
                        })

                        let diretorInserido = await diretoresDAO.selectByIdDiretor(idNovoDiretor)
                        if (novoDiretor && novaNacionalidadeDiretor) {
                            novoDiretorJSON.diretor = diretorInserido
                            novoDiretorJSON.status = message.SUCCESS_CREATED_ITEM.status
                            novoDiretorJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                            novoDiretorJSON.message = message.SUCCESS_CREATED_ITEM.message
    
                            return novoDiretorJSON 
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

const setExcluirDiretor = async function (id) {

    try {

        let idDiretor = id

        if (idDiretor == "" || idDiretor == undefined || isNaN(idDiretor)) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
            return message.ERROR_INVALID_ID
        } else {

            let nacionalidadeDiretorDeletada = await diretoresDAO.deleteNacionalidadeDiretor(idDiretor)
            let diretorDeletado = await diretoresDAO.deleteDiretor(idDiretor)


            
            if (diretorDeletado && nacionalidadeDiretorDeletada) {
                return message.SUCCESS_DELETED_ITEM 

            } else {

                return message.ERROR_INTERNAL_SERVER_DB 
            }
        }
    } catch (error) {
        
        return message.ERROR_INTERNAL_SERVER 
    }

}

const setAtualizarDiretor = async function (id, dados, contentType){

    try {
        
        let idDiretor = id
        let dadosDiretor = dados

        if (String(contentType).toLowerCase() == 'application/json') {
            if (idDiretor == "" || idDiretor == undefined || isNaN(idDiretor)) {
                //caso seja inválido, envia a mensagem da config                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                return message.ERROR_INVALID_ID
            } else {

                if (dadosDiretor.nome == "" || dadosDiretor.nome == undefined || dadosDiretor.nome == null || dadosDiretor.nome.length > 80 ||
                dadosDiretor.nome_artistico == "" || dadosDiretor.nome_artistico == undefined || dadosDiretor.nome_artistico == null || dadosDiretor.nome_artistico.length > 18 ||
                dadosDiretor.data_nascimento == "" || dadosDiretor.data_nascimento == undefined || dadosDiretor.data_nascimento == null || dadosDiretor.data_nascimento.length > 15 ||
                dadosDiretor.biografia == "" || dadosDiretor.biografia == undefined || dadosDiretor.biografia == null 
                ) {
                    return message.ERROR_REQUIRED_FIELDS
                } else {

                        let nacionalidadesAntigas = await controllerPaises.getPaisesPorDiretor(idDiretor)
                        let diretorAtualizado = await diretoresDAO.updateDiretor(idDiretor, dadosDiretor)

                        let count = 0
                        let nacionalidadeDiretorAtualizada
                        nacionalidadesAntigas.forEach(async nacionalidadeAntiga =>{
                            nacionalidadeDiretorAtualizada = await diretoresDAO.updateNacionalidadeDiretor(idDiretor, dadosDiretor.nacionalidade[count], nacionalidadeAntiga.id)
                            count ++
                        })

                        let dadosDiretorAtualiazado = await getBuscarDiretor(idDiretor)

                        let diretorAtualizadoJSON = {}

           
                        if (diretorAtualizado){
                            diretorAtualizadoJSON.diretor = dadosDiretorAtualiazado.diretor
                            diretorAtualizadoJSON.status = message.SUCCESS_UPDATED_ITEM.status
                            diretorAtualizadoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                            diretorAtualizadoJSON.message = message.SUCCESS_UPDATED_ITEM.message

                            return diretorAtualizadoJSON
                        }else{

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


module.exports = {
    getListarDiretores,
    getBuscarDiretor,
    getDiretorPorFilme,
    setInserirNovoDiretor,
    setExcluirDiretor,
    setAtualizarDiretor
}