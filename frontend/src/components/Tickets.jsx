import { useEffect, useState } from "react";

function Tickets() {
  const [tickets, setTickets] = useState([]);

  const [userId, setUserId] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [seatId, setSeatId] = useState("");
  const [price, setPrice] = useState("");

  // ===== GET =====
  const fetchTickets = () => {
    fetch("http://localhost:8080/tickets")
      .then((res) => res.json())
      .then((data) => setTickets(data))
      .catch((err) => console.error(err));
  };

  // ===== CREATE =====
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
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          console.error("Ошибка:", text);
          throw new Error("Ошибка создания билета");
        }
        return res.json();
      })
      .then(() => {
        setUserId("");
        setScheduleId("");
        setSeatId("");
        setPrice("");
        fetchTickets();
      })
      .catch((err) => console.error(err));
  };

  // ===== DELETE =====
  const handleDelete = (id) => {
    fetch(`http://localhost:8080/tickets/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка удаления");
        fetchTickets();
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div>
      <h2>🎫 Создать билет</h2>

      <form onSubmit={handleCreate}>
        <input
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Schedule ID"
          value={scheduleId}
          onChange={(e) => setScheduleId(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Seat ID"
          value={seatId}
          onChange={(e) => setSeatId(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <br /><br />

        <button type="submit">Создать</button>
      </form>

      <h2>Список билетов</h2>

      {tickets.map((t) => (
        <div key={t.id} style={cardStyle}>
          <p>ID: {t.id}</p>
          <p>User: {t.userId}</p>
          <p>Schedule: {t.scheduleId}</p>
          <p>Seat: {t.seatId}</p>
          <p>Price: {t.price}</p>
          <p>Purchased: {t.purchaseDate}</p>

          <button onClick={() => handleDelete(t.id)} style={deleteBtn}>
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

export default Tickets;