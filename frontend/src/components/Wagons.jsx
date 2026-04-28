import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Wagons() {
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN" || user?.role === "WORKER";
  const canSeeId = isAdmin;

  const [wagons, setWagons] = useState([]);
  const [trains, setTrains] = useState([]);
  const [types, setTypes] = useState([]);

  const [trainId, setTrainId] = useState("");
  const [number, setNumber] = useState("");
  const [price, setPrice] = useState("");
  const [typeId, setTypeId] = useState("");

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
      .then((data) => {
        const filtered = data.filter((t) => t.type !== "CARGO");
        setTrains(filtered);
      });
  };

  const fetchTypes = () => {
    fetch("http://localhost:8080/wagon-types")
      .then((res) => res.json())
      .then(setTypes);
  };

  useEffect(() => {
    fetchWagons();
    fetchTrains();
    fetchTypes();
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
        price: Number(price),
        typeId: Number(typeId),
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
    }).then(fetchWagons);
  };

  const handleEdit = (w) => {
    setEditingId(w.id);
    setTrainId(w.trainId);
    setNumber(w.number);
    setPrice(w.price);
    setTypeId(w.typeId);
  };

  const resetForm = () => {
    setEditingId(null);
    setTrainId("");
    setNumber("");
    setPrice("");
    setTypeId("");
  };

  const getTrainName = (id) => {
    const t = trains.find((t) => t.id === id);
    return t ? t.number : "—";
  };

  const getTypeName = (id) => {
    const t = types.find((t) => t.id === id);
    return t ? t.name : "—";
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

          <select value={typeId} onChange={(e) => setTypeId(e.target.value)}>
            <option value="">Тип вагона</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
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
            {canSeeId && <p><b>ID:</b> {w.id}</p>}
            <p><b>Train:</b> {getTrainName(w.trainId)}</p>
            <p><b>Wagon:</b> {w.number}</p>
            <p><b>Type:</b> {getTypeName(w.typeId)}</p>
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