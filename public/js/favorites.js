const POKEFAN_FAVORITES_KEY = 'pokefan_favoritos';

const readFavoritesStore = () => {
    const rawStore = localStorage.getItem(POKEFAN_FAVORITES_KEY);

    if (!rawStore) {
        return {};
    }

    try {
        const parsedStore = JSON.parse(rawStore);
        return parsedStore && typeof parsedStore === 'object' ? parsedStore : {};
    } catch {
        localStorage.removeItem(POKEFAN_FAVORITES_KEY);
        return {};
    }
};

const writeFavoritesStore = (store) => {
    localStorage.setItem(POKEFAN_FAVORITES_KEY, JSON.stringify(store));
};

const getUserFavoritesKey = (user) => {
    if (!user) {
        return null;
    }

    return String(user.id || user.login);
};

const getUserFavorites = (user = window.PokeFanAuth?.getCurrentUser()) => {
    const key = getUserFavoritesKey(user);

    if (!key) {
        return [];
    }

    const store = readFavoritesStore();
    return Array.isArray(store[key]) ? store[key] : [];
};

const saveUserFavorites = (favorites, user = window.PokeFanAuth?.getCurrentUser()) => {
    const key = getUserFavoritesKey(user);

    if (!key) {
        return false;
    }

    const store = readFavoritesStore();
    store[key] = favorites;
    writeFavoritesStore(store);
    return true;
};

const isFavorite = (type, id, user = window.PokeFanAuth?.getCurrentUser()) => {
    return getUserFavorites(user).some((item) => item.type === type && Number(item.id) === Number(id));
};

const toggleFavorite = (favoriteItem, user = window.PokeFanAuth?.getCurrentUser()) => {
    if (!user) {
        return {
            ok: false,
            requiresAuth: true,
            message: 'Voce precisa fazer login para favoritar itens.'
        };
    }

    const favorites = getUserFavorites(user);
    const existingIndex = favorites.findIndex((item) => item.type === favoriteItem.type && Number(item.id) === Number(favoriteItem.id));

    if (existingIndex >= 0) {
        favorites.splice(existingIndex, 1);
        saveUserFavorites(favorites, user);

        return {
            ok: true,
            isFavorite: false
        };
    }

    favorites.push(favoriteItem);
    saveUserFavorites(favorites, user);

    return {
        ok: true,
        isFavorite: true
    };
};

window.PokeFanFavorites = {
    getUserFavorites,
    saveUserFavorites,
    isFavorite,
    toggleFavorite
};