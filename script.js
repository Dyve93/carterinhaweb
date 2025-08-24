// URL da sua API do Google Apps Script
// **SUBSTITUA AQUI PELA SUA URL DE IMPLANTAÇÃO!**
const SCRIPT_URL = 'AKfycbyrYkDFb5HUXtOMRCMMeI8o21W4obq66wMI9y4KwESPyIrt7UNeHtsg0qhG-Xzl31sW';

// Função chamada pelo Google após o login
function handleCredentialResponse(response) {
    // O Google retorna um token, que precisa ser decodificado para extrair as informações
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

    // Envie o e-mail do usuário para o Apps Script para verificação
    fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ email: emailUsuario }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.sucesso) {
            // Se o Apps Script confirmou que o e-mail é de um membro
            document.getElementById('nome-membro').textContent = nomeUsuario;
            document.getElementById('foto-membro').src = urlFoto;
            
            // Oculta a tela de login e mostra a carteirinha
            document.getElementById('login-container').classList.add('hidden');
            document.getElementById('carteirinha-container').classList.remove('hidden');
        } else {
            // Se o Apps Script retornou um erro (não é membro)
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
