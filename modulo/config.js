/*********************************************************************************************
 * Objetivo: Arquivo resposável pela padronização de variáveis e constantes globais do projeto
 * Data: 22/02/2024
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
 ********************************************************************************************/


//---------------------------   mensagens de erro do projeto   ---------------------------//

const ERROR_INVALID_ID =   {status: false, status_code: 400, message: 'O ID encaminhado na requisição não é váldo'}

const ERROR_INVALID_VALUE = {status: false, status_code: 400, message: 'O valor encaminhado na requisição não é váldo'}

const ERROR_NOT_FOUND = {status: false, status_code: 404, message: 'Não foi encontado nenhum item'}

const ERROR_INTERNAL_SERVER_DB = {status: false, status_code: 500, message: 'Não foi posivel processar a requisição devido a um erro no acesso ao banco de dados. Contate o admnistrador da API'}

module.exports ={
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND,
    ERROR_INTERNAL_SERVER_DB,
    ERROR_INVALID_VALUE
}