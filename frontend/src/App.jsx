import { useEffect, useState } from "react";

function App() {
  const [trains, setTrains] = useState([]);

  const [number, setNumber] = useState("");
  const [type, setType] = useState("");

  // загрузка поездов
  const fetchTrains = () => {
    fetch("http://localhost:8080/trains")
      .then((res) => res.json())
      .then((data) => setTrains(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  // создание поезда
  const handleCreateTrain = (e) => {
    e.preventDefault();

    const newTrain = {
      number: number,
      type: type,
    };

    fetch("http://localhost:8080/trains", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTrain),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ошибка при создании поезда");
        }
        return res.json();
      })
      .then(() => {
        setNumber("");
        setType("");
        fetchTrains(); // обновляем список
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🚆 Train System</h1>

      {/* ФОРМА */}
      <h2>Создать поезд</h2>
      <form onSubmit={handleCreateTrain}>
        <input
          type="text"
          placeholder="Номер поезда"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <br /><br />

        <input
          type="text"
          placeholder="Тип поезда"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <br /><br />

        <button type="submit">Создать</button>
      </form>

      <hr />

      {/* СПИСОК */}
      <h2>Список поездов</h2>

      {trains.length === 0 ? (
        <p>Нет поездов</p>
      ) : (
        trains.map((train) => (
          <div
            key={train.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px"
            }}
          >
            <p><b>ID:</b> {train.id}</p>
            <p><b>Номер:</b> {train.number}</p>
            <p><b>Тип:</b> {train.type}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;