// Liste des troupes avec leur coût en espace
const troops = [
    { name: "Barbare", space: 1 },
    { name: "Archère", space: 1 },
    { name: "Géant", space: 5 },
    { name: "Gobelin", space: 1 },
    { name: "Sapeur", space: 2 },
    { name: "Ballon", space: 5 },
    { name: "Sorcier", space: 4 },
    { name: "Guérisseuse", space: 14 },
    { name: "Dragon", space: 20 },
    { name: "P.E.K.K.A", space: 25 },
    { name: "Bébé Dragon", space: 10 },
    { name: "Mineur", space: 6 },
    { name: "Électro-dragon", space: 30 },
    { name: "Yéti", space: 18 },
    { name: "Chevaucheur de dragon", space: 25 },
    { name: "Électro-titanide", space: 32 },
    { name: "Cavalière sylvestre", space: 20 },
    { name: "Gargouille", space: 2 },
    { name: "Chevaucheur de cochon", space: 5 },
    { name: "Valkyrie", space: 8 },
    { name: "Golem", space: 30 },
    { name: "Sorcière", space: 12 },
    { name: "Molosse de lave", space: 30 },
    { name: "Bouliste", space: 6 },
    { name: "Golem de glace", space: 15 },
    { name: "Chasseuse de tête", space: 6 },
    { name: "Apprenti gardien", space: 20 },
    { name: "Druide", space: 16 },
];

// Variables pour le joueur et le classement
let playerName = '';
let campSize = 0;
let availableTroops = [];
let victories = 0;

// Événement pour le bouton de démarrage
document.getElementById("startButton").addEventListener("click", () => {
    playerName = document.getElementById("playerName").value;
    const hdvLevel = parseInt(document.getElementById("hdvLevel").value);

    if (!playerName || isNaN(hdvLevel) || hdvLevel < 1) {
        alert("Veuillez entrer un pseudo valide et un niveau d'Hôtel de Ville.");
        return;
    }

    document.getElementById("welcomeContainer").style.display = "none";
    document.getElementById("troopSelectionContainer").style.display = "block";

    // Afficher les cases à cocher pour les troupes disponibles
    const troopCheckboxes = document.getElementById("troopCheckboxes");
    troopCheckboxes.innerHTML = ''; // Réinitialiser le contenu

    troops.forEach(troop => {
        const checkbox = document.createElement("div");
        checkbox.className = "troop-checkbox";
        checkbox.innerHTML = `<input type="checkbox" id="${troop.name}" class="troopCheckbox"> ${troop.name}`;
        troopCheckboxes.appendChild(checkbox);
    });
});

// Événement pour la case à cocher "Tout sélectionner"
document.getElementById("selectAllTroops").addEventListener("change", function() {
    const checkboxes = document.querySelectorAll(".troopCheckbox");
    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked; // Vérifie ou décoche les cases en fonction de l'état de "Tout sélectionner"
    });
});

// Si une case est décochée, la case "Tout sélectionner" se décoche
document.getElementById("troopCheckboxes").addEventListener("change", function(event) {
    if (!event.target.checked) {
        document.getElementById("selectAllTroops").checked = false;
    }
});

// Événement pour le bouton de validation des troupes
document.getElementById("validateTroopsButton").addEventListener("click", () => {
    const selectedTroops = document.querySelectorAll(".troopCheckbox:checked");
    availableTroops = Array.from(selectedTroops).map(checkbox => checkbox.id);

    campSize = parseInt(document.getElementById("campSize").value);
    if (isNaN(campSize) || campSize <= 0) {
        alert("Veuillez entrer une taille de camp valide.");
        return;
    }

    document.getElementById("troopSelectionContainer").style.display = "none";
    document.getElementById("compositionContainer").style.display = "block";
});

// Fonction pour générer une composition aléatoire en fonction de la taille du camp
function generateArmy() {
    let totalSpace = campSize;
    let army = {};
    let currentSpace = 0;

    while (currentSpace < totalSpace) {
        const randomTroop = availableTroops[Math.floor(Math.random() * availableTroops.length)];
        const troopData = troops.find(t => t.name === randomTroop);
        
        if (currentSpace + troopData.space <= totalSpace) {
            army[troopData.name] = (army[troopData.name] || 0) + 1;
            currentSpace += troopData.space;
        }
    }

    return army;
}

