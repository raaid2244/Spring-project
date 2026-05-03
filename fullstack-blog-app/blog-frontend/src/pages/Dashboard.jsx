import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Dashboard() {
  const navigate = useNavigate();

  // states
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // fetchPosts
  const fetchPosts = useCallback(async () => {
    try {
      const response = await api.get("/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to load posts");
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // This is used to create and edit posts
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      if (editId) {
        await api.put(`/posts/${editId}`, { title, content });
        alert("Post updated");
      } else {
        await api.post("/posts", { title, content });
        alert("Post created");
      }

      resetForm();
      fetchPosts();
    } catch (error) {
  console.error("CREATE POST ERROR:", error.response?.data || error.message);
  alert(error.response?.data?.message || "Something went wrong");
}
 finally {
      setLoading(false);
    }
  };

  // This is used to edit a post
  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditId(post.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // This is used to delete a post
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this post?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/posts/${id}`);
      fetchPosts();
    } catch (error) {
      alert("Delete failed");
    }
  };

  // This is used to reset the form
  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditId(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  
  return (
    <div className="dashboard">

      <div className="nav-content">
        <h2>Dashboard</h2>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* create or edit form */}
      <div className="create-post">
        <h3>{editId ? "Edit Post" : "Create Post"}</h3>

        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Post content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : editId ? "Update Post" : "Create Post"}
        </button>
      </div>

      {/* post the list */}
      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h4>{post.title}</h4>
            <p>{post.content}</p>

            <button onClick={() => handleEdit(post)}>Edit</button>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Dashboard;
