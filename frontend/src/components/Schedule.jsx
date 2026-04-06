import { useEffect, useState } from "react";

function Schedule() {
  const [schedules, setSchedules] = useState([]);

  const [trains, setTrains] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [trainId, setTrainId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");

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

  const handleCreate = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/schedules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trainId: Number(trainId),
        routeId: Number(routeId),
        arrivalTime,
        departureTime,
      }),
    })
      .then(() => {
        setTrainId("");
        setRouteId("");
        setArrivalTime("");
        setDepartureTime("");
        fetchSchedules();
      })
      .catch(console.error);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/schedules/${id}`, {
      method: "DELETE",
    })
      .then(() => fetchSchedules())
      .catch(console.error);
  };

  return (
    <div style={container}>
      <h2>📅 Расписание</h2>

      <form onSubmit={handleCreate} style={form}>
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

        <input type="datetime-local" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} />
        <input type="datetime-local" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} />

        <button type="submit" style={createBtn}>Создать</button>
      </form>

      <div style={grid}>
        {schedules.map((s) => (
          <div key={s.id} style={card}>
            <p><b>ID:</b> {s.id}</p>
            <p>Train: {s.trainId}</p>
            <p>Route: {s.routeId}</p>

            <button onClick={() => handleDelete(s.id)} style={deleteBtn}>
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const container = { marginBottom: "40px" };
const form = { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "15px" };

const card = { border: "1px solid #ddd", padding: "15px", borderRadius: "10px" };
const createBtn = { background: "green", color: "white", padding: "8px", borderRadius: "6px" };
const deleteBtn = { background: "red", color: "white", padding: "6px", borderRadius: "6px", marginTop: "10px" };

export default Schedule;