var express = require('express');
var router = express.Router();

const Aluno = require('../controllers/aluno')

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Turma PRI de 2020' });
});

/* GET lista de alunos */
router.get('/alunos', (req, res) => {
    Aluno.listar()
        .then(dados => res.render('alunos', { lista: dados }))
        .catch(e => res.render('error', { error: e }))
})
/* GET Página para registar Aluno */
router.get('/alunos/registar', (req, res) => {
    res.render('registo');
})

/* GET Aluno especifico */
router.get('/alunos/:idAluno', (req, res) => {
    Aluno.consultar(req.params.idAluno)
        .then(dados => res.render('aluno', {
            infoaluno: dados
        }))
        .catch(e => res.render('error', {
            error: e
        }))
})

/* GET Pagina editar aluno */
router.get('/alunos/update/:idAluno', (req, res) => {
    Aluno.consultar(req.params.idAluno)
        .then(dados => res.render('editar', {
            infoaluno: dados
        }))
        .catch(e => res.render('error', {
            error: e
        }))
})


/* POST Atualizar aluno */
router.post("/alunos/:idAluno", function (req, res) {
    Aluno.atualizar(req.params.idAluno, req.body)
        .then(dados => {
            res.render('index')
        })
        .catch(e => res.render('error', {
            error: e
        }))
})



/* POST regista novo aluno */
router.post('/registar', (req, res) => {
    var aluno = {
        Número: req.body.Número,
        Nome: req.body.Nome,
        Git: req.body.Git
    }
    Aluno.inserir(aluno)
        .then(dados => res.redirect('/alunos'))
        .catch(e => res.render('error', {
            error: e
        }))
})

/*POST to delete aluno */
router.post("/delete/:idAluno", function (req, res) {
    Aluno.eliminar(req.params.idAluno)
        .then(dados => {
            res.render('deleted')
        })
        .catch(e => res.render('error', {
            error: e
        }))
})


module.exports = router;