// Fonction pour afficher les troupes avec une animation
function displayArmy(army) {
    const armyCompositionDiv = document.getElementById("armyComposition");
    armyCompositionDiv.innerHTML = ""; // Réinitialise le contenu

    Object.keys(army).forEach((troop, index) => {
        const troopElement = document.createElement("div");
        troopElement.classList.add("troop");
        troopElement.innerText = `${troop} x${army[troop]}`;
        armyCompositionDiv.appendChild(troopElement);
        setTimeout(() => {
            troopElement.classList.add("show");
        }, index * 500); // Délai pour l'animation
    });
}

// Événement du bouton de génération de composition (dé)
document.getElementById("generateButton").addEventListener("click", () => {
    const currentArmy = generateArmy();
    displayArmy(currentArmy);
    document.getElementById("compositionContainer").style.display = "none";
    document.getElementById("resultContainer").style.display = "block";
});

// Événements pour le bouton de résultat
document.getElementById("successButton").addEventListener("click", () => {
    victories++;
    updateLeaderboard();
    const currentArmy = document.getElementById("armyComposition").innerText;
    document.getElementById("resultMessage").innerText = `Bravo, ${playerName}! Vous avez réussi votre attaque avec cette composition: \n${currentArmy}`;
    document.getElementById("retryButton").style.display = "block";
});

document.getElementById("failButton").addEventListener("click", () => {
    const currentArmy = document.getElementById("armyComposition").innerText;
    document.getElementById("resultMessage").innerText = `Désolé, ${playerName}. Vous avez échoué avec cette composition: \n${currentArmy}`;
    document.getElementById("retryButton").style.display = "block";
});

// Événement pour le bouton de recommencer
document.getElementById("retryButton").addEventListener("click", () => {
    document.getElementById("resultContainer").style.display = "none";
    document.getElementById("welcomeContainer").style.display = "block";
    victories = 0; // Réinitialiser les victoires
    document.getElementById("leaderboard").innerHTML = ""; // Réinitialiser le classement
});

let victoires = 0; // Initialiser le nombre de victoires
let currentComposition = ''; // Variable pour stocker la composition actuelle

// Fonction pour générer une composition aléatoire
function generateRandomComposition() {
    // Logique pour générer une nouvelle composition
    // Exemple : retournons une chaîne aléatoire (vous devez remplacer cela par votre logique)
    const troops = ['Barbare', 'Archer', 'Géant', 'Sorcier', 'Dragon'];
    const randomTroop = troops[Math.floor(Math.random() * troops.length)];
    return `1x ${randomTroop}`; // Exemple de composition
}

// Initialiser la première composition
currentComposition = generateRandomComposition();

// Afficher la composition initiale
document.getElementById('armyComposition').innerHTML = `Composition initiale : ${currentComposition}`;

// Écouter le clic sur le bouton de succès
document.getElementById('successfulButton').addEventListener('click', function() {
    // Incrémente le score de victoire
    victoires++;

    // Affiche le message de succès avec la composition actuelle
    const armyCompositionDisplay = document.getElementById('armyComposition');
    armyCompositionDisplay.innerHTML = `Bravo, LeGrandSushi! Vous avez réussi votre attaque avec cette composition: ${currentComposition}.`;

    // Affiche le pseudo et le score de victoire
    const scoreDisplay = document.getElementById('scoreDisplay');
    scoreDisplay.innerHTML = `Pseudo : LeGrandSushi, HDV : 16, Victoires : ${victoires}`;

    // Générez une nouvelle composition
    currentComposition = generateRandomComposition(); // Appel de la fonction pour obtenir une nouvelle composition
    
    // Affichez la nouvelle composition
    armyCompositionDisplay.innerHTML += `<br> Nouvelle composition : ${currentComposition}`;
});
