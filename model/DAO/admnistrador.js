
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient

const selectAllAdmnistradores = async function (){

    try {
        let sql = `select * from tbl_admnistradores`

        let rsAdmnistradores = await prisma.$queryRawUnsafe(sql)
        return rsAdmnistradores
    } catch (error) {
        console.log(error)
        return false
    }
}

const selectByIdAdmnistrador = async function (id){

   try {

     let sql = `select * from tbl_admnistradores where id = ${id}`

     let rsAdmnistrador = await prisma.$queryRawUnsafe(sql)

     return rsAdmnistrador

   } catch (error) {
    return false
   }
    
}

const insertAdmnistrador = async function (dadosAdmnistrador){

    try {
        
        let sql = `INSERT INTO tbl_admnistradores 
        (nome, 
        login, 
        senha) values
        ('${dadosAdmnistrador.nome}', 
        '${dadosAdmnistrador.login}', 
        '${dadosAdmnistrador.senha}')`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return result
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

const updateAdmnistrador = async function (id, dados){
    let dadosAdmnistrador = dados

    try{

        let sql = `update tbl_admnistradores set 
        
        nome = '${dadosAdmnistrador.nome}',
        login = '${dadosAdmnistrador.login}',
        senha = '${dadosAdmnistrador.senha}'
    
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

const deleteAdmnistrador = async function (id){
    
    let idAdmnistrador = id

    try {
        let sql = `delete from tbl_admnistradores where id = ${idAdmnistrador}`

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
    let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_admnistradores limit 1`
    let result = await prisma.$queryRawUnsafe(sql)
    
    let id
    result.forEach( idAdmnistrador => {
        id = Number(idAdmnistrador.id)
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
    selectAllAdmnistradores,
    selectByIdAdmnistrador,
    selectLastInsertId,
    deleteAdmnistrador,
    insertAdmnistrador,
    updateAdmnistrador
}