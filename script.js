// Liste des noms de Pokémon (exemple partiel, à compléter avec tous les noms nécessaires)
const pokemonNames = {
  "001": "bulbasaur",
  "002": "ivysaur",
  "003": "venusaur",
  "004": "charmander",
  "005": "charmeleon",
  "006": "charizard",
  "007": "squirtle",
  "008": "wartortle",
  "009": "blastoise",
  "019": "rattata",
  "045": "vileplume",
  // ... ajoute les autres numéros et noms ici
};

function getPokemonName(numStr) {
  return pokemonNames[numStr] || "missingno";
}

const nationalDexTotal = 1010;
let shinies = [];

// Fonction pour afficher les shinys attrapés
function displayCaughtShinies() {
  const container = document.getElementById('pokemon-container');
  container.innerHTML = '';

  shinies.forEach(pokemon => {
    const card = document.createElement('div');
    card.className = 'shiny-card';
    card.innerHTML = `
      <img src="${pokemon.image}" alt="${pokemon.nom}" />
      <h4>#${pokemon.numero} ${pokemon.nom}</h4>
      <p><strong>Surnom :</strong> ${pokemon.surnom}</p>
      <p><strong>Sexe :</strong> ${pokemon.sexe}</p>
      <p><strong>Date :</strong> ${pokemon.date}</p>
      <p><strong>Méthode :</strong> ${pokemon.methode}</p>
      <p><strong>Jeu :</strong> ${pokemon.jeu}</p>
      <p><strong>Ball :</strong> ${pokemon.ball}</p>
      <p><strong>Rencontres :</strong> ${pokemon.rencontre}</p>
    `;
    container.appendChild(card);
  });

  // Mise à jour de la progression
  const totalShinies = shinies.length;
  const progression = ((totalShinies / nationalDexTotal) * 100).toFixed(1);
  document.getElementById('progression').innerHTML = `
    <h3>Progression : ${totalShinies} / ${nationalDexTotal} (${progression}%)</h3>
  `;
}

// Fonction pour générer la liste des Pokémon manquants avec image et nom
function generateMissingList() {
  const missingList = document.getElementById('missing-pokemon-list');
  missingList.innerHTML = '';

  const caughtSet = new Set(shinies.map(p => p.numero));

  for (let i = 1; i <= nationalDexTotal; i++) {
    const numStr = i.toString().padStart(3, '0');
    if (!caughtSet.has(numStr)) {
      const name = getPokemonName(numStr);
      const imageUrl = `https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/shiny/${name}.png`;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${imageUrl}" alt="Pokémon #${numStr}" style="width:40px; height:40px;"></td>
        <td>#${numStr}</td>
        <td>${name}</td>
      `;
      missingList.appendChild(tr);
    }
  }
}

// Fonction pour charger la liste des shinys depuis le JSON
async function loadShinies() {
  try {
    const response = await fetch('shinydex.json');
    if (!response.ok) throw new Error("Fichier shinydex.json introuvable ou inaccessible");

    shinies = await response.json();

    // Afficher les shinys et la liste manquante
    displayCaughtShinies();
    generateMissingList();

  } catch (error) {
    document.getElementById('pokemon-container').innerHTML = `
      <p style="color: red;">Erreur : ${error.message}</p>
    `;
  }
}

// Fonction pour créer l’URL de l’image shiny lors de l’ajout manuel
function createImageUrl(numStr) {
  const name = getPokemonName(numStr);
  return `https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/shiny/${name}.png`;
}

// Gestionnaire du formulaire d’ajout
function setupAddShinyForm() {
  const form = document.getElementById('add-shiny-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const numero = formData.get('pokedex').toString().padStart(3, '0');
    const nom = formData.get('nom');
    const surnom = formData.get('surnom');
    const sexe = formData.get('sexe');
    const date = formData.get('date');
    const methode = formData.get('methode');
    const jeu = formData.get('jeu');
    const ball = formData.get('ball');
    const rencontre = formData.get('rencontre');

    // Créer l'objet shiny à ajouter
    const newShiny = {
      numero: numero,
      nom: nom,
      surnom: surnom,
      sexe: sexe,
      date: date,
      methode: methode,
      jeu: jeu,
      ball: ball,
      rencontre: rencontre,
      image: createImageUrl(numero)
    };

    // Ajouter au tableau et rafraîchir affichage
    shinies.push(newShiny);
    displayCaughtShinies();
    generateMissingList();

    form.reset();
  });
}

// Au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  loadShinies();
  setupAddShinyForm();
});
