//components/NewBook.jsx
import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { ALL_BOOKS } from "./Books";
import { ALL_AUTHORS } from "./Authors";

const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title
      author
    }
  }
`;

const NewBook = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }]
  });

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    await addBook({ variables: { title, author, published: Number(published), genres } });

    setTitle("");
    setAuthor("");
    setPublished("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          Title <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          Author <input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div>
          Published(year) <input type="number" value={published} onChange={(e) => setPublished(e.target.value)} />
        </div>
        <div>
          <input value={genre} onChange={(e) => setGenre(e.target.value)} />
          <button type="button" onClick={addGenre}>Add Genre</button>
        </div>
        <div>Genres: {genres.join(", ")}</div>
        <button type="submit">Create Book</button>
      </form>
    </div>
  );
};

export default NewBook;
