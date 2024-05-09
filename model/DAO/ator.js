
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
    console.log(error)
    return false
   }
    
}

const selectByFilmeAtor = async (id) =>{

    let idFilme = id
    try{

        let sql = `select tbl_ator.id, tbl_ator.nome, tbl_ator.nome_artistico, tbl_ator.data_nascimento, 
                   tbl_ator.data_falecimento, tbl_ator.biografia, tbl_ator.foto
                    from tbl_ator 
                    inner join tbl_ator_filme on tbl_ator.id=tbl_ator_filme.ator_id 
                    inner join tbl_filme on tbl_ator_filme.filme_id=tbl_filme.id
                    where tbl_filme.id = ${idFilme};`

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
const insertAtor = async function (dadosAtor){

    try {
        
        let falecimento
        if (dadosAtor.data_falecimento != null && dadosAtor.data_falecimento != "" && dadosAtor.data_falecimento != undefined){
            falecimento = `'${dadosAtor.data_falecimento}'`
        }else{
            falecimento = null
        }

        let fotoAtor
        if (dadosAtor.foto != null && dadosAtor.foto != "" && dadosAtor.foto != undefined){
            fotoAtor = `'${dadosAtor.foto}'`
        }else{
            fotoAtor = null
        }


        let sql = `INSERT INTO tbl_ator 
            (nome, 
            nome_artistico, 
            data_nascimento, 
            data_falecimento, 
            biografia,
            foto) values
            ('${dadosAtor.nome}', 
            '${dadosAtor.nome_artistico}', 
            '${dadosAtor.data_nascimento}', 
             ${falecimento}, 
            '${dadosAtor.biografia}',
             ${fotoAtor}
        )`

    
        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return result
        else
            return false

    } catch (error) {
        console.log('sssss')
        console.log(error)
        return false
    }
}

const insertNacionalidadeAtor = async function(idAtor, idNacionalidade){

    try {
        
        let sql = `INSERT INTO tbl_nacionalidade_ator 
            (ator_id, pais_id) values
            ('${idAtor}', ${idNacionalidade})`

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

const updateAtor = async function (id, dados){

    let dadosAtor = dados

    try{

        let falecimento
        if (dadosAtor.data_falecimento != null && dadosAtor.data_falecimento != "" && dadosAtor.data_falecimento != undefined){
            falecimento = `'${dadosAtor.data_falecimento}'`
        }else{
            falecimento = null
        }

        let fotoAtor
        if (dadosAtor.foto != null && dadosAtor.foto != "" && dadosAtor.foto != undefined){
            fotoAtor = `'${dadosAtor.foto}'`
        }else{
            fotoAtor = null
        }

        let sql
            sql = `update tbl_ator set 
        
            nome = '${dadosAtor.nome}',
            nome_artistico = '${dadosAtor.nome_artistico}', 
            data_nascimento = '${dadosAtor.data_nascimento}',
            data_falecimento = ${falecimento},
            biografia = '${dadosAtor.biografia}',
            foto = ${fotoAtor}
        
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

const updateNacionalidadeAtor = async function (idAtor, idNacionalidadeNova, idNacionalidadeAntiga){
    try{

        console.log
        let sql
            sql = `update tbl_nacionalidade_ator set 
            pais_id = ${idNacionalidadeNova}
            where ator_id = ${idAtor} and pais_id = ${idNacionalidadeAntiga}`


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



const deleteNacionalidadeAtor = async function (id) {
    let idAtor = id

    try {
        let sql = `delete from tbl_nacionalidade_ator where ator_id = ${idAtor}`

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
    selectByFilmeAtor,
    selectLastInsertId,
    deleteAtor,
    insertAtor,
    updateAtor,
    insertNacionalidadeAtor,
    deleteNacionalidadeAtor,
    updateNacionalidadeAtor
}