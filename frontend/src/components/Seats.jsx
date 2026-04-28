import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Seats() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN" || user?.role === "WORKER";

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
      .then((data) => {
        if (Array.isArray(data)) {
          setSeats(data);
        } else {
          setSeats([]);
        }
      })
      .catch(() => {
        console.error("Ошибка загрузки мест");
        setSeats([]);
      });
  };

  const fetchTrains = () => {
    fetch("http://localhost:8080/trains")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const filtered = data.filter((t) => t.type !== "CARGO");
          setTrains(filtered);
        } else {
          setTrains([]);
        }
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
    setWagonId(s.wagonId);
    setNumber(s.number);
  };

  const resetForm = () => {
    setEditingId(null);
    setTrainId("");
    setWagonId("");
    setNumber("");
  };

  const getTrainNumber = (trainId) => {
    const t = trains.find((t) => t.id === trainId);
    return t ? t.number : "—";
  };

  const getWagonNumber = (wagonId) => {
    const w = wagons.find((w) => w.id === wagonId);
    return w ? w.number : wagonId;
  };

  return (
    <div style={container}>
      <h2>💺 Места</h2>

      {isAdmin && (
        <form onSubmit={handleSubmit} style={form}>
          {/* поезд */}
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

          {/* вагон */}
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
            {isAdmin && <p><b>ID:</b> {s.id}</p>}

            <p><b>Train:</b> {s.trainNumber}</p>
            <p><b>Wagon:</b> №{s.wagonNumber}</p>
            <p><b>Seat:</b> {s.number}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// стили
const container = { marginBottom: "40px" };
const form = { display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "15px" };
const card = { border: "1px solid #ddd", padding: "15px", borderRadius: "10px", background: "#fafafa" };
const createBtn = { background: "green", color: "white", border: "none", padding: "8px", borderRadius: "6px", cursor: "pointer" };

export default Seats;