import { useParams } from "react-router-dom";
import "./Note.css";
import { useEffect, useState } from "react";

function Note({notes,saveNote,deleteNote}) {
  const [thisNote, setThisNote] = useState(null);
  
  // Récupération de l'id dans l'url avec useParams
  const {id} = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(function () {
      const dataNote = notes.find(element => element.id === Number.parseInt(id));
      setThisNote(dataNote);
      setTitle(dataNote.title);
      setContent(dataNote.content);
  }, [id]); 

  return (
    thisNote !== null /* SI thisNote n'est pas null */ ? ( 
      <form className="Form">
      <input className="Note-editable Note-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="Note-editable Note-content" value={content} onChange={(e) => setContent(e.target.value)}/>
      <div className="Note-actions">
        <button
          className="Button-save-note"
          /* Appel de la fonction saveNote au clic du bouton */
          type="button"
          onClick={function(){
              saveNote(id,title,content)
            } 
          }
        >
          Enregistrer
        </button>
        <button
          className="Button-delete-note"
          /* Appel de la fonction deleteNote au clic du bouton */
          type="button"
          onClick={function(){
              deleteNote(id)
            } 
          }
        >
          Supprimer
        </button>
      </div>  
    </form>
    ) : /* SINON */ <h1>Veuillez sélectionner une note</h1> /* on renvoie ce message */
  );
} 


export default Note;