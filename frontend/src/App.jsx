import { useEffect, useState } from "react";

function App() {
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);

  const [number, setNumber] = useState("");
  const [type, setType] = useState("");

  const [stationName, setStationName] = useState("");
  const [city, setCity] = useState("");
  const [code, setCode] = useState("");

  // ===== TRAINS =====

  const fetchTrains = () => {
    fetch("http://localhost:8080/trains")
      .then((res) => res.json())
      .then((data) => setTrains(data))
      .catch((err) => console.error(err));
  };

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
        if (!res.ok) throw new Error("Ошибка при создании поезда");
        return res.json();
      })
      .then(() => {
        setNumber("");
        setType("");
        fetchTrains();
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteTrain = (id) => {
    fetch(`http://localhost:8080/trains/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при удалении");
        fetchTrains();
      })
      .catch((err) => console.error(err));
  };

  // ===== STATIONS =====

  const fetchStations = () => {
    fetch("http://localhost:8080/stations")
      .then((res) => res.json())
      .then((data) => setStations(data))
      .catch((err) => console.error(err));
  };

  const handleCreateStation = (e) => {
    e.preventDefault();

    const newStation = {
      name: stationName,
      city: city,
      code: code,
    };

    fetch("http://localhost:8080/stations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStation),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при создании станции");
        return res.json();
      })
      .then(() => {
        setStationName("");
        setCity("");
        setCode("");
        fetchStations();
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteStation = (id) => {
    fetch(`http://localhost:8080/stations/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при удалении станции");
        fetchStations();
      })
      .catch((err) => console.error(err));
  };

  // ===== INIT =====

  useEffect(() => {
    fetchTrains();
    fetchStations();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🚆 Train System</h1>

      {/* ===== TRAINS ===== */}
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

      <h2>Список поездов</h2>

      {trains.map((train) => (
        <div key={train.id} style={cardStyle}>
          <p><b>ID:</b> {train.id}</p>
          <p><b>Номер:</b> {train.number}</p>
          <p><b>Тип:</b> {train.type}</p>

          <button onClick={() => handleDeleteTrain(train.id)} style={deleteBtn}>
            Удалить
          </button>
        </div>
      ))}

      <hr />

      {/* ===== STATIONS ===== */}
      <h2>Создать станцию</h2>
      <form onSubmit={handleCreateStation}>
        <input
          type="text"
          placeholder="Название"
          value={stationName}
          onChange={(e) => setStationName(e.target.value)}
        />
        <br /><br />

        <input
          type="text"
          placeholder="Город"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <br /><br />

        <input
          type="text"
          placeholder="Код"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <br /><br />

        <button type="submit">Создать</button>
      </form>

      <h2>Список станций</h2>

      {stations.map((station) => (
        <div key={station.id} style={cardStyle}>
          <p><b>ID:</b> {station.id}</p>
          <p><b>Название:</b> {station.name}</p>
          <p><b>Город:</b> {station.city}</p>
          <p><b>Код:</b> {station.code}</p>

          <button
            onClick={() => handleDeleteStation(station.id)}
            style={deleteBtn}
          >
            Удалить
          </button>
        </div>
      ))}
    </div>
  );
}

// немного стилей чтобы не дублировать
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

export default App;