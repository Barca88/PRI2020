var http = require('http')
var axios = require('axios')
var fs = require('fs')
var static = require('./static')

var { parse } = require('querystring')
const { fileURLToPath } = require('url')


// Funções auxilidares
function recuperaInfo(request, callback) {
    if (request.headers['content-type'] == 'application/x-www-form-urlencoded') {
        let body = ''
        request.on('data', bloco => {
            body += bloco.toString()
        })
        request.on('end', () => {
            console.log(body)
            callback(parse(body))
        })
    }
}

// Template para a página com to do List ------------------
function geraPagList(lista) {
    let pagHTML = `
              <div class="w3-container w3-teal">
                  <h2>To Do List</h2>
              </div>
              <table class="w3-table w3-bordered">
                  <tr>
                      <th>Data limite</th>
                      <th>Responsável</th>
                      <th>Descrição</th>
                      <th>Status</th>
                      <th></th>
                      <th></th>
                  </tr>
    `
    lista.forEach(a => {
        switch (a.status) {
            case "0":
                pagHTML += `
                <tr>
                  <td>${a.data}</td>
                  <td>${a.responsavel}</td>
                  <td>${a.descricao}</td>
                  <td>To Do</td>
                  <td><a href="/todos/Feito/${a.id}"class="w3-btn w3-green">Feito</a></td>
                  <td><a href="/todos/Apagar/${a.id}" class="w3-btn w3-red">Apagar</a></td>
                `
                break;
            case "1":
                pagHTML += `
                <tr class="w3-brown">
                  <td>${a.data}</td>
                  <td>${a.responsavel}</td>
                  <td>${a.descricao}</td>
                  <td>Done</td>
                  <td><a href="/todos/Desfazer/${a.id}"class="w3-btn w3-black">Desfazer</a></td>
                  <td><a href="/todos/Apagar/${a.id}" class="w3-btn w3-red">Apagar</a></td>
                `
                break;
            default:
                pagHTML += `<tr class="w3-red">
                <td>${a.data}</td>
                <td>${a.responsavel}</td>
                <td>${a.descricao}</td>
                <td>Deleted</td>
                <td><a href="/todos/Feito/${a.id}"class="w3-btn w3-green">Feito</a></td>
                <td><a href="/todos/Desfazer/${a.id}"class="w3-btn w3-black">Por Fazer</a></td>
                `
                break;
        }

        pagHTML += `</tr>`
    });

    pagHTML += `</table>`
    return pagHTML
}

// Template para o formulário de aluno ------------------
function geraFormList(responsaveis) {
    htmlPage = `
            <div class="w3-container w3-teal">
                <h5>Nova Tarefa</h5>
            </div>
            <form class="w3-container" action="/todos" method="POST">
            <div class="w3-row-padding">
            <div class="w3-half">
              <label class="w3-text-teal"><b>Data Limite</b></label>
              <input class="w3-input w3-border w3-light-grey" type="text" name="data" placeholder="aaaa/mm/dd">
            </div>
            <div class="w3-half">
                <label class="w3-text-teal"><b>Responsavel</b></label>
                <select class="w3-select w3-border w3-light-grey" name="responsavel">
                `

    responsaveis.forEach(r => {
        htmlPage += `<option value="${r.id}">${r.nome}</option>`
    });

    htmlPage += `</select>
                    </div>
                </div>
                <input type="hidden" name="status" value=0>
                <div class="w3-row-padding">
                <label class="w3-text-teal"><b>Descriçao</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="descricao">
                </div>
                <input class="w3-btn w3-border w3-light-grey" type="submit" value="Registar"/>
                <input class="w3-btn w3-border w3-light-grey" type="reset" value="Limpar valores"/>
            </form>
    `
    return htmlPage
}

function geraHead() {
    return `
    <html>
    <head>
        <title>To Do List</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
    `
}
function geraCauda() {
    return `
    </body>
    </html>
    `
}

