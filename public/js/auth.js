const POKEFAN_API_BASE_URL = 'http://localhost:3000';
const POKEFAN_SESSION_KEY = 'pokefan_usuario_logado';

const sanitizeUser = (user) => ({
    id: user.id,
    nome: user.nome,
    login: user.login,
    admin: Boolean(user.admin)
});

const getCurrentUser = () => {
    const rawUser = sessionStorage.getItem(POKEFAN_SESSION_KEY);

    if (!rawUser) {
        return null;
    }

    try {
        return JSON.parse(rawUser);
    } catch {
        sessionStorage.removeItem(POKEFAN_SESSION_KEY);
        return null;
    }
};

const setCurrentUser = (user) => {
    sessionStorage.setItem(POKEFAN_SESSION_KEY, JSON.stringify(sanitizeUser(user)));
};

const clearCurrentUser = () => {
    sessionStorage.removeItem(POKEFAN_SESSION_KEY);
};

const getCurrentPageName = () => window.location.pathname.split('/').pop() || 'index.html';

const redirectToLogin = (returnPage = getCurrentPageName()) => {
    window.location.href = `login.html?redirect=${encodeURIComponent(returnPage)}`;
};

const buildNavigationItems = (user) => {
    const favoriteLink = user
        ? '<li><a href="favoritos.html">FAVORITOS</a></li>'
        : '';

    const adminLink = user && user.admin
        ? '<li><a href="cadastro-itens.html">CADASTRO</a></li>'
        : '';

    return `
        <li><a href="pokedex.html">POKEDÉX</a></li>
        <li><a href="analises.html">ANÁLISES</a></li>
        <li><a href="obras.html">OBRAS</a></li>
        ${favoriteLink}
        ${adminLink}
    `;
};

const buildHeaderAuth = (user) => {
    if (!user) {
        return '<a href="login.html">LOGIN</a>';
    }

    return `
        <div class="cabecalho-usuario">
            <span class="cabecalho-usuario-icon">👤</span>
            <span>${user.nome}</span>
            <a href="#" data-auth-logout style="padding: 0.3rem 0.7rem; font-size: 0.8rem;">Sair</a>
        </div>
    `;
};

const renderAuthNavigation = () => {
    const user = getCurrentUser();

    document.querySelectorAll('[data-auth-nav]').forEach((navigationList) => {
        navigationList.innerHTML = buildNavigationItems(user);
    });

    document.querySelectorAll('[data-auth-header]').forEach((headerAuth) => {
        headerAuth.innerHTML = buildHeaderAuth(user);
    });

    document.querySelectorAll('[data-auth-logout]').forEach((logoutLink) => {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            clearCurrentUser();

            if (window.location.pathname.endsWith('/favoritos.html')) {
                window.location.href = 'login.html';
                return;
            }

            window.location.reload();
        });
    });
};

const buildRequestError = (message) => ({
    ok: false,
    message
});

const requestJson = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            return buildRequestError('Nao foi possivel conectar ao servidor de usuarios.');
        }

        const data = await response.json();
        return {
            ok: true,
            data
        };
    } catch {
        return buildRequestError('JSON Server indisponivel. Inicie o servidor antes de continuar.');
    }
};

const loginUser = async (login, senha) => {
    const query = `${POKEFAN_API_BASE_URL}/users?login=${encodeURIComponent(login)}&senha=${encodeURIComponent(senha)}`;
    const result = await requestJson(query);

    if (!result.ok) {
        return result;
    }

    const [user] = result.data;

    if (!user) {
        return buildRequestError('Login ou senha invalidos.');
    }

    setCurrentUser(user);

    return {
        ok: true,
        data: sanitizeUser(user)
    };
};

const registerUser = async ({ nome, login, senha }) => {
    const existingUser = await requestJson(`${POKEFAN_API_BASE_URL}/users?login=${encodeURIComponent(login)}`);

    if (!existingUser.ok) {
        return existingUser;
    }

    if (existingUser.data.length) {
        return buildRequestError('Esse login ja esta em uso.');
    }

    const result = await requestJson(`${POKEFAN_API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, login, senha, admin: false })
    });

    if (!result.ok) {
        return result;
    }

    setCurrentUser(result.data);

    return {
        ok: true,
        data: sanitizeUser(result.data)
    };
};

const ensureAuthenticatedPage = (fallbackUrl = 'login.html') => {
    if (!getCurrentUser()) {
        if (fallbackUrl === 'login.html') {
            redirectToLogin(getCurrentPageName());
        } else {
            window.location.href = fallbackUrl;
        }
        return false;
    }

    return true;
};

const ensureAdminPage = (fallbackUrl = 'index.html') => {
    const user = getCurrentUser();

    if (!user) {
        redirectToLogin(getCurrentPageName());
        return false;
    }

    if (!user.admin) {
        window.location.href = fallbackUrl;
        return false;
    }

    return true;
};

window.PokeFanAuth = {
    apiBaseUrl: POKEFAN_API_BASE_URL,
    getCurrentUser,
    setCurrentUser,
    clearCurrentUser,
    renderAuthNavigation,
    loginUser,
    registerUser,
    ensureAuthenticatedPage,
    ensureAdminPage,
    redirectToLogin
};

document.addEventListener('DOMContentLoaded', renderAuthNavigation);