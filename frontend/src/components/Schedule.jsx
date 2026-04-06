import { useEffect, useState } from "react";

function Schedule() {
  const [schedules, setSchedules] = useState([]);

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

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trainId: Number(trainId),
        routeId: Number(routeId),
        arrivalTime,
        departureTime,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
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
        <input placeholder="Train ID" value={trainId} onChange={(e) => setTrainId(e.target.value)} />
        <input placeholder="Route ID" value={routeId} onChange={(e) => setRouteId(e.target.value)} />
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

const card = {
  border: "1px solid #ddd",
  padding: "15px",
  borderRadius: "10px",
};

const createBtn = { background: "green", color: "white", padding: "8px", borderRadius: "6px" };
const deleteBtn = { background: "red", color: "white", padding: "6px", borderRadius: "6px", marginTop: "10px" };

export default Schedule;