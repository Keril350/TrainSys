import { useEffect, useState } from "react";

function App() {
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [number, setNumber] = useState("");
  const [type, setType] = useState("");

  const [stationName, setStationName] = useState("");
  const [city, setCity] = useState("");
  const [code, setCode] = useState("");

  // ROUTE STATE
  const [routeName, setRouteName] = useState("");
  const [routeStations, setRouteStations] = useState([]);
  const [stationId, setStationId] = useState("");
  const [stationOrder, setStationOrder] = useState("");

  // ===== TRAINS =====

  const fetchTrains = () => {
    fetch("http://localhost:8080/trains")
      .then((res) => res.json())
      .then((data) => setTrains(data))
      .catch((err) => console.error(err));
  };

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

    fetch("http://localhost:8080/stations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: stationName, city, code }),
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

  // ===== ROUTES =====

  const fetchRoutes = () => {
    fetch("http://localhost:8080/routes")
      .then((res) => res.json())
      .then((data) => setRoutes(data))
      .catch((err) => console.error(err));
  };

  const addStationToRoute = () => {
    if (!stationId || !stationOrder) return;

    setRouteStations([
      ...routeStations,
      {
        stationId: Number(stationId),
        stationOrder: Number(stationOrder),
      },
    ]);

    setStationId("");
    setStationOrder("");
  };

  const handleCreateRoute = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/routes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: routeName,
        stations: routeStations,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          console.error("Ошибка:", text);
          throw new Error("Ошибка при создании маршрута");
        }
        return res.json();
      })
      .then(() => {
        setRouteName("");
        setRouteStations([]);
        fetchRoutes();
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteRoute = (id) => {
    fetch(`http://localhost:8080/routes/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка удаления маршрута");
        fetchRoutes();
      })
      .catch((err) => console.error(err));
  };

  // ===== INIT =====

  useEffect(() => {
    fetchTrains();
    fetchStations();
    fetchRoutes();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🚆 Train System</h1>

      {/* ===== TRAINS ===== */}
      <h2>Создать поезд</h2>
      <form onSubmit={handleCreateTrain}>
        <input
          type="text"
          placeholder="Номер"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <br /><br />
        <input
          type="text"
          placeholder="Тип"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <br /><br />
        <button type="submit">Создать</button>
      </form>

      <h2>Список поездов</h2>
      {trains.map((train) => (
        <div key={train.id} style={cardStyle}>
          <p>{train.number} ({train.type})</p>
          <button onClick={() => handleDeleteTrain(train.id)} style={deleteBtn}>
            Удалить
          </button>
        </div>
      ))}

      <hr />

      {/* ===== STATIONS ===== */}
      <h2>Создать станцию</h2>
      <form onSubmit={handleCreateStation}>
        <input placeholder="Название" value={stationName} onChange={(e) => setStationName(e.target.value)} />
        <br /><br />
        <input placeholder="Город" value={city} onChange={(e) => setCity(e.target.value)} />
        <br /><br />
        <input placeholder="Код" value={code} onChange={(e) => setCode(e.target.value)} />
        <br /><br />
        <button type="submit">Создать</button>
      </form>

      <h2>Список станций</h2>
      {stations.map((s) => (
        <div key={s.id} style={cardStyle}>
          <p>{s.name} ({s.city}) [{s.code}]</p>
          <button onClick={() => handleDeleteStation(s.id)} style={deleteBtn}>
            Удалить
          </button>
        </div>
      ))}

      <hr />

      {/* ===== ROUTES ===== */}
      <h2>Создать маршрут</h2>
      <form onSubmit={handleCreateRoute}>
        <input
          placeholder="Название маршрута"
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="ID станции"
          value={stationId}
          onChange={(e) => setStationId(e.target.value)}
        />

        <input
          placeholder="Порядок"
          value={stationOrder}
          onChange={(e) => setStationOrder(e.target.value)}
        />

        <button type="button" onClick={addStationToRoute}>
          Добавить станцию
        </button>

        <br /><br />

        {routeStations.map((s, i) => (
          <div key={i}>
            {s.stationId} → {s.stationOrder}
          </div>
        ))}

        <br />
        <button type="submit">Создать маршрут</button>
      </form>

      <h2>Список маршрутов</h2>
      {routes.map((r) => (
        <div key={r.id} style={cardStyle}>
          <p><b>{r.name}</b></p>

          {r.stations?.map((s, i) => (
            <div key={i}>
              {s.stationOrder}. {s.stationName}
            </div>
          ))}

          <button onClick={() => handleDeleteRoute(r.id)} style={deleteBtn}>
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

export default App;