import Feedback from './feedback.js';

let audioDatabase = [];
let currentAudioId = null;
const feedback = new Feedback('feedback');

// Função para carregar os dados do JSON
async function loadAudioData() {
  try {
    const response = await fetch('/audios/data.json');
    if (!response.ok) {
      throw new Error('Erro ao carregar o arquivo JSON');
    }
    audioDatabase = await response.json();
    if (audioDatabase.length === 0) {
      throw new Error('Nenhum dado encontrado no arquivo JSON');
    }
  } catch (error) {
    console.error('Erro ao carregar os dados:', error);
    alert('Erro ao carregar os dados dos áudios. Verifique o console para mais detalhes.');
  }
}

// Função para carregar um áudio aleatório
function loadRandomAudio() {
  if (audioDatabase.length === 0) {
    alert('Os dados dos áudios não foram carregados corretamente.');
    return;
  }

  let randomIndex;
  let audioData;
  do {
    randomIndex = Math.floor(Math.random() * audioDatabase.length);
    audioData = audioDatabase[randomIndex];
  } while (audioData.id === currentAudioId);

  currentAudioId = audioData.id;
  const fakePhrases = getFakePhrases(randomIndex);

  document.getElementById('audio-source').src = audioData.src;
  document.getElementById('audio').load();
  document.getElementById('audio').style.display = 'block';

  const phrasesContainer = document.getElementById('phrases-container');
  phrasesContainer.innerHTML = '';

  const allPhrases = [audioData.truePhrase, ...fakePhrases];
  shuffleArray(allPhrases);

  allPhrases.forEach(phrase => {
    const phraseElement = document.createElement('div');
    phraseElement.className = 'phrase';
    phraseElement.innerText = phrase;
    phraseElement.onclick = () => checkAnswer(phrase, audioData.truePhrase);
    phrasesContainer.appendChild(phraseElement);
  });
}

// Função para pegar duas frases falsas de outros áudios
function getFakePhrases(excludeIndex) {
  const phrases = [];
  while (phrases.length < 2) {
    const randomIndex = Math.floor(Math.random() * audioDatabase.length);
    if (randomIndex !== excludeIndex && !phrases.includes(audioDatabase[randomIndex].truePhrase)) {
      phrases.push(audioDatabase[randomIndex].truePhrase);
    }
  }
  return phrases;
}

// Função para verificar a resposta
function checkAnswer(selectedPhrase, truePhrase) {
  if (selectedPhrase === truePhrase) {
    feedback.showFeedback('Correto!', true);
    loadRandomAudio();
  } else {
    feedback.showFeedback('Errado. Tente novamente.', false);
  }
}

// Função para embaralhar um array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Função para carregar o áudio do usuário
function uploadAudio() {
  document.getElementById('upload-container').style.display = 'block';
}

// Função para carregar o arquivo de áudio do usuário
function uploadAudioFile() {
    const fileInput = document.getElementById('audio-file');
    const truePhraseInput = document.getElementById('true-phrase');
    const file = fileInput.files[0];
    const truePhrase = truePhraseInput.value;
  
    if (!file || !truePhrase) {
      feedback.showFeedback('Por favor, selecione um arquivo de áudio e insira a frase correta.', false);
      return;
    }
  
    const formData = new FormData();
    formData.append('audio', file);
    formData.append('truePhrase', truePhrase);
  
    fetch('/upload-audio', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.text())
      .then(message => {
        feedback.showFeedback(message, true);
        loadRandomAudio();
        document.getElementById('upload-container').style.display = 'none';
      })
      .catch(error => {
        console.error('Erro ao carregar o áudio:', error);
        feedback.showFeedback('Erro ao carregar o áudio. Tente novamente.', false);
      });
  }
  
// Carregar os dados ao carregar a página
window.onload = loadAudioData;

// Anexar funções ao objeto window para que estejam disponíveis globalmente
window.loadRandomAudio = loadRandomAudio;
window.uploadAudio = uploadAudio;
window.uploadAudioFile = uploadAudioFile;
