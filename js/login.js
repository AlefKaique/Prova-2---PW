
function Login() {
    const emailCaixaTexto = document.getElementById('email').value;
    const senhaCaixaTexto = document.getElementById('password').value;

    if (!emailCaixaTexto || !senhaCaixaTexto) {
        alert('Preencha todos os campos');
        return;
    }

    if (emailCaixaTexto === 'admin@gmail.com' && senhaCaixaTexto === 'admin') {
        alert('Usuário e senha corretos!');
        window.location.href = 'index.html';
    } else {
        alert('Usuário ou senha inválidos');
    }
}

if (switchToRegisterLink) {
    switchToRegisterLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = 'cadastrar.html';
    });
}
