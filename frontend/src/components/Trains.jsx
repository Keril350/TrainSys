import { useEffect, useState } from "react";

function Trains() {
  const [trains, setTrains] = useState([]);
  const [number, setNumber] = useState("");
  const [type, setType] = useState("");

  const fetchTrains = () => {
    fetch("http://localhost:8080/trains")
      .then((res) => res.json())
      .then(setTrains)
      .catch(console.error);
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  const handleCreateTrain = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/trains", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ number, type }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setNumber("");
        setType("");
        fetchTrains();
      })
      .catch(console.error);
  };

  const handleDeleteTrain = (id) => {
    fetch(`http://localhost:8080/trains/${id}`, {
      method: "DELETE",
    })
      .then(() => fetchTrains())
      .catch(console.error);
  };

  return (
    <>
      <h2>Поезда</h2>

      <form onSubmit={handleCreateTrain}>
        <input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Номер" />
        <br /><br />
        <input value={type} onChange={(e) => setType(e.target.value)} placeholder="Тип" />
        <br /><br />
        <button type="submit">Создать</button>
      </form>

      {trains.map((t) => (
        <div key={t.id} style={cardStyle}>
          <p>{t.number} ({t.type})</p>
          <button onClick={() => handleDeleteTrain(t.id)} style={deleteBtn}>
            Удалить
          </button>
        </div>
      ))}
    </>
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

export default Trains;