import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useState, useRef, useEffect } from "react";
import styles from "./styles/common.module.css";

import Trains from "./components/Trains";
import Stations from "./components/Stations";
import RoutesPage from "./components/Routes";
import Schedule from "./components/Schedule";
import Seats from "./components/Seats";
import Tickets from "./components/Tickets";
import Login from "./components/Login";
import Register from "./components/Register";
import Comments from "./components/Comments";
import Wagons from "./components/Wagons";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user, logout } = useAuth();

  const [userOpen, setUserOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);

  const userRef = useRef();
  const dataRef = useRef();

  const canViewDictionaries =
    user && (user.role === "ADMIN" || user.role === "WORKER");

  const closeAll = () => {
    setUserOpen(false);
    setDataOpen(false);
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
      if (dataRef.current && !dataRef.current.contains(e.target)) {
        setDataOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? `${styles.navLink} ${styles.navLinkActive}`
      : styles.navLink;

  return (
    <BrowserRouter>
      {/* NAVBAR */}
      <div className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>🚆 Железная дорога</div>

          <div className={styles.navLinks}>
            <NavLink to="/trains" className={navLinkClass}>
              Поезда
            </NavLink>

            {canViewDictionaries && (
              <div className={styles.dropdown} ref={dataRef}>
                <div
                  className={styles.dropdownTrigger}
                  onClick={() => {
                    setDataOpen(!dataOpen);
                    setUserOpen(false);
                  }}
                >
                  Справочники ▾
                </div>

                {dataOpen && (
                  <div className={styles.dropdownMenu}>
                    <NavLink
                      to="/wagons"
                      className={styles.dropdownItem}
                      onClick={closeAll}
                    >
                      Вагоны
                    </NavLink>
                    <NavLink
                      to="/stations"
                      className={styles.dropdownItem}
                      onClick={closeAll}
                    >
                      Станции
                    </NavLink>
                    <NavLink
                      to="/seats"
                      className={styles.dropdownItem}
                      onClick={closeAll}
                    >
                      Места
                    </NavLink>
                  </div>
                )}
              </div>
            )}

            <NavLink to="/routes" className={navLinkClass}>
              Маршруты
            </NavLink>

            <NavLink to="/schedules" className={navLinkClass}>
              Расписание
            </NavLink>

            <NavLink to="/tickets" className={navLinkClass}>
              Билеты
            </NavLink>
          </div>

          {/* USER */}
          <div className={styles.rightSection}>
            {user ? (
              <div className={styles.dropdown} ref={userRef}>
                <div
                  className={styles.dropdownTrigger}
                  onClick={() => {
                    setUserOpen(!userOpen);
                    setDataOpen(false);
                  }}
                >
                  👤 {user.username} ▾
                </div>

                {userOpen && (
                  <div className={styles.dropdownMenu}>
                    <div
                      className={styles.dropdownItem}
                      style={{ color: "red" }}
                      onClick={() => {
                        logout();
                        closeAll();
                      }}
                    >
                      Выйти
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Вход
                </NavLink>
                <NavLink to="/register" className={navLinkClass}>
                  Регистрация
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/trains" element={<ProtectedRoute><Trains /></ProtectedRoute>} />
          <Route path="/wagons" element={<ProtectedRoute roles={["ADMIN", "WORKER"]}><Wagons /></ProtectedRoute>} />
          <Route path="/stations" element={<ProtectedRoute roles={["ADMIN", "WORKER"]}><Stations /></ProtectedRoute>} />
          <Route path="/seats" element={<ProtectedRoute roles={["ADMIN", "WORKER"]}><Seats /></ProtectedRoute>} />
          <Route path="/routes" element={<ProtectedRoute><RoutesPage /></ProtectedRoute>} />
          <Route path="/schedules" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
          <Route path="/tickets" element={<ProtectedRoute><Tickets /></ProtectedRoute>} />

          <Route path="*" element={<Trains />} />
        </Routes>

        {user && <Comments />}
      </div>
    </BrowserRouter>
  );
}

export default App;