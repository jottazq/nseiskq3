const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 999o;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/nmr', (req, res) => {
  res.sendFile(path.join(__dirname, './public/', 'nmr.html'));
});

app.post('/nmr', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'respostasNmr.json');
  const novaResposta = {
    resposta: req.body.resposta,
    horario: req.body.horario,
  };

   fs.readFile(filePath, 'utf8', (err, data) => {
    let respostas = [];
    if (!err) {
      try {
        respostas = JSON.parse(data);
      } catch (e) {
        console.error('Erro ao parsear o arquivo:', e);
      }
    }

    respostas.push(novaResposta);
    fs.writeFile(filePath, JSON.stringify(respostas, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Erro ao salvar resposta:', err);
        return res.status(500).json({ message: 'Erro ao salvar resposta.' });
      }
      res.status(200).json({ message: 'Resposta salva com sucesso!' });
    });
  });
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}: http://localhost:${PORT}`);
});