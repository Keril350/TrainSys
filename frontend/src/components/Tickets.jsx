import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Tickets() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [tickets, setTickets] = useState([]);

  const [users, setUsers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [seats, setSeats] = useState([]);

  const [userId, setUserId] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [seatId, setSeatId] = useState("");

  const [editId, setEditId] = useState(null);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: "Bearer " + user?.token,
  });

  useEffect(() => {
    fetchTickets();
    fetchSchedules();
    if (isAdmin) fetchUsers();
  }, [user]);

  const fetchTickets = () => {
    fetch("http://localhost:8080/tickets", {
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setTickets(Array.isArray(data) ? data : []);
      })
      .catch(() => setTickets([]));
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

  const fetchSeats = (id) => {
    fetch(`http://localhost:8080/seats/available/${id}`)
      .then((res) => res.json())
      .then(setSeats);
  };

  // 🔥 БЕЗ PRICE
  const handleSubmit = (e) => {
    e.preventDefault();

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:8080/tickets/${editId}`
      : "http://localhost:8080/tickets";

    fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify({
        userId: isAdmin ? Number(userId) : null,
        scheduleId: Number(scheduleId),
        seatId: Number(seatId),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        resetForm();
        fetchTickets();
      })
      .catch(() => alert("Ошибка"));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/tickets/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        fetchTickets();
      })
      .catch(() => alert("Ошибка удаления"));
  };

  const handleEdit = (t) => {
    setEditId(t.id);
    setUserId(t.userId);
    setScheduleId(t.scheduleId);
    setSeatId(t.seatId);
    fetchSeats(t.scheduleId);
  };

  const resetForm = () => {
    setUserId("");
    setScheduleId("");
    setSeatId("");
    setEditId(null);
    setSeats([]);
  };

  return (
    <div style={container}>
      <h2>🎫 Билеты</h2>

      <form onSubmit={handleSubmit} style={form}>
        {isAdmin && (
          <select value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">Пользователь</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
        )}

        <select
          value={scheduleId}
          onChange={(e) => {
            const val = e.target.value;
            setScheduleId(val);
            setSeatId("");
            fetchSeats(val);
          }}
        >
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
              {s.number}
            </option>
          ))}
        </select>

        <button type="submit" style={createBtn}>
          {editId ? "Сохранить" : "Создать"}
        </button>
      </form>

      <div style={grid}>
        {tickets.map((t) => (
          <div key={t.id} style={card}>
            <p><b>ID:</b> {t.id}</p>
            <p>User: {t.userId}</p>
            <p>Schedule: {t.scheduleId}</p>
            <p>Seat: {t.seatId}</p>
            <p><b>Price:</b> {t.price}</p>

            {isAdmin && (
              <>
                <button onClick={() => handleEdit(t)}>Редактировать</button>
                <button onClick={() => handleDelete(t.id)} style={deleteBtn}>
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
const form = { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "15px" };
const card = { border: "1px solid #ddd", padding: "15px", borderRadius: "10px" };
const createBtn = { background: "green", color: "white", padding: "8px", borderRadius: "6px", border: "none", cursor: "pointer" };
const deleteBtn = { background: "red", color: "white", padding: "6px", borderRadius: "6px", marginTop: "10px", border: "none", cursor: "pointer" };

export default Tickets;