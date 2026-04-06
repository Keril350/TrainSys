import { useEffect, useState } from "react";

function Seats() {
  const [seats, setSeats] = useState([]);

  const [trainId, setTrainId] = useState("");
  const [number, setNumber] = useState("");

  // ===== GET =====
  const fetchSeats = () => {
    fetch("http://localhost:8080/seats")
      .then((res) => res.json())
      .then((data) => setSeats(data))
      .catch((err) => console.error(err));
  };

  // ===== CREATE =====
  const handleCreate = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/seats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trainId: Number(trainId),
        number: number,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          console.error("Ошибка:", text);
          throw new Error("Ошибка создания места");
        }
        return res.json();
      })
      .then(() => {
        setTrainId("");
        setNumber("");
        fetchSeats();
      })
      .catch((err) => console.error(err));
  };

  // ===== DELETE =====
  const handleDelete = (id) => {
    fetch(`http://localhost:8080/seats/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка удаления");
        fetchSeats();
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  return (
    <div>
      <h2>💺 Создать место</h2>

      <form onSubmit={handleCreate}>
        <input
          placeholder="Train ID"
          value={trainId}
          onChange={(e) => setTrainId(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Номер места"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <br /><br />

        <button type="submit">Создать</button>
      </form>

      <h2>Список мест</h2>

      {seats.map((seat) => (
        <div key={seat.id} style={cardStyle}>
          <p>ID: {seat.id}</p>
          <p>Train: {seat.trainId}</p>
          <p>Seat: {seat.number}</p>

          <button onClick={() => handleDelete(seat.id)} style={deleteBtn}>
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

export default Seats;