import pandas as pd
df = pd.read_csv('covid_vaccine_statewise.csv')
latest = df[df['State'] == 'Maharashtra'].iloc[-1]
total = latest['Total Individuals Vaccinated']
age_sum = latest['18-44 Years(Individuals Vaccinated)'] + latest['45-60 Years(Individuals Vaccinated)'] + latest['60+ Years(Individuals Vaccinated)']
print(f"Total: {total}, Age Sum: {age_sum}, Diff: {total - age_sum}")
