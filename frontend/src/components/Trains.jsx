import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/common.module.css";

function Trains() {
  const [trains, setTrains] = useState([]);
  const [types, setTypes] = useState([]);

  const [number, setNumber] = useState("");
  const [type, setType] = useState("");

  const [editingId, setEditingId] = useState(null);

  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const isWorker = user?.role === "WORKER";

  const canManage = isAdmin || isWorker;
  const canSeeId = isAdmin || isWorker;

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: "Bearer " + user?.token,
  });

  const fetchTrains = () => {
    fetch("http://localhost:8080/trains")
      .then((res) => res.json())
      .then(setTrains);
  };

  const fetchTypes = () => {
    fetch("http://localhost:8080/train-types")
      .then((res) => res.json())
      .then(setTypes);
  };

  useEffect(() => {
    fetchTrains();
    fetchTypes();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:8080/trains/${editingId}`
      : "http://localhost:8080/trains";

    fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify({ number, type }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        resetForm();
        fetchTrains();
      })
      .catch(() =>
        alert("Ошибка (нужны права WORKER/ADMIN или тип не найден)")
      );
  };

  const handleDeleteTrain = (id) => {
    fetch(`http://localhost:8080/trains/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        fetchTrains();
      })
      .catch(() => alert("Ошибка удаления (только ADMIN)"));
  };

  const handleEdit = (train) => {
    setEditingId(train.id);
    setNumber(train.number);
    setType(train.type);
  };

  const resetForm = () => {
    setEditingId(null);
    setNumber("");
    setType("");
  };

  return (
    <div className={styles.page}>
      <h2>🚆 Поезда</h2>

      {canManage && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Номер"
          />

          <select
            className={styles.select}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Тип</option>
            {types.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>

          <button type="submit" className={styles.createBtn}>
            {editingId ? "Сохранить" : "Создать"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className={styles.cancelBtn}
            >
              Отмена
            </button>
          )}
        </form>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            {canSeeId && <th>ID</th>}
            <th>Номер</th>
            <th>Тип</th>
            {canManage && <th></th>}
          </tr>
        </thead>

        <tbody>
          {trains.map((t) => (
            <tr key={t.id}>
              {canSeeId && <td>{t.id}</td>}
              <td>{t.number}</td>
              <td>{t.type}</td>

              {canManage && (
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEdit(t)}
                    >
                      Редактировать
                    </button>

                    {isAdmin && (
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteTrain(t.id)}
                      >
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

export default Trains;