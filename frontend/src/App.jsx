import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Trains from "./components/Trains";
import Stations from "./components/Stations";
import RoutesPage from "./components/Routes";
import Schedule from "./components/Schedule";
import Seats from "./components/Seats";
import Tickets from "./components/Tickets";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "20px" }}>
        <h1>🚆 Train System</h1>

        {/* 🔥 Навигация */}
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/trains">Поезда</Link> |{" "}
          <Link to="/stations">Станции</Link> |{" "}
          <Link to="/routes">Маршруты</Link> |{" "}
          <Link to="/schedules">Расписание</Link> |{" "}
          <Link to="/seats">Места</Link> |{" "}
          <Link to="/tickets">Билеты</Link>
        </nav>

        {/* 🔥 Роуты */}
        <Routes>
          <Route path="/trains" element={<Trains />} />
          <Route path="/stations" element={<Stations />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/schedules" element={<Schedule />} />
          <Route path="/seats" element={<Seats />} />
          <Route path="/tickets" element={<Tickets />} />

          {/* дефолт */}
          <Route path="*" element={<Trains />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;