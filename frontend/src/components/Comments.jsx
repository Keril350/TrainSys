import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/chat.module.css";

function Comments() {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  const bottomRef = useRef(null);

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: "Bearer " + user?.token,
  });

  const fetchComments = () => {
    fetch("http://localhost:8080/comments")
      .then((res) => res.json())
      .then(setComments);
  };

  useEffect(() => {
    fetchComments();
    const interval = setInterval(fetchComments, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    fetch("http://localhost:8080/comments", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(text),
    }).then(() => {
      setText("");
      fetchComments();
    });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/comments/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    }).then(fetchComments);
  };

  if (!isOpen) {
    return (
      <div className={styles.chatButton} onClick={() => setIsOpen(true)}>
        💬
      </div>
    );
  }

  return (
    <div className={styles.chat}>
      <div className={styles.header}>
        💬 Чат
        <span
          className={styles.close}
          onClick={() => setIsOpen(false)}
        >
          ✖
        </span>
      </div>

      <div className={styles.messages}>
        {comments.map((c) => {
          const isMine = c.username === user?.username;

          return (
            <div
              key={c.id}
              className={`${styles.messageRow} ${
                isMine ? styles.myRow : styles.otherRow
              }`}
              onMouseEnter={() => setHoveredId(c.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className={styles.message}>
                <div className={styles.meta}>
                  <b>{c.username}</b>
                  <span>
                    {new Date(c.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                <div>{c.content}</div>

                {user?.role === "ADMIN" &&
                  hoveredId === c.id && (
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(c.id)}
                    >
                      ❌
                    </button>
                  )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {user && (
        <form onSubmit={handleSubmit} className={styles.inputArea}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Сообщение..."
          />
          <button>➤</button>
        </form>
      )}
    </div>
  );
}

export default Comments;