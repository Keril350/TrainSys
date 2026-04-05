import { useEffect, useState } from "react";

function App() {
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/trains")
      .then((res) => res.json())
      .then((data) => {
        setTrains(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🚆 Train System</h1>

      <h2>Список поездов</h2>

      {trains.length === 0 ? (
        <p>Нет поездов</p>
      ) : (
        <div>
          {trains.map((train) => (
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
          ))}
        </div>
      )}
    </div>
  );
}

export default App;