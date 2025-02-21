import React, { useState, useEffect, useCallback } from "react";
import { TextField } from "@mui/material";
import LoginHeader from "../../components/LoginHeader/LoginHeader";
import styles from "./DiaryPage.module.css";
import API from "../../services/api";

const DiaryPage = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [productName, setProductName] = useState("");
  const [grams, setGrams] = useState("");
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [products, setProducts] = useState([]);

  // Încarcă datele utilizatorului curent
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const url = "/users/current";
          console.log(`📡 Sending request to: ${API.defaults.baseURL}${url}`);
          const response = await API.get(url, {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log("📂 User Data received:", response.data);
          setCurrentUserId(response.data._id);
        } else {
          console.error("❌ No token found in localStorage.");
        }
      } catch (error) {
        console.error("❌ Error getting session:", error);
      }
    };

    fetchSession();
  }, []);

  // Încarcă intrările din jurnal pentru data selectată
  const loadDiaryEntries = useCallback(async () => {
    if (!currentUserId) return;
    try {
      console.log("🔄 Loading diary entries for:", {
        currentUserId,
        selectedDate,
      });
      const response = await API.get(
        `/diary?userId=${currentUserId}&date=${selectedDate}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("📥 Diary entries received:", response.data);
      setDiaryEntries(response.data);
    } catch (error) {
      console.error("Error fetching diary entries:", error);
    }
  }, [currentUserId, selectedDate]);

  // Reîncarcă intrările atunci când se schimbă data sau userId
  useEffect(() => {
    loadDiaryEntries();
  }, [selectedDate, currentUserId, loadDiaryEntries]);

  // Încarcă lista de produse disponibile
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/categories");

        if (response.data.length > 0) {
          setProducts(response.data);
          console.log("✅ Products loaded:", response.data.length);
        } else {
          console.warn("⚠️ No products received from backend!");
        }
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Gestionează schimbarea datei
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Gestionează adăugarea unei intrări noi
  const handleAddEntry = async () => {
    console.log("🔍 Searching for product:", productName);

    if (!products || products.length === 0) {
      console.warn("⚠️ Products are not yet loaded. Retrying...");
      return;
    }

    console.log("📦 Products list (sample):", products.slice(0, 5));

    const normalizeText = (text) => text?.trim().toLowerCase();
    const product = products.find(
      (p) => normalizeText(p.title) === normalizeText(productName)
    );

    if (!product) {
      console.error("❌ Product not found in database.");
      return;
    }

    console.log("✅ Product found:", product);

    // Validare date
    if (
      !currentUserId ||
      !selectedDate ||
      !grams ||
      !product?.title ||
      !product?.calories
    ) {
      console.error("❌ Invalid data:", {
        currentUserId,
        selectedDate,
        grams,
        product,
      });
      return;
    }

    try {
      const newEntry = {
        userId: currentUserId,
        date: selectedDate,
        product: {
          title: product.title,
          weight: Number(grams),
          calories: product.calories,
        },
      };

      console.log("📤 Data being sent to server:", newEntry);

      const response = await API.post("/diary/add", newEntry, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log("✅ Entry added:", response.data);

      // Actualizează starea corect
      setDiaryEntries((prevEntries) => {
        const existingEntry = prevEntries.find(
          (entry) => entry.date === selectedDate
        );

        if (existingEntry) {
          // Actualizează intrarea existentă
          return prevEntries.map((entry) =>
            entry.date === selectedDate
              ? { ...entry, productList: response.data.productList }
              : entry
          );
        } else {
          // Adaugă o nouă intrare
          return [...prevEntries, response.data];
        }
      });
    } catch (error) {
      console.error(
        "❌ Error adding diary entry:",
        error.response?.data || error.message
      );
    }
  };

  // Gestionează ștergerea unei intrări
  const handleDeleteEntry = async (id) => {
    try {
      await API.delete(`/diary/delete`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        data: { date: selectedDate, _id: id },
      });
      setDiaryEntries((prevEntries) =>
        prevEntries.filter((entry) => entry._id !== id)
      );
    } catch (error) {
      console.error("Error deleting diary entry:", error);
    }
  };

  // Afișează intrările din jurnal
  return (
    <div className={styles.container}>
      <LoginHeader />
      <div className={styles.diaryPage}>
        <div className={styles.leftSection}>
          <div className={styles.datePicker}>
            <input
              className={styles.datePickerInput}
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
          <div className={styles.entryForm}>
            <TextField
              label="Enter product name"
              variant="standard"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              fullWidth
              margin="normal"
              sx={{ width: "240px", marginRight: "20px" }}
            />
            <TextField
              label="Grams"
              variant="standard"
              type="number"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              fullWidth
              margin="normal"
              sx={{ width: "240px", marginRight: "20px" }}
            />
            <button
              className={styles.addButton}
              type="button"
              onClick={handleAddEntry}
            >
              +
            </button>
          </div>
          <div className={styles.entriesList}>
            {diaryEntries.length === 0 ? (
              <p>No entries for this date.</p>
            ) : (
              <ul className={styles.diaryFoodList}>
                {diaryEntries.map((entry) =>
                  entry.productList.map((product, index) => (
                    <li
                      className={styles.diaryFoods}
                      key={`${entry._id}-${index}`}
                    >
                      {product.title} - {product.weight} grams
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteEntry(entry._id)}
                      >
                        X
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryPage;
