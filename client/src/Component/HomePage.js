import React, { useState, useEffect } from "react";
import "./HomePage.css";

const circumference = 2 * Math.PI * 45;

const HomePage = () => {
  const [symptomsOptions, setSymptomsOptions] = useState([]);
  const [symptoms, setSymptoms] = useState(["", "", "", "", ""]);
  const [predictions, setPredictions] = useState([]);
  const [precautions, setPrecautions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/symptoms")
      .then((res) => res.json())
      .then((data) => {
        console.log("Symptoms received:", data);
        setSymptomsOptions(data);
      })
      .catch((err) => {
        console.error("Failed to fetch symptoms:", err);
        setSymptomsOptions([]);
      });
  }, []);

  const handleSymptomChange = (index, value) => {
    const updated = [...symptoms];
    updated[index] = value;
    setSymptoms(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selected = symptoms.filter((s) => s.trim() !== "");

    if (selected.length < 5) {
      alert("Please select at least 5 symptoms.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: selected }),
      });

      const data = await res.json();
      console.log("Prediction response:", data);

      if (!res.ok) {
        setError(data.error || "Prediction failed");
        setPredictions([]);
        setPrecautions([]);
      } else {
        setPredictions(data.predictions || []);
        setPrecautions(data.precautions || []);
        setError(null);
      }
    } catch (err) {
      setError("Backend not reachable");
      setPredictions([]);
      setPrecautions([]);
      console.error(err);
    }
  };

  return (
    <div className="glass-container">
      <h1 className="main-title">🩺 Disease Predictor</h1>

      <form onSubmit={handleSubmit} className="symptom-form">
        <h2>Select 5 Symptoms</h2>
        {symptoms.map((symptom, idx) => (
          <select
            key={idx}
            value={symptom}
            onChange={(e) => handleSymptomChange(idx, e.target.value)}
          >
            <option value="">Select Symptom</option>
            {symptomsOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        ))}
        <button type="submit">Predict</button>
        {error && <p className="error">{error}</p>}
      </form>

      {(predictions.length > 0 || precautions.length > 0) && (
        <div className="results-wrapper">
          <div className="results-card predictions-card">
            <h2>Disease Predictions</h2>
            <div className="prediction-charts">
              {predictions.map(({ predicted_disease, confidence }, i) => {
                const colors = ["#F59E0B", "#10B981", "#3B82F6"];
                const color = colors[i % colors.length];
                return (
                  <div className="chart-container" key={i}>
                    <svg
                      className="circular-chart"
                      viewBox="0 0 100 100"
                      width="120"
                      height="120"
                      style={{
                        "--dashoffset":
                          circumference - (circumference * confidence) / 100,
                      }}
                    >
                      <circle className="circle-bg" cx="50" cy="50" r="45" />
                      <circle
                        className="circle"
                        cx="50"
                        cy="50"
                        r="45"
                        stroke={color}
                      />
                      <text
                        x="50"
                        y="55"
                        textAnchor="middle"
                        fontSize="20"
                        fill="#333"
                        fontWeight="bold"
                      >
                        {confidence.toFixed(0)}%
                      </text>
                    </svg>
                    <p className="prediction-label">
                      {predicted_disease.replace(/_/g, " ").toUpperCase()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {precautions.length > 0 && (
            <div className="results-card precaution-card">
              <h2>Top 5 Precautions</h2>
              <ul className="precaution-list">
                {precautions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
