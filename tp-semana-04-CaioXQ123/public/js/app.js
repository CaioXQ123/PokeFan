const container = document.getElementById("cards-regioes");

if (container) {

    regioes.forEach(regiao => {

        container.innerHTML += `
        
            <div class="col-10 col-sm-6 col-md-4 col-lg-3">

                <div class="card h-100 shadow">

                    <img 
                        src="${regiao.imagem}" 
                        class="card-img-top object-fit-cover"
                        style="height: 220px;"
                        alt="${regiao.nome}"
                    >

                    <div class="card-body text-center">

                        <h5 class="card-title">
                            ${regiao.nome}
                        </h5>

                        <p class="card-text">
                            ${regiao.descricao}
                        </p>

                        <a 
                            href="detalhes.html?id=${regiao.id}"
                            class="btn btn-danger"
                        >
                            Ver mais
                        </a>

                    </div>

                </div>

            </div>

        `;
    });
}



const detalhes = document.getElementById("detalhes-regiao");

if (detalhes) {

    const parametros = new URLSearchParams(window.location.search);

    const id = Number(parametros.get("id"));

    const regiao = regioes.find(r => r.id === id);

    detalhes.innerHTML = `

        <div class="card shadow p-4">

            <h1 class="text-center mb-4">
                ${regiao.nome}
            </h1>

            <img 
                src="${regiao.imagemMapa}" 
                class="img-fluid rounded mb-4 imagem-detalhe"
            >

            <p class="fs-5">
                ${regiao.conteudo}
            </p>

            <div class="mt-3">
                <p><strong>Cidades principais:</strong></p>
                <ul>
                    ${regiao.cidades.map(c => `<li>${c}</li>`).join('')}
                </ul>

                <p><strong>Tipos de ginásio/Desafios:</strong> ${regiao.tiposGinasios.join(', ')}</p>

                <p><strong>Top 3 Pokémons mais fortes:</strong> ${regiao.top3.join(', ')}</p>
            </div>

            <p>
                <strong>Geração:</strong>
                ${regiao.geracao}
            </p>

            <p>
                <strong>Professor:</strong>
                ${regiao.professor}
            </p>

            <h2 class="mt-4 ">
                Pokémons Iniciais
            </h2>

            <img 
                src="${regiao.imagemIniciais}" 
                class="img-fluid rounded imagem-detalhe"
            >

            <p class="fs-5 mt-3">
                ${regiao.descricaoIniciais}
            </p>

        </div>

    `;
}