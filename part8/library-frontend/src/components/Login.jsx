//components/Login.jsx
import { useState } from "react";
import { useMutation, gql } from "@apollo/client";

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data, error }] = useMutation(LOGIN);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await login({ variables: { username, password } });
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>Login failed</p>}
      <form onSubmit={handleSubmit}>
        <div>
          Username: <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login
