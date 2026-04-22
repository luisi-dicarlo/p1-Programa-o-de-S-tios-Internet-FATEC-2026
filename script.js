let listaPokemons = [];
let quantidadeExibida = 20;
let ultimaBusca = "";

// carrega todos os pokemons (1025)
async function carregarLista() {
    const resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
    const dados = await resposta.json();
    listaPokemons = dados.results;
}

// renderiza lista (CARD SIMPLES - apenas alguns para melhor performance)
async function buscar() {
    const nome = document.getElementById("inputBusca").value.toLowerCase();
    const resultado = document.getElementById("resultado");

    ultimaBusca = nome;

    resultado.innerHTML = "Carregando...";

    try {
        const filtrados = listaPokemons.filter(pokemon =>
            pokemon.name.includes(nome)
        );

        resultado.innerHTML = "";

        const limite = filtrados.slice(0, quantidadeExibida);

        for (let pokemon of limite) {
            const res = await fetch(pokemon.url);
            const data = await res.json();

            const numero = String(data.id).padStart(3, '0');

            // tipos dos Pokémons
            const tipos = data.types.map(t => t.type.name);

            // cria badges de tipo
            const tiposHTML = tipos.map(tipo =>
                `<span class="tipo ${tipo}">${tipo}</span>`
            ).join("");

            resultado.innerHTML += `
        <div class="card">
          <p><strong>#${numero}</strong></p>
          <img src="${data.sprites.front_default}">
          <h3>${data.name}</h3>
          <div>${tiposHTML}</div>
          <button onclick="verMais('${pokemon.name}')">LER MAIS</button>
        </div>
      `;
        }

        if (filtrados.length > quantidadeExibida) {
            resultado.innerHTML += `
        <div style="width:100%">
          <button onclick="carregarMais()">Ver mais</button>
        </div>
      `;
        }

        if (filtrados.length === 0) {
            resultado.innerHTML = "Nenhum Pokémon encontrado 😢";
        }

    } catch (erro) {
        resultado.innerHTML = "Erro ao carregar 😢";
    }
}

// carregar mais (caso o usuário deseje)
function carregarMais() {
    quantidadeExibida += 20;
    buscar();
}

// detalhes (mais informacoes sobre o pokémon)
async function verMais(nome) {
    const resultado = document.getElementById("resultado");

    resultado.innerHTML = "Carregando detalhes...";

    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
        const data = await resposta.json();

        const tipos = data.types.map(t => t.type.name);
        const habilidades = data.abilities.map(a => a.ability.name).join(", ");

        const tiposHTML = tipos.map(tipo =>
            `<span class="tipo ${tipo}">${tipo}</span>`
        ).join("");

        const altura = data.height * 10;
        const peso = (data.weight / 10).toFixed(1);
        const numero = String(data.id).padStart(3, '0');

        resultado.innerHTML = `
      <div class="card">
        <p><strong>#${numero}</strong></p>
        <img src="${data.sprites.other['official-artwork'].front_default}">
        <h2>${data.name}</h2>
        <div>${tiposHTML}</div>
        <p><strong>Altura:</strong> ${altura} cm</p>
        <p><strong>Peso:</strong> ${peso} kg</p>
        <p><strong>Habilidades:</strong> ${habilidades}</p>
        <button onclick="voltarBusca()">VOLTAR</button>
      </div>
    `;

    } catch (erro) {
        resultado.innerHTML = "Erro ao carregar detalhes 😢";
    }
}

// voltar a aba inicial do pokémon
function voltarBusca() {
    document.getElementById("inputBusca").value = ultimaBusca;
    buscar();
}

// iniciar
async function iniciar() {
    await carregarLista();
    buscar();
}

// voltar ao inicio
function voltarInicio() {
    document.getElementById("inputBusca").value = "";
    quantidadeExibida = 20;
    buscar();
}

iniciar();