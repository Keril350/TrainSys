import { useEffect, useState } from "react";

function Schedule() {
  const [schedules, setSchedules] = useState([]);

  const [trainId, setTrainId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");

  // ===== GET =====
  const fetchSchedules = () => {
    fetch("http://localhost:8080/schedules")
      .then((res) => res.json())
      .then((data) => setSchedules(data))
      .catch((err) => console.error(err));
  };

  // ===== CREATE =====
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
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          console.error("Ошибка:", text);
          throw new Error("Ошибка создания расписания");
        }
        return res.json();
      })
      .then(() => {
        setTrainId("");
        setRouteId("");
        setArrivalTime("");
        setDepartureTime("");
        fetchSchedules();
      })
      .catch((err) => console.error(err));
  };

  // ===== DELETE =====
  const handleDelete = (id) => {
    fetch(`http://localhost:8080/schedules/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка удаления");
        fetchSchedules();
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div>
      <h2>📅 Создать расписание</h2>

      <form onSubmit={handleCreate}>
        <input
          placeholder="Train ID"
          value={trainId}
          onChange={(e) => setTrainId(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Route ID"
          value={routeId}
          onChange={(e) => setRouteId(e.target.value)}
        />
        <br /><br />

        <input
          type="datetime-local"
          value={arrivalTime}
          onChange={(e) => setArrivalTime(e.target.value)}
        />
        <br /><br />

        <input
          type="datetime-local"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
        />
        <br /><br />

        <button type="submit">Создать</button>
      </form>

      <h2>Список расписаний</h2>

      {schedules.map((s) => (
        <div key={s.id} style={cardStyle}>
          <p>ID: {s.id}</p>
          <p>Train: {s.trainId}</p>
          <p>Route: {s.routeId}</p>
          <p>Arrival: {s.arrivalTime}</p>
          <p>Departure: {s.departureTime}</p>

          <button onClick={() => handleDelete(s.id)} style={deleteBtn}>
            Удалить
          </button>
        </div>
      ))}
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "8px"
};

const deleteBtn = {
  backgroundColor: "red",
  color: "white",
  border: "none",
  padding: "5px 10px",
  cursor: "pointer",
  borderRadius: "5px"
};

export default Schedule;