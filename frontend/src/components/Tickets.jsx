import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/common.module.css";

function Tickets() {
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const canEdit = user?.role === "ADMIN" || user?.role === "WORKER";

  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [seats, setSeats] = useState([]);

  const [userId, setUserId] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [seatId, setSeatId] = useState("");

  const [editId, setEditId] = useState(null);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: "Bearer " + user?.token,
  });

  useEffect(() => {
    fetchTickets();
    fetchSchedules();
    if (isAdmin) fetchUsers();
  }, [user]);

  const fetchTickets = () => {
    fetch("http://localhost:8080/tickets", {
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((data) => setTickets(Array.isArray(data) ? data : []));
  };

  const fetchUsers = () => {
    fetch("http://localhost:8080/users")
      .then((res) => res.json())
      .then(setUsers);
  };

  const fetchSchedules = () => {
    fetch("http://localhost:8080/schedules")
      .then((res) => res.json())
      .then(setSchedules);
  };

  const fetchSeats = (id) => {
    fetch(`http://localhost:8080/seats/available/${id}`)
      .then((res) => res.json())
      .then(setSeats);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:8080/tickets/${editId}`
      : "http://localhost:8080/tickets";

    fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify({
        userId: isAdmin ? Number(userId) : null,
        scheduleId: Number(scheduleId),
        seatId: Number(seatId),
      }),
    }).then(() => {
      resetForm();
      fetchTickets();
    });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/tickets/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    }).then(fetchTickets);
  };

  const handleEdit = (t) => {
    setEditId(t.id);
    setUserId(t.userId);
    setScheduleId(t.scheduleId);
    setSeatId(t.seatId);
    fetchSeats(t.scheduleId);
  };

  const resetForm = () => {
    setUserId("");
    setScheduleId("");
    setSeatId("");
    setEditId(null);
    setSeats([]);
  };

  return (
    <div className={styles.container}>
      <h2>🎫 Билеты</h2>

      {canEdit && (
        <form onSubmit={handleSubmit} className={styles.form}>
          {isAdmin && (
            <select
              className={styles.select}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            >
              <option value="">Пользователь</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.username}
                </option>
              ))}
            </select>
          )}

          <select
            className={styles.select}
            value={scheduleId}
            onChange={(e) => {
              const val = e.target.value;
              setScheduleId(val);
              setSeatId("");
              fetchSeats(val);
            }}
          >
            <option value="">Расписание</option>
            {schedules.map((s) => (
              <option key={s.id} value={s.id}>
                Поезд {s.trainNumber}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            value={seatId}
            onChange={(e) => setSeatId(e.target.value)}
          >
            <option value="">Место</option>
            {seats.map((s) => (
              <option key={s.id} value={s.id}>
                Вагон {s.wagonNumber} — место {s.number}
              </option>
            ))}
          </select>

          <button className={styles.createBtn}>
            {editId ? "Сохранить" : "Создать"}
          </button>
        </form>
      )}

      <div className={styles.grid}>
        {tickets.map((t) => (
          <div key={t.id} className={styles.card}>
            {isAdmin && <p><b>ID:</b> {t.id}</p>}

            <p><b>User:</b> {t.username}</p>
            <p><b>Train:</b> {t.trainNumber}</p>
            <p><b>Wagon:</b> {t.wagonNumber}</p>
            <p><b>Seat:</b> {t.seatNumber}</p>
            <p><b>Price:</b> {t.price}</p>

            {canEdit && (
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
                    onClick={() => handleDelete(t.id)}
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

export default Tickets;