
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient

const selectFilmesAvaliadosUsuario = async function(idUsuario){
    try {
        let sql = `select filme_id as filme, avaliacao from tbl_avaliacao where usuario_id = ${idUsuario}`
        
        let rsFilmes = await prisma.$queryRawUnsafe(sql)
        return rsFilmes
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    selectFilmesAvaliadosUsuario
}