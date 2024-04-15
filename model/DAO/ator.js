
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient

const selectAllAtores = async function (){

    try {
        let sql = `select * from tbl_ator`

        let rsAtores = await prisma.$queryRawUnsafe(sql)
        return rsAtores
    } catch (error) {
        console.log(error)
        return false
    }
}

const selectByIdAtor = async function (id){

   try {

     let sql = `select * from tbl_ator where id = ${id}`

     let rsAtor = await prisma.$queryRawUnsafe(sql)

     return rsAtor

   } catch (error) {
    return false
   }
    
}

const insertAtor = async function (dadosAtor){

    try {
        
        let sql = `INSERT INTO tbl_ator 
        (nome, 
        cpf, 
        telefone, 
        email, 
        senha) values
        ('${dadosAtor.nome}', 
        '${dadosAtor.cpf}', 
        '${dadosAtor.telefone}', 
        '${dadosAtor.email}', 
        '${dadosAtor.senha}')`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return result
        else
            return false

    } catch (error) {
        return false
    }
}

const updateAtor = async function (id, dados){
    let dadosAtor = dados

    try{

        let sql = `update tbl_ator set 
        
        nome = '${dadosAtor.nome}',
        cpf = '${dadosAtor.cpf}', 
        telefone = '${dadosAtor.telefone}',
        email = '${dadosAtor.email}',
        senha = '${dadosAtor.senha}'
    
        where id = ${id}`

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

const deleteAtor = async function (id){
    
    let idAtor = id

    try {
        let sql = `delete from tbl_ator where id = ${idAtor}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        return false
    }

}

const selectLastInsertId = async function () {

    try{
    let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_ator limit 1`
    let result = await prisma.$queryRawUnsafe(sql)
    
    let id
    result.forEach( idAtor => {
        id = Number(idAtor.id)
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
    selectAllAtores,
    selectByIdAtor,
    selectLastInsertId,
    deleteAtor,
    insertAtor,
    updateAtor
}