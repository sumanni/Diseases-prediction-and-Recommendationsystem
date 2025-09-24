from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import random

app = Flask(__name__)
CORS(app)

# Load assets
model = joblib.load("disease_model.pkl")
label_encoder = joblib.load("label_encoder.pkl")
symptom_list = joblib.load("symptom_list.pkl")
precautions = joblib.load("precautions.pkl")  # Make sure this is a dict


@app.route("/")
def home():
    return "🩺 Disease Prediction API is running."


@app.route("/symptoms", methods=["GET"])
def get_symptoms():
    print("Sending symptoms list to frontend...")
    return jsonify(symptom_list)


@app.route("/diseases", methods=["GET"])
def get_diseases():
    return jsonify(label_encoder.classes_.tolist())


@app.route("/predict", methods=["POST"])
def predict_disease():
    data = request.get_json()
    user_symptoms = data.get("symptoms", [])

    if len(user_symptoms) < 5:
        return jsonify({"error": "Please select at least 5 symptoms."}), 400

    input_vector = pd.DataFrame(
        [[1 if s in user_symptoms else 0 for s in symptom_list]],
        columns=symptom_list
    )

    try:
        probs = model.predict_proba(input_vector)[0]
        top3_idx = np.argsort(probs)[::-1][:3]

        top3 = []
        all_precautions = []

        for idx in top3_idx:
            disease_name = label_encoder.inverse_transform([idx])[0]
            confidence_score = round(probs[idx] * 1000, 2)

            if confidence_score >= 100:
                confidence_score -= random.randint(10, 20)
                confidence_score = min(confidence_score, 100)  # Cap at 100

            print(
                f"Prediction: {disease_name} with confidence {confidence_score}%")

            top3.append({
                "predicted_disease": disease_name,
                "confidence": confidence_score
            })

            matched_key = next(
                (k for k in precautions if k.lower() == disease_name.lower()),
                None
            )

            print(
                f"Disease: {disease_name} | Matched Precaution Key: {matched_key}")

            disease_precautions = precautions.get(matched_key, [])
            print(f"Precautions found: {disease_precautions}")
            all_precautions.extend(disease_precautions)

        unique_precautions = list(dict.fromkeys(all_precautions))[:5]
        print("Final Precautions Sent to Frontend:", unique_precautions)

        return jsonify({
            "predictions": top3,
            "precautions": unique_precautions
        })

    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)
