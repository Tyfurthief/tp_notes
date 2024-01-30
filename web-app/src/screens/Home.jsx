import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import Loader from "../components/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import Forms from "../components/Forms";

export default function Home() {
    // Déclaration de l'état pour stocker les notes
    const [notes, setNotes] = useState(null);

    // Déclaration de l'état pour stocker les profils utilisateurs
    const [profile, setProfile] = useState(null);

    // Déclaration de la variable pour le loading
    const [loading, setLoading] = useState(false);

    const { id } = useParams();

    // Déclaration pour la navigation (note à afficher)
    const navigate = useNavigate();

    // Action à exécuter : récupérer les notes et les mettre dans l'état
    async function fetchNotes() {
        // Définition de la fonction qui va permettre de récupérer les notes
        const response = await fetch("/notes?_sort=updatedAt&_order=desc"); //Pas besoin de préciser "..."
        const data = await response.json(); // Récupération du contenu du json (donc des notes) dans la variable data
        setNotes(data); // Affectation du contenu de la variable data dans la variable notes, dans l'ordre inversé avec reverse()
        setLoading(false);
    };


    // Récupération les informations de l'utilisateur
    async function fetchProfile() {
        // Définition de la fonction qui va permettre de récupérer les notes
        const response = await fetch("/profile");
        const data = await response.json();
        setProfile(data); // Affectation du contenu de la variable data dans la variable profil
        setLoading(false);
    };

    async function addNote() {
        setLoading(true);
        const newNote = { // Définition du modèle affiché par défaut lors de la création d'une note
            title: "Nouvelle note",
            content: "Contenu de la note",
            updatedAt: new Date(),
            createdAt: new Date(),
        };

        const requestOptions = {
            // Définition des options de la requête
            method: "POST", // Pour définir le type de la requête (POST = Ajout)
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newNote),
        };

        const response = await fetch("/notes", requestOptions); // Envoi de la requête avec les options définies précédemment
        const data = await response.json();
        navigate('/notes/' + data.id);

        fetchNotes(); // On appelle la fonction fetchNotes pour rafraichir l'affichage des notes en même temps (presque, juste après en vrai) que la création d'une nouvelle
    };

    // Définition de la fonction de sauvegarde d'une note
    async function saveNote(title, content) {
        setLoading(true);
        const editNote = {
            title: title,
            content: content,
            updatedAt: new Date(),
        };

        const requestOptions = {
            // Définition des options de la requête
            method: "PATCH", // Pour définir le type de la requête (PATCH = Modification par incrémentation (on ne remplace pas toutes la note mais uniquement les changements))
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editNote),
        };

        await fetch("/notes/" + id, requestOptions); // Envoi de la requête avec les options définies précédemment

        fetchNotes();
        toast.success("Sauvegarde effectuée.", { position: "bottom-center", autoClose: 1500, hideProgressBar: true }); // Message de confirmation de save via ToastContainer
    };

    // Définition de la fonction de suppression d'une note
    async function deleteNote() {
        setLoading(true);

        const requestOptions = {
            // Définition des options de la requête
            method: "DELETE", // Pour définir le type de la requête (DELETE = Suppression)
            headers: { "Content-Type": "application/json" },
        };

        await fetch("/notes/" + id, requestOptions); // Envoi de la requête avec les options définies précédemment

        fetchNotes();
        toast.success("Suppression effectuée.", { position: "bottom-center", autoClose: 1500, hideProgressBar: true }); // Message de confirmation de la suppression via ToastContainer
    };

    // Définition de la fonction pour le "check" d'une note
    async function updateCheck(noteId, checked) {
        const editNote = {
            checked: checked,
            updatedAt: new Date(),
        };

        const requestOptions = {
            // Définition des options de la requête
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editNote),
        };

        await fetch("/notes/" + noteId, requestOptions); // Envoi de la requête avec les options définies précédemment

        fetchNotes();
    };

    // Définition de la fonction pour chercher une note
    function searchNote(value) {
        const noteFounded = notes.find((note) => note.title.toLowerCase().includes(value) || note.content.toLowerCase().includes(value));
        if (noteFounded) {
            navigate('/notes/' + noteFounded.id); // "Redirection" sur la note trouvée
        };
    }

    // Définition de la fonction pour formater correctement la date
    function formaterDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', options);
    }

    useEffect(function () {
        setLoading(true);
        // Définition de l'action qui va être réalisée au chargement de la page
        fetchNotes();
        fetchProfile();
    }, []); //le tableau vide "[]" fait que l'action ne se fera qu'une seule fois

    return (
        <div>
            <aside className="Side">
                <div>
                    <div className="Header-Create-Note">
                        <button className="Button-create-note" onClick={addNote}>
                            Nouvelle note
                        </button>
                        {loading ? <Loader /> : null}
                    </div>
                    {notes ?
                        <ol className="Notes-list">
                            {notes.map((note) => (
                                <div key={note.id} className="Notes-Lists">
                                    <li>
                                        <Link className={`Note-link ${note.id === Number.parseInt(id) ? "active" : ""}`} to={`/notes/${note.id}`}>
                                            {note.title}
                                            <div className={"Note-link-lastUpdatedAt"} to={`/notes/${note.id}`}>
                                                {formaterDate(note.updatedAt)}
                                            </div>
                                        </Link>
                                    </li>
                                    <input
                                        type="checkbox"
                                        name="checked"
                                        defaultChecked={note.checked}
                                        onChange={function (e) {
                                            updateCheck(note.id, e.target.checked)
                                        }}
                                    />
                                </div>
                            ))}
                        </ol> : null}
                    {profile ? <p className="User">Hello {profile.name} 👋</p> : null}
                </div>
            </aside>
            {notes ?
                <main className="Main">
                    <Forms
                        note={notes.find((note) => note.id === Number.parseInt(id))}
                        saveNote={saveNote}
                        deleteNote={deleteNote}
                        searchNote={searchNote}
                    />
                </main> : null}
        </div>
    )
}