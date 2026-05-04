import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/auth.module.css";

function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      setError("Введите логин и пароль");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Ошибка входа");
        return;
      }

      login(form.username, data.role, data.token);
      navigate("/trains");
    } catch (err) {
      console.error(err);
      setError("Ошибка сервера");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.card}>
        <h2 className={styles.title}>Вход</h2>

        {error && <div className={styles.error}>{error}</div>}

        <input
          name="username"
          placeholder="Логин"
          value={form.username}
          onChange={handleChange}
          className={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
          className={styles.input}
        />

        <button disabled={loading} className={styles.button}>
          {loading ? "Вход..." : "Войти"}
        </button>
      </form>
    </div>
  );
}

export default Login;