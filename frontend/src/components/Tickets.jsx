import { useEffect, useState } from "react";

function Tickets() {
  const [tickets, setTickets] = useState([]);

  const [users, setUsers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [seats, setSeats] = useState([]);

  const [userId, setUserId] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [seatId, setSeatId] = useState("");
  const [price, setPrice] = useState("");

  const fetchTickets = () => {
    fetch("http://localhost:8080/tickets")
      .then((res) => res.json())
      .then(setTickets);
  };

  const fetchUsers = () => {
    fetch("http://localhost:8080/users")
      .then((res) => res.json())
      .then(setUsers);
  };

  const fetchSchedules = () => {
    fetch("http://localhost:8080/schedules")
      .then((res) => res.json())
      .then(setSchedules);
  };

  const fetchSeats = () => {
    fetch("http://localhost:8080/seats")
      .then((res) => res.json())
      .then(setSeats);
  };

  useEffect(() => {
    fetchTickets();
    fetchUsers();
    fetchSchedules();
    fetchSeats();
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: Number(userId),
        scheduleId: Number(scheduleId),
        seatId: Number(seatId),
        price: Number(price),
      }),
    })
      .then(() => {
        setUserId("");
        setScheduleId("");
        setSeatId("");
        setPrice("");
        fetchTickets();
      })
      .catch(console.error);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/tickets/${id}`, {
      method: "DELETE",
    })
      .then(() => fetchTickets());
  };

  return (
    <div style={container}>
      <h2>🎫 Билеты</h2>

      <form onSubmit={handleCreate} style={form}>
        <select value={userId} onChange={(e) => setUserId(e.target.value)}>
          <option value="">Пользователь</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.email}
            </option>
          ))}
        </select>

        <select value={scheduleId} onChange={(e) => setScheduleId(e.target.value)}>
          <option value="">Расписание</option>
          {schedules.map((s) => (
            <option key={s.id} value={s.id}>
              #{s.id}
            </option>
          ))}
        </select>

        <select value={seatId} onChange={(e) => setSeatId(e.target.value)}>
          <option value="">Место</option>
          {seats.map((s) => (
            <option key={s.id} value={s.id}>
              {s.number} (train {s.trainId})
            </option>
          ))}
        </select>

        <input placeholder="Цена" value={price} onChange={(e) => setPrice(e.target.value)} />

        <button type="submit" style={createBtn}>Создать</button>
      </form>

      <div style={grid}>
        {tickets.map((t) => (
          <div key={t.id} style={card}>
            <p><b>ID:</b> {t.id}</p>
            <p>User: {t.userId}</p>
            <p>Schedule: {t.scheduleId}</p>
            <p>Seat: {t.seatId}</p>
            <p>Price: {t.price}</p>

            <button onClick={() => handleDelete(t.id)} style={deleteBtn}>
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

export default Tickets;