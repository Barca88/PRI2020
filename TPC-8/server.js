var express = require('express')
var bodyParser = require('body-parser')
var templates = require('./html-templates')
var jsonfile = require('jsonfile')
var logger = require('morgan')
var fs = require('fs')

var multer = require('multer')
var upload = multer({ dest: 'uploads/' })

//create app
var app = express()

//set logger
app.use(logger('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//serve statics files
app.use(express.static('public'))

//GET Home page
app.get('/', function (req, res) {
    var d = new Date().toISOString().substr(0, 16)
    var files = jsonfile.readFileSync('./db.json')
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
    res.write(templates.fileList(files, d))
    res.end()
})

//GET Upload page
app.get('/files/upload', function (req, res) {
    var d = new Date().toISOString().substr(0, 16)
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
    res.write(templates.fileForm(d))
    res.end()
})

//GET Download
app.get('/download/:filename', function (req, res) {
    res.download(__dirname + '/public/fileStore/' + req.params.filename)
})

//POST Files
app.post('/files', upload.array('myFile', 12), function (req, res) {
    // req.file is the 'myFile' file
    // req.body will hold the text fields if any

    req.files.forEach(reqFile => {
        let quarentinePath = __dirname + '/' + reqFile.path
        let newPath = __dirname + '/public/fileStore/' + reqFile.originalname

        fs.rename(quarentinePath, newPath, function (err) {
            if (err) {
                res.writeHead(203, { 'Content-Type': 'text/html;charset=utf-8' })
                res.write('<p>Erro: ao mover o ficheiro da quarentena</p>')
                res.end()
            } else {
                var d = new Date().toISOString().substr(0, 16)
                var files = jsonfile.readFileSync('./db.json')

                files.push({
                    date: d,
                    name: reqFile.originalname,
                    mimetype: reqFile.mimetype,
                    size: reqFile.size
                })

                jsonfile.writeFileSync('./db.json', files)
            }
        })
    })

    res.redirect('/')
})


app.listen(8800, () => console.log('Servidor porta 8800...'))
