const STORAGE_KEY = 'shinydex-lester';

function saveShinies(shinies) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(shinies));
}

function loadShinies() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) return JSON.parse(data);
  // Si aucun dans localStorage, charge shinydex.json via fetch
  return fetch('shinydex.json')
    .then(res => {
      if (!res.ok) throw new Error('shinydex.json introuvable');
      return res.json();
    })
    .catch(() => []);
}

function renderShinies(shinies) {
  const container = document.getElementById('pokemon-container');
  container.innerHTML = '';
  const totalShinies = shinies.length;
  const nationalDexTotal = 1010;
  const progression = ((totalShinies / nationalDexTotal) * 100).toFixed(1);
  document.getElementById('progression').innerHTML = `<h3>Progression : ${totalShinies} / ${nationalDexTotal} (${progression}%)</h3>`;

  shinies.forEach(pokemon => {
    const card = document.createElement('div');
    card.className = 'shiny-card';
    card.innerHTML = `
      <img src="${pokemon.image}" alt="${pokemon.nom}" />
      <div>
        <h4>#${pokemon.numero} ${pokemon.nom}</h4>
        <p><strong>Surnom :</strong> ${pokemon.surnom}</p>
        <p><strong>Sexe :</strong> ${pokemon.sexe}</p>
        <p><strong>Date :</strong> ${pokemon.date}</p>
        <p><strong>Méthode :</strong> ${pokemon.methode}</p>
        <p><strong>Jeu :</strong> ${pokemon.jeu}</p>
        <p><strong>Ball :</strong> ${pokemon.ball}</p>
        <p><strong>Rencontres :</strong> ${pokemon.rencontre}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

async function init() {
  let shinies = await loadShinies();
  if (!Array.isArray(shinies)) shinies = [];

  renderShinies(shinies);

  document.getElementById('add-shiny-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.target;
    const newShiny = {
      numero: form.pokedex.value.padStart(3, '0'),
      nom: form.nom.value,
      surnom: form.surnom.value,
      sexe: form.sexe.value,
      date: form.date.value,
      methode: form.methode.value,
      jeu: form.jeu.value,
      ball: form.ball.value,
      rencontre: form.rencontre.value,
      image: `https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/shiny/${form.nom.value.toLowerCase()}.png`
    };
    shinies.push(newShiny);
    saveShinies(shinies);
    renderShinies(shinies);
    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', init);
