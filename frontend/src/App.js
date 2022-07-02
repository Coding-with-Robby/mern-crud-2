import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  // State
  const [notes, setNotes] = useState(null);
  const [createForm, setCreateForm] = useState({
    title: "",
    body: "",
  });
  const [updateForm, setUpdateForm] = useState({
    _id: null,
    title: "",
    body: "",
  });

  // Use effect
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    // Fetch the notes
    const res = await axios.get("http://localhost:3000/notes");

    // Set to state
    setNotes(res.data.notes);
  };

  const updateCreateFormField = (e) => {
    const { name, value } = e.target;

    setCreateForm({
      ...createForm,
      [name]: value,
    });
  };

  const createNote = async (e) => {
    e.preventDefault();

    const res = await axios.post("http://localhost:3000/notes", createForm);

    setNotes([...notes, res.data.note]);

    setCreateForm({
      title: "",
      body: "",
    });
  };

  const deleteNote = async (_id) => {
    // Delete the note
    const res = await axios.delete(`http://localhost:3000/notes/${_id}`);

    // Update state
    const newNotes = [...notes].filter((note) => {
      return note._id !== _id;
    });

    setNotes(newNotes);
  };

  const handleUpdateFieldChange = (e) => {
    const { value, name } = e.target;

    setUpdateForm({
      ...updateForm,
      [name]: value,
    });
  };

  const toggleUpdate = (note) => {
    // Set state on update form
    setUpdateForm({ title: note.title, body: note.body, _id: note._id });
  };

  const updateNote = async (e) => {
    e.preventDefault();

    const { title, body } = updateForm;

    // Send the update request
    const res = await axios.put(
      `http://localhost:3000/notes/${updateForm._id}`,
      { title, body }
    );

    // Update state
    const newNotes = [...notes];
    const noteIndex = notes.findIndex((note) => {
      return note._id === updateForm._id;
    });
    newNotes[noteIndex] = res.data.note;

    setNotes(newNotes);

    // Clear update form state
    setUpdateForm({
      _id: null,
      title: "",
      body: "",
    });
  };

  return (
    <div className="App">
      <div>
        <h2>Notes:</h2>
        {notes &&
          notes.map((note) => {
            return (
              <div key={note._id}>
                <h3>{note.title}</h3>
                <button onClick={() => deleteNote(note._id)}>
                  Delete note
                </button>
                <button onClick={() => toggleUpdate(note)}>Update note</button>
              </div>
            );
          })}
      </div>

      {updateForm._id && (
        <div>
          <h2>Update note</h2>
          <form onSubmit={updateNote}>
            <input
              onChange={handleUpdateFieldChange}
              value={updateForm.title}
              name="title"
            />
            <textarea
              onChange={handleUpdateFieldChange}
              value={updateForm.body}
              name="body"
            />
            <button type="submit">Update note</button>
          </form>
        </div>
      )}

      {!updateForm._id && (
        <div>
          <h2>Create note</h2>
          <form onSubmit={createNote}>
            <input
              onChange={updateCreateFormField}
              value={createForm.title}
              name="title"
            />
            <textarea
              onChange={updateCreateFormField}
              value={createForm.body}
              name="body"
            />
            <button type="submit">Create note</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
