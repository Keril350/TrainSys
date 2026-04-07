import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Trains from "./components/Trains";
import Stations from "./components/Stations";
import RoutesPage from "./components/Routes";
import Schedule from "./components/Schedule";
import Seats from "./components/Seats";
import Tickets from "./components/Tickets";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload();
  };

  return (
    <BrowserRouter>
      {/* 🔥 USER PANEL (фиксированный угол) */}
      <div style={userPanelStyle}>
        {username ? (
          <>
            👤 <b>{username}</b>
            <button onClick={handleLogout} style={logoutBtn}>
              Выйти
            </button>
          </>
        ) : (
          <span style={{ color: "gray" }}>Не авторизован</span>
        )}
      </div>

      <div style={{ padding: "20px", marginTop: "40px" }}>
        <h1>🚆 Train System</h1>

        {/* 🔥 Навигация */}
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/login">Вход</Link> |{" "}
          <Link to="/register">Регистрация</Link> |{" "}
          <Link to="/trains">Поезда</Link> |{" "}
          <Link to="/stations">Станции</Link> |{" "}
          <Link to="/routes">Маршруты</Link> |{" "}
          <Link to="/schedules">Расписание</Link> |{" "}
          <Link to="/seats">Места</Link> |{" "}
          <Link to="/tickets">Билеты</Link>
        </nav>

        {/* 🔥 Роуты */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/trains" element={<Trains />} />
          <Route path="/stations" element={<Stations />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/schedules" element={<Schedule />} />
          <Route path="/seats" element={<Seats />} />
          <Route path="/tickets" element={<Tickets />} />

          <Route path="*" element={<Trains />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// ===== СТИЛИ =====

const userPanelStyle = {
  position: "fixed",
  top: "10px",
  left: "10px",
  background: "#f5f5f5",
  padding: "8px 12px",
  borderRadius: "8px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  zIndex: 1000,
};

const logoutBtn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};

export default App;