

const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient

const selectAllClassificacoes = async () =>{

    try{
        let sql = `select * from tbl_classificacao`

        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
        return result
        else
        return false
    }catch(error){
    console.log(error)
        return false
    }
}

module.exports = {
    selectAllClassificacoes
}

const selectByIdClassificacao = async (id) =>{

    try{

        let sql = `select * from tbl_classificacao where id = ${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
        return result
        else
        return false

    }catch(error){
        return false
    }

}

const selectByFilmeClassificacao = async (id) =>{

    try{

        let sql = ` select tbl_classificacao.id, tbl_classificacao.nome, nome_completo, descricao, sigla from tbl_classificacao 
        join tbl_filme on tbl_classificacao.id = tbl_filme.classificacao_id 
        where tbl_filme.id = ${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
        return result
        else
        return false

    }catch(error){
        return false
    }

}

const insertClassificacao = async (dadosClassificacao) => {
    try {
        let sql = `INSERT INTO tbl_classificacao
        (
            nome, imagem, nome_completo, descricao, sigla
        ) values
        ('${dadosClassificacao.nome}', 
        '${dadosClassificacao.imagem}',
        '${dadosClassificacao.nome_completo}',
        '${dadosClassificacao.descricao}',
        '${dadosClassificacao.sigla}')
        `
        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
        return true
        else
        return false

    } catch (error) {

        return false
    }
}

const updateClassificacao = async (id, dados) =>{

    let idClassificacao = id
    let dadosClassificacao = dados

    let sql = `update tbl_classificacao set 
    nome = '${dadosClassificacao.nome}',
    imagem = '${dadosClassificacao.imagem}',
    nome_completo = '${dadosClassificacao.nome_completo}',
    descricao = '${dadosClassificacao.descricao}',
    sigla = '${dadosClassificacao.sigla}'
    where id = ${idClassificacao};`


    try {

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
        return true
        else
        return false
        
    } catch (error) {
        console.log(error)
        return false
    }
    
}

const deleteClassificacao = async (id) =>{
    
    try {
        let sql = `delete from tbl_classificacao where id=${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
        return true
        else
        return false

    } catch (error) {
        return false
    }
}


const selectLastInsertId = async function () {

    try{
    let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_classificacao limit 1`
    let result = await prisma.$queryRawUnsafe(sql)
    
    let id
    result.forEach( idClassificacao => {
        id = Number(idClassificacao.id)
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
    selectAllClassificacoes,
    selectByIdClassificacao,
    selectByFilmeClassificacao,
    insertClassificacao,
    updateClassificacao,
    deleteClassificacao,
    selectLastInsertId
}