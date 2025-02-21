import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import logo from "../../assets/logo.png";
import logo2 from "../../assets/logo2.png";
import loginLeef from "../../assets/loginLeef.png";
import loginLeefSmall from "../../assets/loginLeefSmall.png";
import styles from "./LoginHeader.module.css";

const Header = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getUserName = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);

        setUserName(decoded.name || decoded.email);
      }
    };
    getUserName();
  }, []);

  const handleExit = async () => {
    try {
      await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <div className={styles.buttonContainer}>
        <img
          src={logo}
          alt="SlimMom logo"
          className={styles.logoImage}
          onClick={() => navigate("/")}
        />
        <img
          src={logo2}
          alt="SlimMom logo"
          className={styles.logoImage2}
          onClick={() => navigate("/")}
        />
        <div className={styles.calcBtnContainer}>
          <div className={styles.homeButtonsContainer}>
            <button
              className={`${styles.homeButtons} ${
                location.pathname === "/calculator" ? styles.activeButton : ""
              }`}
              onClick={() => navigate("/calculator")}
            >
              calculator
            </button>
            <button
              className={`${styles.homeButtons} ${
                location.pathname === "/diary" ? styles.activeButton : ""
              }`}
              onClick={() => navigate("/diary")}
            >
              diary
            </button>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.userName}>{userName}</span>
            <button className={styles.exitButton} onClick={handleExit}>
              Exit
            </button>
          </div>
        </div>
      </div>
      <img src={loginLeef} alt="frame" className={styles.leefFrame} />
      <img
        src={loginLeefSmall}
        alt="smallFrame"
        className={styles.loginLeefSmall}
      />
    </>
  );
};

export default Header;
