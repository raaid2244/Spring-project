import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  
  const handleRegister = async () => {
    // Basic validations
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
    setError("Password must be at least 6 characters");
    return;
    }

    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", { username, password });
      alert("Registration successful");
      navigate("/");
    } catch (error) {
      setError("Username already exists");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Register</h2>
          <p>Create your account</p>
        </div>

        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

        <input type="text" placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input type="password" placeholder="Confirm Password" value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="switch-auth">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </div>
      </div>
    </div>
  );
}

export default Register;
