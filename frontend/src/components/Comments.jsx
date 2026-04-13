import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Comments() {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

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

  return (
    <div style={container}>
      <h3>💬 Комментарии</h3>

      <div style={list}>
        {comments.map((c) => (
          <div key={c.id} style={comment}>
            <b>{c.username}</b>: {c.content}
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
  padding: "5px 0",
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