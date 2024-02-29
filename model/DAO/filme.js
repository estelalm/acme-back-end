/***********************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados no Banco SQL;
 *              aqui realizamos o CRUD na linguagem SQL.
 * Data: 01/02/2023
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
***********************************************************************/


//Import da biblioteca do prisma client
const { PrismaClient } = require('@prisma/client')

//Instância da classe prisma client
const prisma = new PrismaClient

//função para inserir um novo filme no banco de dados
const insertFilme = async function(dadosFilme){

    try{
        let sql = `insert into tbl_filme (  nome, 
            sinopse, 
            duracao,
            data_lancamento,
            data_relancamento,
            foto_capa,
            valor_unitario
)values (
            '${dadosFilme.nome}',
            '${dadosFilme.sinopse}',
            '${dadosFilme.duracao}',
            '${dadosFilme.data_lancamento}',
            '${dadosFilme.data_relancamento}',
            '${dadosFilme.foto_capa}',
             ${dadosFilme.valor_unitario}

)`

//$executeRawUnsafe( - serve para executar scripts sem retorno de dados (insert, update e delete))
let result = await prisma.$executeRawUnsafe(sql)
    }catch(error){
        return false
    }
    
}

//função para atualizar um filme no banco de dados
const updateFilme = async function(){
}

//função para excluir um filme do banco de dados
const deleteFilme = async function (){
}

//função para listar todos os filmes banco de dados
const selectAllFilmes = async function (){

    try{
        let sql = 'select * from tbl_filme'

        //Prisma executa o script (encaminhado pela variável) dentro do banco de dados pra retornar -> rs: result/record set
        // $queryRawUnsafe(sql) -> possibilita enviar uma variável
        // $queryRaw('select * from tbl_filme') -> colocar script no argumento
        let rsFilmes = await prisma.$queryRawUnsafe(sql) 
        return rsFilmes
    }catch(error){
    return false
    }

}

//função para buscar um filme do banco de dados pelo id
const selectByIdFilme = async function (id){

    try {
        let sql = `select * from tbl_filme where id =  ${id}`
        //encaminha o script da variável sql para o banco de dados
        let rsFilmes = await prisma.$queryRawUnsafe(sql) 

         return rsFilmes
    } catch (error) {
        return false
    }


}

const selectByNomeFilme = async function (nomeFilme){

    let nome = nomeFilme.replaceAll('"', '')
    try{
        let sql = `select * from tbl_filme where nome like '%${nome}%'`
        let rsFilme = await prisma.$queryRawUnsafe(sql)
        return rsFilme
    }catch(error){
        return false
    }

}

const selectByFiltro = async function(params){

    try {
        let keys = Object.keys(params)
        let rsFilmes
        let condition
        keys.forEach(async key =>{
            if(condition){
                condition += ` and ${key} like "%${params[key]}%"`
            }else{
                condition = `${key} like "%${params[key]}%"`
            }
        })
            let sql = `select * from tbl_filme where ${condition}`
            rsFilmes = await prisma.$queryRawUnsafe(sql)
            return rsFilmes

    } catch (error) {
        return false
    }

}

module.exports ={
    insertFilme,
    updateFilme,
    deleteFilme,
    selectAllFilmes,
    selectByIdFilme,
    selectByNomeFilme,
    selectByFiltro
}
