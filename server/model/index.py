import pandas as pd

df = pd.read_excel("medical_dataset.xlsx")

all_symptoms = pd.unique(df.iloc[:, 1:].values.ravel())
all_symptoms = [symptom for symptom in all_symptoms if str(symptom) != 'nan']
print(df)
