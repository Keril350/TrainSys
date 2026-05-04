import { useState } from "react";

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
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Регистрация</h2>

        {error && <div style={styles.error}>{error}</div>}

        <input
          name="lastName"
          placeholder="Фамилия"
          value={form.lastName}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="firstName"
          placeholder="Имя"
          value={form.firstName}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="middleName"
          placeholder="Отчество"
          value={form.middleName}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="username"
          placeholder="Логин"
          value={form.username}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
        />

        <button disabled={loading} style={styles.button}>
          {loading ? "Загрузка..." : "Зарегистрироваться"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    background: "#f5f7fa",
  },
  card: {
    width: "400px",
    padding: "30px",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  title: {
    textAlign: "center",
    marginBottom: "10px",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    background: "#2c3e50",
    color: "#fff",
    cursor: "pointer",
    fontSize: "15px",
  },
  error: {
    color: "red",
    fontSize: "14px",
    textAlign: "center",
  },
};

export default Register;