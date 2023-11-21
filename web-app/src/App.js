import { useState, useEffect } from "react";
import "./App.css";

// CYCLE DE VIE du composant App :
// 1. rendu initial (avec les valeurs d'état initiales)
// 2. exécution de l'action du 'useEffect' : mise à jour de l'état
// 3. ce qui fait automatiquement un nouveau rendu

function App() {
  //déclarer l'état pour stocker les notes
  const [notes, setNotes] = useState(null);
  //action à exécuter : récupérer les notes et les mettre dans l'état
  async function fetchNotes() {
    //Définition de la fonction qui va permettre de récupérer les notes
    const response = await fetch("/notes"); //Pas besoin de préciser "http://localhost:4000..."
    const data = await response.json(); //Récupération du contenu du json (donc des notes) dans la variable data
    setNotes(data.reverse()); //Affectation du contenu de la variable data dans la variable notes, dans l'ordre inversé avec reverse()
  }

  async function AddNote() {
    const newNote = {
      title: "Nouvelle note",
      content: "Contenu de la note",
    };

    const requestOptions = {
      // Définition des options de la requête
      method: "POST", // Pour définir le type de la requête (POST = Ajout)
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    };

    const response = await fetch("/notes", requestOptions); // Envoi de la requête avec les options défini précédemment

    fetchNotes(); // On appelle la fonction fetchNotes pour rafraichir l'affichage des notes en même temps (presque, en vrai juste après) que la création d'une nouvelle
  }

  useEffect(function () {
    // Définition de l'action qui va être réalisée au chargement de la page
    fetchNotes();
  }, []); //le tableau vide "[]" fait que l'action ne se fera qu'une seule fois

  return (
    //Création/Modification du code HTML
    <>
      <aside className="Side">
        <button className="Button-create-note" onClick={AddNote /* Appel de la fonction AddNote au clic du bouton */}>
          +
        </button>
        {notes !== null // SI notes n'est pas NULL
          ? notes.map(
              (note //ALORS on consulte l'objet json "notes"
              ) => (
                <div>
                  <h1>{note.title /* Partie en JS pour récupéré le titre des notes*/}</h1>
                  <h3>{note.content /* Partie en JS pour récupérer le contenu des notes */}</h3>
                </div>
              )
            )
          : null /* SINON on ne renvoie rien */}
      </aside>
      <main className="Main"></main>
    </>
  );
}

export default App;
