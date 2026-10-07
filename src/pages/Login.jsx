import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import { Label } from "../components/ui/label.jsx";
import { toast } from "../components/ui/sonner.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    // Demo login
    if (email === "admin@gmail.com" && password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("isLoggedIn", "true");
      toast("Login successful");
      navigate("/dashboard");
    } else {
      setError("Invalid email or password");
      toast("Invalid email or password", "error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Employee Management</h1>
        <p className="login-subtitle">Login to your account</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <Button type="submit" className="login-button">
            Login
          </Button>
        </form>

        
      </div>
    </div>
  );
}

export default Login;
