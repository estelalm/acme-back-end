/***********************************************************************
 * Objetivo: Arquivo responsável pelas validações e consistências de dados de 'filme'.
 * Data: 01/02/2023
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
***********************************************************************/

//import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const filmesDAO = require('../model/DAO/filme.js')
const controllerClassificacoes = require('../controller/controller_classificacao.js')
const controllerPaises = require('../controller/controller_paises.js')
const controllerGeneros = require('../controller/controller_generos.js')
const controllerAtores = require('../controller/controller_atores.js')
const controllerDiretores = require('../controller/controller_diretores.js')
const controllerProdutora = require('../controller/controller_produtoras.js')
const { getFilmes } = require('./filmes_funcoes.js')

//função para inserir um novo filme
const setInserirNovoFilme = async function (dadosFilme, contentType) {

    try {
        
        if (String(contentType).toLowerCase() == 'application/json') {  //**

            //cria o objeto JSON para devolver os dados criados na requisição
            let novoFilmeJSON = {}

            //validação de campos obrigatórios ou com digitação inválida
            if (dadosFilme.nome == "" || dadosFilme.nome == undefined || dadosFilme.nome == null || dadosFilme.nome.length > 80 ||
                dadosFilme.sinopse == "" || dadosFilme.sinopse == undefined || dadosFilme.sinopse == null || dadosFilme.sinopse.length > 65000 ||
                dadosFilme.duracao == "" || dadosFilme.duracao == undefined || dadosFilme.duracao == null || dadosFilme.duracao.length > 8 ||
                dadosFilme.data_lancamento == "" || dadosFilme.data_lancamento == undefined || dadosFilme.data_lancamento == null || dadosFilme.data_lancamento.length != 10 ||
                dadosFilme.foto_capa == "" || dadosFilme.foto_capa == undefined || dadosFilme.foto_capa == null || dadosFilme.foto_capa.length > 200 ||
                dadosFilme.trailer == "" || dadosFilme.trailer == undefined || dadosFilme.trailer == null || dadosFilme.trailer.length > 200 ||
                dadosFilme.classificacao == undefined || dadosFilme.classificacao == "" || isNaN(dadosFilme.classificacao) ||
                dadosFilme.pais_origem == undefined || dadosFilme.pais_origem == "" || isNaN(dadosFilme.pais_origem)
                || dadosFilme.valor_unitario.length > 6
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {

                //validação da data de relançamento
                let validateStatus = false

                if (dadosFilme.data_relancamento != null && dadosFilme.data_relancamento != "" && dadosFilme.data_relancamento != undefined) {

                    if (dadosFilme.data_relancamento.length != 10)
                        return message.ERROR_REQUIRED_FIELDS //400
                    else
                        validateStatus = true

                } else {
                    validateStatus = true
                }

                //verificar se a variável é verdadeira
                if (validateStatus) {

                    //encaminhando os dados do filme para o DAO inserir no banco de dados
                    let novoFilme = await filmesDAO.insertFilme(dadosFilme)
                    let idNovoFilme = await filmesDAO.selectLastInsertId()

                    dadosFilme.generos.forEach(async idGenero =>{
                        let novoGeneroFilme
                        if(!isNaN(idGenero))
                        novoGeneroFilme = await filmesDAO.insertGeneroFilme(idNovoFilme, idGenero)
                        else
                        return message.ERROR_INVALID_VALUE
                    })

                    dadosFilme.elenco.forEach(async idAtor =>{
                        let novoAtorFilme
                        
                        if(!isNaN(idAtor))
                         novoAtorFilme = await filmesDAO.insertAtorFilme(idNovoFilme, idAtor)
                        else
                        return message.ERROR_INVALID_VALUE
                    })

                    dadosFilme.diretor.forEach(async idDiretor =>{
                        let novoDiretorFilme
                        if(!isNaN(idDiretor))
                        novoDiretorFilme = await filmesDAO.insertDiretorFilme(idNovoFilme, idDiretor)
                        else
                        return message.ERROR_INVALID_VALUE
                    })

                    dadosFilme.produtora.forEach(async idProdutora =>{
                        let novaProdutoraFilme
                        if(!isNaN(idProdutora))
                        novaProdutoraFilme = await filmesDAO.insertProdutoraFilme(idNovoFilme, idProdutora)
                        else
                        return message.ERROR_INVALID_VALUE
                    })


                    let filmeInserido = await getBuscarFilme(idNovoFilme)
                    

                    //validação para verificar se o DAO inseriu os dados no banco
                    if (novoFilme) {
                        //cria o JSON de retorno dos dados (201)
                        novoFilmeJSON.filme = filmeInserido
                        novoFilmeJSON.filme.id = idNovoFilme
                        novoFilmeJSON.status = message.SUCCESS_CREATED_ITEM.status
                        novoFilmeJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                        novoFilmeJSON.message = message.SUCCESS_CREATED_ITEM.message

                        return novoFilmeJSON //201
                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB //500
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

//função para atualizar um filme ????????????
const setAtualizarFilme = async function (id, dadosFilme, contentType) {

    try {
        
        let idFilme = id
        if (String(contentType).toLowerCase() == 'application/json') {
            if (idFilme == "" || idFilme == undefined || isNaN(idFilme)) {
                //caso seja inválido, envia a mensagem da config                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                return message.ERROR_INVALID_ID
            } else {

                if (dadosFilme.nome == "" || dadosFilme.nome == undefined || dadosFilme.nome == null || dadosFilme.nome.length > 80 ||
                    dadosFilme.sinopse == "" || dadosFilme.sinopse == undefined || dadosFilme.sinopse == null || dadosFilme.sinopse.length > 65000 ||
                    dadosFilme.duracao == "" || dadosFilme.duracao == undefined || dadosFilme.duracao == null || dadosFilme.duracao.length > 8 ||
                    dadosFilme.data_lancamento == "" || dadosFilme.data_lancamento == undefined || dadosFilme.data_lancamento == null || dadosFilme.data_lancamento.length != 10 ||
                    dadosFilme.foto_capa == "" || dadosFilme.foto_capa == undefined || dadosFilme.foto_capa == null || dadosFilme.foto_capa.length > 200 ||
                    dadosFilme.valor_unitario.length > 6
                ) {
                    return message.ERROR_REQUIRED_FIELDS
                } else {
                    let validateStatus = false

                    if (dadosFilme.data_relancamento != null && dadosFilme.data_relancamento != "" && dadosFilme.data_relancamento != undefined) {

                        if (dadosFilme.data_relancamento.length != 10)
                            return message.ERROR_REQUIRED_FIELDS //400
                        else
                            validateStatus = true

                    } else {
                        validateStatus = true
                    }

                    if(validateStatus){

                        let filmeAtualizado = await filmesDAO.updateFilme(idFilme, dadosFilme)

                        let filmeAtualizadoJSON = {}

                        if (filmeAtualizado){
                            filmeAtualizadoJSON.filme = dadosFilme
                            filmeAtualizadoJSON.status = message.SUCCESS_UPDATED_ITEM.status
                            filmeAtualizadoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                            filmeAtualizadoJSON.message = message.SUCCESS_UPDATED_ITEM.message

                            return filmeAtualizadoJSON
                        }else{
                            return message.ERROR_INTERNAL_SERVER_DB
                        }

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

//função para deletar um filme
const setExcluirFilme = async function (id) {

    try {

        let idFilme = id

        if (idFilme == "" || idFilme == undefined || isNaN(idFilme)) {
            //caso seja inválido, envia a mensagem da config                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
            return message.ERROR_INVALID_ID
        } else {

            let atoresDeletados = await filmesDAO.deleteAtorFilme(idFilme)
            let generosDeletados = await filmesDAO.deleteGeneroFilme(idFilme)
            let produtorasDeletadas = await filmesDAO.deleteProdutoraFilme(idFilme)
            let diretoresDeletados = await filmesDAO.deleteDiretorFilme(idFilme)
            let filmeDeletado = await filmesDAO.deleteFilme(idFilme)


            if (filmeDeletado && atoresDeletados && generosDeletados && produtorasDeletadas && diretoresDeletados) {
                return message.SUCCESS_DELETED_ITEM //201

            } else {
                return message.ERROR_INTERNAL_SERVER_DB //500: erro no banco de dados
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER //500: erro na controller
    }

}

//função para listar todos os filmes
const getListarFilmes = async function () {

    try {
        //cria um objeto json
        let filmesJSON = {}

        //chama a função do DAO que retorna os filmes do banco
        let dadosFilmes = await filmesDAO.selectAllFilmes()

        //chama as funções que retornam outras informações do filme
        await Promise.all(dadosFilmes.map(async (filme) => {
            let classificacaoFilme = await controllerClassificacoes.getBuscarClassficacaoFilme(filme.id)
            filme.classificacao = classificacaoFilme;
        }));

        await Promise.all(dadosFilmes.map(async (filme) => {
            let paisFilme = await controllerPaises.getPaisPorFilme(filme.id)
            filme.pais_origem = paisFilme;
        }));

        await Promise.all(dadosFilmes.map(async (filme) => {
            let avaliacaoFilme = await getAvaliacaoFilme(filme.id);
            if(avaliacaoFilme.avaliacao)
            filme.avaliacao = avaliacaoFilme.avaliacao;
            else
            filme.avaliacao = null
        }));

        await Promise.all(dadosFilmes.map(async (filme) => {
            let generoFilme = await controllerGeneros.getGeneroPorFilme(filme.id);
            filme.generos = generoFilme;
        }));

        await Promise.all(dadosFilmes.map(async (filme) => {
            let atoresFilme = await controllerAtores.getAtorPorFilme(filme.id);
            filme.elenco = atoresFilme;
        }));

        await Promise.all(dadosFilmes.map(async (filme) => {
            let diretoresFilme = await controllerDiretores.getDiretorPorFilme(filme.id);
            filme.diretor = diretoresFilme;
        }));

        await Promise.all(dadosFilmes.map(async (filme) => {
            let produtorasFilme = await controllerProdutora.getProdutoraPorFilme(filme.id);
            filme.produtora = produtorasFilme;
        }));



        //validação para verificar se o DAO retornou dados
        if (dadosFilmes) {
            //cria os atributos para reornar ao app

            if (dadosFilmes.length > 0) {
                filmesJSON.filmes = dadosFilmes
                filmesJSON.quantidade = dadosFilmes.length
                filmesJSON.status_code = 200

                return filmesJSON
            } else {
                return message.ERROR_NOT_FOUND
            }

        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    } catch (error) {

        return message.ERROR_INTERNAL_SERVER //500: erro na controller
    }
}

//função para buscar um filme pelo id
const getBuscarFilme = async function (id) {

    try {
        let idFilme = id

        //validação do id
        if (idFilme == "" || idFilme == undefined || isNaN(idFilme)) {
            //caso seja inválido, envia a mensagem da confi                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
            return message.ERROR_INVALID_ID
        } else {

            //cria um objeto json
            let filmeJSON = {}

            //chama a função do DAO que retorna os filmes do banco
            let dadosFilme = await filmesDAO.selectByIdFilme(idFilme)
            

            //this is saying dadosFilme is undefined, so is the filme.id
            await Promise.all(dadosFilme.map(async (filme) => {
                let classificacaoFilme = await controllerClassificacoes.getBuscarClassficacaoFilme(filme.id)
                filme.classificacao = classificacaoFilme;
            }));
    
            //from here id doesn't get undefined, why is that??
            await Promise.all(dadosFilme.map(async (filme) => {
                let paisFilme = await controllerPaises.getPaisPorFilme(filme.id)
                filme.pais_origem = paisFilme;
            }));
    
            await Promise.all(dadosFilme.map(async (filme) => {
                let avaliacaoFilme = await getAvaliacaoFilme(filme.id);
                if(avaliacaoFilme.avaliacao)
                filme.avaliacao = avaliacaoFilme.avaliacao;
                else
                filme.avaliacao = null
            }));

            await Promise.all(dadosFilme.map(async (filme) => {
                let generoFilme = await controllerGeneros.getGeneroPorFilme(filme.id);
                filme.generos = generoFilme;
            }));
    
            await Promise.all(dadosFilme.map(async (filme) => {
                let atoresFilme = await controllerAtores.getAtorPorFilme(filme.id);
                filme.elenco = atoresFilme;
            }));
    
            await Promise.all(dadosFilme.map(async (filme) => {
                let diretoresFilme = await controllerDiretores.getDiretorPorFilme(filme.id);
                filme.diretor = diretoresFilme;
            }));
    
            await Promise.all(dadosFilme.map(async (filme) => {
                let produtorasFilme = await controllerProdutora.getProdutoraPorFilme(filme.id);
                filme.produtora = produtorasFilme;
            }));



            //validação para verificar se o DAO retornou dados
            if (dadosFilme) {
                //cria os atributos para reornar ao app

                if (dadosFilme.length > 0) {
                    
                    filmeJSON.filme = dadosFilme
                    filmeJSON.status_code = 200

                    return filmeJSON

                } else {
                    return message.ERROR_NOT_FOUND
                }

            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500: erro na controller
    }
}

const getFilmesCompradosUsuario = async function (idUsuario) {

    try {
        //cria um objeto json
        let filmesJSON = {}

        //chama a função do DAO que retorna os filmes do banco
        let dadosFilmes = await filmesDAO.selectFilmesCompradosUsuario(idUsuario)

                //chama as funções que retornam outras informações do filme
                await Promise.all(dadosFilmes.map(async (filme) => {
                    let classificacaoFilme = await controllerClassificacoes.getBuscarClassficacaoFilme(filme.id)
                    filme.classificacao = classificacaoFilme;
                }));
        
                await Promise.all(dadosFilmes.map(async (filme) => {
                    let paisFilme = await controllerPaises.getPaisPorFilme(filme.id)
                    filme.pais_origem = paisFilme;
                }));
        
                await Promise.all(dadosFilmes.map(async (filme) => {
                    let generoFilme = await controllerGeneros.getGeneroPorFilme(filme.id);
                    filme.generos = generoFilme;
                }));
        
                await Promise.all(dadosFilmes.map(async (filme) => {
                    let atoresFilme = await controllerAtores.getAtorPorFilme(filme.id);
                    filme.elenco = atoresFilme;
                }));
        
                await Promise.all(dadosFilmes.map(async (filme) => {
                    let diretoresFilme = await controllerDiretores.getDiretorPorFilme(filme.id);
                    filme.diretor = diretoresFilme;
                }));
        
                await Promise.all(dadosFilmes.map(async (filme) => {
                    let produtorasFilme = await controllerProdutora.getProdutoraPorFilme(filme.id);
                    filme.produtora = produtorasFilme;
                }));
        

        //validação para verificar se o DAO retornou dados
        if (dadosFilmes) {
            //cria os atributos para reornar ao app

            if (dadosFilmes.length > 0) {
                filmesJSON.filmes = dadosFilmes
                filmesJSON.quantidade = dadosFilmes.length
                filmesJSON.status_code = 200

                return filmesJSON
            } else {
                return message.ERROR_NOT_FOUND
            }

        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER //500: erro na controller
    }
}

const setInserirNovoFilmeComprado = async function (idUsuario, idFilme){

    try {

            //cria o objeto JSON para devolver os dados criados na requisição
            let novoFilmeJSON = {}

            //validação de campos obrigatórios ou com digitação inválida
            if (idFilme == "" || idFilme == undefined || isNaN(idFilme) || idUsuario == "" || idUsuario == undefined || isNaN(idUsuario)
            ) {
                return message.ERROR_INVALID_ID
            } else {

                    let novoFilmeComprado = await filmesDAO.insertFilmeComprado(idUsuario, idFilme)
                    
                    //validação para verificar se o DAO inseriu os dados no banco
                    if (novoFilmeComprado) {
                        //cria o JSON de retorno dos dados (201)
                        // novoFilmeJSON.filme = filmeComprado
                        novoFilmeJSON.status = message.SUCCESS_CREATED_ITEM.status
                        novoFilmeJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                        novoFilmeJSON.message = message.SUCCESS_CREATED_ITEM.message

                        return novoFilmeJSON //201
                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB //500
                    }

            }

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }

}

const setExcluirFilmeComprado = async function (idUsuario, idFilme) {

    try {

        if (idFilme == "" || idFilme == undefined || isNaN(idFilme), idUsuario == "" || idUsuario == undefined || isNaN(idUsuario)) {
            //caso seja inválido, envia a mensagem da config                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
            return message.ERROR_INVALID_ID
        } else {
            let filmeCompradoDeletado = await filmesDAO.deleteFilmeComprado(idUsuario, idFilme)


            if (filmeCompradoDeletado) {
                return message.SUCCESS_DELETED_ITEM //201

            } else {
                return message.ERROR_INTERNAL_SERVER_DB //500: erro no banco de dados
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER //500: erro na controller
    }

}

const getFilmesSalvosUsuario = async function (idUsuario) {

    try {
        //cria um objeto json
        let filmesJSON = {}

        //chama a função do DAO que retorna os filmes do banco
        let dadosFilmes = await filmesDAO.selectFilmesSalvosUsuario(idUsuario)

                //chama as funções que retornam outras informações do filme
                await Promise.all(dadosFilmes.map(async (filme) => {
                    let classificacaoFilme = await controllerClassificacoes.getBuscarClassficacaoFilme(filme.id)
                    filme.classificacao = classificacaoFilme;
                }));
        
                await Promise.all(dadosFilmes.map(async (filme) => {
                    let paisFilme = await controllerPaises.getPaisPorFilme(filme.id)
                    filme.pais_origem = paisFilme;
                }));
        
                await Promise.all(dadosFilmes.map(async (filme) => {
                    let generoFilme = await controllerGeneros.getGeneroPorFilme(filme.id);
                    filme.generos = generoFilme;
                }));
        
                await Promise.all(dadosFilmes.map(async (filme) => {
                    let atoresFilme = await controllerAtores.getAtorPorFilme(filme.id);
                    filme.elenco = atoresFilme;
                }));
        
                await Promise.all(dadosFilmes.map(async (filme) => {
                    let diretoresFilme = await controllerDiretores.getDiretorPorFilme(filme.id);
                    filme.diretor = diretoresFilme;
                }));
        
                await Promise.all(dadosFilmes.map(async (filme) => {
                    let produtorasFilme = await controllerProdutora.getProdutoraPorFilme(filme.id);
                    filme.produtora = produtorasFilme;
                }));
        

        //validação para verificar se o DAO retornou dados
        if (dadosFilmes) {
            //cria os atributos para reornar ao app

            if (dadosFilmes.length > 0) {
                filmesJSON.filmes = dadosFilmes
                filmesJSON.quantidade = dadosFilmes.length
                filmesJSON.status_code = 200

                return filmesJSON
            } else {
                return message.ERROR_NOT_FOUND
            }

        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER //500: erro na controller
    }
}

const getAvaliacaoFilme = async function (idFilme){

    try {

        let avaliacaoFilme = await filmesDAO.selectAvaliacaoFilme(idFilme)

        if (avaliacaoFilme) {
            //cria os atributos para reornar ao app

            let filmeJSON = {}

            if (avaliacaoFilme.length > 0  && avaliacaoFilme[0].avaliacao != null) {
                filmeJSON.avaliacao = avaliacaoFilme[0].avaliacao
                filmeJSON.status_code = 200

                return filmeJSON
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


const setExcluirAvaliacaoFilme = async function (idFilme) {

    try {

        if (idFilme == "" || idFilme == undefined || isNaN(idFilme)) {
            //caso seja inválido, envia a mensagem da config                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
            return message.ERROR_INVALID_ID
        } else {
            let avaliacoesDeletadas = await filmesDAO.deleteAvaliacoesFilme(idFilme)


            if (avaliacoesDeletadas) {
                return message.SUCCESS_DELETED_ITEM //201

            } else {
                return message.ERROR_INTERNAL_SERVER_DB //500: erro no banco de dados
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER //500: erro na controller
    }

}

const setInserirNovoFilmeSalvo = async function (idUsuario, idFilme){

    try {

            //cria o objeto JSON para devolver os dados criados na requisição
            let novoFilmeJSON = {}

            //validação de campos obrigatórios ou com digitação inválida
            if (idFilme == "" || idFilme == undefined || isNaN(idFilme) || idUsuario == "" || idUsuario == undefined || isNaN(idUsuario)
            ) {
                return message.ERROR_INVALID_ID
            } else {

                    let novoFilmeSalvo = await filmesDAO.insertFilmeSalvo(idUsuario, idFilme)
                    
                    //validação para verificar se o DAO inseriu os dados no banco
                    if (novoFilmeSalvo) {
                        //cria o JSON de retorno dos dados (201)
                        // novoFilmeJSON.filme = filmeComprado
                        novoFilmeJSON.status = message.SUCCESS_CREATED_ITEM.status
                        novoFilmeJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                        novoFilmeJSON.message = message.SUCCESS_CREATED_ITEM.message

                        return novoFilmeJSON //201
                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB //500
                    }

            }

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }

}

const setInserirAvaliacaoFilme = async function (idFilme, contentType, dadosAvaliacao){

    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            //cria o objeto JSON para devolver os dados criados na requisição
            let novoFilmeJSON = {}

            let idUsuario = dadosAvaliacao.usuario
            let avaliacao =  dadosAvaliacao.avaliacao

            //validação de campos obrigatórios ou com digitação inválida
            if (idFilme == "" || idFilme == undefined || isNaN(idFilme) 
            || idUsuario == "" || idUsuario == undefined || isNaN(idUsuario)
            || avaliacao > 5 || avaliacao < 1
            ) {
                return message.ERROR_INVALID_ID
            } else {

                    let novoFilmeSalvo = await filmesDAO.insertAvaliacaoFilme(idUsuario, idFilme, avaliacao)
                    
                    //validação para verificar se o DAO inseriu os dados no banco
                    if (novoFilmeSalvo) {
                        //cria o JSON de retorno dos dados (201)
                        // novoFilmeJSON.filme = filmeComprado
                        novoFilmeJSON.status = message.SUCCESS_CREATED_ITEM.status
                        novoFilmeJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                        novoFilmeJSON.message = message.SUCCESS_CREATED_ITEM.message

                        return novoFilmeJSON //201
                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB //500
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

const setExcluirFilmeSalvo = async function (idUsuario, idFilme) {

    try {

        if (idFilme == "" || idFilme == undefined || isNaN(idFilme), idUsuario == "" || idUsuario == undefined || isNaN(idUsuario)) {
            //caso seja inválido, envia a mensagem da config                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
            return message.ERROR_INVALID_ID
        } else {
            let filmeSalvoDeletado = await filmesDAO.deleteFilmeSalvo(idUsuario, idFilme)


            if (filmeSalvoDeletado) {
                return message.SUCCESS_DELETED_ITEM //201

            } else {
                return message.ERROR_INTERNAL_SERVER_DB //500: erro no banco de dados
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER //500: erro na controller
    }

}

const getBuscarNomeFilme = async function (nome) {

    try {


        let nomeFilme = nome
        if (nomeFilme == "") {
            return message.ERROR_INVALID_VALUE
        } else {
            let filmesJSON = {}

            let dadosFilmes = await filmesDAO.selectByNomeFilme(nomeFilme)

            if (dadosFilmes) {

                if (dadosFilmes.length > 0) {
                    filmesJSON.filmes = dadosFilmes
                    filmesJSON.quantidade = dadosFilmes.length
                    filmesJSON.status_code = 200

                    return filmesJSON
                } else {
                    return message.ERROR_NOT_FOUND
                }

            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500: erro na controller
    }

}

const getFiltrarFilmes = async function (parametros) {

    try {
        if (parametros == "") {
            return message.ERROR_INVALID_VALUE
        } else {
            let filmesJSON = {}

            let dadosFilmes = await filmesDAO.selectByFiltro(parametros)
            console.log(dadosFilmes)

            await Promise.all(dadosFilmes.map(async (filme) => {
                let classificacaoFilme = await controllerClassificacoes.getBuscarClassficacaoFilme(filme.id)
                filme.classificacao = classificacaoFilme;
            }));
    
            await Promise.all(dadosFilmes.map(async (filme) => {
                let paisFilme = await controllerPaises.getPaisPorFilme(filme.id)
                filme.pais_origem = paisFilme;
            }));
    
            await Promise.all(dadosFilmes.map(async (filme) => {
                let avaliacaoFilme = await getAvaliacaoFilme(filme.id);
                if(avaliacaoFilme.avaliacao)
                filme.avaliacao = avaliacaoFilme.avaliacao;
                else
                filme.avaliacao = null
            }));
    
            await Promise.all(dadosFilmes.map(async (filme) => {
                let generoFilme = await controllerGeneros.getGeneroPorFilme(filme.id);
                filme.generos = generoFilme;
            }));
    
            await Promise.all(dadosFilmes.map(async (filme) => {
                let atoresFilme = await controllerAtores.getAtorPorFilme(filme.id);
                filme.elenco = atoresFilme;
            }));
    
            await Promise.all(dadosFilmes.map(async (filme) => {
                let diretoresFilme = await controllerDiretores.getDiretorPorFilme(filme.id);
                filme.diretor = diretoresFilme;
            }));
    
            await Promise.all(dadosFilmes.map(async (filme) => {
                let produtorasFilme = await controllerProdutora.getProdutoraPorFilme(filme.id);
                filme.produtora = produtorasFilme;
            }));

            if (dadosFilmes) {

                if (dadosFilmes.length > 0) {
                    filmesJSON.filmes = dadosFilmes
                    filmesJSON.quantidade = dadosFilmes.length
                    filmesJSON.status_code = 200

                    return filmesJSON
                } else {
                    return message.ERROR_NOT_FOUND
                }

            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER //500: erro na controller
    }
}

const getFiltrarFilmesGenero = async function (idGenero){

        try {
            //cria um objeto json
            let filmesJSON = {}
            //chama a função do DAO que retorna os filmes do banco
            let dadosFilmes = await filmesDAO.selectFilmesByGenero(idGenero)
    
            //chama as funções que retornam outras informações do filme
            await Promise.all(dadosFilmes.map(async (filme) => {
                let classificacaoFilme = await controllerClassificacoes.getBuscarClassficacaoFilme(filme.id)
                filme.classificacao = classificacaoFilme;
            }));
    
            await Promise.all(dadosFilmes.map(async (filme) => {
                let paisFilme = await controllerPaises.getPaisPorFilme(filme.id)
                filme.pais_origem = paisFilme;
            }));
    
            await Promise.all(dadosFilmes.map(async (filme) => {
                let avaliacaoFilme = await getAvaliacaoFilme(filme.id);
                if(avaliacaoFilme.avaliacao)
                filme.avaliacao = avaliacaoFilme.avaliacao;
                else
                filme.avaliacao = null
            }));
    
            await Promise.all(dadosFilmes.map(async (filme) => {
                let generoFilme = await controllerGeneros.getGeneroPorFilme(filme.id);
                filme.generos = generoFilme;
            }));
    
            await Promise.all(dadosFilmes.map(async (filme) => {
                let atoresFilme = await controllerAtores.getAtorPorFilme(filme.id);
                filme.elenco = atoresFilme;
            }));
    
            await Promise.all(dadosFilmes.map(async (filme) => {
                let diretoresFilme = await controllerDiretores.getDiretorPorFilme(filme.id);
                filme.diretor = diretoresFilme;
            }));
    
            await Promise.all(dadosFilmes.map(async (filme) => {
                let produtorasFilme = await controllerProdutora.getProdutoraPorFilme(filme.id);
                filme.produtora = produtorasFilme;
            }));
    
    
    
            //validação para verificar se o DAO retornou dados
            if (dadosFilmes) {
                //cria os atributos para reornar ao app
    
                if (dadosFilmes.length > 0) {
                    filmesJSON.filmes = dadosFilmes
                    filmesJSON.quantidade = dadosFilmes.length
                    filmesJSON.status_code = 200
    
                    return filmesJSON
                } else {
                    return message.ERROR_NOT_FOUND
                }
    
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        } catch (error) {
    
            return message.ERROR_INTERNAL_SERVER //500: erro na controller
        }
    
}

module.exports = {
    setInserirNovoFilme,
    setAtualizarFilme,
    setExcluirFilme,
    getListarFilmes,
    getBuscarFilme,
    getBuscarNomeFilme,
    getFilmesCompradosUsuario,
    getFiltrarFilmesGenero,
    getFilmesSalvosUsuario,
    getFiltrarFilmes,
    getAvaliacaoFilme,
    setInserirNovoFilmeComprado,
    setInserirNovoFilmeSalvo,
    setInserirAvaliacaoFilme,
    setExcluirFilme,
    setExcluirFilmeComprado,
    setExcluirFilmeSalvo,
    setExcluirAvaliacaoFilme,
    setAtualizarFilme
}
