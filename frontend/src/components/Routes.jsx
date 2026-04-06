import { useEffect, useState } from "react";

function Routes() {
  const [routes, setRoutes] = useState([]);

  const [routeName, setRouteName] = useState("");
  const [routeStations, setRouteStations] = useState([]);
  const [stationId, setStationId] = useState("");
  const [stationOrder, setStationOrder] = useState("");

  const fetchRoutes = () => {
    fetch("http://localhost:8080/routes")
      .then((res) => res.json())
      .then(setRoutes)
      .catch(console.error);
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: routeName,
        stations: routeStations,
      }),
    })
      .then(() => {
        setRouteName("");
        setRouteStations([]);
        fetchRoutes();
      })
      .catch(console.error);
  };

  const handleDeleteRoute = (id) => {
    fetch(`http://localhost:8080/routes/${id}`, {
      method: "DELETE",
    })
      .then(() => fetchRoutes())
      .catch(console.error);
  };

  return (
    <div style={container}>
      <h2>🛤 Маршруты</h2>

      <form onSubmit={handleCreateRoute} style={form}>
        <input placeholder="Название" value={routeName} onChange={(e) => setRouteName(e.target.value)} />
        <input placeholder="Station ID" value={stationId} onChange={(e) => setStationId(e.target.value)} />
        <input placeholder="Order" value={stationOrder} onChange={(e) => setStationOrder(e.target.value)} />

        <button type="button" onClick={addStationToRoute}>+</button>
        <button type="submit" style={createBtn}>Создать</button>
      </form>

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

const createBtn = { background: "green", color: "white", padding: "8px", borderRadius: "6px" };
const deleteBtn = { background: "red", color: "white", padding: "6px", borderRadius: "6px", marginTop: "10px" };

export default Routes;