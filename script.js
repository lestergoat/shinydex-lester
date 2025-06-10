de// Données de base (shinies ajoutés)
let shinies = [];

// Données pokédex complètes (exemple, à compléter ou charger d’un JSON)
const pokedex = [
  { numero: "001", nom: "Bulbizarre", versions: ["normal", "alola"], type: ["Plante", "Poison"] },
  { numero: "019", nom: "Rattata", versions: ["normal", "alola"], type: ["Normal"] },
  { numero: "045", nom: "Rafflesia", versions: ["normal"], type: ["Plante", "Poison"] },
  { numero: "006", nom: "Dracaufeu", versions: ["normal", "mega"], type: ["Feu", "Vol"] },
  { numero: "483", nom: "Dialga", versions: ["normal"], type: ["Acier", "Dragon"] },
  // ... compléter la liste réelle ...
];

// Filtres appliqués
let filtreJeu = "Tous";
let filtreType = "Tous";
let filtreMethode = "Tous";

function saveShinies() {
  localStorage.setItem("shinies", JSON.stringify(shinies));
}

function loadShinies() {
  const data = localStorage.getItem("shinies");
  if (data) {
    shinies = JSON.parse(data);
  } else {
    shinies = [];
  }
}

function afficherProgression() {
  const totalShinies = shinies.length;
  const nationalDexTotal = pokedex.length;
  const progression = ((totalShinies / nationalDexTotal) * 100).toFixed(1);
  document.getElementById("progression").textContent = `Progression : ${totalShinies} / ${nationalDexTotal} (${progression}%)`;
}

function creerCarte(pokemon, index) {
  const card = document.createElement("div");
  card.className = "shiny-card";

  card.innerHTML = `
    <img src="${pokemon.image}" alt="${pokemon.nom}" />
    <div class="info">
      <h4>#${pokemon.numero} ${pokemon.nom} (${pokemon.version || "normal"})</h4>
      <p><strong>Surnom :</strong> ${pokemon.surnom}</p>
      <p><strong>Sexe :</strong> ${pokemon.sexe}</p>
      <p><strong>Date :</strong> ${pokemon.date}</p>
      <p><strong>Méthode :</strong> ${pokemon.methode}</p>
      <p><strong>Jeu :</strong> ${pokemon.jeu}</p>
      <p><strong>Ball :</strong> <img src="${pokemon.ballImage || ''}" alt="${pokemon.ball}" style="width:24px; vertical-align:middle;"> ${pokemon.ball}</p>
      <p><strong>Rencontres :</strong> ${pokemon.rencontre}</p>
      <p><strong>Lieu d'obtention :</strong> ${pokemon.lieu || 'Inconnu'}</p>
      <button data-index="${index}" class="edit-btn">Modifier</button>
    </div>
  `;
  return card;
}

function afficherShinies() {
  const container = document.getElementById("pokemon-container");
  container.innerHTML = "";

  // Appliquer filtres
  let filtered = shinies.filter(p => {
    return (filtreJeu === "Tous" || p.jeu === filtreJeu) &&
           (filtreType === "Tous" || (p.type && p.type.includes(filtreType))) &&
           (filtreMethode === "Tous" || p.methode === filtreMethode);
  });

  filtered.forEach((pokemon, i) => {
    container.appendChild(creerCarte(pokemon, i));
  });

  afficherProgression();

  // Ajouter gestion modification
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.onclick = () => {
      ouvrirFormulaireEdition(btn.dataset.index);
    };
  });
}

