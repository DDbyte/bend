import { useQuery, gql } from "@apollo/client";
import { useState } from "react";

export const ALL_BOOKS = gql`
  query AllBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      author {
        name
      }
      published
    }
  }
`;

const Books = (props) => {
  const [genre, setGenre] = useState(null);
  const { loading, error, data } = useQuery(ALL_BOOKS, { variables: { genre } });

  if (!props.show) {
    return null;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const genres = ["fiction", "non-fiction", "fantasy", "history", "sci-fi"];

  return (
    <div>
      <h2>Books</h2>

      <div>
        <strong>Filter by genre:</strong>
        {genres.map((g) => (
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => setGenre(null)}>All Genres</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {data.allBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
