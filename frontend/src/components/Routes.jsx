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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: routeName,
        stations: routeStations,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
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
    <>
      <h2>Маршруты</h2>

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

export default Routes;