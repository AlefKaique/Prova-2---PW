function limparTodosUsuarios() {
    const container = document.getElementById('cards-container');
    container.innerHTML = '<p class="no-users">Nenhum usuário cadastrado.</p>'; // Limpa a tela
    localStorage.removeItem('users'); // Remove os usuários do localStorage
}

// Adiciona o event listener para o botão "Limpar Tudo"
document.addEventListener('DOMContentLoaded', () => {
    const limparTudoBtn = document.getElementById('limpar-tudo-btn');
    if (limparTudoBtn) {
        limparTudoBtn.addEventListener('click', limparTodosUsuarios);
    }
});

function exibirUsuarios() {
    const container = document.getElementById('cards-container');
    container.innerHTML = ''; // Limpa o container para evitar duplicações
    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.length === 0) {
        container.innerHTML = '<p class="no-users">Nenhum usuário cadastrado.</p>';
        return;
    }

    users.forEach((user, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index; // Armazena o índice para facilitar a exclusão

        const randomImageUrl = `https://source.unsplash.com/random/600x300/?person&${index}`;

        card.innerHTML = `
            <img src="${randomImageUrl}" alt="Imagem de pessoa" style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 15px;">
            <p><strong>Nome:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Endereço:</strong> ${user.logradouro}, ${user.numero}${user.complemento ? ' - ' + user.complemento : ''}</p>
            <p><strong>Bairro:</strong> ${user.bairro}</p>
            <p><strong>Cidade:</strong> ${user.cidade} - ${user.uf}</p>
            <p><strong>CEP:</strong> ${user.cep}</p>
            <button class="delete-button">Excluir</button>
        `;

        container.appendChild(card);
    });

    // Adiciona event listeners para os botões de exclusão APÓS os cards serem criados
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cardToDelete = this.parentNode;
            const indexToDelete = parseInt(cardToDelete.dataset.index);
            excluirUsuario(indexToDelete, cardToDelete);
        });
    });
}

function excluirUsuario(index, cardElement) {
    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (index >= 0 && index < users.length) {
        // Remove o usuário do array
        users.splice(index, 1);

        // Atualiza o LocalStorage
        localStorage.setItem('users', JSON.stringify(users));

        // Remove o card da tela
        cardElement.remove();

        // Recarrega a lista para atualizar os índices (opcional, mas pode ser útil em alguns casos)
        exibirUsuarios();
    }
}

// Executa ao carregar a página
exibirUsuarios();