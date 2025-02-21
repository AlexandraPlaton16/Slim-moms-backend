import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import LoginHeader from "../../components/LoginHeader/LoginHeader";
import styles from "./CalculatorPage.module.css";
import axios from "axios";

const CalculatorPage = () => {
  const [form, setForm] = useState({
    height: "",
    desiredWeight: "",
    age: "",
    bloodType: "",
    currentWeight: "",
  });

  const [calculation, setCalculation] = useState({
    left: "",
    consumed: "",
    dailyRate: "",
    percentNormal: "",
  });
  const [calculationDone, setCalculationDone] = useState(false);
  const [foodsNotRecommended, setFoodsNotRecommended] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Cerere GET pentru a obține categoriile din backend
    axios
      .get("http://localhost:5000/api/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleChange = (prop) => (event) => {
    setForm({ ...form, [prop]: event.target.value });
  };

  const handleCalculate = (e) => {
    e.preventDefault();

    const currentWeightNum = Number(form.currentWeight);
    if (!currentWeightNum) return;
    const dailyRate = currentWeightNum * 30;

    const leftValue = dailyRate - 500;
    const consumedValue = dailyRate - leftValue;
    const percentNormal = ((consumedValue / dailyRate) * 100).toFixed(0);

    setCalculation({
      left: leftValue,
      consumed: consumedValue,
      dailyRate: dailyRate,
      percentNormal: percentNormal,
    });

    const bloodMapping = { A: 1, B: 2, AB: 3, O: 4 };
    const bloodIndex = bloodMapping[form.bloodType.toUpperCase()];
    if (!bloodIndex) {
      alert("Please enter a valid blood type (A, B, AB, O).");
      return;
    }

    // Filtrare alimente interzise pe baza grupului sanguin
    const filteredFoods = categories.filter((category) => {
      return (
        category.groupBloodNotAllowed &&
        category.groupBloodNotAllowed[bloodIndex] === 1
      );
    });

    setFoodsNotRecommended(filteredFoods);
    setCalculationDone(true);
    localStorage.setItem("dailyRate", dailyRate);
  };

  const today = new Date().toLocaleDateString();

  return (
    <div className={styles.container}>
      <LoginHeader />
      <div className={styles.calculatorPage}>
        <div className={styles.leftSection}>
          <h1 className={styles.homeDescription}>
            Calculate your daily calorie intake right now
          </h1>
          <form onSubmit={handleCalculate} className={styles.calcForm}>
            <TextField
              label="Height"
              name="height"
              variant="standard"
              value={form.height}
              onChange={handleChange("height")}
              required
              fullWidth
              margin="normal"
              sx={{ width: "240px", marginRight: "20px" }}
            />
            <TextField
              label="Desired Weight"
              name="desiredWeight"
              variant="standard"
              value={form.desiredWeight}
              onChange={handleChange("desiredWeight")}
              required
              fullWidth
              margin="normal"
              sx={{ width: "240px", marginRight: "20px" }}
            />
            <TextField
              label="Age"
              name="age"
              variant="standard"
              type="number"
              value={form.age}
              onChange={handleChange("age")}
              required
              fullWidth
              margin="normal"
              sx={{ width: "240px", marginRight: "20px" }}
            />
            <TextField
              label="Blood Type (A, B, AB, O)"
              name="bloodType"
              variant="standard"
              value={form.bloodType}
              onChange={handleChange("bloodType")}
              required
              fullWidth
              margin="normal"
              select
              SelectProps={{ native: true }}
              sx={{ width: "240px", marginRight: "20px" }}
            >
              <option value="" />
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </TextField>
            <TextField
              label="Current Weight"
              name="currentWeight"
              variant="standard"
              type="number"
              value={form.currentWeight}
              onChange={handleChange("currentWeight")}
              required
              fullWidth
              margin="normal"
              sx={{ width: "240px", marginRight: "20px" }}
            />
            <button type="submit" className={styles.calcSubmitButton}>
              Start losing weight
            </button>
          </form>
        </div>

        <div className={styles.vector}></div>
        <div className={styles.rightSection}>
          <div className={styles.summary}>
            <div className={styles.summaryHeader}>
              <h3>Summary for {today}</h3>
              {calculationDone && (
                <form className={styles.summaryForm}>
                  <div className={styles.summaryItem}>
                    <label>Left:</label>
                    <input
                      className={styles.summaryInput}
                      type="text"
                      value={`${calculation.left} kcal`}
                      readOnly
                    />
                  </div>
                  <div className={styles.summaryItem}>
                    <label>Consumed:</label>
                    <input
                      className={styles.summaryInput}
                      type="text"
                      value={`${calculation.consumed} kcal`}
                      readOnly
                    />
                  </div>
                  <div className={styles.summaryItem}>
                    <label>Daily rate:</label>
                    <input
                      className={styles.summaryInput}
                      type="text"
                      value={`${calculation.dailyRate} kcal`}
                      readOnly
                    />
                  </div>
                  <div className={styles.summaryItem}>
                    <label>n% of normal:</label>
                    <input
                      className={styles.summaryInput}
                      type="text"
                      value={`${calculation.percentNormal}%`}
                      readOnly
                    />
                  </div>
                </form>
              )}
            </div>
            <div className={styles.summaryText}>
              <h4>Food not recommended:</h4>
              {calculationDone && (
                <div className={styles.foodsNotRecommended}>
                  <ul className={styles.foodList}>
                    {foodsNotRecommended.map((food, index) => (
                      <li key={index}>{food.title}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
