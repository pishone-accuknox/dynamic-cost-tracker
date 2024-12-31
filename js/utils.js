async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = tab.id === tabId ? 'block' : 'none';
  });

  document.querySelectorAll('.tab-button').forEach(button => {
    button.classList.remove('active');
  });
  document.querySelector(`[onclick="showTab('${tabId}')"]`).classList.add('active');

  if (tabId === 'time-analysis') {
    loadTimeAnalysis();
  } else if (tabId === 'failures') {
    loadFailures();
  } else if (tabId === 'trend') {
    loadTrendChart();
  }
}

export { fetchData, showTab };