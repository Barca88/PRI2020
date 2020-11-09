var http = require('http')
var fs = require('fs')

var servidor = http.createServer(function (req, res) {

  var num = req.url.split("/")[1]

  if (req.url.match(/\/[1-9]+$/)) {
    console.log(num)
    fs.readFile('./site/id' + num + '.html', function (err, data) {
      if (err) {
        console.log("ERRO 404: Artigo não existente -> " + err)
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
        res.write("<p> Ficheiro inexistente. </p>")
        res.end()
      }
      else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.write(data)
        res.end()
      }
    })

  }

  else {
    console.log(num)
    if (num === "index.html" || num === "" || num === "index" || num === "favicon.ico") {
      console.log(num)
      fs.readFile('./site/index.html', function (err, data) {
        if (err) {
          console.log("ERRO 404: index não existente -> " + err)
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
          res.write("<p> Ficheiro inexistente. </p>")
          res.end()
        }
        else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
          res.write(data)
          res.end()
        }
      })

    }
    else {
      console.log("ERRO 404: não algarismos detectados\n  Server gonna BOOM!! ")
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
      res.write("<p> Ficheiro inexistente. </p>")
      res.end()
    }
  }
})

servidor.listen(7777)
console.log('Servidor à escuta na porta 7777')