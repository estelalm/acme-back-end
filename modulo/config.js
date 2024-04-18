/*********************************************************************************************
 * Objetivo: Arquivo resposável pela padronização de variáveis e constantes globais do projeto
 * Data: 22/02/2024
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
 ********************************************************************************************/


//---------------------------   mensagens de erro do projeto   ---------------------------//

const ERROR_INVALID_ID =   {status: false, status_code: 400, message: 'O ID encaminhado na requisição não é váldo'}

const ERROR_INVALID_VALUE = {status: false, status_code: 400, message: 'O valor encaminhado na requisição não é váldo'}

const ERROR_REQUIRED_FIELDS = {status: false, status_code: 400, message: 'Existem campos requeridos que não foram preenchidos ou não atendem aos critérios de digitação'}

const ERROR_NOT_FOUND = {status: false, status_code: 404, message: 'Não foi encontado nenhum item'}

const ERROR_CONTENT_TYPE = {status: false, status_code: 415, message: 'O content-type encaminhado na requisição não é suportado pelo servidor. Deve-se encaminhar apenas requisições com aplication/json'}

const ERROR_INTERNAL_SERVER_DB = {status: false, status_code: 500, message: 'Não foi posivel processar a requisição devido a um erro no acesso ao banco de dados. Contate o admnistrador da API'}

const ERROR_INTERNAL_SERVER = {status: false, status_code: 500, message: 'Não foi posivel processar a requisição devido a um erro na camada de negócio/controle da aplicação. Contate o admnistrador da API'}



//---------------------------   mensagens de sucesso do projeto   ---------------------------//


const SUCCESS_CREATED_ITEM = {status: true, status_code: 201, message: 'Item criado com sucesso'}

const SUCCESS_DELETED_ITEM = {status: true, status_code: 201, message: 'Item excluído com sucesso'}

const SUCCESS_UPDATED_ITEM = {status: true, status_code: 201, message: 'Item atualizado com sucesso'}


module.exports ={
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND,
    ERROR_INTERNAL_SERVER_DB,
    ERROR_INVALID_VALUE,
    ERROR_REQUIRED_FIELDS,
    ERROR_CONTENT_TYPE,
    ERROR_INTERNAL_SERVER,
    SUCCESS_CREATED_ITEM,
    SUCCESS_DELETED_ITEM,
    SUCCESS_UPDATED_ITEM
}