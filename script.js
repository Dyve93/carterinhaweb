// Substitua 'SUA_URL_DO_APPS_SCRIPT_AQUI' pela URL da sua API
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyrYkDFb5HUXtOMRCMMeI8o21W4obq66wMI9y4KwESPyIrt7UNeHtsg0qhG-Xzl31sW/exec';

function handleCredentialResponse(response) {
    const token = response.credential;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const data = JSON.parse(atob(base64));

    const emailUsuario = data.email;
    const nomeUsuario = data.name;
    const urlFoto = data.picture;

    const mensagemElement = document.getElementById('mensagem');
    mensagemElement.textContent = "Verificando se você é um membro...";
    mensagemElement.style.color = "#3498db";

    // Verifique e ajuste este bloco de código
    fetch(SCRIPT_URL, {
        method: 'POST', // <-- Este deve ser 'POST'
        body: JSON.stringify({ email: emailUsuario }), // <-- Dados a serem enviados em JSON
        headers: {
            'Content-Type': 'application/json' // <-- Crucial: avisa ao Apps Script que o dado é JSON
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            document.getElementById('nome-membro').textContent = nomeUsuario;
            document.getElementById('foto-membro').src = urlFoto;
            
            document.getElementById('login-container').classList.add('hidden');
            document.getElementById('carteirinha-container').classList.remove('hidden');
        } else {
            mensagemElement.textContent = data.mensagem;
            mensagemElement.style.color = "#e74c3c";
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        mensagemElement.textContent = "Ocorreu um erro. Tente novamente.";
        mensagemElement.style.color = "#e74c3c";
    });
}
