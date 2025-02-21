import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import Header from "../../components/Header/Header";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle login logic
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Trimitem cererea de logare către backend
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials or server error");
      }

      const data = await response.json();
      // Stocăm token-ul JWT în localStorage (sau în alt loc sigur)
      localStorage.setItem("token", data.token);
      console.log("Logare reușită:", data);

      // Redirect către pagina calculator
      navigate("/calculator");
    } catch (error) {
      console.error("Eroare la logare:", error.message);
      alert("Logare eșuată! Verificați email-ul și parola.");
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.loginContainer}>
        <h2 className={styles.loginPage}>log in</h2>
        <form className={styles.formGroupLogin} onSubmit={handleLogin}>
          <TextField
            label="Email"
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ width: "240px" }}
            required
          />

          <TextField
            label="Password"
            variant="standard"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ width: "240px" }}
            required
          />
          <div className={styles.btnContainer}>
            <button className={styles.logBtn} type="submit">
              Log in
            </button>
            <button
              className={styles.regBtn}
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
