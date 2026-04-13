import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Trains() {
  const [trains, setTrains] = useState([]);
  const [types, setTypes] = useState([]); // 👈 НОВОЕ

  const [number, setNumber] = useState("");
  const [type, setType] = useState("");

  const [editingId, setEditingId] = useState(null);

  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: "Bearer " + user?.token,
  });

  const fetchTrains = () => {
    fetch("http://localhost:8080/trains")
      .then((res) => res.json())
      .then(setTrains)
      .catch(console.error);
  };

  // 👇 НОВОЕ
  const fetchTypes = () => {
    fetch("http://localhost:8080/train-types")
      .then((res) => res.json())
      .then(setTypes)
      .catch(console.error);
  };

  useEffect(() => {
    fetchTrains();
    fetchTypes(); // 👈 добавили
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:8080/trains/${editingId}`
      : "http://localhost:8080/trains";

    fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify({ number, type }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        resetForm();
        fetchTrains();
      })
      .catch(() => alert("Ошибка (нужны права ADMIN или тип не найден)"));
  };

  const handleDeleteTrain = (id) => {
    fetch(`http://localhost:8080/trains/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        fetchTrains();
      })
      .catch(() => alert("Ошибка удаления"));
  };

  const handleEdit = (train) => {
    setEditingId(train.id);
    setNumber(train.number);
    setType(train.type); // 👈 работает, т.к. это строка
  };

  const resetForm = () => {
    setEditingId(null);
    setNumber("");
    setType("");
  };

  return (
    <div>
      <h2>🚆 Поезда</h2>

      {isAdmin && (
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Номер"
            style={inputStyle}
          />

          {/* 🔥 ВМЕСТО INPUT */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={inputStyle}
          >
            <option value="">Тип</option>
            {types.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>

          <button type="submit" style={createBtn}>
            {editingId ? "Сохранить" : "Создать"}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm} style={cancelBtn}>
              Отмена
            </button>
          )}
        </form>
      )}

      <table style={tableStyle}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Номер</th>
            <th>Тип</th>
            {isAdmin && <th></th>}
          </tr>
        </thead>

        <tbody>
          {trains.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.number}</td>
              <td>{t.type}</td>

              {isAdmin && (
                <td style={{ display: "flex", gap: "5px" }}>
                  <button onClick={() => handleEdit(t)} style={editBtn}>
                    Редактировать
                  </button>

                  <button
                    onClick={() => handleDeleteTrain(t.id)}
                    style={deleteBtn}
                  >
                    Удалить
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// стили без изменений
const formStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
};

const inputStyle = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const createBtn = {
  backgroundColor: "green",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "6px",
  cursor: "pointer",
};

const cancelBtn = {
  backgroundColor: "gray",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "6px",
  cursor: "pointer",
};

const editBtn = {
  backgroundColor: "orange",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};

const deleteBtn = {
  backgroundColor: "red",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

export default Trains;