function home(res) {
    axios.all([
        axios.get('http://localhost:3000/todos?_sort=status'),
        axios.get('http://localhost:3000/responsaveis')
    ]).then(axios.spread((toDos, resPons) => {
        todos = toDos.data
        responsaveis = resPons.data
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8', Location: 'http://localhost:8888/' })
        res.write(geraHead())
        res.write(geraFormList(responsaveis))
        res.write(geraPagList(todos))
        res.write(geraCauda())
        res.end()
    }))
        .catch((err) => {
            res.writeHead(203, { 'Content-Type': 'text/html;charset=utf-8', Location: 'http://localhost:8888/' })
            console.log('FAIL', err)
            res.end()
        })
}
//status == 1
function feito(res, a) {
    axios.get('http://localhost:3000/todos/' + a)
        .then(resp => {
            todo = resp.data
            todo.status = "1"
            axios.put(`http://localhost:3000/todos/${todo.id}`, todo)
                .then(respo => {
                    confirm.log('Feito ' + todo.id)
                    home(res)
                })
                .catch(error => {
                    console.log('Erro no put ' + error)
                    home(res)
                })
        })
        .catch(error => {
            console.log('Error no get do feito ' + error)
            home(res)
        })
}
//status == 2
function apagar(res, a) {
    axios.get('http://localhost:3000/todos/' + a)
        .then(resp => {
            todo = resp.data
            todo.status = "2"
            axios.put(`http://localhost:3000/todos/${todo.id}`, todo)
                .then(respo => {
                    console.log('Apagado ' + todo.id)
                    home(res)
                })
                .catch(error => {
                    console.log('Erro no put ' + error)
                    home(res)
                })
        })
        .catch(error => {
            console.log('Error no get do feito ' + error)
            home(res)
        })
}
//status == 0
function desfazer(res, a) {
    axios.get('http://localhost:3000/todos/' + a)
        .then(resp => {
            todo = resp.data
            todo.status = "0"
            axios.put(`http://localhost:3000/todos/${todo.id}`, todo)
                .then(respo => {
                    console.log('Desfeito ' + todo.id)
                    home(res)
                })
                .catch(error => {
                    console.log('Erro no put ' + error)
                    home(res)
                })
        })
        .catch(error => {
            console.log('Error no get do feito ' + error)
            home(res)
        })
}
// Criação do servidor
var toDoListServer = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substr(0, 16)
    console.log(req.method + " " + req.url + " " + d)
    // Request processing
    // Tests if a static resource is requested
    if (static.recursoEstatico(req)) {
        static.sirvoRecursoEstatico(req, res)
    } else {

        // Tratamento do pedido
        var listaUrl = req.url.split("/")
        listaUrl.shift()
        console.log(listaUrl)
        switch (req.method) {
            case "GET":
                switch (listaUrl[0]) {
                    case '':
                        home(res)
                        break
                    case 'todos':
                        if (listaUrl.length == 1) { home(res); break }
                        switch (listaUrl[1]) {
                            case 'Feito':
                                feito(res, listaUrl[2])
                                break
                            case 'Apagar':
                                apagar(res, listaUrl[2])
                                break
                            case 'Desfazer':
                                console.log('Desfazer')
                                desfazer(res, listaUrl[2])
                                break
                            default:
                                res.writeHead(203, { 'Content-Type': 'text/html;charset=utf-8' })
                                res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                                res.end()
                                break
                        }
                        break
                    default:
                        home(res)
                        break
                }
                break;

            case "POST":
                if ((req.url == "/") || (req.url == "/todos")) {
                    recuperaInfo(req, info => {
                        console.log('Post :' + JSON.stringify(info))
                        axios.post('http://localhost:3000/todos', info)
                            .then(resp => {
                                home(res)
                            })
                            .catch(erro => {
                                console.log('erro POST' + erro)
                                home(res)
                            })
                    })
                }
                else {
                    home(res)
                }
                break
            default:
                home(res)
        }
    }
})

toDoListServer.listen(8888)
console.log('Servidor à escuta na porta 8888...')