import pandas as pd
df = pd.read_csv('covid_vaccine_statewise.csv')
for state in df['State'].unique():
    latest = df[df['State'] == state].dropna(subset=['Total Individuals Vaccinated', '18-44 Years(Individuals Vaccinated)']).iloc[-1:]
    if not latest.empty:
        l = latest.iloc[0]
        total = l['Total Individuals Vaccinated']
        age_sum = l['18-44 Years(Individuals Vaccinated)'] + l['45-60 Years(Individuals Vaccinated)'] + l['60+ Years(Individuals Vaccinated)']
        print(f"State: {state}, Total: {total}, Age Sum: {age_sum}, Diff: {total - age_sum}")
        break
