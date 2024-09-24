const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const jsonfile = require('jsonfile');

const app = express();
const PORT = 3000;

function generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
// Configurar o multer para lidar com uploads de arquivos
const upload = multer({
  dest: path.join(__dirname, 'audios'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'audios'))); // Servir arquivos de áudio

// Rota para servir o arquivo JSON
app.get('/audios/data.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'audios', 'data.json'));
});

// Rota para lidar com uploads de arquivos
app.post('/upload-audio', upload.single('audio'), (req, res) => {
  const audioFile = req.file;
  const truePhrase = req.body.truePhrase;

  // Salvar o áudio no sistema de arquivos
  fs.rename(audioFile.path, path.join(__dirname, 'audios', audioFile.originalname), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao salvar o áudio');
    } else {
      // Atualizar o JSON
      const jsonData = jsonfile.readFileSync(path.join(__dirname, 'audios', 'data.json'));
      jsonData.push({
        id: generateGuid(),
        src: audioFile.originalname,
        truePhrase: truePhrase,
      });
      jsonfile.writeFileSync(path.join(__dirname, 'audios', 'data.json'), jsonData);
      res.send('Áudio salvo com sucesso!');
    }
  });
});

// Ignorar favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
