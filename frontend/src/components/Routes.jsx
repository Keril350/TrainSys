import { useEffect, useState } from "react";

function Routes() {
  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);

  const [routeName, setRouteName] = useState("");
  const [routeStations, setRouteStations] = useState([]);

  const [stationId, setStationId] = useState("");
  const [stationOrder, setStationOrder] = useState("");

  const fetchRoutes = () => {
    fetch("http://localhost:8080/routes")
      .then((res) => res.json())
      .then(setRoutes);
  };

  const fetchStations = () => {
    fetch("http://localhost:8080/stations")
      .then((res) => res.json())
      .then(setStations);
  };

  useEffect(() => {
    fetchRoutes();
    fetchStations();
  }, []);

  // ➕ добавить станцию
  const addStationToRoute = () => {
    if (!stationId || !stationOrder) return;

    const selectedStation = stations.find(
      (s) => s.id === Number(stationId)
    );

    setRouteStations([
      ...routeStations,
      {
        stationId: Number(stationId),
        stationOrder: Number(stationOrder),
        stationName: selectedStation?.name,
      },
    ]);

    // 🔥 очистка
    setStationId("");
    setStationOrder("");
  };

  // ❌ удалить станцию из списка
  const removeStation = (index) => {
    setRouteStations(routeStations.filter((_, i) => i !== index));
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
        stations: routeStations.map((s) => ({
          stationId: s.stationId,
          stationOrder: s.stationOrder,
        })),
      }),
    }).then(() => {
      setRouteName("");
      setRouteStations([]);
      fetchRoutes();
    });
  };

  const handleDeleteRoute = (id) => {
    fetch(`http://localhost:8080/routes/${id}`, {
      method: "DELETE",
    }).then(() => fetchRoutes());
  };

  return (
    <div style={container}>
      <h2>🛤 Маршруты</h2>

      <form onSubmit={handleCreateRoute} style={form}>
        <input
          placeholder="Название маршрута"
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
        />

        <select value={stationId} onChange={(e) => setStationId(e.target.value)}>
          <option value="">Станция</option>
          {stations.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.city})
            </option>
          ))}
        </select>

        <input
          placeholder="Порядок"
          value={stationOrder}
          onChange={(e) => setStationOrder(e.target.value)}
        />

        <button type="button" onClick={addStationToRoute}>
          Добавить
        </button>

        <button type="submit" style={createBtn}>
          Создать маршрут
        </button>
      </form>

      {/* 👇 список добавленных станций */}
      <div style={{ marginBottom: "20px" }}>
        {routeStations.map((s, i) => (
          <div key={i}>
            {s.stationOrder}. {s.stationName}
            <button onClick={() => removeStation(i)}>❌</button>
          </div>
        ))}
      </div>

      <div style={grid}>
        {routes.map((r) => (
          <div key={r.id} style={card}>
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
    </div>
  );
}

const container = { marginBottom: "40px" };
const form = { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "15px" };

const card = {
  border: "1px solid #ddd",
  padding: "15px",
  borderRadius: "10px",
};

const createBtn = {
  background: "green",
  color: "white",
  padding: "8px",
  borderRadius: "6px",
};

const deleteBtn = {
  background: "red",
  color: "white",
  padding: "6px",
  borderRadius: "6px",
  marginTop: "10px",
};

export default Routes;