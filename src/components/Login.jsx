import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://my-todo-backend-2.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        }
      );
      const data = await response.json();
      localStorage.setItem("token", data.token);
      if (response.ok) {
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex justify-center mt-[100px]">
      <div className="flex justify-center border w-[500px] py-8 rounded px-8">
        <div className="flex flex-col space-y-2 items-center">
          <input
            type="text"
            name="email"
            onChange={handleChange}
            className="border w-[340px] rounded p-2"
            placeholder="Enter email"
          />
          <input
            type="text"
            name="password"
            onChange={handleChange}
            className="border w-[340px] rounded p-2"
            placeholder="Enter password"
          />
          <button
            className="bg-black text-white py-2 px-4 rounded cursor-pointer"
            onClick={handleLogin}
          >
            Login
          </button>
          <div>
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-500 underline">
                Signup
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
