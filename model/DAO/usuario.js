/***********************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados no Banco SQL;
 *              aqui realizamos o CRUD na linguagem SQL.
 * Data: 01/02/2023
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
***********************************************************************/

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient

const selectAllUsuarios = async function (){

    try {
        let sql = `select * from tbl_usuario`

        let rsUsuarios = await prisma.$queryRawUnsafe(sql)
        return rsUsuarios
    } catch (error) {
        console.log(error)
        return false
    }
}

const selectByIdUsuario = async function (id){

   try {

     let sql = `select * from tbl_usuario where id = ${id}`

     let rsUsuario = await prisma.$queryRawUnsafe(sql)

     return rsUsuario

   } catch (error) {
    return false
   }
    
}

const insertUsuario = async function (dadosUsuario){

    try {
        
        let sql = `INSERT INTO tbl_usuario 
        (nome, 
        cpf, 
        telefone, 
        email, 
        senha) values
        ('${dadosUsuario.nome}', 
        '${dadosUsuario.cpf}', 
        '${dadosUsuario.telefone}', 
        '${dadosUsuario.email}', 
        '${dadosUsuario.senha}')`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return result
        else
            return false

    } catch (error) {
        return false
    }
}

const updateUsuario = async function (id, dados){
    let dadosUsuario = dados

    try{

        let sql = `update tbl_usuario set 
        
        nome = '${dadosUsuario.nome}',
        cpf = '${dadosUsuario.cpf}', 
        telefone = '${dadosUsuario.telefone}',
        email = '${dadosUsuario.email}',
        senha = '${dadosUsuario.senha}'
    
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

const deleteUsuario = async function (id){
    
    let idUsuario = id

    try {
        let sql = `delete from tbl_usuario where id = ${idUsuario}`

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
    let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_usuario limit 1`
    let result = await prisma.$queryRawUnsafe(sql)
    
    let id
    result.forEach( idUsuario => {
        id = Number(idUsuario.id)
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
    selectAllUsuarios,
    selectByIdUsuario,
    selectLastInsertId,
    deleteUsuario,
    insertUsuario,
    updateUsuario
}