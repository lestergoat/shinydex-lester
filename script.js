fetch('shinydex.json')
  .then(res => res.json())
  .then(data => {
    const shinyContainer = document.getElementById('shinydex');
    const progression = document.getElementById('progression');
    const total = 1025;
    progression.textContent = `Shiny capturés : ${data.length} / ${total} (${((data.length / total) * 100).toFixed(2)}%)`;

    data.forEach(pokemon => {
      const div = document.createElement('div');
      div.className = 'shiny-card';
      div.innerHTML = `
        <h2>#${pokemon.numero} - ${pokemon.nom} (${pokemon.surnom})</h2>
        <p>Sexe : ${pokemon.sexe}</p>
        <p>Date : ${pokemon.date}</p>
        <p>Méthode : ${pokemon.methode}</p>
        <p>Jeu : ${pokemon.jeu}</p>
        <p>Rencontres : ${pokemon.rencontre}</p>
        <p>Ball : ${pokemon.ball}</p>
        <img src="${pokemon.image}" alt="Shiny ${pokemon.nom}" width="100">
      `;
      shinyContainer.appendChild(div);
    });
  });