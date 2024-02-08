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
const insertFilme = async function(){

}

//função para atualizar um filme no banco de dados
const updateFilme = async function(){

}

//função para excluir um filme do banco de dados
const deleteFilme = async function (){

}

//função para listar todos os filmes banco de dados
const selectAllFilmes = async function (){

    let sql = 'select * from tbl_filme'

    //Prisma executa o script (encaminhado pela variável) dentro do banco de dados pra retornar -> rs: result/record set
    // $queryRawUnsafe(sql) -> possibilita enviar uma variável
    // $queryRaw('select * from tbl_filme') -> colocar script no argumento
    let rsFilmes = await prisma.$queryRawUnsafe(sql) 

    if(rsFilmes.length > 0)
    return rsFilmes
    else
    return false

}

//função para buscar um filme do banco de dados pelo id
const selectByIdFilme = async function (id){
    let sql = 'select * from tbl_filme where id = ' + id

    let rsFilmes = await prisma.$queryRawUnsafe(sql) 

    if(rsFilmes.length > 0)
    return rsFilmes
    else
    return false
}

module.exports ={
    insertFilme,
    updateFilme,
    deleteFilme,
    selectAllFilmes,
    selectByIdFilme
}
