import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [model, setModel] = useState(false);
  const [editModel, setEditModel] = useState({
    id: null,
    todo: "",
    completed: undefined,
  });

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch(
        "https://my-todo-backend-2xc0.onrender.com/api/todos"
      );
      const data = await response.json();

      setTodos(data);
    };

    fetchTodos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    console.log(e.target.name);
    setEditModel((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddTodo = async () => {
    try {
      const response = await fetch(
        "https://my-todo-backend-2xc0.onrender.com/api/todos",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ todo }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setTodos((prev) => [...prev, data]);
        setTodo("");
      }
    } catch (err) {
      console.log("Something went wrong");
    }
  };

  const handleUpdateTodo = async () => {
    try {
      const response = await fetch(
        `https://my-todo-backend-2xc0.onrender.com/api/todos/${editModel._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            todo: editModel.todo,
            completed: editModel.completed,
          }),
        }
      );
      const data = await response.json();
      setTodos(data);
      setModel(false);
    } catch (error) {
      console.log("The error is:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(
        `https://my-todo-backend-2xc0.onrender.com/api/todos/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "appplication/json" },
        }
      );
      const data = await response.json();

      if (response.ok) {
        setTodos((prev) => prev.filter((todo) => todo._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditButton = (id) => {
    const findTodo = todos.find((todo) => todo._id === id);

    setEditModel({ ...findTodo });
    console.log(editModel);
    setModel(true);
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="flex flex-col space-y-4">
        <div>
          <input
            type="text"
            className="py-2 w-96 rounded border"
            placeholder="Enter todo here..."
            name="todo"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
          <button
            className="bg-green-400 cursor-pointer rounded p-2 px-4"
            onClick={() => handleAddTodo()}
          >
            Add
          </button>
        </div>
        {todos.map((todo) => (
          <div key={todo._id}>
            <div className="flex items-center justify-between">
              <p>{todo.todo}</p>
              <button
                className="bg-blue-300 p-2 rounded px-4 cursor-pointer"
                onClick={() => handleEditButton(todo._id)}
              >
                Edit
              </button>
              <button
                className="bg-red-300 p-2 rounded px-4 cursor-pointer"
                onClick={() => handleDeleteTodo(todo._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {model && (
          <div className="flex flex-col">
            <label for="todo">
              Todo:
              <input
                type="text"
                id="todo"
                name="todo"
                onChange={handleChange}
                className="py-2 w-96 rounded border"
                value={editModel.todo}
              />
            </label>
            <label for="completed">
              Completed:
              <input
                type="checkbox"
                id="completed"
                name="completed"
                onChange={handleChange}
                checked={editModel.completed}
              />
            </label>
            <button
              onClick={handleUpdateTodo}
              className="bg-black text-white rounded py-2 p-4 cursor-pointer"
            >
              Update
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
