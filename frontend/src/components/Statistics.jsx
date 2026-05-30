import { useEffect, useState } from "react";
import styles from "../styles/common.module.css";

function Statistics() {

  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/statistics")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className={styles.container}>
        <h2>Нет статистики</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>📊 Статистика системы</h2>

      <div className={styles.grid}>

        <div className={styles.card}>
          <h3>🚆 Поезда</h3>
          <h1>{stats.trainsCount}</h1>
        </div>

        <div className={styles.card}>
          <h3>🛤 Маршруты</h3>
          <h1>{stats.routesCount}</h1>
        </div>

        <div className={styles.card}>
          <h3>📅 Рейсы</h3>
          <h1>{stats.schedulesCount}</h1>
        </div>

        <div className={styles.card}>
          <h3>🎫 Билеты</h3>
          <h1>{stats.ticketsCount}</h1>
        </div>

        <div className={styles.card}>
          <h3>💰 Выручка</h3>
          <h1>{stats.totalRevenue} BYN</h1>
        </div>

        <div className={styles.card}>
          <h3>Популярный маршрут</h3>
          <h2>{stats.mostPopularRoute}</h2>
        </div>

      </div>
    </div>
  );
}

export default Statistics;