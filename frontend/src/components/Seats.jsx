import { useEffect, useState } from "react";

function Seats() {
  const [seats, setSeats] = useState([]);
  const [trains, setTrains] = useState([]);

  const [trainId, setTrainId] = useState("");
  const [number, setNumber] = useState("");

  const [editingId, setEditingId] = useState(null);

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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trainId: Number(trainId),
        number,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка сохранения");
        return res.json();
      })
      .then(() => {
        resetForm();
        fetchSeats();
      })
      .catch(console.error);
  };

  // ===== DELETE =====
  const handleDelete = (id) => {
    fetch(`http://localhost:8080/seats/${id}`, {
      method: "DELETE",
    })
      .then(() => fetchSeats())
      .catch(console.error);
  };

  // ===== EDIT =====
  const handleEdit = (seat) => {
    setEditingId(seat.id);
    setTrainId(seat.trainId); // 🔥 важно
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

      <form onSubmit={handleSubmit} style={form}>
        {/* DROPDOWN */}
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

      <div style={grid}>
        {seats.map((s) => (
          <div key={s.id} style={card}>
            <p><b>ID:</b> {s.id}</p>
            <p>Train: {s.trainId}</p>
            <p>Seat: {s.number}</p>

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
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== СТИЛИ =====

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