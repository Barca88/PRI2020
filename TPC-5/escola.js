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

function home(res) {
    res.writeHead(200, {
        'Content-type': 'text/html; charset=utf-8'
    })
    res.write('<h1> Escola de Música </h1>');
    res.write('<ul>');
    res.write('<li><a href=\"http://localhost:3001/alunos/\"> Lista de Alunos </a>');
    res.write('<li><a href=\"http://localhost:3001/cursos/\"> Lista de Cursos </a>');
    res.write('<li><a href=\"http://localhost:3001/instrumentos/\"> Lista de Instrumentos </a>');
    res.write('</ul>');
    res.end();
}

function alunosId(res, listaUrl) {
    axios.get('http://localhost:3000/alunos/' + listaUrl[1])
        .then(resp => {
            res.writeHead(200, {
                'Content-type': 'text/html; charset=utf-8'
            })
            aluno = resp.data;
            res.write(`<h1>Aluno</h1>`);
            res.write(`<p>Nome: ${aluno.nome}</p>`);
            res.write(`<p>Número de aluno: ${aluno.id}</p>`);
            res.write(`<p>Data de Nascimento: ${aluno.dataNasc}</p>`);
            res.write(`<p>Curso: <a href=\"http://localhost:3001/cursos/${aluno.curso}\">${aluno.curso}</a></p>`);
            res.write(`<p>Ano do Curso: ${aluno.anoCurso}</p>`);
            res.write(`<p>Instrumento: <a href=\"http://localhost:3001/instrumentos/${aluno.instrumento}\">${aluno.instrumento}</a></p>`);
            res.write('<p><a href=\"http://localhost:3001/alunos\">Alunos</a></p>');
            res.write('<a href=\"http://localhost:3001/\">Indice</a>');
            res.end();
        }).catch(error => {
            res.writeHead(203, {
                'Content-type': 'text/html; charset=utf-8'
            })
            console.log('Erro: ' + error);
            res.write('<p> Aluno Não encontrado...</p>')
            res.write('<p><a href=\"http://localhost:3001/alunos\">Alunos</a></p>');
            res.write('<a href=\"http://localhost:3001/\">Indice</a>');
            res.end();
        });
}
function cursosId(res, listaUrl) {
    axios.get('http://localhost:3000/cursos/' + listaUrl[1])
        .then(resp => {
            res.writeHead(200, {
                'Content-type': 'text/html; charset=utf-8'
            })
            curso = resp.data;
            res.write(`<h1>Curso</h1>`);
            res.write(`<p>Designação: ${curso.designacao}</p>`);
            res.write(`<p>Id: ${curso.id}</p>`);
            res.write(`<p>Duração do Curso: ${curso.duracao}</p>`);
            res.write(`<p>Instrumento: <a href=\"http://localhost:3001/instrumentos/${curso.instrumento.nomeIns}\">${curso.instrumento.nomeIns}</a></p>`);
            res.write('<p><a href=\"http://localhost:3001/cursos\">Cursos</a></p>');
            res.write('<a href=\"http://localhost:3001/\">Indice</a>');
            res.end();
        }).catch(error => {
            res.writeHead(203, {
                'Content-type': 'text/html; charset=utf-8'
            })
            console.log('Erro: ' + error);
            res.write('<p> Curso Não encontrado...</p>')
            res.write('<p><a href=\"http://localhost:3001/cursos\">Cursos</a></p>');
            res.write('<a href=\"http://localhost:3001/\">Indice</a>');
            res.end();
        });
}
function instrumentosId(res, listaUrl) {
    axios.get('http://localhost:3000/instrumentos?nomeIns=' + listaUrl[1])
        .then(resp => {
            res.writeHead(200, {
                'Content-type': 'text/html; charset=utf-8'
            })
            instrumento = resp.data[0];
            res.write(`<h1>Instrumento</h1>`);
            res.write(`<p>Nome: ${instrumento.nomeIns}</p>`);
            res.write(`<p>Id: ${instrumento.id}</p>`);
            res.write('<p><a href=\"http://localhost:3001/instrumentos\">Instrumentos</a></p>');
            res.write('<a href=\"http://localhost:3001/\">Indice</a>');
            res.end();
        }).catch(error => {
            res.writeHead(203, {
                'Content-type': 'text/html; charset=utf-8'
            })
            console.log('Erro: ' + error);
            res.write('<p> Instrumento Não encontrado...</p>')
            res.write('<p><a href=\"http://localhost:3001/instrumentos\">Instrumentos</a></p>');
            res.write('<a href=\"http://localhost:3001/\">Indice</a>');
            res.end();
        });
}

