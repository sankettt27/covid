const API_BASE = "";

async function fetchDescription() {
    try {
        const response = await fetch(`${API_BASE}/dataset-description`);
        const data = await response.json();
        
        document.getElementById('rows-count').innerText = data.rows.toLocaleString();
        document.getElementById('cols-count').innerText = data.columns;
        
        const tagsContainer = document.getElementById('columns-container');
        tagsContainer.innerHTML = '';
        data.column_names.forEach(name => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.innerText = name;
            tagsContainer.appendChild(span);
        });
    } catch (error) {
        console.error("Error fetching description:", error);
    }
}

async function fetchSummary() {
    try {
        const response = await fetch(`${API_BASE}/summary`);
        const data = await response.json();
        
        animateValue("male-count", 0, data.total_male, 2000);
        animateValue("female-count", 0, data.total_female, 2000);
        
        renderGenderChart(data.total_male, data.total_female);
    } catch (error) {
        console.error("Error fetching summary:", error);
    }
}

async function fetchStatewise() {
    try {
        const response = await fetch(`${API_BASE}/statewise`);
        const data = await response.json();
        
        const tableBody = document.getElementById('statewise-body');
        tableBody.innerHTML = '';
        
        // Sort data for the chart (top 10 states by first dose)
        const sortedData = [...data].sort((a, b) => b['First Dose Administered'] - a['First Dose Administered']);
        const top10 = sortedData.slice(0, 10);
        
        renderStateChart(top10);

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.State}</td>
                <td>${Number(item['First Dose Administered']).toLocaleString()}</td>
                <td>${Number(item['Second Dose Administered']).toLocaleString()}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching statewise data:", error);
    }
}

function renderGenderChart(male, female) {
    const ctx = document.getElementById('genderChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Male', 'Female'],
            datasets: [{
                data: [male, female],
                backgroundColor: ['#3B82F6', '#EC4899'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            },
            cutout: '70%'
        }
    });
}

function renderStateChart(top10) {
    const ctx = document.getElementById('stateChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: top10.map(d => d.State),
            datasets: [{
                label: 'First Dose',
                data: top10.map(d => d['First Dose Administered']),
                backgroundColor: '#2D8A56',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, ticks: { callback: v => v.toLocaleString() } },
                x: { grid: { display: false } }
            }
        }
    });
}

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

let fdChart = null;
let sdChart = null;

async function fetchStates() {
    try {
        const response = await fetch(`${API_BASE}/states`);
        const states = await response.json();
        const select = document.getElementById('state-select');
        states.forEach(state => {
            const opt = document.createElement('option');
            opt.value = state;
            opt.innerText = state;
            select.appendChild(opt);
        });
        
        select.addEventListener('change', (e) => {
            if (e.target.value) fetchStateDetail(e.target.value);
        });
    } catch (error) {
        console.error("Error fetching states:", error);
    }
}

async function fetchStateDetail(state) {
    try {
        const response = await fetch(`${API_BASE}/state-data?state=${encodeURIComponent(state)}`);
        const data = await response.json();
        
        updateDoseSection('fd', data.first_dose, 'First Dose');
        updateDoseSection('sd', data.second_dose, 'Second Dose');
    } catch (error) {
        console.error("Error fetching state detail:", error);
    }
}

function updateDoseSection(prefix, data, label) {
    if (!data) return;
    
    document.getElementById(`${prefix}-total`).innerText = data.total.toLocaleString();
    
    const canvasId = `${prefix}Chart`;
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Destroy previous chart
    if (prefix === 'fd' && fdChart) fdChart.destroy();
    if (prefix === 'sd' && sdChart) sdChart.destroy();
    
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Male', 'Female', 'Children'],
            datasets: [{
                label: label,
                data: [data.male, data.female, data.children],
                backgroundColor: ['#3B82F6', '#EC4899', '#F59E0B'],
                borderRadius: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, ticks: { callback: v => v.toLocaleString() } },
                x: { grid: { display: false } }
            }
        }
    });
    
    if (prefix === 'fd') fdChart = chart;
    else sdChart = chart;
}

// Initial load
window.addEventListener('DOMContentLoaded', () => {
    fetchDescription();
    fetchSummary();
    fetchStatewise();
    fetchStates();
});
