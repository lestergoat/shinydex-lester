async function loadShinies() {
  try {
    const response = await fetch('shinydex.json');
    if (!response.ok) throw new Error("Fichier introuvable ou inaccessible");

    const data = await response.json();

    const container = document.getElementById('pokemon-container');
    const totalShinies = data.length;
    const nationalDexTotal = 1010;
    const progression = ((totalShinies / nationalDexTotal) * 100).toFixed(1);

    document.getElementById('progression').innerHTML = `
      <h3>Progression : ${totalShinies} / ${nationalDexTotal} (${progression}%)</h3>
    `;

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

  } catch (error) {
    document.getElementById('pokemon-container').innerHTML = `
      <p style="color: red;">Erreur : ${error.message}</p>
    `;
  }
}

document.addEventListener('DOMContentLoaded', loadShinies);
