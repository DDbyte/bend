//
import { useQuery, gql } from "@apollo/client";

const ME = gql`
  query {
    me {
      favoriteGenre
    }
  }
`;

const ALL_BOOKS = gql`
  query AllBooks($genre: String!) {
    allBooks(genre: $genre) {
      title
      author {
        name
      }
      published
    }
  }
`;

const RecommendedBooks = () => {
  const { data: meData, loading: meLoading } = useQuery(ME);

  if (meLoading) return <p>Loading user info...</p>;
  const favoriteGenre = meData.me.favoriteGenre;

  const { data, loading } = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
  });

  if (loading) return <p>Loading books...</p>;

  return (
    <div>
      <h2>Recommended Books (Genre: {favoriteGenre})</h2>
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

export default RecommendedBooks
