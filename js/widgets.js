import { fetchData } from './utils.js';
import { COST_PER_MINUTE } from './config.js';

async function updateWidgets() {
  const trendData = await fetchData('data/daily_trend.json');
  const failuresData = await fetchData('data/failed_runs.json');

  const fromDate = new Date(document.getElementById('fromDate').value);
  const toDate = new Date(document.getElementById('toDate').value);

  // Calculate Total Cost
  let totalCost = 0;
  const today = new Date().toISOString().split('T')[0];
  trendData.forEach(day => {
    const date = new Date(day.date);
    if (date >= fromDate && date <= toDate) {
      totalCost += (day.Ubuntu * COST_PER_MINUTE.Ubuntu) +
                   (day.Windows * COST_PER_MINUTE.Windows) +
                   (day.MacOS * COST_PER_MINUTE.MacOS);
    }
  });
  document.getElementById('totalCost').innerText = `$${totalCost.toFixed(2)}`;

  // Top 3 Time-Consuming Workflows
  const sortedWorkflows = trendData
    .filter(day => new Date(day.date) >= fromDate && new Date(day.date) <= toDate)
    .sort((a, b) => b.Total - a.Total)
    .slice(0, 3);
  const topWorkflowsList = sortedWorkflows
    .map(workflow => `<li>${workflow.date}: ${workflow.Total} minutes</li>`)
    .join('');
  document.getElementById('topWorkflows').innerHTML = topWorkflowsList;

  // Count Failures Today
  const failedToday = failuresData.filter(run => run.created_at.split('T')[0] === today).length;
  document.getElementById('failedWorkflows').innerText = failedToday;
}

async function loadFailures() {
  const failuresData = await fetchData('data/failed_runs.json');
  const failuresContainer = document.getElementById('failuresContainer');
  failuresContainer.innerHTML = '';

  const groupedFailures = failuresData.reduce((acc, run) => {
    const date = run.created_at.split('T')[0];
    acc[date] = acc[date] || [];
    acc[date].push(run);
    return acc;
  }, {});

  Object.keys(groupedFailures).sort((a, b) => new Date(b) - new Date(a)).forEach(date => {
    const section = document.createElement('div');
    section.classList.add('failure-section');

    const toggleButton = document.createElement('button');
    toggleButton.classList.add('toggle-button');
    toggleButton.textContent = `Failures on ${date}`;
    toggleButton.onclick = () => {
      const table = section.querySelector('table');
      table.style.display = table.style.display === 'none' ? 'table' : 'none';
    };

    const table = document.createElement('table');
    table.classList.add('failure-table');
    table.style.display = 'table';
    table.innerHTML = `
      <thead>
        <tr>
          <th>Repository</th>
          <th>Workflow Name</th>
          <th>Date</th>
          <th>Run Link</th>
        </tr>
      </thead>
      <tbody>
        ${groupedFailures[date]
          .map(run => `
            <tr>
              <td>${run.repo}</td>
              <td>${run.workflow_name}</td>
              <td>${run.created_at.split('T')[0]}</td>
              <td><a href="${run.html_url}" target="_blank">View Run</a></td>
            </tr>
          `)
          .join('')}
      </tbody>
    `;

    section.appendChild(toggleButton);
    section.appendChild(table);
    failuresContainer.appendChild(section);
  });
}

export { updateWidgets, loadFailures };