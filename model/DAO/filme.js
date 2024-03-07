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
const insertFilme = async function (dadosFilme) {

    let sql

    try {

        if (dadosFilme.data_relancamento != null && dadosFilme.data_relancamento != "" && dadosFilme.data_relancamento != undefined) {
            sql = `insert into tbl_filme (  nome, 
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
        } else {
            sql = `insert into tbl_filme (  nome, 
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
                null,
                '${dadosFilme.foto_capa}',
                 ${dadosFilme.valor_unitario}
    
        )`
        }



        //$executeRawUnsafe( - serve para executar scripts sem retorno de dados (insert, update e delete))
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        return false
    }

}

//função para atualizar um filme no banco de dados
const updateFilme = async function () {

    let campo
    let valorNovo
    let idFilme

    let sql = `update tbl_filme set ${campo} = ${valorNovo} where id = ${idFilme}`
}

//função para excluir um filme do banco de dados
const deleteFilme = async function (id) {

    let idFilme = id

    try {
        let sql = `delete from tbl_filme where id = ${idFilme}`

        let result = await prisma.$executeRawUnsafe(sql)


        if (result)
            return true
        else
            return false

    } catch (error) {
        return false
    }

}

//função para listar todos os filmes banco de dados
const selectAllFilmes = async function () {

    try {
        let sql = 'select * from tbl_filme'

        //Prisma executa o script (encaminhado pela variável) dentro do banco de dados pra retornar -> rs: result/record set
        // $queryRawUnsafe(sql) -> possibilita enviar uma variável
        // $queryRaw('select * from tbl_filme') -> colocar script no argumento
        let rsFilmes = await prisma.$queryRawUnsafe(sql)
        return rsFilmes
    } catch (error) {
        return false
    }

}

//função para buscar um filme do banco de dados pelo id
const selectByIdFilme = async function (id) {

    try {
        let sql = `select * from tbl_filme where id =  ${id}`
        //encaminha o script da variável sql para o banco de dados
        let rsFilmes = await prisma.$queryRawUnsafe(sql)

        return rsFilmes
    } catch (error) {
        return false
    }


}

const selectByNomeFilme = async function (nomeFilme) {

    let nome = nomeFilme.replaceAll('"', '')
    try {
        let sql = `select * from tbl_filme where nome like '%${nome}%'`
        let rsFilme = await prisma.$queryRawUnsafe(sql)
        return rsFilme
    } catch (error) {
        return false
    }

}

const selectByFiltro = async function (params) {

    try {
        let keys = Object.keys(params)
        let rsFilmes
        let condition
        keys.forEach(async key => {
            if (condition) {
                condition += ` and ${key} like "%${params[key]}%"`
            } else {
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

const selectLastInsertId = async function () {

    try{
    let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_filme limit 1`
    let result = await prisma.$queryRawUnsafe(sql)
    
    let id
    result.forEach( idFilme => {
        id = Number(idFilme.id)
    })

    if(id){
        return id
    }else{
        return false
    }
    }catch(error){
        console.log(error)
        return false
    }

}

module.exports = {
    insertFilme,
    updateFilme,
    deleteFilme,
    selectAllFilmes,
    selectByIdFilme,
    selectByNomeFilme,
    selectByFiltro,
    selectLastInsertId
}
