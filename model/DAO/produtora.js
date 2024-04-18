


const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient

const selectAllProdutoras = async () =>{

    try {
        
        let sql = `select * from tbl_produtora`

        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
        return result
        else
        return false

    } catch (error) {
        return false
    }

}

const selectByIdProdutora = async (id) =>{

    try{

        let sql = `select * from tbl_produtora where id = ${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
        return result
        else
        return false

    }catch(error){
        return false
    }

}

const insertProdutora = async (dadosProdutora) =>{

    try{

        let sql = `INSERT INTO tbl_produtora 
                    (nome, descricao) values
                    ('${dadosProdutora.nome}', '${dadosProdutora.descricao}')`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
        return true
        else
        return false

    }catch(error){
        return false
    }
}

const updateProdutora = async (id, dados) =>{

    let idProdutora = id
    let dadosProdutora = dados

    try {

        let sql = `update tbl_produtora set 
        nome = '${dadosProdutora.nome}',
        descricao = '${dadosProdutora.descricao}'
        where id = ${idProdutora}`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
        return true
        else
        return false
        
    } catch (error) {
        return false
    }
    
}

const deleteProdutora = async (id) =>{
    
    try {
        let sql = `delete from tbl_produtora where id=${id}`

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
    let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_produtora limit 1`
    let result = await prisma.$queryRawUnsafe(sql)
    
    let id
    result.forEach( idProdutora => {
        id = Number(idProdutora.id)
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
    selectAllProdutoras,
    selectByIdProdutora,
    selectLastInsertId,
    insertProdutora,
    deleteProdutora,
    updateProdutora
}