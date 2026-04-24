# COVID Vaccine Dataset Analysis

A professional web application for analyzing COVID-19 vaccination data in India. Built with a clean medical theme, 3D effects, and real-time data processing.

## Features
- **Dataset Description**: Automatic analysis of row/column counts and schema.
- **State-wise Analysis**: Interactive table showing First and Second dose progress for all Indian states.
- **Gender Vaccination Stats**: Real-time totals for Male and Female vaccinations with smooth counter animations.
- **Premium UI**: Medical-inspired design with glassmorphism and 3D hover effects.

## Tech Stack
- **Frontend**: HTML5, Vanilla CSS3, JavaScript (ES6+)
- **Backend**: Python (Flask)
- **Data Analysis**: Pandas, NumPy

## Setup & Running

### 1. Install Dependencies
Make sure you have Python installed, then run:
```bash
pip install -r requirements.txt
```

### 2. Start the Backend
```bash
python app.py
```
The server will start at `http://localhost:5000`.

### 3. Open the Frontend
Simply open `index.html` in your web browser.

## Dataset
The app uses the `covid_vaccine_statewise.csv` dataset from the Kaggle "COVID-19 in India" project.
If the file is missing, the backend will automatically look for it in the project root.
