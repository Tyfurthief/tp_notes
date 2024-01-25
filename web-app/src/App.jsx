import { useState, useEffect } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes, useParams } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./App.css";
import Note from "./components/Note";
import Loader from "./components/Loader";

// CYCLE DE VIE du composant App :
// 1. rendu initial (avec les valeurs d'état initiales)
// 2. exécution de l'action du 'useEffect' : mise à jour de l'état
// 3. ce qui fait automatiquement un nouveau rendu

function App() {
  //déclarer l'état pour stocker les notes
  const [notes, setNotes] = useState(null);

  // déclaration de la variable qui stocke la note actuelle
  const [currentNote, setCurrentNote] = useState(null);

  // déclaration de la variable pour le loading
  const [loading, setLoading] = useState(false);
  
  //action à exécuter : récupérer les notes et les mettre dans l'état
  async function fetchNotes() {
    //Définition de la fonction qui va permettre de récupérer les notes
    const response = await fetch("/notes"); //Pas besoin de préciser "http://localhost:4000..."
    const data = await response.json(); //Récupération du contenu du json (donc des notes) dans la variable data
    setNotes(data.reverse()); //Affectation du contenu de la variable data dans la variable notes, dans l'ordre inversé avec reverse()
    setLoading(false);
  }

  // function getCurrentNote(){
  //   // (notes.filter(element => console.log(element.id,Number.parseInt(id) )))
  //   setCurrentNote(notes.filter(element => element.id === Number.parseInt(id)[0]));
  // }

  async function addNote() {
    setLoading(true);
    const newNote = { // Définition du modèle affiché par défaut lors de la création d'une note
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

  // Définition de la fonction de sauvegarde d'une note
  async function saveNote(id, title, content){
    setLoading(true);
    const editNote = { // Définition du modèle affiché par défaut lors de la création d'une note
      title: title,
      content: content,
    };

    const requestOptions = {
      // Définition des options de la requête
      method: "PUT", // Pour définir le type de la requête (PUT = Modification)
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editNote),
    };

    const response = await fetch("http://localhost:4000/notes/"+id, requestOptions); // Envoi de la requête avec les options défini précédemment

    fetchNotes();
    toast.success("Sauvegarde effectuée.",{position:"bottom-center", autoClose:1500}); // Message de confirmation de save via ToastContainer
  }

  // Définition de la fonction de suppression d'une note
  function deleteNote(){
    
  }

  useEffect(function () {
    // Définition de l'action qui va être réalisée au chargement de la page
    fetchNotes();
  }, []); //le tableau vide "[]" fait que l'action ne se fera qu'une seule fois

  return (
    //Création/Modification du code HTML
    <BrowserRouter>
      <aside className="Side">
        <div>
          <button className="Button-create-note" onClick={addNote /* Appel de la fonction addNote au clic du bouton */}>
            +
          </button>
          {loading /* SI loading est true */ ? <Loader/> /* ALORS le bouton loading s'affiche en appelant le composant GifLoading*/
            : null /* SINON on ne l'affiche pas */ }
          {notes !== null /* SI notes n'est pas NULL */ ? ( 
            <ol className="Notes-list">
            {notes.map((note /*ALORS on consulte l'objet json "notes"*/) => (
                  <li key={note.id}>
                    <Link className="Note-link" to={`/notes/${note.id}`}> 
                      {note.title /* Partie en JS pour récupéré le titre des notes*/}
                    </Link>
                  </li>
              ))}
            </ol>
          ) : null /* SINON on ne renvoie rien */}
        </div>
      </aside>
      {notes !== null ? 
        <main className="Main">
          <Routes>
          <Route path="/" element="Sélectionner une note" />
          <Route path="/notes/:id" element={<Note notes={notes} saveNote={saveNote} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </main>
        : <Loader/> 
      }
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
