var http = require('http');
const axios = require('axios');


function caminho(lista) {
    size = lista.length;
    switch (size) {
        case 1:
            if (lista[0] == '') return 0;
            else if (lista[0] == 'alunos') return 1;
            else if (lista[0] == 'cursos') return 2;
            else if (lista[0] == 'instrumentos') return 3;
            else return -1; //caminho invalido
        case 2:
            if (lista[0] == 'alunos' && lista[1] == '') return 1;
            else if (lista[0] == 'cursos' && lista[1] == '') return 2;
            else if (lista[0] == 'instrumentos' && lista[1] == '') return 3;
            else if (lista[0] == 'alunos' && lista[1] != '') return 4;
            else if (lista[0] == 'cursos' && lista[1] != '') return 5;
            else if (lista[0] == 'instrumentos' && lista[1] != '') return 6;
            else return -1; //caminho invalido
        default:
            return -1;
    }
}


var servidor = http.createServer(function (req, res) {
    if (req.method == 'GET') {
        var listaUrl = req.url.split("/");
        listaUrl.shift();
        console.log(listaUrl);
        if (req.url == '/') {
            res.writeHead(200, {
                'Content-type': 'text/html; charset=utf-8'
            })
            res.write('<h2> Escola de Música </h2>');
            res.write('<ul>');
            res.write('<li><a href=\"http://localhost:3001/alunos/\"> Lista de Alunos </a>');
            res.write('<li><a href=\"http://localhost:3001/cursos/\"> Lista de Cursos </a>');
            res.write('<li><a href=\"http://localhost:3001/instrumentos/\"> Lista de Instrumentos </a>');
            res.write('</ul>');

        } else if (req.url == '/alunos' || req.url == '/alunos/') {
            res.writeHead(200, {
                'Content-type': 'text/html; charset=utf-8'
            })
            axios.get('http://localhost:3000/alunos')
                .then(resp => {
                    alunos = resp.data;
                    res.write('<ul>');
                    alunos.forEach(a => {
                        res.write(`<li>${a.id}, ${a.nome}, ${a.instrumento}</li>`);
                    });
                    res.write('</ul>');
                    res.write('<a href=\"http://localhost:3001/\">Indice</a>');
                    res.end();
                }).catch(error => {
                    console.log('Erro: ' + error);
                    res.write('<p> Não consegui obter a lista de alunos...</p>')
                    res.end();
                });

        } else if (req.url == '/cursos' || req.url == '/cursos/') {
            res.writeHead(200, {
                'Content-type': 'text/html; charset=utf-8'
            })
            axios.get('http://localhost:3000/cursos')
                .then(resp => {
                    cursos = resp.data;
                    res.write('<ul>');
                    cursos.forEach(c => {
                        res.write(`<li>${c.id}, ${c.designacao}, ${c.duracao}, ${c.instrumento.id}, ${c.instrumento.nomeIns} </li > `);
                    });
                    res.write('</ul>');
                    res.write('<a href=\"http://localhost:3001/\">Indice</a>');
                    res.end();
                }).catch(error => {
                    console.log('Erro: ' + error);
                    res.write('<p> Não consegui obter a lista de cursos...</p>')
                    res.end();
                });

        } else if (req.url == '/instrumentos' || req.url == '/instrumentos/') {
            res.writeHead(200, {
                'Content-type': 'text/html; charset=utf-8'
            })
            axios.get('http://localhost:3000/instrumentos')
                .then(resp => {
                    instrumentos = resp.data;
                    res.write('<ul>');
                    instrumentos.forEach(i => {
                        res.write(`<li> ${i.id}, ${i.nomeIns} </li> `);
                    });
                    res.write('</ul>');
                    res.write('<a href=\"http://localhost:3001/\">Indice</a>');
                    res.end();
                }).catch(error => {
                    console.log('Erro: ' + error);
                    res.write('<p> Não consegui obter a lista de instrumentos...</p>')
                    res.end();
                });

        }
    }
    else {
        //tratar os outros pedidos
    }
})


servidor.listen(3001)
console.log('Servidor à escuta na porta 3001')