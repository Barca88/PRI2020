else if (req.url == '/alunos' || req.url == '/alunos/') {
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

