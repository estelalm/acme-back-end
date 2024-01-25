var acmeFilmes = require('../modulo/filmes.js')

let filmes = acmeFilmes.filmes.filmes

const getFilmes = function () {

    let JSONfilmes  = {}
    let arrayFilmes = []

    let status = false

    filmes.forEach( filme => {

        let filmeJSON = {}

        filmeJSON.id = filme.id
        filmeJSON.sinopse = filme.sinopse
        filmeJSON.duracao = filme.duracao
        filmeJSON.data_lancamento = filme.data_lancamento

        if(!(filme.data_relancamento == null))
        filmeJSON.data_relancamento = filme.data_relancamento

        filmeJSON.foto_capa = filme.foto_capa
        filmeJSON.valor_unitario = filme.valor_unitario


        // arrayFilmes.push(filme)
        arrayFilmes.push(filmeJSON)
        status = true
    })

    JSONfilmes.status = status
    JSONfilmes.filmes = arrayFilmes

    return JSONfilmes

}

const getFilmesId = function (idFilme) {

    let JSONfilme = {}

    let filmeId = idFilme

    let status = false

    filmes.forEach(filme =>{

        let filmeJSON = {}

        if(filmeId == filme.id){
            status = true

            filmeJSON.id = filme.id
            filmeJSON.sinopse = filme.sinopse
            filmeJSON.duracao = filme.duracao
            filmeJSON.data_lancamento = filme.data_lancamento
    
            if(!(filme.data_relancamento == null))
            filmeJSON.data_relancamento = filme.data_relancamento
    
            filmeJSON.foto_capa = filme.foto_capa
            filmeJSON.valor_unitario = filme.valor_unitario

            JSONfilme.filme = filmeJSON
        }
        

    })

    JSONfilme.status = status

    return JSONfilme
}


module.exports = {
    getFilmes,
    getFilmesId
}