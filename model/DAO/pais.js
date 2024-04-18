/***********************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados no Banco SQL;
 *           Tabela de países e nacionalidades
 * Data: 01/02/2023
 * Autor: Estela Alves de Moraes
 * Versão: 1.0
***********************************************************************/



const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient

const selectAllPaises = async () =>{

    try {
        
        let sql = `select * from tbl_pais`

        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
        return result
        else
        return false

    } catch (error) {
        return false
    }

}

const selectByIdPais = async (id) =>{

    try{

        let sql = `select * from tbl_pais where id = ${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
        return result
        else
        return false

    }catch(error){
        return false
    }

}

const selectByAtorPais = async (idAtor) =>{
    try{
        let sql = `select tbl_pais.id, tbl_pais.gentilico, tbl_pais.sigla, 
        tbl_pais.bandeira from tbl_pais inner join tbl_nacionalidade_ator 
        on tbl_pais.id=tbl_nacionalidade_ator.pais_id inner join tbl_ator 
        on tbl_nacionalidade_ator.ator_id= tbl_ator.id where tbl_ator.id = ${idAtor};
        `
        let result = await prisma.$queryRawUnsafe(sql)

        if(result)
        return result
        else
        return false

    }catch(error){

        return false
    }
}

const insertPais = async (dadosPais) =>{

    let sql 
    try{
        if (dadosPais.data_relancamento != null && dadosPais.data_relancamento != "" && dadosPais.data_relancamento != undefined){
            sql = `INSERT INTO tbl_pais 
            (nome, gentilico, sigla) values
            ('${dadosPais.nome}', 
            '${dadosPais.gentilico}',
            '${dadosPais.sigla}'
            )`
        }else{
            sql = `INSERT INTO tbl_pais 
            (nome, gentilico, sigla, bandeira) values
            ('${dadosPais.nome}', 
            '${dadosPais.gentilico}',
            '${dadosPais.sigla}',
            '${dadosPais.bandeira}')`
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

const updatePais = async (id, dados) =>{

    let idPais = id
    let dadosPais = dados
    let sql

    try {
        if (dadosPais.data_relancamento != null && dadosPais.data_relancamento != "" && dadosPais.data_relancamento != undefined){

        sql = `update tbl_pais set 
        nome = '${dadosPais.nome}',
        gentilico = '${dadosPais.gentilico}',
        sigla = '${dadosPais.sigla}'
        where id = ${idPais}
        `
        }else{
            sql = `update tbl_pais set 
            nome = '${dadosPais.nome}',
            gentilico = '${dadosPais.gentilico}',
            sigla = '${dadosPais.sigla}',
            bandeira = '${dadosPais.bandeira}'
            where id = ${idPais}
            `
        }

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
        return true
        else
        return false
        
    } catch (error) {
        
        return false
    }
    
}

const deletePais = async (id) =>{
    
    try {
        let sql = `delete from tbl_pais where id=${id}`

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
    let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_pais limit 1`
    let result = await prisma.$queryRawUnsafe(sql)
    
    let id
    result.forEach( idPais => {
        id = Number(idPais.id)
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
    selectAllPaises,
    selectByIdPais,
    selectLastInsertId,
    selectByAtorPais,
    insertPais,
    deletePais,
    updatePais
}