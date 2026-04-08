import { useEffect, useState } from "react";

function Trains() {
  const [trains, setTrains] = useState([]);

  const [number, setNumber] = useState("");
  const [type, setType] = useState("");

  const [editingId, setEditingId] = useState(null);

  // 🔥 РОЛЬ
  const isAdmin = localStorage.getItem("role") === "ADMIN";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };
  };

  const fetchTrains = () => {
    fetch("http://localhost:8080/trains")
      .then((res) => res.json())
      .then(setTrains)
      .catch(console.error);
  };

  useEffect(() => {
    fetchTrains();
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
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Ошибка сохранения");
        }
        return res.json();
      })
      .then(() => {
        resetForm();
        fetchTrains();
      })
      .catch((err) => {
        console.error(err);
        alert("Ошибка (нужны права ADMIN)");
      });
  };

  const handleDeleteTrain = (id) => {
    fetch(`http://localhost:8080/trains/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Ошибка удаления");
        }
        fetchTrains();
      })
      .catch((err) => {
        console.error(err);
        alert("Ошибка удаления (нужны права ADMIN)");
      });
  };

  const handleEdit = (train) => {
    setEditingId(train.id);
    setNumber(train.number);
    setType(train.type);
  };

  const resetForm = () => {
    setEditingId(null);
    setNumber("");
    setType("");
  };

  return (
    <div>
      <h2>🚆 Поезда</h2>

      {/* ✅ ФОРМА ТОЛЬКО ДЛЯ ADMIN */}
      {isAdmin && (
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
      )}

      <table style={tableStyle}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Номер</th>
            <th>Тип</th>
            {/* ✅ колонка только для ADMIN */}
            {isAdmin && <th></th>}
          </tr>
        </thead>

        <tbody>
          {trains.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.number}</td>
              <td>{t.type}</td>

              {/* ✅ кнопки только для ADMIN */}
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