document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    const reservaForm = document.getElementById('reserva-form');
    const listaCarrinho = document.getElementById('lista-carrinho');
    const totalCarrinhoElement = document.getElementById('total-carrinho');
    const formErro = document.getElementById('form-erro');
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    // Modais de Login e Cadastro
    const loginModal = document.getElementById('loginModal');
    const cadastroModal = document.getElementById('cadastroModal');
    const loginBtn = document.getElementById('loginBtn');
    const cadastroBtn = document.getElementById('cadastroBtn');
    const closeButtons = document.querySelectorAll('.close-button');
    const cadastroForm = document.getElementById('cadastroForm');
    const cadastroSucesso = document.getElementById('cadastroSucesso');
    const cadastroErro = document.getElementById('cadastroErro');
    const loginForm = document.getElementById('loginForm');
    const loginErro = document.getElementById('loginErro');

    // Menu Responsivo
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });

    // Abrir Modal de Login
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = "block";
    });

    // Abrir Modal de Cadastro
    cadastroBtn.addEventListener('click', () => {
        cadastroModal.style.display = "block";
    });

    // Fechar Modais ao clicar no botão de fechar
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            loginModal.style.display = "none";
            cadastroModal.style.display = "none";
            cadastroSucesso.style.display = "none";
            cadastroErro.textContent = '';
            loginErro.textContent = '';
            cadastroForm.reset();
            loginForm.reset();
        });
    });

    // Fechar Modais ao clicar fora da modal
    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = "none";
            loginErro.textContent = '';
            loginForm.reset();
        }
        if (event.target === cadastroModal) {
            cadastroModal.style.display = "none";
            cadastroSucesso.style.display = "none";
            cadastroErro.textContent = '';
            cadastroForm.reset();
        }
    });

    // Simular Reserva (Apenas para fins de interface - não envia dados)
    const botoesSimularReserva = document.querySelectorAll('.simular-reserva');
    botoesSimularReserva.forEach(botao => {
        botao.addEventListener('click', function() {
            const destino = this.dataset.destino;
            document.getElementById('destino').value = destino;
            document.getElementById('reservas').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Renderizar Carrinho
    function renderizarCarrinho() {
        listaCarrinho.innerHTML = '';
        let total = 0;
        carrinho.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${item.destino} - ${new Date(item.data).toLocaleDateString()} - ${item.passageiros} passageiro(s)</span>
                <button data-index="${index}">Remover</button>
            `;
            listaCarrinho.appendChild(listItem);
            total += calcularPreco(item.destino, item.passageiros);
        });
        totalCarrinhoElement.textContent = `Total: R$ ${total.toFixed(2)}`;

        // Atualizar o armazenamento local
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
    }

    // Calcular Preço (Simulado)
    function calcularPreco(destino, passageiros) {
        let precoBase = 0;
        switch (destino) {
            case 'Marte':
                precoBase = 5000;
                break;
            case 'Lua':
                precoBase = 3000;
                break;
            case 'Estação Orbital':
                precoBase = 7000;
                break;
        }
        return precoBase * passageiros;
    }

    // Adicionar ao Carrinho
    reservaForm.addEventListener('submit', function(event) {
        event.preventDefault();
        formErro.textContent = '';

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const destino = document.getElementById('destino').value;
        const data = document.getElementById('data').value;
        const passageiros = parseInt(document.getElementById('passageiros').value);

        if (!nome || !email || !destino || !data || isNaN(passageiros) || passageiros < 1) {
            formErro.textContent = 'Por favor, preencha todos os campos corretamente.';
            return;
        }

        carrinho.push({ nome, email, destino, data, passageiros });
        renderizarCarrinho();
        this.reset(); // Limpar o formulário após adicionar
    });

    // Remover do Carrinho
    listaCarrinho.addEventListener('click', function(event) {
        if (event.target.tagName === 'BUTTON') {
            const index = parseInt(event.target.dataset.index);
            carrinho.splice(index, 1);
            renderizarCarrinho();
        }
    });

    // Salvar Dados de Cadastro no localStorage e Ir para Login
    cadastroForm.addEventListener('submit', function(event) {
        event.preventDefault();
        cadastroErro.textContent = '';
        cadastroSucesso.style.display = 'none';

        const nome = document.getElementById('cadastroNome').value;
        const email = document.getElementById('cadastroEmail').value;
        const senha = document.getElementById('cadastroSenha').value;

        if (!nome || !email || !senha) {
            cadastroErro.textContent = 'Por favor, preencha todos os campos de cadastro.';
            return;
        }

        const usuariosCadastrados = JSON.parse(localStorage.getItem('usuarios')) || [];

        // Verificar se o email já existe
        if (usuariosCadastrados.some(usuario => usuario.email === email)) {
            cadastroErro.textContent = 'Este email já está cadastrado.';
            return;
        }

        usuariosCadastrados.push({ nome, email, senha });
        localStorage.setItem('usuarios', JSON.stringify(usuariosCadastrados));
        cadastroSucesso.style.display = 'block';

        // Após o cadastro bem-sucedido, fechar o modal de cadastro e abrir o de login
        setTimeout(() => {
            cadastroModal.style.display = "none";
            loginModal.style.display = "block";
            cadastroForm.reset();
            cadastroSucesso.style.display = 'none';
            cadastroErro.textContent = '';
        }, 1500); // Espera 1.5 segundos para mostrar a mensagem de sucesso antes de ir para o login
    });

    // Simulação de Login e Redirecionamento para Home
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        loginErro.textContent = '';

        const email = document.getElementById('loginEmail').value;
        const senha = document.getElementById('loginSenha').value; // Por enquanto não estamos verificando a senha

        const usuariosCadastrados = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuarioEncontrado = usuariosCadastrados.find(usuario => usuario.email === email);

        if (usuarioEncontrado) {
            alert(`Login realizado com sucesso para o usuário: ${usuarioEncontrado.nome}`);
            loginModal.style.display = "none";
            this.reset();
            // Redirecionar para a seção Home
            document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
        } else {
            loginErro.textContent = 'Usuário não encontrado. Verifique o email.';
        }
    });

    // Inicializar o carrinho ao carregar a página
    renderizarCarrinho();
});