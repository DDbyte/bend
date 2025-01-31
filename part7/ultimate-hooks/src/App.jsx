import { useField } from './useField';
import useResource from './useResource'; // Import the custom hook
import './App.css'


const App = () => {
  const content = useField('text');
  const name = useField('text');
  const number = useField('text');

  // UseResource automatically fetches notes and persons
  const [notes, noteService] = useResource('http://localhost:3005/notes');
  const [persons, personService] = useResource('http://localhost:3005/persons');

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    if(content.value) { // Ensure content has a value
      noteService.create({ content: content.value });
      content.reset(); // Reset the input after submission
    }
  };

  const handlePersonSubmit = (event) => {
    event.preventDefault();
    if (name.value && number.value) { // Ensure name and number have values
      personService.create({ name: name.value, number: number.value });
      name.reset(); // Reset the name input after submission
      number.reset(); // Reset the number input after submission
    }
  };

  return (
    <div>
      <h2>Notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content.inputprops} />
        <button>create</button>
      </form>
      {notes.map(n => <li key={n.id}>{n.content}</li>)}

      <h2>Persons</h2>
      <form onSubmit={handlePersonSubmit}>
        <div>
          Name: <input {...name.inputprops} />
        </div>
        <div>
          Number: <input {...number.inputprops} />
        </div>
        <button type='submit'>create</button>
      </form>
      {persons.map(p => <li key={p.id}>{p.name} {p.number}</li>)}
    </div>
  )
};

export default App;