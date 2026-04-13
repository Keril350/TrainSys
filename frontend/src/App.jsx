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
      <div style={userPanelStyle}>
        {user ? (
          <>
            👤 <b>{user.username}</b>
            <button onClick={logout} style={logoutBtn}>
              Выйти
            </button>
          </>
        ) : (
          <span style={{ color: "gray" }}>Не авторизован</span>
        )}
      </div>

      <div style={{ padding: "20px", marginTop: "40px" }}>
        <h1>🚆 Train System</h1>

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

        {/* 🔥 ВСЕГДА ВНИЗУ */}
        <Comments />
      </div>
    </BrowserRouter>
  );
}

const userPanelStyle = {
  position: "fixed",
  top: "10px",
  left: "10px",
  background: "#f5f5f5",
  padding: "8px 12px",
  borderRadius: "8px",
  display: "flex",
  gap: "10px",
};

const logoutBtn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "6px",
};

export default App;