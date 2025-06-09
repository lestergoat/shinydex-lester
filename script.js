const nationalDexTotal = 1010; // Nombre total de Pokémon dans le Pokédex national

// Fonction pour basculer entre les onglets
function setupTabs() {
  const buttons = document.querySelectorAll('.tab-button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // Enlever la classe active sur tous les boutons
      buttons.forEach(b => b.classList.remove('active'));
      // Ajouter la classe active au bouton cliqué
      button.classList.add('active');

      // Cacher tous les contenus
      document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
      });
      // Afficher le contenu lié au bouton
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).style.display = 'block';
    });
  });
}

// Charge le fichier JSON et affiche les shinys + pokémons manquants
async function loadShinies() {
  try {
    const response = await fetch('shinydex.json');
    if (!response.ok) throw new Error("Fichier introuvable ou inaccessible");

    const data = await response.json();

    const container = document.getElementById('pokemon-container');
    container.innerHTML = '';

    const totalShinies = data.length;
    const progression = ((totalShinies / nationalDexTotal) * 100).toFixed(1);

    document.getElementById('progression').innerHTML = `
      <h3>Progression : ${totalShinies} / ${nationalDexTotal} (${progression}%)</h3>
    `;

    // Affiche chaque shiny dans une carte
    data.forEach(pokemon => {
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

    // Génère la liste des pokémons manquants
    generateMissingList(data);

  } catch (error) {
    document.getElementById('pokemon-container').innerHTML = `
      <p style="color: red;">Erreur : ${error.message}</p>
    `;
  }
}

// Fonction pour générer la liste des pokémons manquants dans le Pokédex
function generateMissingList(caughtPokemons) {
  const missingList = document.getElementById('missing-pokemon-list');
  missingList.innerHTML = '';

  // Création d'un Set avec les numéros attrapés pour lookup rapide
  const caughtSet = new Set(caughtPokemons.map(p => p.numero));

  // On suppose que les numéros vont de 1 à nationalDexTotal
  for (let i = 1; i <= nationalDexTotal; i++) {
    // Format numéro en string à 3 chiffres (ex: 001, 019)
    const numStr = i.toString().padStart(3, '0');

    if (!caughtSet.has(numStr)) {
      // Ajoute la ligne au tableau des pokémons manquants
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>#${numStr}</td><td>Pokémon #${numStr}</td>`;
      missingList.appendChild(tr);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  loadShinies();
});
