import Trains from "./components/Trains";
import Stations from "./components/Stations";
import Routes from "./components/Routes";
import Schedule from "./components/Schedule";
import Seats from "./components/Seats";
import Tickets from "./components/Tickets";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>🚆 Train System</h1>

      <Trains />
      <hr />

      <Seats />
      <hr />

      <Tickets />
      <hr />

      <Stations />
      <hr />

      <Schedule />
      <hr />

      <Routes />
    </div>
  );
}

export default App;