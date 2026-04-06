import { useEffect, useState } from "react";

function Tickets() {
  const [tickets, setTickets] = useState([]);

  const [userId, setUserId] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [seatId, setSeatId] = useState("");
  const [price, setPrice] = useState("");

  const fetchTickets = () => {
    fetch("http://localhost:8080/tickets")
      .then((res) => res.json())
      .then(setTickets)
      .catch(console.error);
  };

  useEffect(() => {
    fetchTickets();
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
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
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
      .then(() => fetchTickets())
      .catch(console.error);
  };

  return (
    <div style={container}>
      <h2>🎫 Билеты</h2>

      <form onSubmit={handleCreate} style={form}>
        <input placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <input placeholder="Schedule ID" value={scheduleId} onChange={(e) => setScheduleId(e.target.value)} />
        <input placeholder="Seat ID" value={seatId} onChange={(e) => setSeatId(e.target.value)} />
        <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />

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
  background: "#fafafa",
};

const createBtn = {
  background: "green",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const deleteBtn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "10px",
};

export default Tickets;