import { useEffect, useState } from "react";

function Trains() {
  const [trains, setTrains] = useState([]);

  const [number, setNumber] = useState("");
  const [type, setType] = useState("");

  const [editingId, setEditingId] = useState(null); // 🔥 ключевая штука

  const fetchTrains = () => {
    fetch("http://localhost:8080/trains")
      .then((res) => res.json())
      .then(setTrains)
      .catch(console.error);
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  // ===== CREATE / UPDATE =====
  const handleSubmit = (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:8080/trains/${editingId}`
      : "http://localhost:8080/trains";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ number, type }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка сохранения");
        return res.json();
      })
      .then(() => {
        resetForm();
        fetchTrains();
      })
      .catch(console.error);
  };

  // ===== DELETE =====
  const handleDeleteTrain = (id) => {
    fetch(`http://localhost:8080/trains/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка удаления");
        fetchTrains();
      })
      .catch(console.error);
  };

  // ===== EDIT =====
  const handleEdit = (train) => {
    setEditingId(train.id);
    setNumber(train.number);
    setType(train.type);
  };

  // ===== RESET =====
  const resetForm = () => {
    setEditingId(null);
    setNumber("");
    setType("");
  };

  return (
    <div>
      <h2>🚆 Поезда</h2>

      {/* ===== ФОРМА ===== */}
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Номер"
          style={inputStyle}
        />

        <input
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Тип"
          style={inputStyle}
        />

        <button type="submit" style={createBtn}>
          {editingId ? "Сохранить" : "Создать"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm} style={cancelBtn}>
            Отмена
          </button>
        )}
      </form>

      {/* ===== ТАБЛИЦА ===== */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Номер</th>
            <th>Тип</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {trains.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.number}</td>
              <td>{t.type}</td>
              <td style={{ display: "flex", gap: "5px" }}>
                <button
                  onClick={() => handleEdit(t)}
                  style={editBtn}
                >
                  Редактировать
                </button>

                <button
                  onClick={() => handleDeleteTrain(t.id)}
                  style={deleteBtn}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ===== СТИЛИ =====

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