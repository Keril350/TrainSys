import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/common.module.css";

function Stations() {
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const isWorker = user?.role === "WORKER";

  const canEdit = isAdmin || isWorker;
  const canDelete = isAdmin;

  const [stations, setStations] = useState([]);

  const [stationName, setStationName] = useState("");
  const [city, setCity] = useState("");
  const [code, setCode] = useState("");

  const [editingId, setEditingId] = useState(null);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: "Bearer " + user?.token,
  });

  const fetchStations = () => {
    fetch("http://localhost:8080/stations")
      .then((res) => res.json())
      .then(setStations);
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:8080/stations/${editingId}`
      : "http://localhost:8080/stations";

    fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: stationName,
        city,
        code,
      }),
    }).then(() => {
      resetForm();
      fetchStations();
    });
  };

  const handleDeleteStation = (id) => {
    fetch(`http://localhost:8080/stations/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    }).then(fetchStations);
  };

  const handleEdit = (s) => {
    setEditingId(s.id);
    setStationName(s.name);
    setCity(s.city);
    setCode(s.code);
  };

  const resetForm = () => {
    setEditingId(null);
    setStationName("");
    setCity("");
    setCode("");
  };

  return (
    <div className={styles.container}>
      <h2>🚉 Станции</h2>

      {canEdit && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input className={styles.input} value={stationName} onChange={(e) => setStationName(e.target.value)} placeholder="Название" />
          <input className={styles.input} value={city} onChange={(e) => setCity(e.target.value)} placeholder="Город" />
          <input className={styles.input} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Код" />

          <button className={styles.createBtn}>
            {editingId ? "Сохранить" : "Создать"}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm} className={styles.cancelBtn}>
              Отмена
            </button>
          )}
        </form>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            {(isAdmin || isWorker) && <th>ID</th>}
            <th>Название</th>
            <th>Город</th>
            <th>Код</th>
            {canEdit && <th></th>}
          </tr>
        </thead>

        <tbody>
          {stations.map((s) => (
            <tr key={s.id}>
              {(isAdmin || isWorker) && <td>{s.id}</td>}
              <td>{s.name}</td>
              <td>{s.city}</td>
              <td>{s.code}</td>

              {canEdit && (
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => handleEdit(s)}>
                      Редактировать
                    </button>

                    {canDelete && (
                      <button className={styles.deleteBtn} onClick={() => handleDeleteStation(s.id)}>
                        Удалить
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Stations;