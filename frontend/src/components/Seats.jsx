import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Seats() {
  const { user } = useAuth();

  const canEdit = user?.role === "ADMIN" || user?.role === "WORKER";
  const isAdmin = user?.role === "ADMIN";

  const [seats, setSeats] = useState([]);
  const [trains, setTrains] = useState([]);
  const [wagons, setWagons] = useState([]);

  const [trainId, setTrainId] = useState("");
  const [wagonId, setWagonId] = useState("");
  const [number, setNumber] = useState("");

  const [editingId, setEditingId] = useState(null);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: "Bearer " + user?.token,
  });

  const fetchSeats = () => {
    fetch("http://localhost:8080/seats")
      .then((res) => res.json())
      .then((data) => setSeats(Array.isArray(data) ? data : []))
      .catch(() => setSeats([]));
  };

  const fetchTrains = () => {
    fetch("http://localhost:8080/trains")
      .then((res) => res.json())
      .then((data) => {
        const filtered = Array.isArray(data)
          ? data.filter((t) => t.type !== "CARGO")
          : [];
        setTrains(filtered);
      });
  };

  const fetchWagons = (trainId) => {
    fetch(`http://localhost:8080/wagons/train/${trainId}`)
      .then((res) => res.json())
      .then(setWagons);
  };

  useEffect(() => {
    fetchSeats();
    fetchTrains();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!wagonId) {
      alert("Выбери вагон");
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
        wagonId: Number(wagonId),
        number,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        resetForm();
        fetchSeats();
      })
      .catch(() => alert("Ошибка"));
  };

  const handleEdit = (s) => {
    setEditingId(s.id);
    setTrainId(s.trainId);

    fetchWagons(s.trainId); // важно!

    setWagonId(s.wagonId);
    setNumber(s.number);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Удалить место?")) return;

    fetch(`http://localhost:8080/seats/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        fetchSeats();
      })
      .catch(() => alert("Ошибка удаления"));
  };

  const resetForm = () => {
    setEditingId(null);
    setTrainId("");
    setWagonId("");
    setNumber("");
  };

  return (
    <div style={container}>
      <h2>💺 Места</h2>

      {canEdit && (
        <form onSubmit={handleSubmit} style={form}>
          <select
            value={trainId}
            onChange={(e) => {
              const id = e.target.value;
              setTrainId(id);
              fetchWagons(id);
            }}
          >
            <option value="">Поезд</option>
            {trains.map((t) => (
              <option key={t.id} value={t.id}>
                {t.number}
              </option>
            ))}
          </select>

          <select
            value={wagonId}
            onChange={(e) => setWagonId(e.target.value)}
          >
            <option value="">Вагон</option>
            {wagons.map((w) => (
              <option key={w.id} value={w.id}>
                №{w.number}
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
        </form>
      )}

      <div style={grid}>
        {seats.map((s) => (
          <div key={s.id} style={card}>
            {canEdit && <p><b>ID:</b> {s.id}</p>}

            <p><b>Train:</b> {s.trainNumber}</p>
            <p><b>Wagon:</b> №{s.wagonNumber}</p>
            <p><b>Seat:</b> {s.number}</p>

            {/* 🔥 КНОПКИ */}
            {canEdit && (
              <div style={actions}>
                <button
                  style={editBtn}
                  onClick={() => handleEdit(s)}
                >
                  Редактировать
                </button>

                {isAdmin && (
                  <button
                    style={deleteBtn}
                    onClick={() => handleDelete(s.id)}
                  >
                    Удалить
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// стили
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

const actions = {
  display: "flex",
  gap: "10px",
  marginTop: "10px",
};

const createBtn = {
  background: "green",
  color: "white",
  border: "none",
  padding: "8px",
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

export default Seats;