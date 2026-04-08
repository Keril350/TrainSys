import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Ошибка входа");
        return;
      }

      // 🔥 СОХРАНЯЕМ ВСЁ
      localStorage.setItem("username", username);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role); // ✅ ВОТ ЭТОГО НЕ ХВАТАЛО

      alert("Успешный вход");

      navigate("/trains");
      window.location.reload(); // чтобы App обновился
    } catch (err) {
      console.error(err);
      alert("Ошибка сервера");
    }
  };

  return (
    <div>
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}

export default Login;