var servidor = http.createServer(function (req, res) {
    if (req.method == 'GET') {
        var listaUrl = req.url.split("/");
        listaUrl.shift();
        console.log(listaUrl);
        if (req.url == '/') {
            home(res);

        } else {
            var path = caminho(listaUrl)
            console.log(path);

            switch (path) {
                case 0:
                    home(res);
                    break;
                case 1:
                    res.writeHead(200, {
                        'Content-type': 'text/html; charset=utf-8'
                    })
                    axios.get('http://localhost:3000/alunos')
                        .then(resp => {
                            alunos = resp.data;
                            res.write('<h1>Alunos</h1>');
                            res.write('<ul>');
                            alunos.forEach(a => {
                                res.write(`<li><a href="http://localhost:3001/alunos/${a.id}">${a.id}, ${a.nome}, ${a.instrumento}</a></li>`);
                            });
                            res.write('</ul>');
                            res.write('<a href=\"http://localhost:3001/\">Indice</a>');
                            res.end();
                        }).catch(error => {
                            console.log('Erro: ' + error);
                            res.write('<p> Não consegui obter a lista de alunos...</p>')
                            res.end();
                        });
                    break;
                case 2:
                    res.writeHead(200, {
                        'Content-type': 'text/html; charset=utf-8'
                    })
                    axios.get('http://localhost:3000/cursos')
                        .then(resp => {
                            cursos = resp.data;
                            res.write('<h1>Cursos</h1>');
                            res.write('<ul>');
                            cursos.forEach(c => {
                                res.write(`<li><a href="http://localhost:3001/cursos/${c.id}">${c.id}, ${c.designacao}, ${c.duracao}, ${c.instrumento.id}, ${c.instrumento.nomeIns} </a></li > `);
                            });
                            res.write('</ul>');
                            res.write('<a href=\"http://localhost:3001/\">Indice</a>');
                            res.end();
                        }).catch(error => {
                            console.log('Erro: ' + error);
                            res.write('<p> Não consegui obter a lista de cursos...</p>')
                            res.end();
                        });
                    break;
                case 3:
                    res.writeHead(200, {
                        'Content-type': 'text/html; charset=utf-8'
                    })
                    axios.get('http://localhost:3000/instrumentos')
                        .then(resp => {
                            instrumentos = resp.data;
                            res.write('<h1>Instrumentos</h1>');
                            res.write('<ul>');
                            instrumentos.forEach(i => {
                                res.write(`<li><a href="http://localhost:3001/instrumentos/${i.nomeIns}"> ${i.id}, ${i.nomeIns}</a></li> `);
                            });
                            res.write('</ul>');
                            res.write('<a href=\"http://localhost:3001/\">Indice</a>');
                            res.end();
                        }).catch(error => {
                            console.log('Erro: ' + error);
                            res.write('<p> Não consegui obter a lista de instrumentos...</p>')
                            res.end();
                        });
                    break;
                case 4:
                    console.log(4);
                    alunosId(res, listaUrl);
                    break;
                case 5:
                    console.log(5);
                    cursosId(res, listaUrl);
                    break;
                case 6:
                    console.log(6);
                    instrumentosId(res, listaUrl);
                    break;
            }
        }
    }
})


servidor.listen(3001)
console.log('Servidor à escuta na porta 3001')