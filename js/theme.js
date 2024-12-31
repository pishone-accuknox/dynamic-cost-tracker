function toggleTheme() {
  const isChecked = document.getElementById("checkboxInput").checked;
  document.body.className = isChecked ? "dark-theme" : "light-theme";
  localStorage.setItem("theme", isChecked ? "dark" : "light");
}

async function updateLastUpdated() {
  const lastUpdatedElement = document.getElementById('lastUpdated');

  try {
    const response = await fetch('data/last_processed_time.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const lastProcessedTime = new Date(data.last_processed_time);

    const formattedDate = lastProcessedTime.toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    lastUpdatedElement.textContent = formattedDate;
  } catch (error) {
    console.error('Error fetching last_processed_time.json:', error);
    lastUpdatedElement.textContent = 'Error loading timestamp';
  }
}

export { toggleTheme, updateLastUpdated };