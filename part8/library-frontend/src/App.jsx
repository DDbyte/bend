import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Books from "./components/Books";
import Login from "./components/Login";
import Signup from "./components/Signup";
import NewBook from "./components/NewBook";
import EditAuthor from "./components/EditAuthor";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("library-user-token"));

  const logout = () => {
    setToken(null);
    localStorage.removeItem("library-user-token");
  };

  return (
    <Router>
      <nav>
        <Link to="/">Books</Link>
        {!token && <Link to="/signup">Sign Up</Link>}
        {token ? (
          <>
            <Link to="/add">Add Book</Link>
            <Link to="/edit-author">Edit Author</Link>
            <Link to="/recommended">Recommended</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup />} />
        {token && <Route path="/add" element={<NewBook />} />}
        {token && <Route path="/edit-author" element={<EditAuthor />} />}
        {token && <Route path="/recommended" element={<RecommendedBooks />} />}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
