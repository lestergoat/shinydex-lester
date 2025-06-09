async function loadShinies() {
  const response = await fetch('shinydex.json');
  const data = await response.json();

  const container = document.getElementById('pokemon-container');
  const totalShinies = data.length;
  const nationalDexTotal = 1010; // À adapter selon ta version cible
  const progression = ((totalShinies / nationalDexTotal) * 100).toFixed(1);

  // Affiche la progression
  document.getElementById('progression').innerHTML = `
    <h3>Progression : ${totalShinies} / ${nationalDexTotal} (${progression}%)</h3>
  `;

  // Affiche les Pokémon shiny
  data.forEach(pokemon => {
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
}

document.addEventListener('DOMContentLoaded', loadShinies);
