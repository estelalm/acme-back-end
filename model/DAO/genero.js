


const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient

const selectAllGeneros = async () =>{

    try {
        
        let sql = `select * from tbl_genero`

        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
        return result
        else
        return false

    } catch (error) {
        return false
    }

}

const selectByFilmeGenero = async (id) =>{

    let idFilme = id
    try{

        let sql = `select tbl_genero.id, tbl_genero.nome from tbl_genero 
        inner join tbl_genero_filme on tbl_genero.id=tbl_genero_filme.genero_id 
        inner join tbl_filme on tbl_genero_filme.filme_id=tbl_filme.id
        where tbl_filme.id = ${idFilme};`

        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
        return result
        else
        return false

    }catch(error){
        return false
    }

}

const selectByIdGenero = async (id) =>{

    try{

        let sql = `select * from tbl_genero where id = ${id}`

        let result = await prisma.$queryRawUnsafe(sql)
        
        if(result)
        return result
        else
        return false

    }catch(error){
        return false
    }

}

const insertGenero = async (dadosGenero) =>{

    try{

        let sql = `INSERT INTO tbl_genero 
                    (nome) values
                    ('${dadosGenero.nome}')`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
        return true
        else
        return false

    }catch(error){
        return false
    }
}

const updateGenero = async (id, dados) =>{

    let idGenero = id
    let dadosGenero = dados

    try {

        let sql = `update tbl_genero set 
        nome = '${dadosGenero.nome}'
        where id = ${idGenero}
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

const deleteGenero = async (id) =>{
    
    try {
        let sql = `delete from tbl_genero where id=${id}`

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
    let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_genero limit 1`
    let result = await prisma.$queryRawUnsafe(sql)
    
    let id
    result.forEach( idGenero => {
        id = Number(idGenero.id)
    })


    if(id){
        return id
    }else{
        return false
    }
    }catch(error){
        return false
    }

}



module.exports = {
    selectAllGeneros,
    selectByIdGenero,
    selectByFilmeGenero,
    selectLastInsertId,
    insertGenero,
    deleteGenero,
    updateGenero
}