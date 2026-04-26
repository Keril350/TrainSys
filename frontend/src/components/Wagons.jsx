import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Wagons() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN" || user?.role === "WORKER";

  const [wagons, setWagons] = useState([]);
  const [trains, setTrains] = useState([]);

  const [trainId, setTrainId] = useState("");
  const [number, setNumber] = useState("");
  const [price, setPrice] = useState("");

  const [editingId, setEditingId] = useState(null);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: "Bearer " + user?.token,
  });

  const fetchWagons = () => {
    fetch("http://localhost:8080/wagons")
      .then((res) => res.json())
      .then(setWagons);
  };

  const fetchTrains = () => {
    fetch("http://localhost:8080/trains")
      .then((res) => res.json())
      .then(setTrains);
  };

  useEffect(() => {
    fetchWagons();
    fetchTrains();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:8080/wagons/${editingId}`
      : "http://localhost:8080/wagons";

    fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify({
        trainId: Number(trainId),
        number: Number(number),
        price: Number(price), // 🔥
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        resetForm();
        fetchWagons();
      })
      .catch(() => alert("Ошибка"));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/wagons/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        fetchWagons();
      })
      .catch(() => alert("Ошибка удаления"));
  };

  const handleEdit = (w) => {
    setEditingId(w.id);
    setTrainId(w.trainId);
    setNumber(w.number);
    setPrice(w.price);
  };

  const resetForm = () => {
    setEditingId(null);
    setTrainId("");
    setNumber("");
    setPrice("");
  };

  return (
    <div style={container}>
      <h2>🚃 Вагоны</h2>

      {isAdmin && (
        <form onSubmit={handleSubmit} style={form}>
          <select value={trainId} onChange={(e) => setTrainId(e.target.value)}>
            <option value="">Поезд</option>
            {trains.map((t) => (
              <option key={t.id} value={t.id}>
                {t.number}
              </option>
            ))}
          </select>

          <input
            placeholder="Номер вагона"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />

          <input
            placeholder="Цена"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button type="submit" style={createBtn}>
            {editingId ? "Сохранить" : "Создать"}
          </button>
        </form>
      )}

      <div style={grid}>
        {wagons.map((w) => (
          <div key={w.id} style={card}>
            <p><b>ID:</b> {w.id}</p>
            <p>Train: {w.trainId}</p>
            <p>Wagon: {w.number}</p>
            <p><b>Price:</b> {w.price}</p>

            {isAdmin && (
              <>
                <button onClick={() => handleEdit(w)}>Редактировать</button>
                <button onClick={() => handleDelete(w.id)} style={deleteBtn}>
                  Удалить
                </button>
              </>
            )}
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
const deleteBtn = { background: "red", color: "white", border: "none", padding: "6px", borderRadius: "6px", cursor: "pointer" };

export default Wagons;