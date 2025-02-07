//components/NewBook.jsx
import { useMutation, gql } from "@apollo/client";
import { ALL_BOOKS } from "./Books";
import { ALL_AUTHORS } from "./Authors";
import { useState } from "react"; //


const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title
      author {  
        name
      }
    }
  }
`;


const NewBook = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  // Ensure useMutation is correctly defined
  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
  });

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    if (!title || !author || !published || genres.length === 0) {
      alert("All fields are required, including at least one genre.");
      return;
    }

    try {
      await addBook({ variables: { title, author, published: Number(published), genres } });

      // Reset form fields
      setTitle("");
      setAuthor("");
      setPublished("");
      setGenres([]);
      setGenre("");
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <div>
      <h2>Add a New Book</h2>
      <form onSubmit={submit}>
        <div>
          Title: <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          Author: <input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div>
          Published (Year): <input type="number" value={published} onChange={(e) => setPublished(e.target.value)} />
        </div>
        <div>
          Genre: <input value={genre} onChange={(e) => setGenre(e.target.value)} />
          <button type="button" onClick={() => setGenres([...genres, genre])}>Add Genre</button>
        </div>
        <div>Genres: {genres.join(", ")}</div>
        <button type="submit">Create Book</button>
      </form>
    </div>
  );
};

export default NewBook
