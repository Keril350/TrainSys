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
        if (!res.ok) throw new Error();
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
      .then(() => fetchStations())
      .catch(console.error);
  };

  return (
    <>
      <h2>Станции</h2>

      <form onSubmit={handleCreateStation}>
        <input placeholder="Название" value={stationName} onChange={(e) => setStationName(e.target.value)} />
        <br /><br />
        <input placeholder="Город" value={city} onChange={(e) => setCity(e.target.value)} />
        <br /><br />
        <input placeholder="Код" value={code} onChange={(e) => setCode(e.target.value)} />
        <br /><br />
        <button type="submit">Создать</button>
      </form>

      {stations.map((s) => (
        <div key={s.id} style={cardStyle}>
          <p>{s.name} ({s.city}) [{s.code}]</p>
          <button onClick={() => handleDeleteStation(s.id)} style={deleteBtn}>
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

export default Stations;