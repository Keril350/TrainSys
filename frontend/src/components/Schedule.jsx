import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Schedule() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [schedules, setSchedules] = useState([]);

  const [trains, setTrains] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [trainId, setTrainId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");

  const [editId, setEditId] = useState(null);

  // 🔥 JWT через context
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: "Bearer " + user?.token,
  });

  // ===== FETCH =====
  const fetchSchedules = () => {
    fetch("http://localhost:8080/schedules")
      .then((res) => res.json())
      .then(setSchedules)
      .catch(console.error);
  };

  const fetchTrains = () => {
    fetch("http://localhost:8080/trains")
      .then((res) => res.json())
      .then(setTrains);
  };

  const fetchRoutes = () => {
    fetch("http://localhost:8080/routes")
      .then((res) => res.json())
      .then(setRoutes);
  };

  useEffect(() => {
    fetchSchedules();
    fetchTrains();
    fetchRoutes();
  }, []);

  // 🔥 фикс даты
  const formatDateTime = (date) => {
    if (!date) return null;
    return date.length === 16 ? date + ":00" : date;
  };

  // ===== CREATE / UPDATE =====
  const handleSubmit = (e) => {
    e.preventDefault();

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:8080/schedules/${editId}`
      : "http://localhost:8080/schedules";

    fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify({
        trainId: Number(trainId),
        routeId: Number(routeId),
        arrivalTime: formatDateTime(arrivalTime),
        departureTime: formatDateTime(departureTime),
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setTrainId("");
        setRouteId("");
        setArrivalTime("");
        setDepartureTime("");
        setEditId(null);
        fetchSchedules();
      })
      .catch(() => {
        alert("Ошибка (нужна роль ADMIN)");
      });
  };

  // ===== DELETE =====
  const handleDelete = (id) => {
    fetch(`http://localhost:8080/schedules/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error();
        fetchSchedules();
      })
      .catch(() => {
        alert("Ошибка удаления (нужна роль ADMIN)");
      });
  };

  // ===== EDIT =====
  const handleEdit = (s) => {
    setEditId(s.id);
    setTrainId(s.trainId);
    setRouteId(s.routeId);
    setArrivalTime(s.arrivalTime?.slice(0, 16));
    setDepartureTime(s.departureTime?.slice(0, 16));
  };

  return (
    <div style={container}>
      <h2>📅 Расписание</h2>

      {/* ✅ ТОЛЬКО ADMIN */}
      {isAdmin && (
        <form onSubmit={handleSubmit} style={form}>
          <select value={trainId} onChange={(e) => setTrainId(e.target.value)}>
            <option value="">Выбери поезд</option>
            {trains.map((t) => (
              <option key={t.id} value={t.id}>
                {t.number} ({t.type})
              </option>
            ))}
          </select>

          <select value={routeId} onChange={(e) => setRouteId(e.target.value)}>
            <option value="">Выбери маршрут</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
          />

          <input
            type="datetime-local"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
          />

          <button type="submit" style={createBtn}>
            {editId ? "Сохранить" : "Создать"}
          </button>
        </form>
      )}

      <div style={grid}>
        {schedules.map((s) => (
          <div key={s.id} style={card}>
            <p><b>ID:</b> {s.id}</p>
            <p>Train: {s.trainId}</p>
            <p>Route: {s.routeId}</p>

            {/* ✅ кнопки только для ADMIN */}
            {isAdmin && (
              <>
                <button onClick={() => handleEdit(s)}>
                  Редактировать
                </button>

                <button
                  onClick={() => handleDelete(s.id)}
                  style={deleteBtn}
                >
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

// ===== STYLES =====

const container = { marginBottom: "40px" };

const form = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginBottom: "20px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "15px",
};

const card = {
  border: "1px solid #ddd",
  padding: "15px",
  borderRadius: "10px",
};

const createBtn = {
  background: "green",
  color: "white",
  padding: "8px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
};

const deleteBtn = {
  background: "red",
  color: "white",
  padding: "6px",
  borderRadius: "6px",
  marginTop: "10px",
  border: "none",
  cursor: "pointer",
};

export default Schedule;