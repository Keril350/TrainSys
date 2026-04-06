import { useEffect, useState } from "react";

function Stations() {
  const [stations, setStations] = useState([]);
  const [stationName, setStationName] = useState("");
  const [city, setCity] = useState("");
  const [code, setCode] = useState("");

  const fetchStations = () => {
    fetch("http://localhost:8080/stations")
      .then((res) => res.json())
      .then(setStations)
      .catch(console.error);
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleCreateStation = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/stations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: stationName, city, code }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка создания");
        return res.json();
      })
      .then(() => {
        setStationName("");
        setCity("");
        setCode("");
        fetchStations();
      })
      .catch(console.error);
  };

  const handleDeleteStation = (id) => {
    fetch(`http://localhost:8080/stations/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка удаления");
        fetchStations();
      })
      .catch(console.error);
  };

  return (
    <div>
      <h2>🏙 Станции</h2>

      {/* ===== ФОРМА ===== */}
      <form onSubmit={handleCreateStation} style={formStyle}>
        <input
          placeholder="Название"
          value={stationName}
          onChange={(e) => setStationName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Город"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Код"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={inputStyle}
        />

        <button type="submit" style={createBtn}>
          Создать
        </button>
      </form>

      {/* ===== ТАБЛИЦА ===== */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Город</th>
            <th>Код</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {stations.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.city}</td>
              <td>{s.code}</td>
              <td>
                <button
                  onClick={() => handleDeleteStation(s.id)}
                  style={deleteBtn}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ===== СТИЛИ =====

const formStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
};

const inputStyle = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const createBtn = {
  backgroundColor: "green",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "6px",
  cursor: "pointer",
};

const deleteBtn = {
  backgroundColor: "red",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

export default Stations;