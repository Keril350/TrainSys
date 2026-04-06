import { useEffect, useState } from "react";

function Trains() {
  const [trains, setTrains] = useState([]);
  const [number, setNumber] = useState("");
  const [type, setType] = useState("");

  const fetchTrains = () => {
    fetch("http://localhost:8080/trains")
      .then((res) => res.json())
      .then(setTrains)
      .catch(console.error);
  };

  useEffect(() => {
    fetchTrains();
  }, []);

  const handleCreateTrain = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/trains", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ number, type }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка создания");
        return res.json();
      })
      .then(() => {
        setNumber("");
        setType("");
        fetchTrains();
      })
      .catch(console.error);
  };

  const handleDeleteTrain = (id) => {
    fetch(`http://localhost:8080/trains/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка удаления");
        fetchTrains();
      })
      .catch(console.error);
  };

  return (
    <div>
      <h2>🚆 Поезда</h2>

      {/* ===== ФОРМА ===== */}
      <form onSubmit={handleCreateTrain} style={formStyle}>
        <input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Номер"
          style={inputStyle}
        />

        <input
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Тип"
          style={inputStyle}
        />

        <button type="submit" style={createBtn}>
          Создать
        </button>
      </form>

      {/* ===== ТАБЛИЦА ===== */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Номер</th>
            <th>Тип</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {trains.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.number}</td>
              <td>{t.type}</td>
              <td>
                <button
                  onClick={() => handleDeleteTrain(t.id)}
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

export default Trains;