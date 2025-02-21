import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import Header from "../../components/Header/Header";
import API from "../../services/api";
import styles from "./RegisterPage.module.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Trimitem cererea de înregistrare către serverul backend folosind API.js
      const response = await API.post("/users/register", form);

      setSuccessMsg(
        "Registration successful! Please check your email to verify your account."
      );
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Eroare la înregistrare!");
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.regContainer}>
        <h2 className={styles.regPage}>Register</h2>
        <form className={styles.formGroupReg} onSubmit={handleSubmit}>
          <TextField
            label="Name"
            variant="standard"
            value={form.name}
            onChange={handleChange("name")}
            fullWidth
            margin="normal"
            sx={{ width: "240px" }}
            required
          />

          <TextField
            label="Email"
            variant="standard"
            value={form.email}
            onChange={handleChange("email")}
            fullWidth
            margin="normal"
            sx={{ width: "240px" }}
            required
          />

          <TextField
            label="Password"
            variant="standard"
            value={form.password}
            onChange={handleChange("password")}
            fullWidth
            margin="normal"
            sx={{ width: "240px" }}
            required
          />
          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
          {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
          <div className={styles.btnContainer}>
            <button className={styles.logBtn} type="submit">
              Register
            </button>
            <button
              className={styles.regBtn}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
