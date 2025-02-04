//components/EditAuthor.jsx
import { useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import { ALL_AUTHORS } from "./Authors";

// Define the mutation
const EDIT_AUTHOR = gql`
  mutation EditAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`;

const EditAuthor = (props) => {
  const { loading, error, data } = useQuery(ALL_AUTHORS);
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  // Use Apollo's useMutation hook
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }], // Refresh author list
  });

  if (!props.show) {
    return null;
  }

  if (loading) return <p>Loading authors...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const submit = async (event) => {
    event.preventDefault();
    console.log("Updating author birth year...", { name, born });

    await editAuthor({
      variables: { name, setBornTo: Number(born) },
    });

    // Reset form fields
    setName("");
    setBorn("");
  };

  return (
    <div>
      <h2>Set Birth Year</h2>
      <form onSubmit={submit}>
        <div>
          <label>Author:</label>
          <select value={name} onChange={(e) => setName(e.target.value)}>
            <option value="" disabled>Select author</option>
            {data.allAuthors.map((author) => (
              <option key={author.name} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Born:</label>
          <input
            type="number"
            value={born}
            onChange={(e) => setBorn(e.target.value)}
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditAuthor;
