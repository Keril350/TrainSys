import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Seats() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [seats, setSeats] = useState([]);
  const [trains, setTrains] = useState([]);

  const [trainId, setTrainId] = useState("");
  const [number, setNumber] = useState("");

  const [editingId, setEditingId] = useState(null);

  // 🔥 JWT из context
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: "Bearer " + user?.token,
  });

  // ===== FETCH SEATS =====
  const fetchSeats = () => {
    fetch("http://localhost:8080/seats")
      .then((res) => res.json())
      .then(setSeats)
      .catch(console.error);
  };

  // ===== FETCH TRAINS =====
  const fetchTrains = () => {
    fetch("http://localhost:8080/trains")
      .then((res) => res.json())
      .then(setTrains)
      .catch(console.error);
  };

  useEffect(() => {
    fetchSeats();
    fetchTrains();
  }, []);

  // ===== CREATE / UPDATE =====
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!trainId) {
      alert("Выбери поезд");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:8080/seats/${editingId}`
      : "http://localhost:8080/seats";

    fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify({
        trainId: Number(trainId),
        number,
      }),
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
        fetchSeats();
      })
      .catch((err) => {
        console.error(err);
        alert("Ошибка (нужна роль ADMIN)");
      });
  };

  // ===== DELETE =====
  const handleDelete = (id) => {
    fetch(`http://localhost:8080/seats/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Ошибка удаления");
        }
        fetchSeats();
      })
      .catch((err) => {
        console.error(err);
        alert("Ошибка удаления (нужна роль ADMIN)");
      });
  };

  // ===== EDIT =====
  const handleEdit = (seat) => {
    setEditingId(seat.id);
    setTrainId(seat.trainId);
    setNumber(seat.number);
  };

  // ===== RESET =====
  const resetForm = () => {
    setEditingId(null);
    setTrainId("");
    setNumber("");
  };

  return (
    <div style={container}>
      <h2>💺 Места</h2>

      {/* ✅ ТОЛЬКО ADMIN */}
      {isAdmin && (
        <form onSubmit={handleSubmit} style={form}>
          <select
            value={trainId}
            onChange={(e) => setTrainId(e.target.value)}
          >
            <option value="">Выбери поезд</option>
            {trains.map((t) => (
              <option key={t.id} value={t.id}>
                {t.number} ({t.type})
              </option>
            ))}
          </select>

          <input
            placeholder="Номер места"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
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

      {/* ===== СПИСОК ===== */}
      <div style={grid}>
        {seats.map((s) => (
          <div key={s.id} style={card}>
            <p><b>ID:</b> {s.id}</p>
            <p>Train: {s.trainId}</p>
            <p>Seat: {s.number}</p>

            {/* ✅ кнопки только ADMIN */}
            {isAdmin && (
              <div style={{ display: "flex", gap: "5px" }}>
                <button
                  onClick={() => handleEdit(s)}
                  style={editBtn}
                >
                  Редактировать
                </button>

                <button
                  onClick={() => handleDelete(s.id)}
                  style={deleteBtn}
                >
                  Удалить
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== СТИЛИ (НЕ ТРОГАЕМ) =====

const container = { marginBottom: "40px" };

const form = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
  flexWrap: "wrap",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "15px",
};

const card = {
  border: "1px solid #ddd",
  padding: "15px",
  borderRadius: "10px",
  background: "#fafafa",
};

const createBtn = {
  background: "green",
  color: "white",
  border: "none",
  padding: "8px",
  borderRadius: "6px",
  cursor: "pointer",
};

const cancelBtn = {
  background: "gray",
  color: "white",
  border: "none",
  padding: "8px",
  borderRadius: "6px",
  cursor: "pointer",
};

const editBtn = {
  background: "orange",
  color: "white",
  border: "none",
  padding: "6px",
  borderRadius: "6px",
  cursor: "pointer",
};

const deleteBtn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "6px",
  borderRadius: "6px",
  cursor: "pointer",
};

export default Seats;