document.addEventListener('DOMContentLoaded', function() {
    // Performance Trend Chart
    const perfCtx = document.getElementById('performanceChart').getContext('2d');
    new Chart(perfCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Compliance Rate (%)',
                data: [90, 88, 92, 91, 94, 93, 95],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: true,
                tension: 0.4,
                yAxisID: 'y'
            }, {
                label: 'Total Incidents',
                data: [2, 1, 5, 2, 3, 0, 1],
                type: 'bar',
                backgroundColor: '#ef4444',
                borderRadius: 4,
                barThickness: 20,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 0,
                    max: 100,
                    position: 'left',
                    grid: { display: false }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    grid: { display: false }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { usePointStyle: true, padding: 20 }
                }
            }
        }
    });

    // Violations by Department Chart
    const violCtx = document.getElementById('violationsChart').getContext('2d');
    new Chart(violCtx, {
        type: 'bar',
        data: {
            labels: ['Assembly A', 'Loading Dock', 'Warehouse', 'Welding Hall', 'Chemical Lab'],
            datasets: [{
                label: 'Violations',
                data: [4, 9, 3, 5, 2],
                backgroundColor: '#2563eb',
                borderRadius: 4,
                indexAxis: 'y'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { grid: { display: false } },
                y: { grid: { display: false } }
            }
        }
    });
});
