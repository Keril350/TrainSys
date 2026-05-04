import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/common.module.css";

function Schedule() {
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const canEdit = user?.role === "ADMIN" || user?.role === "WORKER";

  const [schedules, setSchedules] = useState([]);
  const [trains, setTrains] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [trainId, setTrainId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");

  const [editId, setEditId] = useState(null);

  const fetchAll = () => {
    fetch("http://localhost:8080/schedules")
      .then((r) => r.json())
      .then(setSchedules);

    fetch("http://localhost:8080/trains")
      .then((r) => r.json())
      .then(setTrains);

    fetch("http://localhost:8080/routes")
      .then((r) => r.json())
      .then(setRoutes);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(
      editId
        ? `http://localhost:8080/schedules/${editId}`
        : "http://localhost:8080/schedules",
      {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + user?.token,
        },
        body: JSON.stringify({
          trainId: Number(trainId),
          routeId: Number(routeId),
          arrivalTime,
          departureTime,
        }),
      }
    ).then(() => {
      resetForm();
      fetchAll();
    });
  };

  const handleEdit = (s) => {
    setEditId(s.id);
    setTrainId(s.trainId);
    setRouteId(s.routeId);
    setArrivalTime(s.arrivalTime?.slice(0, 16));
    setDepartureTime(s.departureTime?.slice(0, 16));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Удалить расписание?")) return;

    fetch(`http://localhost:8080/schedules/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + user?.token,
      },
    }).then(fetchAll);
  };

  const resetForm = () => {
    setEditId(null);
    setTrainId("");
    setRouteId("");
    setArrivalTime("");
    setDepartureTime("");
  };

  return (
    <div className={styles.container}>
      <h2>📅 Расписание</h2>

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
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
          >
            <option value="">Маршрут</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <input
            className={styles.input}
            type="datetime-local"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
          />

          <input
            className={styles.input}
            type="datetime-local"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
          />

          <button className={styles.createBtn}>
            {editId ? "Сохранить" : "Создать"}
          </button>
        </form>
      )}

      <div className={styles.grid}>
        {schedules.map((s) => (
          <div key={s.id} className={styles.card}>
            {isAdmin && <p><b>ID:</b> {s.id}</p>}

            <p>
              <b>Маршрут:</b>{" "}
              {routes.find((r) => r.id === s.routeId)?.name}
            </p>

            <p>
              <b>Поезд:</b>{" "}
              {trains.find((t) => t.id === s.trainId)?.number}
            </p>

            <p><b>Отправление:</b> {s.departureTime}</p>
            <p><b>Прибытие:</b> {s.arrivalTime}</p>

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

export default Schedule;