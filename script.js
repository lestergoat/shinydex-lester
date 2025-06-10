let shinies = [];
const pokedex = [];

// Charger le pokedex
fetch("pokedex.json")
  .then(res => res.json())
  .then(data => {
    pokedex.push(...data);
    loadShinies();
    afficherShinies();
    afficherPokedexManquants();
  });

// Le reste du JS peut être ajouté ici (déjà fourni)