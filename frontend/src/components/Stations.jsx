import { useEffect, useState } from "react";

function Stations() {
  const [stations, setStations] = useState([]);

  const [stationName, setStationName] = useState("");
  const [city, setCity] = useState("");
  const [code, setCode] = useState("");

  const [editingId, setEditingId] = useState(null);

  // 🔑 JWT headers
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem("token"),
  });

  const fetchStations = () => {
    fetch("http://localhost:8080/stations")
      .then((res) => res.json())
      .then(setStations)
      .catch(console.error);
  };

  useEffect(() => {
    fetchStations();
  }, []);

  // ===== CREATE / UPDATE =====
  const handleSubmit = (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:8080/stations/${editingId}`
      : "http://localhost:8080/stations";

    fetch(url, {
      method,
      headers: getAuthHeaders(), // 🔥 добавили токен
      body: JSON.stringify({
        name: stationName,
        city,
        code,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Ошибка сохранения");
        }
        return res.json();
      })
      .then(() => {
        resetForm();
        fetchStations();
      })
      .catch((err) => {
        console.error(err);
        alert("Ошибка сохранения (нужна роль ADMIN)");
      });
  };

  // ===== DELETE =====
  const handleDeleteStation = (id) => {
    fetch(`http://localhost:8080/stations/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }, // 🔥 добавили токен
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Ошибка удаления");
        }
        fetchStations();
      })
      .catch((err) => {
        console.error(err);
        alert("Ошибка удаления (нужна роль ADMIN)");
      });
  };

  // ===== EDIT =====
  const handleEdit = (station) => {
    setEditingId(station.id);
    setStationName(station.name);
    setCity(station.city);
    setCode(station.code);
  };

  // ===== RESET =====
  const resetForm = () => {
    setEditingId(null);
    setStationName("");
    setCity("");
    setCode("");
  };

  return (
    <div>
      <h2>🏙 Станции</h2>

      {/* ===== ФОРМА ===== */}
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          placeholder="Название"
          value={stationName}
          onChange={(e) => setStationName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Город"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Код"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={inputStyle}
        />

        <button type="submit" style={createBtn}>
          {editingId ? "Сохранить" : "Создать"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm} style={cancelBtn}>
            Отмена
          </button>
        )}
      </form>

      {/* ===== ТАБЛИЦА ===== */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Город</th>
            <th>Код</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {stations.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.city}</td>
              <td>{s.code}</td>
              <td style={{ display: "flex", gap: "5px" }}>
                <button
                  onClick={() => handleEdit(s)}
                  style={editBtn}
                >
                  Редактировать
                </button>

                <button
                  onClick={() => handleDeleteStation(s.id)}
                  style={deleteBtn}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ===== СТИЛИ =====

const formStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
};

const inputStyle = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const createBtn = {
  backgroundColor: "green",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "6px",
  cursor: "pointer",
};

const cancelBtn = {
  backgroundColor: "gray",
  color: "white",
  border: "none",
  padding: "8px 15px",
  borderRadius: "6px",
  cursor: "pointer",
};

const editBtn = {
  backgroundColor: "orange",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};

const deleteBtn = {
  backgroundColor: "red",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

export default Stations;