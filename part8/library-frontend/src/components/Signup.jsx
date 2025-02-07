import { useState } from "react";
import { useMutation, gql } from "@apollo/client";

const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!, $favoriteGenre: String!) {
    createUser(username: $username, password: $password, favoriteGenre: $favoriteGenre) {
      username
      favoriteGenre
    }
  }
`;

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [favoriteGenre, setFavoriteGenre] = useState("");

  const [createUser, { data, error }] = useMutation(CREATE_USER);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createUser({ variables: { username, password, favoriteGenre } });
      alert("User created successfully! You can now log in.");
      setUsername("");
      setPassword("");
      setFavoriteGenre("");
    } catch (e) {
      console.error("Signup failed", e);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>Signup failed</p>}
      <form onSubmit={handleSubmit}>
        <div>
          Username: <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          Favorite Genre: <input value={favoriteGenre} onChange={(e) => setFavoriteGenre(e.target.value)} />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup
