import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BuilderPage from "./pages/BuilderPage";

export default function App() {
  const [page, setPage] = useState(
    localStorage.getItem("token") ? "builder" : "login"
  );

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setPage("builder");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setPage("login");
  };

  if (page === "login") return <LoginPage onLogin={handleLogin} goRegister={() => setPage("register")} />;
  if (page === "register") return <RegisterPage onSuccess={() => setPage("login")} goLogin={() => setPage("login")} />;
  return <BuilderPage onLogout={handleLogout} />;
}
