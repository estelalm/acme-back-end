/***********************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados no Banco SQL;
 *              aqui realizamos o CRUD na linguagem SQL.
 * Data: 01/02/2023
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
***********************************************************************/


//Import da biblioteca do prisma client
const { PrismaClient } = require('@prisma/client')
const { selectByDiretorPais } = require('./pais')

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

const insertGeneroFilme = async function (idFilme, idGenero){

    let sql

    try {
            sql = `insert into tbl_genero_filme ( genero_id, filme_id ) values 
            ( ${idGenero}, ${idFilme})`
        
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

const insertAtorFilme = async function (idFilme, idAtor){

    let sql

    try {
            sql = `insert into tbl_ator_filme ( ator_id, filme_id ) values 
            ( ${idAtor}, ${idFilme})`
        
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const insertDiretorFilme = async function (idFilme, idDiretor){

    let sql

    try {
            sql = `insert into tbl_diretor_filme ( diretor_id, filme_id ) values 
            ( ${idDiretor}, ${idFilme})`
        
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}


const insertProdutoraFilme = async function (idFilme, idProdutora){

    let sql

    try {
            sql = `insert into tbl_produtora_filme ( produtora_id, filme_id ) values 
            ( ${idProdutora}, ${idFilme})`
        
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

const insertFilmeComprado = async function (idUsuario, idFilme){

    let sql

    try {
            sql = `insert into tbl_comprado ( usuario_id, filme_id ) values 
            ( ${idUsuario}, ${idFilme})`
        
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}
const insertFilmeSalvo = async function (idUsuario, idFilme){

    let sql

    
    try {
            sql = `insert into tbl_salvo ( usuario_id, filme_id ) values 
            ( ${idUsuario}, ${idFilme})`

            console.log(sql)
        
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}
const insertAvaliacaoFilme = async function (idUsuario, idFilme, avaliacao){

    let sql

    try {
            sql = `insert into tbl_avaliacao ( usuario_id, filme_id, avaliacao ) values 
            ( ${idUsuario}, ${idFilme}, ${avaliacao})`
        
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}
const updateAvaliacaoFilme = async function (idUsuario, idFilme, avaliacao){

    let sql

    try {
            sql = `update tbl_avaliacao 
                set avaliacao = ${avaliacao}
                where usuario_id = ${idUsuario}
                and filme_id = ${idFilme}`
        
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

const deleteGeneroFilme = async function (idFilme){

    let sql

    try {
            sql = `delete from tbl_genero_filme where filme_id = ${idFilme}`
            
        
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}
const deleteAtorFilme = async function (idFilme){

    let sql

    try {
            sql = `delete from tbl_ator_filme where filme_id = ${idFilme}`
            
        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

const deleteDiretorFilme = async function (idFilme){

    let sql

    try {
            sql = `delete from tbl_diretor_filme where filme_id = ${idFilme}`
            
        let result = await prisma.$executeRawUnsafe(sql)
        
        if (result)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}


const deleteProdutoraFilme = async function (idFilme){

    let sql

    try {
            sql = `delete from tbl_produtora_filme where filme_id = ${idFilme}`
            
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
            sinopse = "${dadosFilme.sinopse}", 
            duracao = '${dadosFilme.duracao}',
            data_lancamento = '${dadosFilme.data_lancamento}',
            data_relancamento = ${dadosFilme.data_relancamento},
            valor_unitario = ${dadosFilme.valor_unitario},
            foto_capa = '${dadosFilme.foto_capa}',
            trailer = '${dadosFilme.foto_capa}',
            classificacao_id = ${dadosFilme.classificacao},
            pais_origem_id = ${dadosFilme.pais_origem}
        
            where id = ${idFilme}`
    }else{
        sql = `update tbl_filme set 
        
        nome = '${dadosFilme.nome}',
        sinopse = "${dadosFilme.sinopse}", 
        duracao = '${dadosFilme.duracao}',
        data_lancamento = '${dadosFilme.data_lancamento}',
        data_relancamento = null,
        valor_unitario = ${dadosFilme.valor_unitario},
        foto_capa = '${dadosFilme.foto_capa}',
        trailer = '${dadosFilme.foto_capa}',
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
        console.log(error)
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
        console.log(error)
        return false
    }

}

const deleteFilmeComprado = async function (usuarioId, filmeId) {

    let idUsuario = usuarioId
    let idFilme = filmeId

    try {
        let sql = `delete from tbl_comprado where filme_id = ${idFilme} and usuario_id = ${idUsuario}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }

}

const deleteFilmeSalvo = async function (usuarioId, filmeId) {

    let idUsuario = usuarioId
    let idFilme = filmeId

    try {
        let sql = `delete from tbl_salvo where filme_id = ${idFilme} and usuario_id = ${idUsuario}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }

}

const deleteAvaliacoesFilme = async function (idFilme){

    try {
        let sql = `delete from tbl_avaliacao where filme_id = ${idFilme};`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

//função para listar todos os filmes banco de dados
const selectAllFilmes = async function () {

    try {
        let sql = ` select id, nome, sinopse, duracao, data_lancamento, valor_unitario, foto_capa, trailer from tbl_filme;`

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
        let sql = ` select id, nome, sinopse, duracao, data_lancamento, valor_unitario, foto_capa, trailer from tbl_filme 
                    where tbl_filme.id = ${id}`
        
        //encaminha o script da variável sql para o banco de dados
        let rsFilmes = await prisma.$queryRawUnsafe(sql)
        // group_concat(distinct tbl_produtora.nome separator ", ") as produtora from tbl_filme
        return rsFilmes
    } catch (error) {
        return false
    }


}

const selectFilmesCompradosUsuario = async function(id){
    try {
        let sql = ` select distinct(tbl_filme.id), nome, sinopse, duracao, data_lancamento, valor_unitario, foto_capa, trailer from tbl_filme 
                    join tbl_comprado on tbl_filme.id=tbl_comprado.filme_id where tbl_comprado.usuario_id = ${id}`
        
        //encaminha o script da variável sql para o banco de dados
        let rsFilmes = await prisma.$queryRawUnsafe(sql)
        // group_concat(distinct tbl_produtora.nome separator ", ") as produtora from tbl_filme
        return rsFilmes
    } catch (error) {
        console.log(error)
        return false
    }
}
const selectFilmesSalvosUsuario = async function(id){
    try {
        let sql = ` select distinct(tbl_filme.id), nome, sinopse, duracao, data_lancamento, valor_unitario, foto_capa, trailer from tbl_filme 
                    join tbl_salvo on tbl_filme.id=tbl_salvo.filme_id where tbl_salvo.usuario_id = ${id}`
        
        //encaminha o script da variável sql para o banco de dados
        let rsFilmes = await prisma.$queryRawUnsafe(sql)
        // group_concat(distinct tbl_produtora.nome separator ", ") as produtora from tbl_filme
        return rsFilmes
    } catch (error) {
        console.log(error)
        return false
    }
}

const selectAvaliacaoFilme = async function(id){
    try {
        let sql = `select truncate(avg(avaliacao), 1) as avaliacao from tbl_avaliacao where filme_id = ${id}`
        
        //encaminha o script da variável sql para o banco de dados
        let rsFilmes = await prisma.$queryRawUnsafe(sql)
        // group_concat(distinct tbl_produtora.nome separator ", ") as produtora from tbl_filme
        return rsFilmes
    } catch (error) {
        console.log(error)
        return false
    }
}


const selectByNomeFilme = async function (nomeFilme) {

    let nome = nomeFilme.replaceAll('"', '')
    try {
        let sql = ` select id, nome, sinopse, duracao, data_lancamento, valor_unitario, foto_capa, trailer from tbl_filme 
                    where nome like '%${nome}%'`
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
        let sql = `select id, nome, sinopse, duracao, data_lancamento, valor_unitario, foto_capa, trailer from tbl_filme where ${condition}`
        rsFilmes = await prisma.$queryRawUnsafe(sql)
        return rsFilmes

    } catch (error) {
        console.log(error)
        return false
    }

}

const selectFilmesByGenero = async function (id){
    try {
        let sql = `select tbl_filme.id, nome, sinopse, duracao, data_lancamento, valor_unitario, foto_capa, trailer from tbl_filme 
        join tbl_genero_filme on tbl_filme.id=tbl_genero_filme.filme_id where genero_id = ${id}`

        console.log(sql)
        let rsFilme = await prisma.$queryRawUnsafe(sql)
        return rsFilme
    } catch (error) {
        console.log(error)
        return false
    }
}
const selectFilmesByAtor = async function (id){
    try {
        let sql = `select id, nome, sinopse, duracao, data_lancamento, valor_unitario, foto_capa, trailer from tbl_filme 
        join tbl_ator_filme on tbl_filme.id=tbl_ator_filme.id_filme where ator_id = ${id}`
        let rsFilme = await prisma.$queryRawUnsafe(sql)
        return rsFilme
    } catch (error) {
        return false
    }
}
const selectFilmesByDiretor = async function (id){
    try {
        let sql = ` select id, nome, sinopse, duracao, data_lancamento, valor_unitario, foto_capa, trailer from tbl_filme 
        join tbl_diretor_filme on tbl_filme.id=tbl_diretor_filme.id_filme where diretor_id = ${id}`
        let rsFilme = await prisma.$queryRawUnsafe(sql)
        return rsFilme
    } catch (error) {
        return false
    }
}
const selectFilmesByProdutora = async function (id){
    try {
        let sql = ` select id, nome, sinopse, duracao, data_lancamento, valor_unitario, foto_capa, trailer from tbl_filme 
        join tbl_produtora_filme on tbl_filme.id=tbl_produtora_filme.id_filme where produtora_id = ${id}`
        let rsFilme = await prisma.$queryRawUnsafe(sql)
        return rsFilme
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
    insertAtorFilme,
    insertGeneroFilme,
    insertDiretorFilme, 
    insertProdutoraFilme,
    insertFilmeComprado,
    insertAvaliacaoFilme,
    insertFilmeSalvo,
    updateFilme,
    updateAvaliacaoFilme,
    deleteFilme,
    deleteAtorFilme,
    deleteDiretorFilme,
    deleteProdutoraFilme,
    deleteGeneroFilme,
    deleteFilmeComprado,
    deleteFilmeSalvo,
    selectAllFilmes,
    selectByIdFilme,
    selectByNomeFilme,
    selectByFiltro,
    selectLastInsertId,
    selectFilmesCompradosUsuario,
    selectFilmesSalvosUsuario,
    selectAvaliacaoFilme,
    selectFilmesByAtor,
    selectFilmesByGenero,
    selectFilmesByDiretor,
    selectFilmesByProdutora,
    deleteFilme,
    deleteAvaliacoesFilme,
    updateFilme
}
