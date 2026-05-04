import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/common.module.css";

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

  useEffect(() => {
    fetch("http://localhost:8080/seats")
      .then((res) => res.json())
      .then((data) => setSeats(Array.isArray(data) ? data : []));

    fetch("http://localhost:8080/trains")
      .then((res) => res.json())
      .then((data) =>
        setTrains(data.filter((t) => t.type !== "CARGO"))
      );
  }, []);

  const fetchWagons = (trainId) => {
    fetch(`http://localhost:8080/wagons/train/${trainId}`)
      .then((res) => res.json())
      .then(setWagons);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
    }).then(() => {
      resetForm();
      refresh();
    });
  };

  const refresh = () => {
    fetch("http://localhost:8080/seats")
      .then((res) => res.json())
      .then((data) => setSeats(Array.isArray(data) ? data : []));
  };

  const handleEdit = (s) => {
    setEditingId(s.id);
    setTrainId(s.trainId);
    fetchWagons(s.trainId);
    setWagonId(s.wagonId);
    setNumber(s.number);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Удалить место?")) return;

    fetch(`http://localhost:8080/seats/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    }).then(refresh);
  };

  const resetForm = () => {
    setEditingId(null);
    setTrainId("");
    setWagonId("");
    setNumber("");
  };

  return (
    <div className={styles.page}>
      <h2>💺 Места</h2>

      {canEdit && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <select
            className={styles.select}
            value={trainId}
            onChange={(e) => {
              setTrainId(e.target.value);
              fetchWagons(e.target.value);
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
            className={styles.select}
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
            className={styles.input}
            placeholder="Номер места"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />

          <button className={styles.createBtn}>
            {editingId ? "Сохранить" : "Создать"}
          </button>
        </form>
      )}

      <div className={styles.grid}>
        {seats.map((s) => (
          <div key={s.id} className={styles.card}>
            {canEdit && <p><b>ID:</b> {s.id}</p>}

            <p><b>Train:</b> {s.trainNumber}</p>
            <p><b>Wagon:</b> №{s.wagonNumber}</p>
            <p><b>Seat:</b> {s.number}</p>

            {canEdit && (
              <div className={styles.actions}>
                <button
                  className={styles.editBtn}
                  onClick={() => handleEdit(s)}
                >
                  Редактировать
                </button>

                {isAdmin && (
                  <button
                    className={styles.deleteBtn}
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

export default Seats;