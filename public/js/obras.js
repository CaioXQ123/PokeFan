const rotas = [
    {
        icone: "🎬",
        titulo: "Rota do Cinéfilo",
        texto: "Filmes clássicos + Detective Pikachu para ver o universo Pokemon em dois estilos diferentes.",
        sugestao: "Comece por: Pokemon: O Filme (1998)"
    },
    {
        icone: "🎮",
        titulo: "Rota Gamer",
        texto: "Da base em Red/Blue aos títulos modernos, com aventura, captura e evolução de mecânicas.",
        sugestao: "Comece por: FireRed/LeafGreen"
    },
    {
        icone: "🃏",
        titulo: "Rota Competitiva",
        texto: "TCG para montar decks e torneios, com foco em estratégia e leitura de meta.",
        sugestao: "Comece por: Pokemon TCG Live"
    },
    {
        icone: "📚",
        titulo: "Rota Lore",
        texto: "Mangás e especiais para conhecer versões mais profundas das regiões e personagens.",
        sugestao: "Comece por: Pokemon Adventures"
    }
];

const momentos = [
    "1996: lançamento dos primeiros jogos no Japão",
    "1997: estreia do anime na TV",
    "1998: primeiro filme chega aos cinemas",
    "1999: boom global do TCG",
    "2016: Pokemon GO vira fenômeno mundial",
    "2023: Pokemon Horizons abre nova fase"
];

const obras = [
    {
        tipo: "Anime",
        titulo: "Pokemon: A Série",
        ano: 1997,
        plataforma: "TV e Streaming",
        destaque: "A jornada do Ash por várias regiões.",
        imagem: "../images/info/animePokemon.png"
    },
    {
        tipo: "Filme",
        titulo: "Pokemon: O Filme",
        ano: 1998,
        plataforma: "Cinema",
        destaque: "Mew, Mewtwo e um dos conflitos mais icônicos da franquia.",
        imagem: "../images/info/pokemonOFILME.png"
    },
    {
        tipo: "Jogo",
        titulo: "Pokemon Red e Blue",
        ano: 1996,
        plataforma: "Game Boy",
        destaque: "A origem de Kanto e da fórmula clássica de captura.",
        imagem: "../images/info/pokemonRed.png"
    },
    {
        tipo: "Jogo",
        titulo: "Pokemon GO",
        ano: 2016,
        plataforma: "Mobile",
        destaque: "Realidade aumentada e eventos presenciais com a comunidade.",
        imagem: "../images/info/pokemonGo.png"
    },
    {
        tipo: "TCG",
        titulo: "Pokemon Trading Card Game",
        ano: 1996,
        plataforma: "Cartas e App",
        destaque: "Colecionismo, decks e torneios oficiais no mundo inteiro.",
        imagem: "../images/info/pokemonTCG.png"
    },
    {
        tipo: "Mangá",
        titulo: "Pokemon Adventures",
        ano: 1997,
        plataforma: "Impresso",
        destaque: "Arcos mais densos, com foco em narrativa e estratégia.",
        imagem: "../images/info/pokemonAdventures.png"
    }
];

const rotasContainer = document.getElementById("rotas-fas");
const momentosContainer = document.getElementById("momento-curioso");
const obrasContainer = document.getElementById("obras-cards");

function renderRotas() {
    rotasContainer.innerHTML = rotas
        .map(item => `
            <div class="col-12 col-lg-6">
                <article class="rota-card">
                    <p class="icone mb-2">${item.icone}</p>
                    <h4>${item.titulo}</h4>
                    <p class="mb-2">${item.texto}</p>
                    <p class="mb-0"><strong>${item.sugestao}</strong></p>
                </article>
            </div>
        `)
        .join("");
}

function renderMomentos() {
    momentosContainer.innerHTML = momentos
        .map(item => `<span class="pill-curiosa">${item}</span>`)
        .join("");
}

function renderObras() {
    obrasContainer.innerHTML = obras
        .map(item => `
            <div class="col-12 col-lg-6">
                <article class="obra-card">
                    <img src="${item.imagem}" alt="${item.titulo}">
                    <span class="tipo">${item.tipo}</span>
                    <h4>${item.titulo}</h4>
                    <p class="mb-1"><strong>Ano:</strong> ${item.ano}</p>
                    <p class="mb-1"><strong>Plataforma:</strong> ${item.plataforma}</p>
                    <p class="m-0">${item.destaque}</p>
                </article>
            </div>
        `)
        .join("");
}

renderRotas();
renderMomentos();
renderObras();
