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

  const [editId, setEditId] = useState(null);

  // 🔑 JWT headers
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem("token"),
  });

  // ===== FETCH =====
  const fetchTickets = () => {
    fetch("http://localhost:8080/tickets")
      .then((res) => res.json())
      .then(setTickets)
      .catch(console.error);
  };

  const fetchUsers = () => {
    fetch("http://localhost:8080/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);
  };

  const fetchSchedules = () => {
    fetch("http://localhost:8080/schedules")
      .then((res) => res.json())
      .then(setSchedules)
      .catch(console.error);
  };

  // 🔥 ВАЖНО: места грузим по расписанию
  const fetchSeats = (scheduleId) => {
    if (!scheduleId) return;

    fetch(`http://localhost:8080/seats/available/${scheduleId}`)
      .then((res) => res.json())
      .then(setSeats)
      .catch(console.error);
  };

  useEffect(() => {
    fetchTickets();
    fetchUsers();
    fetchSchedules();
  }, []);

  // ===== CREATE / UPDATE =====
  const handleSubmit = (e) => {
    e.preventDefault();

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:8080/tickets/${editId}`
      : "http://localhost:8080/tickets";

    fetch(url, {
      method,
      headers: getAuthHeaders(), // 🔥 добавили токен
      body: JSON.stringify({
        userId: Number(userId),
        scheduleId: Number(scheduleId),
        seatId: Number(seatId),
        price: Number(price),
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Ошибка");
        }
        return res.json();
      })
      .then(() => {
        setUserId("");
        setScheduleId("");
        setSeatId("");
        setPrice("");
        setEditId(null);
        setSeats([]);
        fetchTickets();
      })
      .catch((err) => {
        console.error(err);
        alert("Ошибка (возможно нет прав USER/ADMIN)");
      });
  };

  // ===== DELETE =====
  const handleDelete = (id) => {
    fetch(`http://localhost:8080/tickets/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }, // 🔥 добавили токен
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Ошибка удаления");
        }
        fetchTickets();
      })
      .catch((err) => {
        console.error(err);
        alert("Ошибка удаления");
      });
  };

  // ===== EDIT =====
  const handleEdit = (t) => {
    setEditId(t.id);
    setUserId(t.userId);
    setScheduleId(t.scheduleId);
    setSeatId(t.seatId);
    setPrice(t.price);

    fetchSeats(t.scheduleId);
  };

  return (
    <div style={container}>
      <h2>🎫 Билеты</h2>

      <form onSubmit={handleSubmit} style={form}>
        {/* USER */}
        <select value={userId} onChange={(e) => setUserId(e.target.value)}>
          <option value="">Пользователь</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username || u.email}
            </option>
          ))}
        </select>

        {/* SCHEDULE */}
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

        {/* SEAT */}
        <select value={seatId} onChange={(e) => setSeatId(e.target.value)}>
          <option value="">Место</option>
          {seats.map((s) => (
            <option key={s.id} value={s.id}>
              {s.number}
            </option>
          ))}
        </select>

        {/* PRICE */}
        <input
          placeholder="Цена"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

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
            <p>Price: {t.price}</p>

            <button onClick={() => handleEdit(t)}>
              Редактировать
            </button>

            <button
              onClick={() => handleDelete(t.id)}
              style={deleteBtn}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== СТИЛИ =====

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

export default Tickets;