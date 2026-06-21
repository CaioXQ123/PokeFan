const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('cadastro-form');
const loginMessage = document.getElementById('login-mensagem');
const signupMessage = document.getElementById('cadastro-mensagem');
const queryParams = new URLSearchParams(window.location.search);
const redirectUrl = queryParams.get('redirect') || 'index.html';

const setStatusMessage = (element, message, success = false) => {
    if (!element) {
        return;
    }

    element.textContent = message;
    element.classList.toggle('sucesso', success);
    element.classList.toggle('erro', !success);
};

if ((loginForm || signupForm) && window.PokeFanAuth.getCurrentUser()) {
    window.location.href = 'index.html';
}

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const login = document.getElementById('login').value.trim();
        const senha = document.getElementById('senha').value.trim();

        const result = await window.PokeFanAuth.loginUser(login, senha);

        if (!result.ok) {
            setStatusMessage(loginMessage, result.message);
            return;
        }

        setStatusMessage(loginMessage, 'Login realizado com sucesso. Redirecionando...', true);
        window.location.href = redirectUrl;
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const login = document.getElementById('novo-login').value.trim();
        const senha = document.getElementById('nova-senha').value.trim();
        const confirmarSenha = document.getElementById('confirmar-senha').value.trim();

        if (senha !== confirmarSenha) {
            setStatusMessage(signupMessage, 'As senhas informadas sao diferentes.');
            return;
        }

        const result = await window.PokeFanAuth.registerUser({ nome, login, senha });

        if (!result.ok) {
            setStatusMessage(signupMessage, result.message);
            return;
        }

        setStatusMessage(signupMessage, 'Cadastro concluido com sucesso. Redirecionando...', true);
        window.location.href = redirectUrl;
    });
}