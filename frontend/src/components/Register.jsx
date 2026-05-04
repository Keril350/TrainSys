import { useState } from "react";
import styles from "../styles/auth.module.css";

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!form.username || !form.password) {
      return "Заполните логин и пароль";
    }
    if (form.password.length < 4) {
      return "Пароль слишком короткий";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Ошибка регистрации");
        return;
      }

      alert("Регистрация успешна");
      window.location.href = "/login";
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
        <h2 className={styles.title}>Регистрация</h2>

        {error && <div className={styles.error}>{error}</div>}

        <input
          name="lastName"
          placeholder="Фамилия"
          value={form.lastName}
          onChange={handleChange}
          className={styles.input}
        />

        <input
          name="firstName"
          placeholder="Имя"
          value={form.firstName}
          onChange={handleChange}
          className={styles.input}
        />

        <input
          name="middleName"
          placeholder="Отчество"
          value={form.middleName}
          onChange={handleChange}
          className={styles.input}
        />

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
          {loading ? "Загрузка..." : "Зарегистрироваться"}
        </button>
      </form>
    </div>
  );
}

export default Register;