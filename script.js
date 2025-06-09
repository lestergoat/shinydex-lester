const nationalDexTotal = 1010; // nombre total de Pokémon dans le Pokédex national

let shinies = []; // liste des shinies chargés

// Charge les shinies depuis le JSON
async function loadShinies() {
  try {
    const response = await fetch('shinydex.json');
    if (!response.ok) throw new Error("Fichier shinydex.json introuvable");

    shinies = await response.json();
    afficherShinies();
    afficherProgression();
    afficherManquants();
  } catch (e) {
    document.getElementById('pokemon-container').innerHTML = `<p style="color:red">${e.message}</p>`;
  }
}

// Affiche la progression (nombre de shinies / total)
function afficherProgression() {
  const progression = ((shinies.length / nationalDexTotal) * 100).toFixed(1);
  document.getElementById('progression').innerHTML = `Progression : ${shinies.length} / ${nationalDexTotal} (${progression}%)`;
}

// Affiche les cartes shinies dans l’onglet shinydex
function afficherShinies() {
  const container = document.getElementById('pokemon-container');
  container.innerHTML = '';
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

// Affiche la liste des pokémons manquants
function afficherManquants() {
  const tbody = document.getElementById('missing-pokemon-list');
  tbody.innerHTML = '';

  // On crée un Set des numéros de pokémon shiny capturés pour accélérer la recherche
  const shinyNums = new Set(shinies.map(s => s.numero));

  // On affiche tous les pokémons manquants
  for(let i=1; i<=nationalDexTotal; i++) {
    const numStr = i.toString().padStart(3, '0');
    if (!shinyNums.has(numStr)) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>#${numStr}</td><td>Pokémon #${numStr}</td>`;
      tbody.appendChild(tr);
    }
  }
}

// Gère le changement d’onglet
function setupTabs() {
  const tabs = document.querySelectorAll('.tab-button');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const tabId = tab.dataset.tab;
      document.querySelectorAll('.tab-content').forEach(tc => {
        tc.style.display = (tc.id === tabId) ? 'block' : 'none';
      });
    });
  });
}

// Ajoute un nouveau shiny depuis le formulaire
function setupForm() {
  const form = document.getElementById('add-shiny-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(form);
    const newShiny = {
      numero: formData.get('pokedex').padStart(3, '0'),
      nom: formData.get('nom'),
      surnom: formData.get('surnom'),
      sexe: formData.get('sexe'),
      date: formData.get('date'),
      methode: formData.get('methode'),
      jeu: formData.get('jeu'),
      ball: formData.get('ball'),
      rencontre: formData.get('rencontre'),
      image: getImageUrl(formData.get('nom')) // fonction pour générer l'url de l'image shiny
    };
    // Vérifie que ce shiny n’existe pas déjà
    if(shinies.some(s => s.numero === newShiny.numero)) {
      alert('Ce Pokémon shiny est déjà enregistré.');
      return;
    }
    shinies.push(newShiny);
    afficherShinies();
    afficherProgression();
    afficherManquants();
    form.reset();
  });
}

// Fonction simple pour créer une URL d’image shiny à partir du nom (tu peux adapter selon ta source d’images)
function getImageUrl(nom) {
  // ex : https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/shiny/rattata.png
  // convertit nom en minuscules et remplace espaces par tirets
  const formatted = nom.toLowerCase().replace(/ /g, '-');
  return `https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/shiny/${formatted}.png`;
}

document.addEventListener('DOMContentLoaded', () => {
  loadShinies();
  setupTabs();
  setupForm();
});
