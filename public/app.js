// DOM Elements
const timeVal = document.getElementById('current-time');
const dateVal = document.getElementById('current-date');

const statusBadge = document.getElementById('status-badge');
const infoName = document.getElementById('info-name');
const infoVersion = document.getElementById('info-version');
const infoUptime = document.getElementById('info-uptime');
const btnRefresh = document.getElementById('btn-refresh');

const echoForm = document.getElementById('echo-form');
const echoInput = document.getElementById('echo-input');
const echoResponseBox = document.getElementById('echo-response-box');
const echoResponseText = document.getElementById('echo-response-text');

// 1. Clock & Date Tick
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  timeVal.textContent = `${hours}:${minutes}:${seconds}`;

  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  dateVal.textContent = now.toLocaleDateString('en-US', options);
}
setInterval(updateClock, 1000);
updateClock();

// 2. Fetch Server Info
async function fetchInfo() {
  try {
    statusBadge.textContent = 'Fetching...';
    statusBadge.style.borderColor = 'var(--border-glass)';
    statusBadge.style.color = 'var(--color-muted)';
    
    const response = await fetch('/api/info');
    if (!response.ok) throw new Error('API offline');
    
    const data = await response.json();
    infoName.textContent = data.appName;
    infoVersion.textContent = data.version;
    infoUptime.textContent = Math.round(data.uptime);
    
    statusBadge.textContent = data.status.toUpperCase();
    statusBadge.style.color = 'var(--accent-success)';
    statusBadge.style.borderColor = 'rgba(140, 220, 140, 0.2)';
  } catch (error) {
    console.error('Error fetching info:', error);
    infoName.textContent = 'Offline';
    infoVersion.textContent = 'N/A';
    infoUptime.textContent = '0';
    
    statusBadge.textContent = 'OFFLINE';
    statusBadge.style.color = 'var(--accent-danger)';
    statusBadge.style.borderColor = 'rgba(235, 87, 87, 0.2)';
  }
}

// 3. Post Message to Echo Route
echoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = echoInput.value.trim();
  if (!message) return;

  try {
    const response = await fetch('/api/echo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    if (response.ok) {
      echoResponseBox.style.display = 'block';
      echoResponseText.textContent = data.echo;
      echoInput.value = '';
    } else {
      alert(data.error || 'Something went wrong');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    alert('Failed to connect to the server');
  }
});

// Event Listeners
btnRefresh.addEventListener('click', fetchInfo);

// Initial Load
window.addEventListener('DOMContentLoaded', fetchInfo);
