const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'audios'))); // Servir arquivos de áudio

// Rota para servir o arquivo JSON
app.get('/audios/data.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'audios', 'data.json'));
});

// Ignorar favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
