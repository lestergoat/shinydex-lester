// script.js

let shinydex = []; // Cette variable contiendra les Pokémon chargés

// Charger les données depuis shinydex.json
fetch('shinydex.json')
  .then(response => response.json())
  .then(data => {
    shinydex = data;
    afficherPokemons();
  });

// Fonction pour afficher les Pokémon dans la page
function afficherPokemons() {
  const container = document.getElementById('pokemon-container');
  container.innerHTML = ''; // Vide avant d’afficher

  shinydex.forEach(pokemon => {
    const card = document.createElement('div');
    card.className = 'pokemon-card';

    card.innerHTML = `
      <img src="${pokemon.image}" alt="${pokemon.nom}">
      <div class="pokemon-info">
        <h2>${pokemon.nom} (#${pokemon.pokedex})</h2>
        <p><strong>Surnom:</strong> ${pokemon.surnom}</p>
        <p><strong>Sexe:</strong> ${pokemon.sexe}</p>
        <p><strong>Date:</strong> ${pokemon.date}</p>
        <p><strong>Méthode:</strong> ${pokemon.methode}</p>
        <p><strong>Jeu:</strong> ${pokemon.jeu}</p>
        <p><strong>Ball:</strong> ${pokemon.ball}</p>
        <p><strong>Rencontre:</strong> ${pokemon.rencontre}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

// Fonction pour ajouter un nouveau shiny depuis le formulaire
function ajouterPokemon(event) {
  event.preventDefault();

  const form = event.target;

  const nouveauPokemon = {
    pokedex: form.pokedex.value,
    nom: form.nom.value,
    surnom: form.surnom.value,
    sexe: form.sexe.value,
    date: form.date.value,
    methode: form.methode.value,
    jeu: form.jeu.value,
    ball: form.ball.value,
    rencontre: form.rencontre.value,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${form.pokedex.value}.png`
  };

  shinydex.push(nouveauPokemon);
  afficherPokemons();

  form.reset(); // vide le formulaire
}

// Ajouter un écouteur sur le formulaire (assure-toi que le formulaire a l’id "add-shiny-form")
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('add-shiny-form');
  if (form) {
    form.addEventListener('submit', ajouterPokemon);
  }
});
