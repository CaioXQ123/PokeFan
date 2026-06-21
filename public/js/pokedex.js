const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');

const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');
const buttonFavorite = document.querySelector('.pokemon__favorite');

let searchPokemon = 1;
let currentPokemon = null;

const fetchPokemon = async (pokemon) => {
    try {
        const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

        if (APIResponse.status === 200) {
            const data = await APIResponse.json();
            return data;
        }
    } catch {
        return null;
    }
}

const getPokemonSprite = (data) => {
    return data.sprites.versions['generation-v']['black-white'].animated.front_default
        || data.sprites.other['official-artwork'].front_default
        || data.sprites.front_default;
}

const updateFavoriteButton = () => {
    if (!buttonFavorite) {
        return;
    }

    const currentUser = window.PokeFanAuth?.getCurrentUser();
    const favoriteActive = currentUser && currentPokemon && window.PokeFanFavorites.isFavorite('pokemon', currentPokemon.id, currentUser);

    buttonFavorite.textContent = favoriteActive ? '♥' : '♡';
    buttonFavorite.classList.toggle('ativo', Boolean(favoriteActive));
    buttonFavorite.classList.toggle('visitante', !currentUser);
    buttonFavorite.disabled = !currentPokemon;
};

const renderPokemon = async (pokemon) => {

    pokemonName.innerHTML = 'Loading...';
    pokemonNumber.innerHTML = '';
    currentPokemon = null;
    updateFavoriteButton();

    const data = await fetchPokemon(pokemon);

    if (data) {
        pokemonImage.style.display = 'block';
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;
        pokemonImage.src = getPokemonSprite(data);
        input.value = '';
        searchPokemon = data.id;
        currentPokemon = data;
        updateFavoriteButton();
    } else {
        pokemonImage.style.display = 'none';
        pokemonName.innerHTML = 'Not found :c';
        pokemonNumber.innerHTML = '';
        updateFavoriteButton();
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderPokemon(input.value.toLowerCase());
});

buttonPrev.addEventListener('click', () => {
    if (searchPokemon > 1) {
        searchPokemon -= 1;
        renderPokemon(searchPokemon);
    }
});

buttonNext.addEventListener('click', () => {
    searchPokemon += 1;
    renderPokemon(searchPokemon);
});

if (buttonFavorite) {
    buttonFavorite.addEventListener('click', () => {
        if (!currentPokemon) {
            return;
        }

        const artwork = currentPokemon.sprites.other['official-artwork'].front_default || getPokemonSprite(currentPokemon);
        const result = window.PokeFanFavorites.toggleFavorite({
            type: 'pokemon',
            id: currentPokemon.id,
            nome: currentPokemon.name,
            numero: currentPokemon.id,
            imagem: artwork
        });

        if (result.requiresAuth) {
            window.PokeFanAuth.redirectToLogin('pokedex.html');
            return;
        }

        updateFavoriteButton();
    });
}

renderPokemon(searchPokemon);