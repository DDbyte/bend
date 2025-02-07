//App.jsx
import "./App.css";
import { useState } from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import EditAuthor from "./components/EditAuthor";

const App = () => {
  const [page, setPage] = useState("authors");

  return (
    <ApolloProvider client={client}>
      <div>
        <button onClick={() => setPage("authors")}>Authors</button>
        <button onClick={() => setPage("books")}>Books</button>
        <button onClick={() => setPage("add")}>Add Book</button>
        <button onClick={() => setPage("edit")}>Edit Author</button>
      </div>

      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} />
      <EditAuthor show={page === "edit"} />
    </ApolloProvider>
  );
};

export default App;


