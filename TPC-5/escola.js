var http = require('http');
const axios = require('axios');


function caminho(lista) {
    size = lista.length;
    switch (size) {
        case 1:
            var subUrl = lista[0].split("?");
            if (lista[0] == '') return 0;
            else if (subUrl[0] == 'alunos') return 1;
            else if (subUrl[0] == 'cursos') return 2;
            else if (subUrl[0] == 'instrumentos') return 3;
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
    });
    res.write('<h1> Escola de Música </h1>');
    res.write('<ul>');
    res.write('<li><a href=\"http://localhost:3001/alunos?_page=1&_limit=20\"> Lista de Alunos </a>');
    res.write('<li><a href=\"http://localhost:3001/cursos?_page=1&_limit=20\"> Lista de Cursos </a>');
    res.write('<li><a href=\"http://localhost:3001/instrumentos?_page=1&_limit=10\\"> Lista de Instrumentos </a>');
    res.write('</ul>');
    res.end();
}

function alunosId(res, listaUrl) {
    axios.get('http://localhost:3000/alunos/' + listaUrl[1])
        .then(resp => {
            res.writeHead(200, {
                'Content-type': 'text/html; charset=utf-8'
            });
            aluno = resp.data;
            res.write(`<h1>Aluno</h1>`);
            res.write(`<p>Nome: ${aluno.nome}</p>`);
            res.write(`<p>Número de aluno: ${aluno.id}</p>`);
            res.write(`<p>Data de Nascimento: ${aluno.dataNasc}</p>`);
            res.write(`<p>Curso: <a href=\"http://localhost:3001/cursos/${aluno.curso}\">${aluno.curso}</a></p>`);
            res.write(`<p>Ano do Curso: ${aluno.anoCurso}</p>`);
            res.write(`<p>Instrumento: <a href=\"http://localhost:3001/instrumentos/${aluno.instrumento}\">${aluno.instrumento}</a></p>`);
            res.write('<p><a href=\"http://localhost:3001/alunos?_page=1&_limit=20\">Alunos</a></p>');
            res.write('<a href=\"http://localhost:3001/\">Indice</a>');
            res.end();
        }).catch(error => {
            res.writeHead(203, {
                'Content-type': 'text/html; charset=utf-8'
            });
            console.log('Erro: ' + error);
            res.write('<p> Aluno Não encontrado...</p>');
            res.write('<p><a href=\"http://localhost:3001/alunos?_page=1&_limit=20\">Alunos</a></p>');
            res.write('<a href=\"http://localhost:3001/\">Indice</a>');
            res.end();
        });
}
function cursosId(res, listaUrl) {
    axios.get('http://localhost:3000/cursos/' + listaUrl[1])
        .then(resp => {
            res.writeHead(200, {
                'Content-type': 'text/html; charset=utf-8'
            });
            curso = resp.data;
            res.write(`<h1>Curso</h1>`);
            res.write(`<p>Designação: ${curso.designacao}</p>`);
            res.write(`<p>Id: ${curso.id}</p>`);
            res.write(`<p>Duração do Curso: ${curso.duracao}</p>`);
            res.write(`<p>Instrumento: <a href=\"http://localhost:3001/instrumentos/${curso.instrumento.nomeIns}\">${curso.instrumento.nomeIns}</a></p>`);
            res.write('<p><a href=\"http://localhost:3001/cursos?_page=1&_limit=20\">Cursos</a></p>');
            res.write('<a href=\"http://localhost:3001/\">Indice</a>');
            res.end();
        }).catch(error => {
            res.writeHead(203, {
                'Content-type': 'text/html; charset=utf-8'
            });
            console.log('Erro: ' + error);
            res.write('<p> Curso Não encontrado...</p>');
            res.write('<p><a href=\"http://localhost:3001/cursos?_page=1&_limit=20\">Cursos</a></p>');
            res.write('<a href=\"http://localhost:3001/\">Indice</a>');
            res.end();
        });
}
function instrumentosId(res, listaUrl) {
    axios.get('http://localhost:3000/instrumentos?nomeIns=' + listaUrl[1])
        .then(resp => {
            res.writeHead(200, {
                'Content-type': 'text/html; charset=utf-8'
            });
            instrumento = resp.data[0];
            res.write(`<h1>Instrumento</h1>`);
            res.write(`<p>Nome: ${instrumento.nomeIns}</p>`);
            res.write(`<p>Id: ${instrumento.id}</p>`);
            res.write('<p><a href=\"http://localhost:3001/instrumentos?_page=1&_limit=10\">Instrumentos</a></p>');
            res.write('<a href=\"http://localhost:3001/\">Indice</a>');
            res.end();
        }).catch(error => {
            res.writeHead(203, {
                'Content-type': 'text/html; charset=utf-8'
            });
            console.log('Erro: ' + error);
            res.write('<p> Instrumento Não encontrado...</p>');
            res.write('<p><a href=\"http://localhost:3001/instrumentos?_page=1&_limit=10\">Instrumentos</a></p>');
            res.write('<a href=\"http://localhost:3001/\">Indice</a>');
            res.end();
        });
}
function getPage(path) {
    var lFirst = path.split("?");
    var lSecond = lFirst[1].split("&");
    console.log(lSecond);
    var r = lSecond[0].split("=")
    return r[1];
}
function getLast(link) {
    var lFirst = link.split(",");
    var size = lFirst.length;
    if (size == 3) {
        var lSecond = lFirst[2].split("&");
    } else {
        var lSecond = lFirst[3].split("&");
    }
    var r = lSecond[0].split("=")
    return r[1];
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
                    var page = getPage(listaUrl[0])
                    axios.get(`http://localhost:3000/alunos?_page=${page}&_limit=20`)
                        .then(resp => {
                            res.writeHead(200, {
                                'Content-type': 'text/html; charset=utf-8'
                            });
                            alunos = resp.data;
                            res.write('<h1>Alunos</h1>');
                            res.write('<ul>');
                            alunos.forEach(a => {
                                res.write(`<li><a href="http://localhost:3001/alunos/${a.id}">${a.id}, ${a.nome}, ${a.instrumento}</a></li>`);
                            });
                            res.write('</ul>');
                            res.write('<div>');
                            res.write('<a href=\"http://localhost:3001/alunos?_page=1&_limit=20\"> Inicio </a> ')
                            if (page > 1) {
                                res.write(`<a href=\"http://localhost:3001/alunos?_page=${page - 1}&_limit=20\"> Anterior </a> `)
                            }
                            var last = parseInt(getLast(resp.headers.link));
                            if (page < last) {
                                res.write(`<a href=\"http://localhost:3001/alunos?_page=${parseInt(page) + 1}&_limit=20\"> Próximo </a> `)
                            }
                            res.write(`<a href=\"http://localhost:3001/alunos?_page=${last}&_limit=20\"> Fim </a> `)
                            res.write('</div>');

                            res.write('<a href=\"http://localhost:3001/\">Indice</a>');
                            res.end();
                        }).catch(error => {
                            res.writeHead(203, {
                                'Content-type': 'text/html; charset=utf-8'
                            });
                            console.log('Erro: ' + error);
                            res.write('<p> Não consegui obter a lista de alunos...</p>')
                            res.end();
                        });
                    break;
                case 2:
                    var page = getPage(listaUrl[0])
                    axios.get(`http://localhost:3000/cursos?_page=${page}&_limit=20`)
                        .then(resp => {
                            res.writeHead(200, {
                                'Content-type': 'text/html; charset=utf-8'
                            });
                            cursos = resp.data;
                            res.write('<h1>Cursos</h1>');
                            res.write('<ul>');
                            cursos.forEach(c => {
                                res.write(`<li><a href="http://localhost:3001/cursos/${c.id}">${c.id}, ${c.designacao}, ${c.duracao}, ${c.instrumento.id}, ${c.instrumento.nomeIns} </a></li > `);
                            });
                            res.write('</ul>');
                            res.write('<div>');
                            res.write('<a href=\"http://localhost:3001/cursos?_page=1&_limit=20\"> Inicio </a> ')
                            if (page > 1) {
                                res.write(`<a href=\"http://localhost:3001/cursos?_page=${page - 1}&_limit=20\"> Anterior </a> `)
                            }
                            var last = parseInt(getLast(resp.headers.link));
                            if (page < last) {
                                res.write(`<a href=\"http://localhost:3001/cursos?_page=${parseInt(page) + 1}&_limit=20\"> Próximo </a> `)
                            }
                            res.write(`<a href=\"http://localhost:3001/cursos?_page=${last}&_limit=20\"> Fim </a> `)
                            res.write('</div>');
                            res.write('<a href=\"http://localhost:3001/\">Indice</a>');
                            res.end();
                        }).catch(error => {
                            res.writeHead(203, {
                                'Content-type': 'text/html; charset=utf-8'
                            });
                            console.log('Erro: ' + error);
                            res.write('<p> Não consegui obter a lista de cursos...</p>')
                            res.end();
                        });
                    break;
                case 3:
                    var page = parseInt(getPage(listaUrl[0]));
                    axios.get(`http://localhost:3000/instrumentos?_page=${page}&_limit=10`)
                        .then(resp => {
                            res.writeHead(200, {
                                'Content-type': 'text/html; charset=utf-8'
                            });
                            instrumentos = resp.data;
                            res.write('<h1>Instrumentos</h1>');
                            res.write('<ul>');
                            instrumentos.forEach(i => {
                                res.write(`<li><a href="http://localhost:3001/instrumentos/${i.nomeIns}"> ${i.id}, ${i.nomeIns}</a></li> `);
                            });
                            res.write('</ul>');
                            res.write('<div>');
                            res.write('<a href=\"http://localhost:3001/instrumentos?_page=1&_limit=10\"> Inicio </a> ')
                            if (page > 1) {
                                res.write(`<a href=\"http://localhost:3001/instrumentos?_page=${page - 1}&_limit=10\"> Anterior </a> `)
                            }
                            var last = parseInt(getLast(resp.headers.link));
                            console.log(getLast(resp.headers.link));
                            if (page < last) {
                                res.write(`<a href=\"http://localhost:3001/instrumentos?_page=${parseInt(page) + 1}&_limit=10\"> Próximo </a> `)
                            }
                            res.write(`<a href=\"http://localhost:3001/instrumentos?_page=${last}&_limit=10\"> Fim </a> `)
                            res.write('</div>');
                            res.write('<a href=\"http://localhost:3001/\">Indice</a>');
                            res.end();
                        }).catch(error => {
                            res.writeHead(203, {
                                'Content-type': 'text/html; charset=utf-8'
                            });
                            console.log('Erro: ' + error);
                            res.write('<p> Não consegui obter a lista de instrumentos...</p>')
                            res.end();
                        });
                    break;
                case 4:
                    alunosId(res, listaUrl);
                    break;
                case 5:
                    cursosId(res, listaUrl);
                    break;
                case 6:
                    instrumentosId(res, listaUrl);
                    break;
            }
        }
    }
});


servidor.listen(3001);
console.log('Servidor à escuta na porta 3001');