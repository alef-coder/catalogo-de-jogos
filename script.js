const container = document.getElementById('games-container');

// AQUI É ONDE COLOCAMOS A API:
const API_URL = 'https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=15';

async function buscarJogos() {
  try {
    // Fazer a requisição para a API
    const resposta = await fetch(API_URL);
    const dados = await resposta.json();

    // Renderizar os 12 primeiros jogos
    exibirJogos(dados.slice(0, 12));
  } catch (erro) {
    container.innerHTML = '<p>Ocorreu um erro ao carregar as ofertas.</p>';
  }
}

function exibirJogos(lista) {
  container.innerHTML = ''; // Limpa a mensagem de carregamento

  lista.forEach(jogo => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${jogo.thumb}" alt="Capa do jogo ${jogo.title}" width="120" height="45" loading="lazy">
      <h2>${jogo.title}</h2>
      <p class="preco">Preço: $${jogo.salePrice}</p>
      <p>Avaliação: ${Math.round(jogo.steamRatingPercent)}% positiva</p>
    `;
    container.appendChild(card);
  });
}

buscarJogos();
