// import React, { use } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import logo2 from "../../assets/logo2.png";
import leef from "../../assets/leef.png";
import leefFrameSmall from "../../assets/leefFrameSmall.png";
import banana from "../../assets/banana.png";
import strawberry from "../../assets/strawberry.png";
import vector from "../../assets/vector.png";
import styles from "./Header.module.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
        <div className={styles.homeButtonsContainer}>
          <button
            className={`${styles.homeButtons} ${
              location.pathname === "/login" ? styles.activeButton : ""
            }`}
            onClick={() => navigate("/login")}
          >
            log in
          </button>
          <button
            className={`${styles.homeButtons} ${
              location.pathname === "/register" ? styles.activeButton : ""
            }`}
            onClick={() => navigate("/register")}
          >
            registration
          </button>{" "}
        </div>
      </div>
      <img src={leef} alt="frame" className={styles.leefFrame} />
      <img src={leefFrameSmall} alt="frame" className={styles.leefFrameSmall} />
      <img src={banana} alt="banana" className={styles.banana} />
      <img src={strawberry} alt="strawberry" className={styles.strawberry} />
      <img src={vector} alt="vector" className={styles.vector} />
    </>
  );
};

export default Header;
