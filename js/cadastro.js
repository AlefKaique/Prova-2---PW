const registerForm = document.getElementById('register-form');
const messageContainer = document.getElementById('message-container');
const cepInput = document.getElementById('cep');
const logradouroInput = document.getElementById('logradouro');
const bairroInput = document.getElementById('bairro');
const cidadeInput = document.getElementById('cidade');
const ufInput = document.getElementById('uf');

function showMessage(message, type = 'success') {
    messageContainer.textContent = message;
    messageContainer.classList.remove('success', 'error');
    messageContainer.classList.add(type, 'show');
    messageContainer.style.display = 'block';

    setTimeout(() => {
        messageContainer.classList.remove('show');
        messageContainer.style.display = 'none';
    }, 3000);
}

function buscarEndereco() {
    const cep = cepInput.value.replace(/\D/g, '');
    if (cep.length !== 8) {
        showMessage('CEP inválido.', 'error');
        limparEndereco();
        return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                showMessage('CEP não encontrado.', 'error');
                limparEndereco();
                return;
            }
            logradouroInput.value = data.logradouro;
            bairroInput.value = data.bairro;
            cidadeInput.value = data.localidade;
            ufInput.value = data.uf;
        })
        .catch(() => {
            showMessage('Erro ao buscar o endereço.', 'error');
            limparEndereco();
        });
}

function limparEndereco() {
    logradouroInput.value = '';
    bairroInput.value = '';
    cidadeInput.value = '';
    ufInput.value = '';
}

registerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = event.target.name.value.trim();
    const email = event.target.email.value.trim();
    const password = event.target.password.value.trim();
    const cep = cepInput.value.trim();
    const logradouro = logradouroInput.value.trim();
    const numero = document.getElementById('numero').value.trim();
    const complemento = document.getElementById('complemento').value.trim();
    const bairro = bairroInput.value.trim();
    const cidade = cidadeInput.value.trim();
    const uf = ufInput.value.trim();

    if (name === '' || email === '' || password === '' || cep === '' || logradouro === '' || numero === '' || bairro === '' || cidade === '' || uf === '') {
        showMessage('Por favor, preencha todos os campos.', 'error');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const emailExists = users.some(user => user.email === email);

    if (emailExists) {
        showMessage('Email já cadastrado. Por favor, use outro email.', 'error');
        return;
    }

    const newUser = {
        name,
        email,
        password,
        cep,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        uf
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    showMessage('Cadastro realizado com sucesso!', 'success');

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);

    registerForm.reset();
});
