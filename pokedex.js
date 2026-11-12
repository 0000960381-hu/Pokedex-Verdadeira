
let estadoPokedex = {
    digitando: false,
}

let numPokemon = '';
let pokemonAtual = 0;

const key1 = document.querySelector('#key-1');
const key2 = document.querySelector('#key-2');
const key3 = document.querySelector('#key-3');
const key4 = document.querySelector('#key-4');
const key5 = document.querySelector('#key-5');
const key6 = document.querySelector('#key-6');
const key7 = document.querySelector('#key-7');
const key8 = document.querySelector('#key-8');
const key9 = document.querySelector('#key-9');
const key10 = document.querySelector('#key-10');
const btnWhiteLeft = document.querySelector('#btn-white-left');
const btnWhiteRight = document.querySelector('#btn-white-right');
const infoScreen = document.querySelector('#info-screen');
const mainScreen = document.querySelector('#main-screen');
const numberDisplay = document.querySelector('#number-display');
const btnUp = document.querySelector('#btn-up');
const btnDown = document.querySelector('#btn-down');
const btnLeft = document.querySelector('#btn-left');
const btnRight = document.querySelector('#btn-right');
const heightPokemon = document.querySelector('#pokemon-height');
const weightPokemon = document.querySelector('#pokemon-weight');
const regionPokemon = document.querySelector('#pokemon-region');
key1.addEventListener('click', () => leituraTeclado('1'));
key2.addEventListener('click', () => leituraTeclado('2'));
key3.addEventListener('click', () => leituraTeclado('3'));
key4.addEventListener('click', () => leituraTeclado('4'));
key5.addEventListener('click', () => leituraTeclado('5'));
key6.addEventListener('click', () => leituraTeclado('6'));
key7.addEventListener('click', () => leituraTeclado('7'));
key8.addEventListener('click', () => leituraTeclado('8'));
key9.addEventListener('click', () => leituraTeclado('9'));
key10.addEventListener('click', () => leituraTeclado('0'));
btnWhiteLeft.addEventListener('click', buscarPokemon);
btnWhiteRight.addEventListener('click', apagar);
btnUp.addEventListener('click', () => trocarPokemon(10));
btnDown.addEventListener('click', () => trocarPokemon(-10));
btnRight.addEventListener('click', () => trocarPokemon(1));
btnLeft.addEventListener('click', () => trocarPokemon(-1));

function leituraTeclado(tecla)
{
    if(!estadoPokedex.digitando)
    {
        infoScreen.textContent = '';
        estadoPokedex.digitando = true;
    }
    numPokemon += tecla;
    infoScreen.textContent = numPokemon;
}

    function apagar()
{
    if(estadoPokedex.digitando)
    {
        numPokemon = numPokemon.slice(0, -1);
        if(numPokemon.length < 1)
        {
            estadoPokedex.digitando = false;
            infoScreen.textContent = 'Aguardando dados…';
        }
        else
        {
            infoScreen.textContent = numPokemon;
        }
    }
}

async function consultarApi(msg) {
    try {
        const id = Number(msg);

        if (!Number.isInteger(id) || id < 1 || id > 1025) {
            throw new Error('Digite um número entre 1 e 1025!');
        }

        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${id}`
        );

        if (!response.ok) {
            throw new Error('Pokémon não encontrado!');
        }

        const data = await response.json();

        atualizarNumero(data.id);
        exibirSprite(data.sprites.front_default);
        await exibirDados(data);

        pokemonAtual = data.id;
        numPokemon = String(data.id);
        estadoPokedex.digitando = false;

    } catch (erro) {
        console.error(erro);
        alert(erro.message || 'Erro ao consultar a PokéAPI!');
    }
}

function buscarPokemon()
{
    if(estadoPokedex.digitando) consultarApi(numPokemon);
}

function exibirSprite(urlImage)
{
    mainScreen.textContent = '';
    const img = document.createElement('img');
    img.src = urlImage;
    //img.style.width = '150px';
    if (window.innerWidth < 600)
    {
        img.style.width = '75px';
    }
    else
    {
        img.style.width = '190px';
        img.style.transform = 'translate(0, -12px)';
    }
    mainScreen.appendChild(img);
}

function trocarPokemon(valor) {

    if (pokemonAtual === 0) {
        alert('Pesquise um Pokémon primeiro!');
        return;
    }

    const novoId = pokemonAtual + valor;

    if (novoId < 1 || novoId > 1025) {
        alert('Você chegou ao limite da Pokédex!');
        return;
    }

    consultarApi(novoId);
}

function atualizarNumero(id)
{

    let idString = id.toString();
    while(idString.length < 4) idString = '0' + idString;
    idString = '#' + idString;
    numberDisplay.textContent = idString;

}


async function exibirDados(data) {
    // Limpa o visor da direita
    infoScreen.textContent = '';

    // Tipos
    const tipos = data.types
        .map(item => capitalizar(item.type.name))
        .join(' / ');

    // Peso e altura
    const peso = data.weight / 10;
    const altura = data.height / 10;

    // Buscar região
    const respostaEspecie = await fetch(data.species.url);
    const especie = await respostaEspecie.json();

    const respostaGeracao = await fetch(especie.generation.url);
    const geracao = await respostaGeracao.json();

    const regiao = capitalizar(geracao.main_region.name);

    // Nome
    const nome = document.createElement('p');
    nome.textContent = capitalizar(data.name);

    // Tipo
    const tipo = document.createElement('p');
    tipo.textContent = 'Tipo: ' + tipos;

    // Peso
    const pesoElemento = document.createElement('p');
    pesoElemento.textContent = 'Peso: ' + peso + ' kg';

    // Altura
    const alturaElemento = document.createElement('p');
    alturaElemento.textContent = 'Altura: ' + altura + ' m';

    // Região
    const regiaoElemento = document.createElement('p');
    regiaoElemento.textContent = 'Região: ' + regiao;

    // Adiciona tudo na tela preta da direita
    infoScreen.append(
        nome,
        tipo,
        pesoElemento,
        alturaElemento,
        regiaoElemento
    );
}


{
    async function buscarPokemon(nome) 
    {
    const resposta = await fetch(
        'https://pokeapi.co/api/v2/pokemon/${nome}'
    );

    const pokemon = await resposta.json();

    document.getElementById("pokemon-weight").textContent =
        'Peso: ${pokemon.weight / 10} kg';

    document.getElementById("pokemon-height").textContent =
        'Altura: ${pokemon.height / 10} m';

   }

function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

}