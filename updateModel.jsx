import React, { useState } from "react";

export default function UpdateModel(props) {
  console.log(props.id);
  const [model, setModel] = useState(false);

  const handleUpdateTodo = async (id) => {};

  return (
    <div>
      <input
        type="text"
        onChange={handleChange}
        className="py-2 w-96 rounded border"
        value={todo}
      />
      <input type="checkbox" onChange={handleChange} value={todo} />
      <button
        onClick={() => handleUpdateTodo(props.id)}
        className="bg-black text-white rounded py-2 p-4 cursor-pointer"
      >
        Update
      </button>
    </div>
  );
}
