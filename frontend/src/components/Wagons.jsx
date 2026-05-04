import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/common.module.css";

function Wagons() {
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const canEdit = user?.role === "ADMIN" || user?.role === "WORKER";
  const canSeeId = canEdit;

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
      .then((data) =>
        setTrains(data.filter((t) => t.type !== "CARGO"))
      );
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
    }).then(() => {
      resetForm();
      fetchWagons();
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Удалить вагон?")) return;

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
    <div className={styles.container}>
      <h2>🚃 Вагоны</h2>

      {canEdit && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <select
            className={styles.select}
            value={trainId}
            onChange={(e) => setTrainId(e.target.value)}
          >
            <option value="">Поезд</option>
            {trains.map((t) => (
              <option key={t.id} value={t.id}>
                {t.number}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            value={typeId}
            onChange={(e) => setTypeId(e.target.value)}
          >
            <option value="">Тип вагона</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <input
            className={styles.input}
            placeholder="Номер вагона"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />

          <input
            className={styles.input}
            placeholder="Цена"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button className={styles.createBtn}>
            {editingId ? "Сохранить" : "Создать"}
          </button>
        </form>
      )}

      <div className={styles.grid}>
        {wagons.map((w) => (
          <div key={w.id} className={styles.card}>
            {canSeeId && <p><b>ID:</b> {w.id}</p>}
            <p><b>Train:</b> {getTrainName(w.trainId)}</p>
            <p><b>Wagon:</b> {w.number}</p>
            <p><b>Type:</b> {getTypeName(w.typeId)}</p>
            <p><b>Price:</b> {w.price}</p>

            {canEdit && (
              <div className={styles.actions}>
                <button
                  className={styles.editBtn}
                  onClick={() => handleEdit(w)}
                >
                  Редактировать
                </button>

                {isAdmin && (
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(w.id)}
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

export default Wagons;