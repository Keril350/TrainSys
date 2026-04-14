import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Comments() {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: "Bearer " + user?.token,
  });

  const fetchComments = () => {
    fetch("http://localhost:8080/comments")
      .then((res) => res.json())
      .then(setComments)
      .catch(console.error);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    fetch("http://localhost:8080/comments", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(text),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setText("");
        fetchComments();
      })
      .catch(() => alert("Ошибка отправки"));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/comments/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        fetchComments();
      })
      .catch(() => alert("Ошибка удаления"));
  };

  return (
    <div style={container}>
      <h3>💬 Комментарии</h3>

      <div style={list}>
        {comments.map((c) => (
          <div
            key={c.id}
            style={{
              ...comment,
              background: hoveredId === c.id ? "#f5f5f5" : "transparent",
            }}
            onMouseEnter={() => setHoveredId(c.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* левая часть */}
            <div style={left}>
              <b>{c.username}</b>: {c.content}
            </div>

            {/* правая часть */}
            <div style={right}>
              <span style={date}>
                {new Date(c.createdAt).toLocaleString()}
              </span>

              {user?.role === "ADMIN" && hoveredId === c.id && (
                <button
                  onClick={() => handleDelete(c.id)}
                  style={deleteBtn}
                >
                  ❌
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {user && (
        <form onSubmit={handleSubmit} style={form}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Написать комментарий..."
            style={input}
          />
          <button type="submit" style={btn}>
            Отправить
          </button>
        </form>
      )}
    </div>
  );
}

const container = {
  marginTop: "40px",
  borderTop: "1px solid #ccc",
  paddingTop: "20px",
};

const list = {
  marginBottom: "10px",
};

const comment = {
  padding: "8px 12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: "6px",
  transition: "background 0.2s",
};

const left = {
  display: "flex",
  gap: "5px",
  alignItems: "center",
};

const right = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const date = {
  fontSize: "12px",
  color: "#888",
  whiteSpace: "nowrap",
};

const deleteBtn = {
  color: "red",
  border: "none",
  background: "transparent",
  cursor: "pointer",
};

const form = {
  display: "flex",
  gap: "10px",
};

const input = {
  flex: 1,
  padding: "8px",
};

const btn = {
  padding: "8px 15px",
};

export default Comments;