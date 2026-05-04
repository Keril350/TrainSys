import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useState, useRef, useEffect } from "react";

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

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? "#fff" : "#cbd5f5",
    textDecoration: "none",
    fontSize: "14px",
    padding: "6px 10px",
    borderRadius: "6px",
    background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
  });

  return (
    <BrowserRouter>
      {/* NAVBAR */}
      <div style={navbar}>
        <div style={navContainer}>
          <div style={logo}>🚆 Train System</div>

          <div style={navLinks}>
            <NavLink to="/trains" style={navLinkStyle}>
              Поезда
            </NavLink>

            {/* СПРАВОЧНИКИ */}
            {canViewDictionaries && (
              <div style={dropdown} ref={dataRef}>
                <div
                  style={dropdownTrigger}
                  onClick={() => {
                    setDataOpen(!dataOpen);
                    setUserOpen(false);
                  }}
                >
                  Справочники ▾
                </div>

                {dataOpen && (
                  <div style={dropdownMenu}>
                    <NavLink to="/wagons" style={dropdownItem} onClick={closeAll}>
                      Вагоны
                    </NavLink>
                    <NavLink to="/stations" style={dropdownItem} onClick={closeAll}>
                      Станции
                    </NavLink>
                    <NavLink to="/seats" style={dropdownItem} onClick={closeAll}>
                      Места
                    </NavLink>
                  </div>
                )}
              </div>
            )}

            <NavLink to="/routes" style={navLinkStyle}>
              Маршруты
            </NavLink>

            <NavLink to="/schedules" style={navLinkStyle}>
              Расписание
            </NavLink>

            <NavLink to="/tickets" style={navLinkStyle}>
              Билеты
            </NavLink>
          </div>

          {/* USER */}
          <div style={rightSection}>
            {user ? (
              <div style={dropdown} ref={userRef}>
                <div
                  style={dropdownTrigger}
                  onClick={() => {
                    setUserOpen(!userOpen);
                    setDataOpen(false);
                  }}
                >
                  👤 {user.username} ▾
                </div>

                {userOpen && (
                  <div style={dropdownMenu}>
                    <div style={dropdownItem} onClick={closeAll}>
                      Профиль
                    </div>

                    <div
                      style={{ ...dropdownItem, color: "red" }}
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
                <NavLink to="/login" style={navLinkStyle}>
                  Вход
                </NavLink>
                <NavLink to="/register" style={navLinkStyle}>
                  Регистрация
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>

      {/* КОНТЕНТ */}
      <div style={container}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/trains"
            element={
              <ProtectedRoute>
                <Trains />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wagons"
            element={
              <ProtectedRoute roles={["ADMIN", "WORKER"]}>
                <Wagons />
              </ProtectedRoute>
            }
          />

          <Route
            path="/stations"
            element={
              <ProtectedRoute roles={["ADMIN", "WORKER"]}>
                <Stations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/seats"
            element={
              <ProtectedRoute roles={["ADMIN", "WORKER"]}>
                <Seats />
              </ProtectedRoute>
            }
          />

          <Route
            path="/routes"
            element={
              <ProtectedRoute>
                <RoutesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/schedules"
            element={
              <ProtectedRoute>
                <Schedule />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <Tickets />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Trains />} />
        </Routes>

        <Comments />
      </div>
    </BrowserRouter>
  );
}

//
// СТИЛИ
//

const navbar = {
  width: "100%",
  background: "#1e293b",
  color: "white",
  padding: "12px 0",
};

const navContainer = {
  maxWidth: "1100px",
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const logo = {
  fontSize: "20px",
  fontWeight: "bold",
};

const navLinks = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
};

const rightSection = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const container = {
  maxWidth: "1100px",
  margin: "30px auto",
  padding: "0 20px",
};

const dropdown = {
  position: "relative",
};

const dropdownTrigger = {
  cursor: "pointer",
  fontSize: "14px",
  padding: "6px 10px",
  color: "#cbd5f5",
};

const dropdownMenu = {
  position: "absolute",
  top: "35px",
  right: 0,
  background: "white",
  color: "#333",
  borderRadius: "8px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  minWidth: "150px",
  display: "flex",
  flexDirection: "column",
  zIndex: 1000,
};

const dropdownItem = {
  padding: "10px",
  textDecoration: "none",
  color: "#333",
  cursor: "pointer",
};

export default App;