function afficherPokedexManquants() {
  const tbody = document.getElementById("missing-pokemon-list");
  tbody.innerHTML = "";

  // Numéros shiny capturés
  const capturés = new Set(shinies.map(p => p.numero));

  pokedex.forEach(p => {
    if (!capturés.has(p.numero)) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.numero}</td>
        <td>${p.nom}</td>
      `;
      tbody.appendChild(tr);
    }
  });
}

// Ouvrir formulaire de modification
function ouvrirFormulaireEdition(index) {
  const pokemon = shinies[index];
  const form = document.getElementById("add-shiny-form");
  form.dataset.editIndex = index;

  form.pokedex.value = pokemon.numero;
  form.nom.value = pokemon.nom;
  form.surnom.value = pokemon.surnom;
  form.sexe.value = pokemon.sexe;
  form.date.value = pokemon.date;
  form.methode.value = pokemon.methode;
  form.jeu.value = pokemon.jeu;
  form.ball.value = pokemon.ball;
  form.rencontre.value = pokemon.rencontre;
  form.lieu.value = pokemon.lieu || "";
  form.version.value = pokemon.version || "normal";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function ajouterOuModifierShiny(event) {
  event.preventDefault();
  const form = event.target;

  const nouveauPokemon = {
    numero: form.pokedex.value,
    nom: form.nom.value,
    surnom: form.surnom.value,
    sexe: form.sexe.value,
    date: form.date.value,
    methode: form.methode.value,
    jeu: form.jeu.value,
    ball: form.ball.value,
    ballImage: getBallImage(form.ball.value),
    rencontre: form.rencontre.value,
    lieu: form.lieu.value,
    version: form.version.value,
    image: getPokemonImage(form.numero.value, form.version.value)
  };

  if (form.dataset.editIndex !== undefined) {
    shinies[form.dataset.editIndex] = nouveauPokemon;
    delete form.dataset.editIndex;
  } else {
    shinies.push(nouveauPokemon);
  }

  saveShinies();
  afficherShinies();
  afficherPokedexManquants();
  form.reset();
}

function getPokemonImage(numero, version) {
  const baseUrl = "https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/shiny/";
  // Exemple simple: on ajoute version dans URL si besoin, sinon normal
  if (version && version !== "normal") {
    if (version === "alola") {
      return baseUrl + "alolan/" + padNumero(numero) + ".png";
    }
    if (version === "mega") {
      return baseUrl + "mega/" + padNumero(numero) + ".png";
    }
  }
  return baseUrl + padNumero(numero) + ".png";
}

function getBallImage(ballName) {
  // Simple mapping, à enrichir avec URL réelles des images de balls
  const balls = {
    "Soin Ball": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/safariball.png",
    "Poké Ball": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/pokeball.png",
    "Super Ball": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/greatball.png",
    "Hyper Ball": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultraball.png",
    // Ajoute d'autres balls ici
  };
  return balls[ballName] || "";
}

function padNumero(numero) {
  return numero.toString().padStart(3, "0");
}

// Gestion onglets
document.querySelectorAll(".tab-button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.dataset.tab;
    document.querySelectorAll(".tab-content").forEach(c => {
      c.style.display = c.id === tab ? "block" : "none";
    });
  });
});

// Gestion filtres
function creerFiltres() {
  const filtresDiv = document.createElement("div");
  filtresDiv.id = "filters";

  // Jeu
  const jeux = ["Tous", ...new Set(shinies.map(p => p.jeu))];
  const selectJeu = document.createElement("select");
  selectJeu.id = "filtre-jeu";
  selectJeu.innerHTML = jeux.map(j => `<option>${j}</option>`).join("");
  filtresDiv.appendChild(creerLabelSelect("Jeu", selectJeu));
  selectJeu.onchange = () => {
    filtreJeu = selectJeu.value;
    afficherShinies();
  };

  // Méthode
  const methodes = ["Tous", ...new Set(shinies.map(p => p.methode))];
  const selectMethode = document.createElement("select");
  selectMethode.id = "filtre-methode";
  selectMethode.innerHTML = methodes.map(m => `<option>${m}</option>`).join("");
  filtresDiv.appendChild(creerLabelSelect("Méthode", selectMethode));
  selectM
// Gestion des onglets
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    const tab = button.dataset.tab;

    // Retire la classe active de tous les boutons
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    // Cache tout le contenu
    document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');

    // Active le bon onglet
    button.classList.add('active');
    document.getElementById(tab).style.display = 'block';
  });
