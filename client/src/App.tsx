import axios from "axios";
import { useState } from "react";

type LoginForm = {
  username: string;
  password: string;
};

type Dashboard = {
  msg: string;
  secret: string;
};

function App() {
  const [loginForm, setLoginForm] = useState<LoginForm>({
    username: "",
    password: "",
  });
  const [token, setToken] = useState<string>(() => {
    const token = localStorage.getItem("token");

    if (!token) return "";

    return token;
  });
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [dashboardError, setDashboardError] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login(loginForm);
  };

  const login = async (loginData: LoginForm) => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/login",
        loginData
      );

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setLoginError("");
      clearLoginForm();
      setDashboardError("");
      setDashboard(null);
    } catch (error: any) {
      setLoginError(error.response.data.msg);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const clearLoginForm = () => {
    setLoginForm({ username: "", password: "" });
  };

  const getData = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/v1/dashboard",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setDashboard(data);
      setLoginError("");
    } catch (error: any) {
      setToken("");
      setDashboard(null);
      setDashboardError(error.response.data.msg);
    }
  };

  const clearToken = () => {
    localStorage.removeItem("token");
    setToken("");
    setDashboard(null);
    clearLoginForm();
  };

  return (
    <div className="flex items-center flex-col mt-16">
      <span
        className={`text-sm text-red-800 ${
          loginError ? `opacity-100` : `opacity-0`
        }`}
      >
        {loginError ? loginError : "Error"}
      </span>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[400px] mb-16 mt-2 shadow-xl bg-white px-7 py-8 gap-3"
      >
        <h2 className=" text-center font-bold text-lg">Login/Register</h2>
        <label id="username" className="font-bold text-sm">
          Username
        </label>
        <input
          id="username"
          className=" border shadow-inner px-1"
          type="text"
          name="username"
          value={loginForm.username}
          onChange={handleChange}
        />
        <label id="password" className="font-bold text-sm">
          Password
        </label>
        <input
          id="password"
          className=" border shadow-inner px-1"
          type="password"
          name="password"
          value={loginForm.password}
          onChange={handleChange}
        />
        <button
          type="submit"
          className=" bg-blue-900 text-white py-1 mt-2 rounded-lg shadow-lg"
        >
          Submit
        </button>
      </form>

      <h2 className=" text-center font-bold text-3xl">Dashboard</h2>
      {token ? (
        <span className=" text-sm my-2 text-green-800 font-bold">
          Token is present
        </span>
      ) : (
        <span className=" text-sm my-2 text-red-800 font-bold">
          No Token Present
        </span>
      )}
      <div className="flex flex-col w-[400px] my-8 shadow-xl bg-white px-7 py-8 gap-3">
        {dashboard ? (
          <>
            <h3 className=" font-bold">{dashboard.msg}</h3>
            <span>{dashboard.secret}</span>
          </>
        ) : (
          <span className=" text-sm my-2 text-red-800">
            {dashboardError ? `Error: ${dashboardError}` : null}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={getData}
        className=" w-[400px] bg-blue-500 text-white rounded-md mb-4 py-0.5"
      >
        Get Data
      </button>
      <button
        type="button"
        onClick={clearToken}
        className=" w-[400px] bg-sky-800 text-white rounded-md py-0.5"
      >
        Clear token
      </button>
    </div>
  );
}

export default App;
