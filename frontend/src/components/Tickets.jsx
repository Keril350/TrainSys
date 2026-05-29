import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/common.module.css";
import { toast } from "react-toastify";

function Tickets() {
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const canEdit =
    user?.role === "ADMIN" || user?.role === "WORKER" || user;

  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [trains, setTrains] = useState([]);
  const [routes, setRoutes] = useState([]);
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
    fetch("http://localhost:8080/trains")
      .then((res) => res.json())
      .then((trainData) => {
        setTrains(trainData);

        fetch("http://localhost:8080/schedules")
          .then((res) => res.json())
          .then((scheduleData) => {
            const filtered = scheduleData.filter((s) => {
              const train = trainData.find((t) => t.id === s.trainId);
              return train?.type !== "CARGO";
            });

            setSchedules(filtered);
          });
      });

    fetchRoutes();
    fetchTickets();

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
      .then((data) => {
        const filtered = data.filter((s) => {
          const train = trains.find((t) => t.id === s.trainId);
          return train?.type !== "CARGO";
        });

        setSchedules(filtered);
      });
  };

  const fetchRoutes = () => {
    fetch("http://localhost:8080/routes")
      .then((res) => res.json())
      .then(setRoutes);
  };

  const fetchSeats = (id) => {
    fetch(`http://localhost:8080/seats/available/${id}`)
      .then((res) => res.json())
      .then(setSeats);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = editId ? "PUT" : "POST";

      const url = editId
        ? `http://localhost:8080/tickets/${editId}`
        : "http://localhost:8080/tickets";

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify({
          userId: isAdmin ? Number(userId) : null,
          scheduleId: Number(scheduleId),
          seatId: Number(seatId),
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при сохранении билета");
      }

      toast.success(
        editId
          ? "Билет обновлен"
          : "Билет успешно куплен"
      );

      resetForm();
      fetchTickets();

    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/tickets/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка удаления");
      }

      toast.success("Билет удален");

      fetchTickets();

    } catch (error) {
      toast.error(error.message);
    }
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

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleString();
  };

  const getRouteName = (routeId) => {
    return routes.find((r) => r.id === routeId)?.name || "—";
  };

  const getSchedule = (id) => {
    return schedules.find((s) => s.id === id);
  };

  const getFullName = (t) => {
    if (!t.lastName && !t.firstName) return t.username;

    return `${t.lastName} ${t.firstName} ${t.middleName || ""}`.trim();
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

              <option value="">Пассажир</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.lastName} {u.firstName}
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

              if (val) {
                fetchSeats(val);
              } else {
                setSeats([]);
              }
            }}
          >

            <option value="">Выберите рейс</option>
            {schedules.map((s) => (
              <option key={s.id} value={s.id}>
                {getRouteName(s.routeId)} | Поезд {s.trainNumber} |{" "}
                {formatDate(s.departureTime)}
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
                Вагон {s.wagonNumber} — место {s.number} | {s.price} ₽
              </option>
            ))}
          </select>

          <button className={styles.createBtn}>
            {editId ? "Сохранить" : "Купить билет"}
          </button>
        </form>
      )}

      <div className={styles.grid}>
        {tickets.map((t) => {
          const schedule = getSchedule(t.scheduleId);

          return (
            <div key={t.id} className={styles.card}>
              {isAdmin && <p><b>ID:</b> {t.id}</p>}

              <p><b>Пассажир:</b> {getFullName(t)}</p>

              <p>
                <b>Маршрут:</b>{" "}
                {schedule ? getRouteName(schedule.routeId) : "—"}
              </p>

              <p><b>Поезд:</b> {t.trainNumber}</p>

              <p>
                <b>Отправление:</b>{" "}
                {schedule ? formatDate(schedule.departureTime) : "—"}
              </p>

              <p><b>Вагон:</b> {t.wagonNumber}</p>
              <p><b>Место:</b> {t.seatNumber}</p>
              <p><b>Цена:</b> {t.price}</p>

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
          );
        })}
      </div>
    </div>
  );
}

export default Tickets;