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
            sql = `insert into tbl_filme ( nome, 
                sinopse, 
                duracao,
                data_lancamento,
                data_relancamento,
                valor_unitario,
                foto_capa,
                trailer,
                classificacao_id,
                pais_origem_id
        )values (
                '${dadosFilme.nome}',
                '${dadosFilme.sinopse}',
                '${dadosFilme.duracao}',
                '${dadosFilme.data_lancamento}',
                '${dadosFilme.data_relancamento}',
                ${dadosFilme.valor_unitario},
                '${dadosFilme.foto_capa}',
                '${dadosFilme.trailer}',
                ${dadosFilme.classificacao},
                ${dadosFilme.pais_origem}
    
        )`
        } else {
            sql = `insert into tbl_filme ( nome, 
                sinopse, 
                duracao,
                data_lancamento,
                valor_unitario,
                foto_capa,
                trailer,
                classificacao_id,
                pais_origem_id
        )values (
                '${dadosFilme.nome}',
                '${dadosFilme.sinopse}',
                '${dadosFilme.duracao}',
                '${dadosFilme.data_lancamento}',
                ${dadosFilme.valor_unitario},
                '${dadosFilme.foto_capa}',
                '${dadosFilme.trailer}',
                ${dadosFilme.classificacao},
                ${dadosFilme.pais_origem}
    
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
const updateFilme = async function (id, dados) {

    let idFilme = id
    let dadosFilme = dados

    try{

        let sql

        if (dadosFilme.data_relancamento != null && dadosFilme.data_relancamento != "" && dadosFilme.data_relancamento != undefined){

        sql = `update tbl_filme set 
        
            nome = '${dadosFilme.nome}',
            sinopse = '${dadosFilme.sinopse}', 
            duracao = '${dadosFilme.duracao}',
            data_lancamento = '${dadosFilme.data_lancamento}',
            data_relancamento = ${dadosFilme.data_relancamento},
            valor_unitario = ${dadosFilme.valor_unitario},
            foto_capa = '${dadosFilme.foto_capa}',
            classificacao_id = ${dadosFilme.classificacao},
            pais_origem_id = ${dadosFilme.pais_origem}
        
            where id = ${idFilme}`
    }else{
        sql = `update tbl_filme set 
        
        nome = '${dadosFilme.nome}',
        sinopse = '${dadosFilme.sinopse}', 
        duracao = '${dadosFilme.duracao}',
        data_lancamento = '${dadosFilme.data_lancamento}',
        data_relancamento = null,
        valor_unitario = ${dadosFilme.valor_unitario},
        foto_capa = '${dadosFilme.foto_capa}',
        classificacao_id = ${dadosFilme.classificacao},
        pais_origem_id = ${dadosFilme.pais_origem}
    
        where id = ${idFilme}`
    }

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
        return true
        else
        return false

    }catch(error){
        return false
    }
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
        let sql = `select tbl_filme.id, tbl_filme.nome, sinopse, duracao, data_lancamento, data_relancamento, 
        valor_unitario, foto_capa, trailer , tbl_classificacao.nome as classificacao , tbl_pais.nome as pais_origem,
         group_concat(distinct tbl_genero.nome separator "/") as generos,  
         group_concat(distinct tbl_diretor.nome separator ", ") as diretor,
         group_concat(distinct tbl_ator.nome separator ", ") as elenco,
         group_concat(distinct tbl_produtora.nome separator ", ") as produtora from tbl_filme
        inner join tbl_genero_filme on tbl_filme.id = tbl_genero_filme.filme_id inner join tbl_genero on tbl_genero_filme.genero_id = tbl_genero.id
        inner join tbl_diretor_filme on tbl_filme.id=tbl_diretor_filme.filme_id inner join tbl_diretor on tbl_diretor_filme.diretor_id=tbl_diretor.id
        inner join tbl_ator_filme on tbl_filme.id=tbl_ator_filme.filme_id inner join tbl_ator on tbl_ator_filme.ator_id=tbl_ator.id
        inner join tbl_produtora_filme on tbl_filme.id=tbl_produtora_filme.filme_id inner join tbl_produtora on tbl_produtora_filme.produtora_id=tbl_produtora.id
        join tbl_classificacao on tbl_filme.classificacao_id=tbl_classificacao.id
        join tbl_pais on tbl_filme.pais_origem_id=tbl_pais.id group by tbl_filme.id`

        //Prisma executa o script (encaminhado pela variável) dentro do banco de dados pra retornar -> rs: result/record set
        // $queryRawUnsafe(sql) -> possibilita enviar uma variável
        // $queryRaw('select * from tbl_filme') -> colocar script no argumento
        let rsFilmes = await prisma.$queryRawUnsafe(sql)
        return rsFilmes
    } catch (error) {
        console.log(error)
        return false
    }

}

//função para buscar um filme do banco de dados pelo id
const selectByIdFilme = async function (id) {

    try {
        let sql = `select tbl_filme.id, tbl_filme.nome, sinopse, duracao, data_lancamento, data_relancamento, 
        valor_unitario, foto_capa, trailer , tbl_classificacao.nome as classificacao , tbl_pais.nome as pais_origem,
         group_concat(distinct tbl_genero.nome separator "/") as generos,  
         group_concat(distinct tbl_diretor.nome separator ", ") as diretor,
         group_concat(distinct tbl_ator.nome separator ", ") as elenco,
         group_concat(distinct tbl_produtora.nome separator ", ") as produtora from tbl_filme
        inner join tbl_genero_filme on tbl_filme.id = tbl_genero_filme.filme_id inner join tbl_genero on tbl_genero_filme.genero_id = tbl_genero.id
        inner join tbl_diretor_filme on tbl_filme.id=tbl_diretor_filme.filme_id inner join tbl_diretor on tbl_diretor_filme.diretor_id=tbl_diretor.id
        inner join tbl_ator_filme on tbl_filme.id=tbl_ator_filme.filme_id inner join tbl_ator on tbl_ator_filme.ator_id=tbl_ator.id
        inner join tbl_produtora_filme on tbl_filme.id=tbl_produtora_filme.filme_id inner join tbl_produtora on tbl_produtora_filme.produtora_id=tbl_produtora.id
        join tbl_classificacao on tbl_filme.classificacao_id=tbl_classificacao.id
        join tbl_pais on tbl_filme.pais_origem_id=tbl_pais.id where tbl_filme.id = ${id}`
        
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
    selectLastInsertId,
    deleteFilme,
    updateFilme
}
