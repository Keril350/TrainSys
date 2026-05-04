import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/common.module.css";

function Routes() {
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const canEdit = user?.role === "ADMIN" || user?.role === "WORKER";

  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);

  const [routeName, setRouteName] = useState("");
  const [routeStations, setRouteStations] = useState([]);

  const [stationId, setStationId] = useState("");
  const [stationOrder, setStationOrder] = useState("");

  const [editId, setEditId] = useState(null);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: "Bearer " + user?.token,
  });

  useEffect(() => {
    fetchRoutes();
    fetchStations();
  }, []);

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

  const addStationToRoute = () => {
    if (!stationId || !stationOrder) return;

    const selected = stations.find(s => s.id === Number(stationId));

    setRouteStations([
      ...routeStations,
      {
        stationId: Number(stationId),
        stationOrder: Number(stationOrder),
        stationName: selected?.name,
      },
    ]);

    setStationId("");
    setStationOrder("");
  };

  const removeStation = (i) => {
    setRouteStations(routeStations.filter((_, idx) => idx !== i));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(
      editId
        ? `http://localhost:8080/routes/${editId}`
        : "http://localhost:8080/routes",
      {
        method: editId ? "PUT" : "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: routeName,
          stations: routeStations.map(s => ({
            stationId: s.stationId,
            stationOrder: s.stationOrder,
          })),
        }),
      }
    ).then(() => {
      setRouteName("");
      setRouteStations([]);
      setEditId(null);
      fetchRoutes();
    });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/routes/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    }).then(fetchRoutes);
  };

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
    <div className={styles.container}>
      <h2>🛤 Маршруты</h2>

      {canEdit && (
        <>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              className={styles.input}
              placeholder="Название"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
            />

            <select
              className={styles.select}
              value={stationId}
              onChange={(e) => setStationId(e.target.value)}
            >
              <option value="">Станция</option>
              {stations.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <input
              className={styles.input}
              placeholder="Порядок"
              value={stationOrder}
              onChange={(e) => setStationOrder(e.target.value)}
            />

            <button
              type="button"
              className={styles.editBtn}
              onClick={addStationToRoute}
            >
              Добавить
            </button>

            <button className={styles.createBtn}>
              {editId ? "Сохранить" : "Создать"}
            </button>
          </form>

          <div>
            {routeStations.map((s, i) => (
              <div key={i}>
                {s.stationOrder}. {s.stationName}
                <button onClick={() => removeStation(i)}>❌</button>
              </div>
            ))}
          </div>
        </>
      )}

      <div className={styles.grid}>
        {routes.map(r => (
          <div key={r.id} className={styles.card}>
            <b>{r.name}</b>

            {r.stations?.map((s, i) => (
              <div key={i}>
                {s.stationOrder}. {s.stationName}
              </div>
            ))}

            {canEdit && (
              <div className={styles.actions}>
                <button
                  className={styles.editBtn}
                  onClick={() => handleEdit(r)}
                >
                  Редактировать
                </button>

                {isAdmin && (
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(r.id)}
                  >
                    Удалить
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Routes;