import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Routes() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);

  const [routeName, setRouteName] = useState("");
  const [routeStations, setRouteStations] = useState([]);

  const [stationId, setStationId] = useState("");
  const [stationOrder, setStationOrder] = useState("");

  const [editId, setEditId] = useState(null);

  // 🔥 JWT из context
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: "Bearer " + user?.token,
  });

  const fetchRoutes = () => {
    fetch("http://localhost:8080/routes")
      .then((res) => res.json())
      .then(setRoutes)
      .catch(console.error);
  };

  const fetchStations = () => {
    fetch("http://localhost:8080/stations")
      .then((res) => res.json())
      .then(setStations)
      .catch(console.error);
  };

  useEffect(() => {
    fetchRoutes();
    fetchStations();
  }, []);

  // ➕ добавить станцию
  const addStationToRoute = () => {
    if (!stationId || !stationOrder) {
      alert("Выбери станцию и порядок");
      return;
    }

    if (routeStations.some((s) => s.stationId === Number(stationId))) {
      alert("Станция уже добавлена");
      return;
    }

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

    setStationId("");
    setStationOrder("");
  };

  const removeStation = (index) => {
    setRouteStations(routeStations.filter((_, i) => i !== index));
  };

  // ===== CREATE / UPDATE =====
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!routeName) {
      alert("Введите название маршрута");
      return;
    }

    if (routeStations.length === 0) {
      alert("Добавь хотя бы одну станцию");
      return;
    }

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:8080/routes/${editId}`
      : "http://localhost:8080/routes";

    fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: routeName,
        stations: routeStations.map((s) => ({
          stationId: s.stationId,
          stationOrder: s.stationOrder,
        })),
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Ошибка");
        }
        return res.json();
      })
      .then(() => {
        setRouteName("");
        setRouteStations([]);
        setEditId(null);
        fetchRoutes();
      })
      .catch((err) => {
        console.error(err);
        alert("Ошибка (нужна роль ADMIN)");
      });
  };

  // ===== DELETE =====
  const handleDeleteRoute = (id) => {
    fetch(`http://localhost:8080/routes/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Ошибка удаления");
        }
        fetchRoutes();
      })
      .catch((err) => {
        console.error(err);
        alert("Ошибка удаления (нужна роль ADMIN)");
      });
  };

  // ===== EDIT =====
  const handleEdit = (r) => {
    setEditId(r.id);
    setRouteName(r.name);

    setRouteStations(
      r.stations.map((s) => ({
        stationId: s.stationId,
        stationOrder: s.stationOrder,
        stationName: s.stationName,
      }))
    );
  };

  return (
    <div style={container}>
      <h2>🛤 Маршруты</h2>

      {/* ✅ только ADMIN */}
      {isAdmin && (
        <>
          <form onSubmit={handleSubmit} style={form}>
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
              {editId ? "Сохранить" : "Создать маршрут"}
            </button>
          </form>

          <div style={{ marginBottom: "20px" }}>
            {routeStations.map((s, i) => (
              <div key={i}>
                {s.stationOrder}. {s.stationName}
                <button onClick={() => removeStation(i)}>❌</button>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={grid}>
        {routes.map((r) => (
          <div key={r.id} style={card}>
            <p><b>{r.name}</b></p>

            {r.stations?.map((s, i) => (
              <div key={i}>
                {s.stationOrder}. {s.stationName}
              </div>
            ))}

            {/* ✅ только ADMIN */}
            {isAdmin && (
              <>
                <button onClick={() => handleEdit(r)}>
                  Редактировать
                </button>

                <button onClick={() => handleDeleteRoute(r.id)} style={deleteBtn}>
                  Удалить
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== СТИЛИ (НЕ ТРОГАЕМ) =====

const container = { marginBottom: "40px" };

const form = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginBottom: "20px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "15px",
};

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
  border: "none",
  cursor: "pointer",
};

const deleteBtn = {
  background: "red",
  color: "white",
  padding: "6px",
  borderRadius: "6px",
  marginTop: "10px",
  border: "none",
  cursor: "pointer",
};

export default Routes;