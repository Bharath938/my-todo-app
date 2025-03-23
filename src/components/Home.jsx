import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import {
  AiOutlineCheckCircle,
  AiFillCheckCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function Home() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [model, setModel] = useState(false);
  const [username, setUsername] = useState(null);
  const [editModel, setEditModel] = useState({
    id: null,
    todo: "",
    completed: undefined,
  });
  const [loadingButton, setLoadingButton] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch(
        "https://my-todo-backend-2.onrender.com/api/todos",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();

      setTodos(data.todos);
      setUsername(data.username);
    };

    fetchTodos();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    console.log(e.target.name);
    setEditModel((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddTodo = async (actionType) => {
    try {
      setLoadingButton(actionType);
      const response = await fetch(
        "https://my-todo-backend-2.onrender.com/api/todos",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ todo }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setTodos((prev) => [...prev, data]);
        setTodo("");
        setLoadingButton(null);
      }
    } catch (err) {
      console.log("Something went wrong");
    }
  };

  const handleUpdateTodo = async (actionType) => {
    try {
      setLoadingButton(actionType);
      const response = await fetch(
        `https://my-todo-backend-2.onrender.com/api/todos/${editModel._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            todo: editModel.todo,
            completed: editModel.completed,
          }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setTodos(data);
        setModel(false);
        setLoadingButton(null);
      }
    } catch (error) {
      console.log("The error is:", error);
    }
  };

  const handleDeleteTodo = async (id, actionType) => {
    try {
      setLoadingButton(actionType);
      const response = await fetch(
        `https://my-todo-backend-2.onrender.com/api/todos/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "appplication/json",
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        setTodos((prev) => prev.filter((todo) => todo._id !== id));
        setLoadingButton(null);
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

  const handleToggle = async (id, actionType) => {
    const findTodo = todos.find((todo) => todo._id === id);
    findTodo.completed = !findTodo.completed;

    try {
      const response = await fetch(
        `https://my-todo-backend-2.onrender.com/api/todos/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: findTodo.completed }),
        }
      );
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <div className="flex justify-between p-4 items-center">
        <div className="bg-purple-500 w-[300px] text-center py-2 px-4 rounded items-center">
          <h1 className="text-white font-medium text-2xl">Todo App</h1>
        </div>
        <div>
          <h1 className="text-2xl text-blue-500">
            Welcome: <span className="text-red-500">{username}</span>
          </h1>
        </div>
        <button
          className="border py-2 px-4 rounded cursor-pointer hover:bg-black hover:text-white"
          onClick={handleLogout}
        >
          LogOut
        </button>
      </div>
      <div className="flex justify-center mt-8">
        <div className="flex flex-col space-y-4">
          <div>
            <input
              type="text"
              className="py-2 w-96 rounded border p-2"
              placeholder="Enter todo here..."
              name="todo"
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
            />
            <button
              className="bg-green-400 cursor-pointer rounded p-3 ml-2 px-4"
              onClick={() => handleAddTodo("add")}
            >
              {loadingButton === "add" ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                <FaPlus />
              )}
            </button>
          </div>
          <div className="mt-[40px]">
            <p className="text-2xl font-medium">Your todos</p>
          </div>
          {todos.map((todo) => (
            <div key={todo._id}>
              <div className="flex w-[500px] items-center justify-between p-2">
                <div className="w-[330px]">
                  <p>{todo.todo}</p>
                </div>
                <div className="flex justify-end">
                  <button
                    className="mr-2 cursor-pointer"
                    onClick={() => handleToggle(todo._id, "toggle")}
                  >
                    {todo.completed ? (
                      <AiFillCheckCircle className="w-8 h-8 text-green-500" />
                    ) : (
                      <AiOutlineCheckCircle className="w-8 h-8 text-red-500" />
                    )}
                  </button>
                  <button
                    className="bg-blue-300 p-2 rounded px-4 cursor-pointer mr-2"
                    onClick={() => handleEditButton(todo._id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-red-300 p-2 rounded px-4 cursor-pointer"
                    onClick={() => handleDeleteTodo(todo._id, "delete")}
                  >
                    {loadingButton === "delete" ? (
                      <AiOutlineLoading3Quarters className="animate-spin" />
                    ) : (
                      <FaTrash />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {model && (
            <div className="flex flex-col justify-center border rounded w-[400px] py-4">
              <div className="flex justify-between py-2 px-4 items-center">
                <div>Todo:</div>
                <input
                  type="text"
                  id="todo"
                  name="todo"
                  placeholder="Enter todo here..."
                  onChange={handleChange}
                  className="p-2 w-[200px] rounded border"
                  value={editModel.todo}
                />
              </div>

              <div className="flex py-2 px-4 items-center">
                <div className="mr-[100px]">Completed: </div>
                <input
                  type="checkbox"
                  id="completed"
                  name="completed"
                  onChange={handleChange}
                  checked={editModel.completed}
                  className="w-4 h-4 accent-green-500"
                />
              </div>

              <div className="flex justify-end mr-2">
                <button
                  onClick={() => setModel(false)}
                  className="bg-white border rounded py-2 p-4 cursor-pointer w-[100px] mr-2"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleUpdateTodo("edit")}
                  className="bg-black text-white rounded py-2 p-4 cursor-pointer w-[100px]"
                >
                  {loadingButton === "edit" ? (
                    <AiOutlineLoading3Quarters className="animate-spin text-center" />
                  ) : (
                    <p>Update</p>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
