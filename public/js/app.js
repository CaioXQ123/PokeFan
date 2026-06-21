const API_BASE_URL = window.PokeFanAuth?.apiBaseUrl || 'http://localhost:3000';
const ITEMS_ENDPOINT = `${API_BASE_URL}/itens`;

const cardsContainer = document.getElementById('cards-regioes');
const searchForm = document.getElementById('item-search-form');
const searchInput = document.getElementById('item-search-input');
const detailsContainer = document.getElementById('detalhes-regiao');

let allItems = [];

const normalizeText = (text) => String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const buildAlertMarkup = (message) => `
    <div class="col-12">
        <div class="alert alert-warning text-center m-0" role="alert">
            ${message}
        </div>
    </div>
`;

const createFavoriteButtonMarkup = (item) => {
    const currentUser = window.PokeFanAuth?.getCurrentUser();
    const favoriteActive = currentUser && window.PokeFanFavorites?.isFavorite('regiao', item.id, currentUser);
    const favoriteSymbol = favoriteActive ? '♥' : '♡';
    const favoriteClassName = favoriteActive ? 'ativo' : 'inativo';
    const loginClassName = currentUser ? '' : 'visitante';

    return `
        <button
            type="button"
            class="botao-favorito ${favoriteClassName} ${loginClassName}"
            data-favorite-toggle="regiao"
            data-id="${item.id}"
            aria-label="Favoritar item ${item.nome}"
            title="Favoritar ${item.nome}"
        >
            ${favoriteSymbol}
        </button>
    `;
};

const renderCards = (items) => {
    if (!cardsContainer) {
        return;
    }

    if (!items.length) {
        cardsContainer.innerHTML = buildAlertMarkup('Nenhum item encontrado para a pesquisa informada.');
        return;
    }

    cardsContainer.innerHTML = items.map((item) => `
        <div class="col-10 col-sm-6 col-md-4 col-lg-3">
            <div class="card h-100 shadow card-regiao" data-item-link="detalhes.html?id=${item.id}">
                <div class="favorito-topo">
                    ${createFavoriteButtonMarkup(item)}
                </div>

                <img
                    src="${item.imagem}"
                    class="card-img-top object-fit-cover"
                    style="height: 220px;"
                    alt="${item.nome}"
                >

                <div class="card-body text-center d-flex flex-column">
                    <h5 class="card-title">${item.nome}</h5>

                    <p class="card-text flex-grow-1">${item.descricao}</p>

                    <a href="detalhes.html?id=${item.id}" class="btn btn-danger">Ver mais</a>
                </div>
            </div>
        </div>
    `).join('');
};

const loadItems = async () => {
    if (!cardsContainer) {
        return;
    }

    try {
        const response = await fetch(ITEMS_ENDPOINT);

        if (!response.ok) {
            throw new Error('API indisponivel');
        }

        allItems = await response.json();
        renderCards(allItems);
    } catch {
        cardsContainer.innerHTML = buildAlertMarkup('Nao foi possivel carregar os itens do JSON Server.');
    }
};

const applySearch = () => {
    if (!cardsContainer || !searchInput) {
        return;
    }

    const rawTerm = searchInput.value.trim();

    if (!rawTerm) {
        renderCards(allItems);
        return;
    }

    const term = normalizeText(rawTerm);

    const filteredItems = allItems.filter((item) => {
        const title = normalizeText(item.nome);
        const description = normalizeText(item.descricao);
        return title.includes(term) || description.includes(term);
    });

    renderCards(filteredItems);
};

const bindHomeEvents = () => {
    if (!cardsContainer) {
        return;
    }

    cardsContainer.addEventListener('click', (event) => {
        const favoriteButton = event.target.closest('[data-favorite-toggle="regiao"]');

        if (favoriteButton) {
            const itemId = String(favoriteButton.dataset.id);
            const item = allItems.find((currentItem) => String(currentItem.id) === itemId);

            if (!item) {
                return;
            }

            const result = window.PokeFanFavorites.toggleFavorite({
                type: 'regiao',
                id: item.id,
                nome: item.nome,
                descricao: item.descricao,
                imagem: item.imagem,
                link: `detalhes.html?id=${item.id}`
            });

            if (result.requiresAuth) {
                window.PokeFanAuth.redirectToLogin('index.html');
                return;
            }

            applySearch();
            return;
        }

        const card = event.target.closest('[data-item-link]');

        if (!card) {
            return;
        }

        if (event.target.closest('a, button')) {
            return;
        }

        window.location.href = card.dataset.itemLink;
    });

    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            applySearch();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            if (!searchInput.value.trim()) {
                renderCards(allItems);
            }
        });
    }
};

const buildNotFoundDetails = () => `
    <div class="card shadow p-4 text-center">
        <h1 class="mb-3">Item nao encontrado</h1>
        <p class="mb-4">O item informado nao existe ou nao esta disponivel no momento.</p>
        <a href="index.html" class="btn btn-danger">Voltar para a home</a>
    </div>
`;

const renderDetails = (item) => {
    const cities = Array.isArray(item.cidades) ? item.cidades : [];
    const gymTypes = Array.isArray(item.tiposGinasios) ? item.tiposGinasios : [];
    const top3 = Array.isArray(item.top3) ? item.top3 : [];

    detailsContainer.innerHTML = `
        <div class="card shadow p-4">
            <h1 class="text-center mb-4">${item.nome}</h1>

            <img
                src="${item.imagemMapa || item.imagem}"
                class="img-fluid rounded mb-4 imagem-detalhe"
                alt="Mapa da regiao ${item.nome}"
            >

            <p class="fs-5">${item.conteudo || item.descricao}</p>

            <div class="mt-3">
                <p><strong>Cidades principais:</strong></p>
                <ul>${cities.map((city) => `<li>${city}</li>`).join('')}</ul>

                <p><strong>Tipos de ginasio/Desafios:</strong> ${gymTypes.join(', ') || 'Nao informado'}</p>
                <p><strong>Top 3 Pokemons mais fortes:</strong> ${top3.join(', ') || 'Nao informado'}</p>
            </div>

            <p><strong>Geracao:</strong> ${item.geracao || 'Nao informada'}</p>
            <p><strong>Professor:</strong> ${item.professor || 'Nao informado'}</p>

            <h2 class="mt-4">Pokemons Iniciais</h2>

            <img
                src="${item.imagemIniciais || item.imagem}"
                class="img-fluid rounded imagem-detalhe"
                alt="Iniciais da regiao ${item.nome}"
            >

            <p class="fs-5 mt-3">${item.descricaoIniciais || 'Sem descricao adicional para os iniciais.'}</p>
        </div>
    `;
};

const loadDetails = async () => {
    if (!detailsContainer) {
        return;
    }

    const parameters = new URLSearchParams(window.location.search);
    const id = parameters.get('id');

    if (!id) {
        detailsContainer.innerHTML = buildNotFoundDetails();
        return;
    }

    try {
        const response = await fetch(`${ITEMS_ENDPOINT}/${encodeURIComponent(id)}`);

        if (!response.ok) {
            detailsContainer.innerHTML = buildNotFoundDetails();
            return;
        }

        const item = await response.json();
        renderDetails(item);
    } catch {
        detailsContainer.innerHTML = buildAlertMarkup('Nao foi possivel carregar os detalhes pelo JSON Server.');
    }
};

void loadItems();
bindHomeEvents();
void loadDetails();
