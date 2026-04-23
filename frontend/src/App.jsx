import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Trains from "./components/Trains";
import Stations from "./components/Stations";
import RoutesPage from "./components/Routes";
import Schedule from "./components/Schedule";
import Seats from "./components/Seats";
import Tickets from "./components/Tickets";
import Login from "./components/Login";
import Register from "./components/Register";
import Comments from "./components/Comments";

function App() {
  const { user, logout } = useAuth();

  return (
    <BrowserRouter>
      {/* 👤 USER PANEL */}
      <div style={userPanelStyle}>
        {user ? (
          <>
            👤 <b>{user.username}</b>
            <button onClick={logout} style={logoutBtn}>
              Выйти
            </button>
          </>
        ) : (
          <span style={{ color: "#888" }}>Не авторизован</span>
        )}
      </div>

      {/* 🔷 NAVBAR */}
      <div style={navbar}>
        <div style={navContainer}>
          <div style={logo}>🚆 Train System</div>

          <div style={navLinks}>
            <Link to="/login" style={link}>Вход</Link>
            <Link to="/register" style={link}>Регистрация</Link>
            <Link to="/trains" style={link}>Поезда</Link>
            <Link to="/stations" style={link}>Станции</Link>
            <Link to="/routes" style={link}>Маршруты</Link>
            <Link to="/schedules" style={link}>Расписание</Link>
            <Link to="/seats" style={link}>Места</Link>
            <Link to="/tickets" style={link}>Билеты</Link>
          </div>
        </div>
      </div>

      {/* 📦 ОСНОВНОЙ КОНТЕНТ */}
      <div style={container}>
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

        {/* 💬 КОММЕНТАРИИ */}
        <Comments />
      </div>
    </BrowserRouter>
  );
}

//
// 🎨 СТИЛИ
//

const navbar = {
  width: "100%",
  background: "#1e293b", // холодный тёмно-синий
  color: "white",
  padding: "10px 0",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
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
  gap: "15px",
};

const link = {
  color: "#cbd5f5",
  textDecoration: "none",
  fontSize: "14px",
};

const container = {
  maxWidth: "1100px",
  margin: "30px auto",
  padding: "0 20px",
};

const userPanelStyle = {
  position: "fixed",
  top: "10px",
  right: "10px",
  background: "white",
  padding: "8px 12px",
  borderRadius: "8px",
  display: "flex",
  gap: "10px",
  alignItems: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  zIndex: 1000,
};

const logoutBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};

export default App;