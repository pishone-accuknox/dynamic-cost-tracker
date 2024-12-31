async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
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