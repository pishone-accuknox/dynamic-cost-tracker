import { showTab } from './utils.js';
import { loadTimeAnalysis, loadTrendChart } from './charts.js';
import { updateWidgets, loadFailures } from './widgets.js';
import { toggleTheme, updateLastUpdated } from './theme.js';

// Initialize date picker
window.onload = () => {
  showTab('time-analysis');
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.className = savedTheme === "dark" ? "dark-theme" : "light-theme";
  document.getElementById("checkboxInput").checked = savedTheme === "dark";

  // Set up date range with default values
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  document.getElementById('fromDate').value = sevenDaysAgo.toISOString().split('T')[0];
  document.getElementById('toDate').value = today.toISOString().split('T')[0];
  
  // Initialize date range picker
  flatpickr('#dateRange', {
    mode: 'range',
    dateFormat: 'Y-m-d',
    defaultDate: [sevenDaysAgo, today],
    onChange: (selectedDates) => {
      if (selectedDates.length === 2) {
        document.getElementById('fromDate').value = selectedDates[0].toISOString().split('T')[0];
        document.getElementById('toDate').value = selectedDates[1].toISOString().split('T')[0];
        updateWidgets();
        loadTimeAnalysis();
      }
    }
  });

  // Initial load
  updateWidgets();
  loadTimeAnalysis();
  loadFailures();
  updateLastUpdated();
};

// Make functions available globally
window.showTab = showTab;
window.toggleTheme = toggleTheme;