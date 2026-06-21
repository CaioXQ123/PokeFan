const STORAGE_KEY = "pokefan_pokemons_crud";

const dadosIniciais = [
    { id: 1, nome: "Pikachu", tipo: "Elétrico", regiao: "Kanto", nivel: 25, capturado: true },
    { id: 2, nome: "Bulbasaur", tipo: "Planta", regiao: "Kanto", nivel: 16, capturado: true },
    { id: 3, nome: "Cyndaquil", tipo: "Fogo", regiao: "Johto", nivel: 14, capturado: false },
    { id: 4, nome: "Mudkip", tipo: "Água", regiao: "Hoenn", nivel: 18, capturado: true },
    { id: 5, nome: "Lucario", tipo: "Lutador", regiao: "Sinnoh", nivel: 38, capturado: false }
];

const form = document.getElementById("pokemon-form");
const inputId = document.getElementById("pokemon-id");
const inputNome = document.getElementById("nome");
const inputTipo = document.getElementById("tipo");
const inputRegiao = document.getElementById("regiao");
const inputNivel = document.getElementById("nivel");
const inputCapturado = document.getElementById("capturado");

const botaoCancelar = document.getElementById("cancelar-edicao");
const botaoReset = document.getElementById("limpar-dados");
const tabela = document.getElementById("pokemon-tabela");

const totalCadastrados = document.getElementById("total-cadastrados");
const tiposDiferentes = document.getElementById("tipos-diferentes");
const taxaCaptura = document.getElementById("taxa-captura");

let chartTipos;
let chartRegioes;
let chartCaptura;

function carregarDados() {
    const bruto = localStorage.getItem(STORAGE_KEY);

    if (!bruto) {
        salvarDados(dadosIniciais);
        return [...dadosIniciais];
    }

    try {
        const dados = JSON.parse(bruto);
        return Array.isArray(dados) ? dados : [...dadosIniciais];
    } catch {
        salvarDados(dadosIniciais);
        return [...dadosIniciais];
    }
}

function salvarDados(registros) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
}

function gerarId(registros) {
    if (!registros.length) {
        return 1;
    }

    return Math.max(...registros.map(item => item.id)) + 1;
}

function limparFormulario() {
    inputId.value = "";
    form.reset();
    inputNivel.value = 5;
    inputCapturado.value = "true";
}

function renderTabela(registros) {
    tabela.innerHTML = "";

    if (!registros.length) {
        tabela.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">Nenhum Pokémon cadastrado.</td>
            </tr>
        `;
        return;
    }

    registros.forEach(pokemon => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${pokemon.nome}</td>
            <td>${pokemon.tipo}</td>
            <td>${pokemon.regiao}</td>
            <td>${pokemon.nivel}</td>
            <td>${pokemon.capturado ? "Sim" : "Não"}</td>
            <td class="d-flex gap-2">
                <button type="button" class="btn btn-sm btn-outline-primary" data-acao="editar" data-id="${pokemon.id}">Editar</button>
                <button type="button" class="btn btn-sm btn-outline-danger" data-acao="excluir" data-id="${pokemon.id}">Excluir</button>
            </td>
        `;

        tabela.appendChild(linha);
    });
}

function contarPorCampo(registros, campo) {
    return registros.reduce((acumulador, item) => {
        const chave = item[campo];
        acumulador[chave] = (acumulador[chave] || 0) + 1;
        return acumulador;
    }, {});
}

function atualizarIndicadores(registros) {
    const total = registros.length;
    const tipos = new Set(registros.map(item => item.tipo));
    const capturados = registros.filter(item => item.capturado).length;
    const taxa = total ? Math.round((capturados / total) * 100) : 0;

    totalCadastrados.textContent = String(total);
    tiposDiferentes.textContent = String(tipos.size);
    taxaCaptura.textContent = `${taxa}%`;
}

function montarGraficoTipos(registros) {
    const dados = contarPorCampo(registros, "tipo");

    if (chartTipos) {
        chartTipos.destroy();
    }

    chartTipos = new Chart(document.getElementById("chart-tipos"), {
        type: "bar",
        data: {
            labels: Object.keys(dados),
            datasets: [{
                label: "Quantidade",
                data: Object.values(dados),
                borderWidth: 1,
                backgroundColor: ["#ef476f", "#06d6a0", "#118ab2", "#ff9f1c", "#8338ec", "#3a86ff", "#2ec4b6"]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            }
        }
    });
}

function montarGraficoRegioes(registros) {
    const dados = contarPorCampo(registros, "regiao");

    if (chartRegioes) {
        chartRegioes.destroy();
    }

    chartRegioes = new Chart(document.getElementById("chart-regioes"), {
        type: "pie",
        data: {
            labels: Object.keys(dados),
            datasets: [{
                data: Object.values(dados),
                backgroundColor: ["#f94144", "#f3722c", "#f9c74f", "#90be6d", "#43aa8b", "#577590", "#277da1"]
            }]
        },
        options: {
            responsive: true
        }
    });
}

function montarGraficoCaptura(registros) {
    const capturados = registros.filter(item => item.capturado).length;
    const naoCapturados = registros.length - capturados;

    if (chartCaptura) {
        chartCaptura.destroy();
    }

    chartCaptura = new Chart(document.getElementById("chart-captura"), {
        type: "bar",
        data: {
            labels: ["Capturados", "Não Capturados"],
            datasets: [{
                label: "Quantidade",
                data: [capturados, naoCapturados],
                backgroundColor: ["#2a9d8f", "#e76f51"]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            }
        }
    });
}

function renderTudo() {
    const registros = carregarDados();
    renderTabela(registros);
    atualizarIndicadores(registros);
    montarGraficoTipos(registros);
    montarGraficoRegioes(registros);
    montarGraficoCaptura(registros);
}

form.addEventListener("submit", evento => {
    evento.preventDefault();

    const registros = carregarDados();

    const novoRegistro = {
        nome: inputNome.value.trim(),
        tipo: inputTipo.value,
        regiao: inputRegiao.value,
        nivel: Number(inputNivel.value),
        capturado: inputCapturado.value === "true"
    };

    if (!novoRegistro.nome) {
        return;
    }

    if (inputId.value) {
        const idEditado = Number(inputId.value);
        const indice = registros.findIndex(item => item.id === idEditado);

        if (indice !== -1) {
            registros[indice] = { ...registros[indice], ...novoRegistro };
        }
    } else {
        registros.push({
            id: gerarId(registros),
            ...novoRegistro
        });
    }

    salvarDados(registros);
    limparFormulario();
    renderTudo();
});

botaoCancelar.addEventListener("click", () => {
    limparFormulario();
});

tabela.addEventListener("click", evento => {
    const botao = evento.target.closest("button[data-acao]");

    if (!botao) {
        return;
    }

    const acao = botao.dataset.acao;
    const id = Number(botao.dataset.id);
    const registros = carregarDados();
    const pokemon = registros.find(item => item.id === id);

    if (!pokemon) {
        return;
    }

    if (acao === "editar") {
        inputId.value = String(pokemon.id);
        inputNome.value = pokemon.nome;
        inputTipo.value = pokemon.tipo;
        inputRegiao.value = pokemon.regiao;
        inputNivel.value = pokemon.nivel;
        inputCapturado.value = String(pokemon.capturado);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
    }

    if (acao === "excluir") {
        const registrosAtualizados = registros.filter(item => item.id !== id);
        salvarDados(registrosAtualizados);
        renderTudo();
    }
});

botaoReset.addEventListener("click", () => {
    salvarDados(dadosIniciais);
    limparFormulario();
    renderTudo();
});

renderTudo();
