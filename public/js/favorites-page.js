const favoritesPanel = document.getElementById('painel-favoritos');

if (favoritesPanel && window.PokeFanAuth.ensureAuthenticatedPage()) {
    const user = window.PokeFanAuth.getCurrentUser();
    const favoriteRegionsContainer = document.getElementById('favoritos-regioes');
    const favoritePokemonsContainer = document.getElementById('favoritos-pokemons');
    const totalFavorites = document.getElementById('total-favoritos');
    const totalRegions = document.getElementById('total-regioes-favoritas');
    const totalPokemons = document.getElementById('total-pokemons-favoritos');
    const favoriteTrainer = document.getElementById('treinador-favoritos');

    const createEmptyState = (message, actionHref, actionText) => `
        <article class="favorito-vazio text-center">
            <h3 class="mb-3">Sua colecao ainda esta vazia</h3>
            <p class="mb-4">${message}</p>
            <a href="${actionHref}" class="btn btn-danger">${actionText}</a>
        </article>
    `;

    const buildRegionCard = (favoriteItem) => {
        const regionData = regioes.find((regiao) => Number(regiao.id) === Number(favoriteItem.id)) || favoriteItem;

        return `
            <article class="favorito-card h-100">
                <img src="${regionData.imagem}" alt="${regionData.nome}" class="favorito-imagem">
                <div class="favorito-conteudo">
                    <span class="favorito-tag">Regiao favorita</span>
                    <h3>${regionData.nome}</h3>
                    <p>${regionData.descricao}</p>
                    <div class="favorito-acoes">
                        <a href="detalhes.html?id=${regionData.id}" class="btn btn-danger">Ver detalhes</a>
                        <button type="button" class="btn btn-outline-dark" data-remove-favorite="regiao" data-id="${regionData.id}">Remover</button>
                    </div>
                </div>
            </article>
        `;
    };

    const buildPokemonCard = (favoriteItem) => `
        <article class="favorito-card h-100 favorito-card-pokemon">
            <img src="${favoriteItem.imagem}" alt="${favoriteItem.nome}" class="favorito-imagem favorito-imagem-pokemon">
            <div class="favorito-conteudo">
                <span class="favorito-tag">Pokemon favorito</span>
                <h3>#${favoriteItem.numero} - ${favoriteItem.nome}</h3>
                <p>Esse pokemon foi marcado na Pokedex personalizada da sua conta.</p>
                <div class="favorito-acoes">
                    <a href="pokedex.html" class="btn btn-danger">Abrir Pokedex</a>
                    <button type="button" class="btn btn-outline-dark" data-remove-favorite="pokemon" data-id="${favoriteItem.id}">Remover</button>
                </div>
            </div>
        </article>
    `;

    const renderFavorites = () => {
        const favorites = window.PokeFanFavorites.getUserFavorites(user);
        const regionFavorites = favorites.filter((item) => item.type === 'regiao');
        const pokemonFavorites = favorites.filter((item) => item.type === 'pokemon');

        favoriteTrainer.textContent = user.nome;
        totalFavorites.textContent = String(favorites.length);
        totalRegions.textContent = String(regionFavorites.length);
        totalPokemons.textContent = String(pokemonFavorites.length);

        favoriteRegionsContainer.innerHTML = regionFavorites.length
            ? regionFavorites.map(buildRegionCard).join('')
            : createEmptyState('Favoritar as regioes da home vai montar sua selecao especial aqui.', 'index.html', 'Explorar regioes');

        favoritePokemonsContainer.innerHTML = pokemonFavorites.length
            ? pokemonFavorites.map(buildPokemonCard).join('')
            : createEmptyState('Abra a Pokedex, escolha seus parceiros preferidos e salve no coracao.', 'pokedex.html', 'Ir para a Pokedex');
    };

    favoritesPanel.addEventListener('click', (event) => {
        const removeButton = event.target.closest('[data-remove-favorite]');

        if (!removeButton) {
            return;
        }

        window.PokeFanFavorites.toggleFavorite({
            type: removeButton.dataset.removeFavorite,
            id: Number(removeButton.dataset.id)
        }, user);

        renderFavorites();
    });

    renderFavorites();
}