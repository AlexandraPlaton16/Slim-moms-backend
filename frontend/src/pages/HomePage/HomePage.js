import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Modal, Box } from "@mui/material";
import Header from "../../components/Header/Header";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    height: "",
    desiredWeight: "",
    age: "",
    bloodType: "",
    currentWeight: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [calorieIntake, setCalorieIntake] = useState(null);
  const [foodsNotAllowed, setFoodsNotAllowed] = useState([]);

  // Update state as user types in the input fields
  const handleChange = (prop) => (event) => {
    setForm({ ...form, [prop]: event.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for backend request
    const userData = {
      height: form.height,
      desiredWeight: form.desiredWeight,
      age: form.age,
      bloodType: form.bloodType.toUpperCase(),
      currentWeight: form.currentWeight,
    };

    try {
      // Call the backend API to get the recommended calories and forbidden foods
      const response = await fetch("/api/calculate-calories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch calorie information");
      }

      const data = await response.json();
      setCalorieIntake(data.recommendedCalories);
      setFoodsNotAllowed(data.foodsNotAllowed);
      setOpenModal(true);
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error calculating your calorie intake.");
    }
  };

  const handleStartLosingWeight = () => {
    setOpenModal(false);
    navigate("/register");
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.formContainer}>
        <h1 className={styles.homeDescription}>
          Calculate your daily calorie intake right now
        </h1>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Height"
            variant="standard"
            value={form.height}
            onChange={handleChange("height")}
            fullWidth
            margin="normal"
            required
            sx={{ width: "240px", marginRight: "20px" }}
          />
          <TextField
            label="Desired weight"
            variant="standard"
            value={form.desiredWeight}
            onChange={handleChange("desiredWeight")}
            fullWidth
            margin="normal"
            required
            sx={{ width: "240px", marginRight: "20px" }}
          />
          <TextField
            label="Age"
            variant="standard"
            type="number"
            value={form.age}
            onChange={handleChange("age")}
            fullWidth
            margin="normal"
            required
            sx={{ width: "240px", marginRight: "20px" }}
          />
          <TextField
            label="Blood type"
            variant="standard"
            value={form.bloodType}
            onChange={handleChange("bloodType")}
            fullWidth
            margin="normal"
            select
            SelectProps={{ native: true }}
            required
            sx={{ width: "240px", marginRight: "20px" }}
          >
            <option value="" />
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="AB">AB</option>
            <option value="O">O</option>
          </TextField>
          <TextField
            label="Current weight"
            variant="standard"
            value={form.currentWeight}
            onChange={handleChange("currentWeight")}
            fullWidth
            margin="normal"
            required
            sx={{ width: "240px", marginRight: "20px" }}
          />
          <button className={styles.submitButton} type="submit">
            Start losing weight
          </button>
        </form>
      </div>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2 id="modal-title" className={styles.modalTitle}>
            Your recommended daily calorie intake is{" "}
            <span className={styles.calorieValue}>{calorieIntake}</span> kcal
          </h2>
          <p id="modal-description" className={styles.modalDescription}>
            Foods you should not eat:
          </p>

          <Box sx={{ maxHeight: "300px", overflowY: "auto", mt: 2 }}>
            <ol>
              {foodsNotAllowed.length > 0 ? (
                foodsNotAllowed.map((food, index) => (
                  <li key={index}>{food.title}</li>
                ))
              ) : (
                <li>No forbidden foods found.</li>
              )}
            </ol>
          </Box>
          <button
            className={styles.modalButton}
            onClick={handleStartLosingWeight}
          >
            Start losing weight
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default HomePage;
