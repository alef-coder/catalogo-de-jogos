const container = document.getElementById('games-container');
const API_URL = 'https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=15';

// 1. REGISTRAR O SERVICE WORKER
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log('Service Worker registrado com sucesso!'))
    .catch((erro) => console.log('Falha ao registrar o Service Worker:', erro));
}

// 2. LÓGICA DO BOTÃO DE INSTALAÇÃO DO PWA
let eventoInstalacao;
const btnInstalar = document.getElementById('btn-instalar');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  eventoInstalacao = e;
  if (btnInstalar) {
    btnInstalar.style.display = 'inline-block';
  }
});

if (btnInstalar) {
  btnInstalar.addEventListener('click', async () => {
    if (eventoInstalacao) {
      eventoInstalacao.prompt();
      btnInstalar.style.display = 'none';
      eventoInstalacao = null;
    }
  });
}

// 3. RECURSO DE HARDWARE: Geolocalização
const btnLocalizacao = document.getElementById('btn-localizacao');
const textoLocalizacao = document.getElementById('texto-localizacao');

if (btnLocalizacao) {
  btnLocalizacao.addEventListener('click', () => {
    if (navigator.geolocation) {
      textoLocalizacao.textContent = 'Buscando sua localização...';
      navigator.geolocation.getCurrentPosition(
        (posicao) => {
          const lat = posicao.coords.latitude.toFixed(2);
          const lon = posicao.coords.longitude.toFixed(2);
          textoLocalizacao.textContent = `Sua posição: Lat ${lat}, Lon ${lon}`;
        },
        () => {
          textoLocalizacao.textContent = 'Não foi possível obter sua localização.';
        }
      );
    } else {
      textoLocalizacao.textContent = 'Navegador não suporta geolocalização.';
    }
  });
}

// 4. BUSCAR JOGOS DA API
async function buscarJogos() {
  try {
    const resposta = await fetch(API_URL);
    const dados = await resposta.json();
    exibirJogos(dados.slice(0, 12));
  } catch (erro) {
    container.innerHTML = '<p>Ocorreu um erro ao carregar as ofertas.</p>';
  }
}

function exibirJogos(lista) {
  container.innerHTML = '';

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
