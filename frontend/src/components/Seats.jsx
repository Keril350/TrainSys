import { useEffect, useState } from "react";

function Seats() {
  const [seats, setSeats] = useState([]);
  const [trainId, setTrainId] = useState("");
  const [number, setNumber] = useState("");

  const fetchSeats = () => {
    fetch("http://localhost:8080/seats")
      .then((res) => res.json())
      .then(setSeats)
      .catch(console.error);
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/seats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trainId: Number(trainId),
        number,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setTrainId("");
        setNumber("");
        fetchSeats();
      })
      .catch(console.error);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/seats/${id}`, {
      method: "DELETE",
    })
      .then(() => fetchSeats())
      .catch(console.error);
  };

  return (
    <div style={container}>
      <h2>💺 Места</h2>

      <form onSubmit={handleCreate} style={form}>
        <input placeholder="Train ID" value={trainId} onChange={(e) => setTrainId(e.target.value)} />
        <input placeholder="Номер места" value={number} onChange={(e) => setNumber(e.target.value)} />

        <button type="submit" style={createBtn}>Создать</button>
      </form>

      <div style={grid}>
        {seats.map((s) => (
          <div key={s.id} style={card}>
            <p><b>ID:</b> {s.id}</p>
            <p>Train: {s.trainId}</p>
            <p>Seat: {s.number}</p>

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
const form = { display: "flex", gap: "10px", marginBottom: "20px" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "15px" };

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
  padding: "8px",
  borderRadius: "6px",
};

const deleteBtn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "6px",
  borderRadius: "6px",
  marginTop: "10px",
};

export default Seats;