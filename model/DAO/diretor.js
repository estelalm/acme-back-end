
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient

const selectAllDiretores = async function (){

    try {
        let sql = `select * from tbl_diretor`

        let rsDiretores = await prisma.$queryRawUnsafe(sql)
        return rsDiretores
    } catch (error) {
        console.log(error)
        return false
    }
}

const selectByIdDiretor = async function (id){

   try {

     let sql = `select * from tbl_diretor where id = ${id}`

     let rsDiretor = await prisma.$queryRawUnsafe(sql)

     return rsDiretor

   } catch (error) {
    
    return false
   }
    
}

const insertDiretor = async function (dadosDiretor){

    try {
        
        let falecimento
        if (dadosDiretor.data_falecimento != null && dadosDiretor.data_falecimento != "" && dadosDiretor.data_falecimento != undefined){
            falecimento = `'${dadosDiretor.data_falecimento}'`
        }else{
            falecimento = null
        }

        let fotoDiretor
        if (dadosDiretor.foto != null && dadosDiretor.foto != "" && dadosDiretor.foto != undefined){
            fotoDiretor = `'${dadosDiretor.foto}'`
        }else{
            fotoDiretor = null
        }

        let sql
            sql = `INSERT INTO tbl_diretor 
            (nome, 
            nome_artistico, 
            data_nascimento, 
            data_falecimento, 
            biografia,
            foto) values
            ('${dadosDiretor.nome}', 
            '${dadosDiretor.nome_artistico}', 
            '${dadosDiretor.data_nascimento}', 
             ${falecimento}, 
            '${dadosDiretor.biografia}',
             ${fotoDiretor}
        )`
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

const insertNacionalidadeDiretor = async function(idDiretor, idNacionalidade){

    try {

        let sql = `INSERT INTO tbl_nacionalidade_diretor 
            (diretor_id, pais_id) values
            ('${idDiretor}', ${idNacionalidade})`

        let result = await prisma.$executeRawUnsafe(sql)

        
        if(result){
            return true
        }
            
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }

}

const updateDiretor = async function (id, dados){

    let dadosDiretor = dados

    try{

        let falecimento
        if (dadosDiretor.data_falecimento != null && dadosDiretor.data_falecimento != "" && dadosDiretor.data_falecimento != undefined){
            falecimento = `'${dadosDiretor.data_falecimento}'`
        }else{
            falecimento = null
        }

        let fotoDiretor
        if (dadosDiretor.foto != null && dadosDiretor.foto != "" && dadosDiretor.foto != undefined){
            fotoDiretor = `'${dadosDiretor.foto}'`
        }else{
            fotoDiretor = null
        }

        let sql
            sql = `update tbl_diretor set 
        
            nome = '${dadosDiretor.nome}',
            nome_artistico = '${dadosDiretor.nome_artistico}', 
            data_nascimento = '${dadosDiretor.data_nascimento}',
            data_falecimento = ${falecimento},
            biografia = '${dadosDiretor.biografia}',
            foto = ${fotoDiretor}
        
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

const updateNacionalidadeDiretor = async function (idDiretor, idPais, idPaisAntigo){
    try{

        let sql
            sql = `update tbl_nacionalidade_diretor set 
            pais_id = ${idPais}
            where diretor_id = ${idDiretor} and pais_id = ${idPaisAntigo}`


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

const deleteDiretor = async function (id){
    
    let idDiretor = id

    try {
        let sql = `delete from tbl_diretor where id = ${idDiretor}`

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



const deleteNacionalidadeDiretor = async function (id) {
    let idDiretor = id

    try {
        let sql = `delete from tbl_nacionalidade_diretor where diretor_id = ${idDiretor}`

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

const selectLastInsertId = async function () {

    try{
    let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_diretor limit 1`
    let result = await prisma.$queryRawUnsafe(sql)
    
    let id
    result.forEach( idDiretor => {
        id = Number(idDiretor.id)
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
    selectAllDiretores,
    selectByIdDiretor,
    selectLastInsertId,
    deleteDiretor,
    insertDiretor,
    updateDiretor,
    insertNacionalidadeDiretor,
    deleteNacionalidadeDiretor,
    updateNacionalidadeDiretor
}