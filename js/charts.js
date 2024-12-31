import { fetchData } from './utils.js';

let barChartInstance = null;
let trendChartInstance = null;

async function loadTimeAnalysis() {
  const workflowData = await fetchData('data/workflow_runs.json');

  const fromDate = new Date(document.getElementById('fromDate').value);
  const toDate = new Date(document.getElementById('toDate').value);

  const aggregatedData = workflowData.reduce((acc, run) => {
    const runDate = new Date(run.created_at.split("T")[0]);
    if (runDate >= fromDate && runDate <= toDate && run.total_time_minutes > 0) {
      const key = `${run.repo} - ${run.workflow_name}`;
      acc[key] = (acc[key] || 0) + run.total_time_minutes;
    }
    return acc;
  }, {});

  const sortedData = Object.entries(aggregatedData)
    .sort(([, a], [, b]) => b - a)
    .reduce((acc, [key, value]) => {
      acc.labels.push(key);
      acc.data.push(value);
      return acc;
    }, { labels: [], data: [] });

  const barChartCtx = document.getElementById('workflowBarChart').getContext('2d');
  const gradient = barChartCtx.createLinearGradient(0, 0, 0, barChartCtx.canvas.height);
  gradient.addColorStop(0, 'rgba(75, 192, 192, 0.8)');
  gradient.addColorStop(1, 'rgba(75, 192, 192, 0.2)');

  const isDarkTheme = document.body.classList.contains('dark-theme');
  const textColor = isDarkTheme ? '#e0e0e0' : '#333333';
  const gridColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  if (barChartInstance) barChartInstance.destroy();
  barChartInstance = new Chart(barChartCtx, {
    type: 'bar',
    data: {
      labels: sortedData.labels,
      datasets: [{
        label: 'Billable Time (minutes)',
        data: sortedData.data,
        backgroundColor: gradient,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      indexAxis: 'y',
      animation: { duration: 1000 },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.raw} minutes`;
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            color: textColor,
            font: { size: 12, weight: 'bold' },
          },
          grid: { color: gridColor },
        },
        y: {
          ticks: {
            color: textColor,
            font: { size: 12, weight: 'bold' },
          },
          grid: { display: false },
        },
      },
    },
  });
}

async function loadTrendChart() {
  const trendData = await fetchData('data/daily_trend.json');
  const trendChartCanvas = document.getElementById('trendChart');

  if (trendChartInstance) trendChartInstance.destroy();

  setTimeout(() => {
    const trendChartCtx = trendChartCanvas.getContext('2d');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    const textColor = isDarkTheme ? '#e0e0e0' : '#333333';
    const gridColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    const datasets = [];
    const osColors = {
      Ubuntu: 'rgba(75, 192, 192, 0.7)',
      Windows: 'rgba(54, 162, 235, 0.7)',
      MacOS: 'rgba(255, 99, 132, 0.7)'
    };

    Object.keys(osColors).forEach(os => {
      const osData = trendData.map(item => item[os] || 0);
      if (osData.some(value => value > 0)) {
        datasets.push({
          label: os,
          data: osData,
          borderColor: osColors[os].replace(/0\.7/, '1'),
          borderWidth: 2,
          fill: true,
          backgroundColor: osColors[os],
          tension: 0.2,
        });
      }
    });

    trendChartInstance = new Chart(trendChartCtx, {
      type: 'line',
      data: {
        labels: trendData.map(item => item.date),
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${context.raw} minutes`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: textColor,
              maxTicksLimit: 7,
            },
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              beginAtZero: true,
              color: textColor,
            },
          },
        },
      },
    });
  }, 100);
}

export { loadTimeAnalysis, loadTrendChart };