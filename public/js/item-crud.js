const apiBaseUrl = window.PokeFanAuth?.apiBaseUrl || 'http://localhost:3000';
const endpoint = `${apiBaseUrl}/itens`;

if (!window.PokeFanAuth.ensureAdminPage()) {
    // A funcao de auth ja faz o redirecionamento quando necessario.
} else {
    const form = document.getElementById('item-form');
    const feedback = document.getElementById('item-feedback');
    const tableBody = document.getElementById('item-tabela');
    const cancelButton = document.getElementById('item-cancelar');

    const fields = {
        id: document.getElementById('item-id'),
        nome: document.getElementById('item-nome'),
        descricao: document.getElementById('item-descricao'),
        conteudo: document.getElementById('item-conteudo'),
        geracao: document.getElementById('item-geracao'),
        professor: document.getElementById('item-professor'),
        imagem: document.getElementById('item-imagem'),
        imagemMapa: document.getElementById('item-imagem-mapa'),
        imagemIniciais: document.getElementById('item-imagem-iniciais'),
        descricaoIniciais: document.getElementById('item-descricao-iniciais'),
        cidades: document.getElementById('item-cidades'),
        tiposGinasios: document.getElementById('item-tipos'),
        top3: document.getElementById('item-top3')
    };

    const splitCsv = (value) => String(value || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

    const setFeedback = (message, isSuccess = false) => {
        feedback.textContent = message;
        feedback.className = isSuccess ? 'mt-3 mb-0 text-success' : 'mt-3 mb-0 text-danger';
    };

    const clearForm = () => {
        form.reset();
        fields.id.value = '';
    };

    const itemFromForm = () => ({
        nome: fields.nome.value.trim(),
        descricao: fields.descricao.value.trim(),
        conteudo: fields.conteudo.value.trim(),
        geracao: fields.geracao.value.trim(),
        professor: fields.professor.value.trim(),
        imagem: fields.imagem.value.trim(),
        imagemMapa: fields.imagemMapa.value.trim() || fields.imagem.value.trim(),
        imagemIniciais: fields.imagemIniciais.value.trim() || fields.imagem.value.trim(),
        descricaoIniciais: fields.descricaoIniciais.value.trim(),
        cidades: splitCsv(fields.cidades.value),
        tiposGinasios: splitCsv(fields.tiposGinasios.value),
        top3: splitCsv(fields.top3.value)
    });

    const fillForm = (item) => {
        fields.id.value = item.id || '';
        fields.nome.value = item.nome || '';
        fields.descricao.value = item.descricao || '';
        fields.conteudo.value = item.conteudo || '';
        fields.geracao.value = item.geracao || '';
        fields.professor.value = item.professor || '';
        fields.imagem.value = item.imagem || '';
        fields.imagemMapa.value = item.imagemMapa || '';
        fields.imagemIniciais.value = item.imagemIniciais || '';
        fields.descricaoIniciais.value = item.descricaoIniciais || '';
        fields.cidades.value = Array.isArray(item.cidades) ? item.cidades.join(', ') : '';
        fields.tiposGinasios.value = Array.isArray(item.tiposGinasios) ? item.tiposGinasios.join(', ') : '';
        fields.top3.value = Array.isArray(item.top3) ? item.top3.join(', ') : '';
    };

    const fetchItems = async () => {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error('Falha ao listar itens');
        }

        return response.json();
    };

    const renderTable = async () => {
        try {
            const items = await fetchItems();

            tableBody.innerHTML = items.map((item) => `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.nome}</td>
                    <td>${item.descricao}</td>
                    <td class="d-flex gap-2 flex-wrap">
                        <button class="btn btn-sm btn-outline-dark" data-action="edit" data-id="${item.id}">Editar</button>
                        <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${item.id}">Excluir</button>
                    </td>
                </tr>
            `).join('');
        } catch {
            tableBody.innerHTML = '<tr><td colspan="4" class="text-center">Nao foi possivel carregar os itens.</td></tr>';
        }
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const id = fields.id.value;
        const payload = itemFromForm();

        try {
            const response = await fetch(id ? `${endpoint}/${id}` : endpoint, {
                method: id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Falha ao salvar');
            }

            clearForm();
            setFeedback('Item salvo com sucesso.', true);
            await renderTable();
        } catch {
            setFeedback('Nao foi possivel salvar o item.');
        }
    });

    cancelButton.addEventListener('click', () => {
        clearForm();
        setFeedback('Edicao cancelada.', true);
    });

    tableBody.addEventListener('click', async (event) => {
        const button = event.target.closest('[data-action]');

        if (!button) {
            return;
        }

        const itemId = button.dataset.id;
        const action = button.dataset.action;

        if (action === 'delete') {
            try {
                const response = await fetch(`${endpoint}/${itemId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error('Falha ao excluir');
                }

                setFeedback('Item removido com sucesso.', true);
                await renderTable();
            } catch {
                setFeedback('Nao foi possivel remover o item.');
            }

            return;
        }

        if (action === 'edit') {
            try {
                const response = await fetch(`${endpoint}/${itemId}`);

                if (!response.ok) {
                    throw new Error('Falha ao carregar item');
                }

                const item = await response.json();
                fillForm(item);
                setFeedback('Item carregado para edicao.', true);
            } catch {
                setFeedback('Nao foi possivel carregar o item para edicao.');
            }
        }
    });

    void renderTable();
}
