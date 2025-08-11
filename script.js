// script.js
const websites = [
{ name: "zlibrary", url: "https://z-lib.uk/" },{ name: "zlibrary", url: "https://zlib.pl/" },{ name: "zlibrary", url: "https://myzlib.deno.dev/" }
];
const tbody = document.getElementById('websiteTable');
const TIMEOUT_DURATION = 5000;
websites.forEach(site => {
const row = document.createElement('tr');
row.innerHTML = `
<td>${site.name}</td>
<td class="status" data-url="${site.url}">检查中...</td>
<td class="latency" data-url="${site.url}">- ms</td>
<td><button class="open-btn" data-url="${site.url}">打开</button></td>
`;
tbody.appendChild(row);
});
const statusCells = document.querySelectorAll('.status');
const latencyCells = document.querySelectorAll('.latency');
const openButtons = document.querySelectorAll('.open-btn');
function checkLinkStatus(url, cell, latencyCell) {
const startTime = Date.now(); // Start time for latency measurement
const iframe = document.createElement('iframe');
iframe.style.display = 'none';
document.body.appendChild(iframe);
cell.classList.add('status-checking');
let isCompleted = false;
iframe.onload = () => {
if (!isCompleted) {
isCompleted = true;
const latency = Date.now() - startTime; // Calculate latency
cell.textContent = '链接正常';
latencyCell.textContent = `${latency} ms`; // Display latency
cell.classList.remove('status-checking');
cell.classList.add('status-success');
document.body.removeChild(iframe);
}
};
iframe.onerror = () => {
if (!isCompleted) {
isCompleted = true;
const latency = Date.now() - startTime; // Calculate latency
cell.textContent = '链接失败';
latencyCell.textContent = `${latency} ms`; // Display latency
cell.classList.remove('status-checking');
cell.classList.add('status-failure');
document.body.removeChild(iframe);
}
};
setTimeout(() => {
if (!isCompleted) {
isCompleted = true;
cell.textContent = '链接失败';
latencyCell.textContent = '超时'; // Indicate timeout
cell.classList.remove('status-checking');
cell.classList.add('status-failure');
document.body.removeChild(iframe);
}
}, TIMEOUT_DURATION);
iframe.src = url;
}
statusCells.forEach(cell => {
const url = cell.getAttribute('data-url');
const latencyCell = cell.nextElementSibling; // Get the corresponding latency cell
checkLinkStatus(url, cell, latencyCell);
});
openButtons.forEach(button => {
button.addEventListener('click', () => {
const url = button.getAttribute('data-url');
window.open(url, '_blank');
});
});
