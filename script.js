// script.js
const websites = [
    { name: "zlibrary", url: "https://zh.z-lib.uk/" },
    { name: "百度", url: "https://www.baidu.com" },
    { name: "Grok3", url: "https://www.x.ai" }
];

const tbody = document.getElementById('websiteTable');
const TIMEOUT_DURATION = 5000;

websites.forEach(site => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${site.name}</td>
        <td class="status" data-url="${site.url}">检查中...</td>
        <td><button class="open-btn" data-url="${site.url}">打开</button></td>
    `;
    tbody.appendChild(row);
});

const statusCells = document.querySelectorAll('.status');
const openButtons = document.querySelectorAll('.open-btn');

function checkLinkStatus(url, cell) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    cell.classList.add('status-checking');
    let isCompleted = false;

    iframe.onload = () => {
        if (!isCompleted) {
            isCompleted = true;
            cell.textContent = '链接正常';
            cell.classList.remove('status-checking');
            cell.classList.add('status-success');
            document.body.removeChild(iframe);
        }
    };

    iframe.onerror = () => {
        if (!isCompleted) {
            isCompleted = true;
            cell.textContent = '链接失败';
            cell.classList.remove('status-checking');
            cell.classList.add('status-failure');
            document.body.removeChild(iframe);
        }
    };

    setTimeout(() => {
        if (!isCompleted) {
            isCompleted = true;
            cell.textContent = '链接失败（超时）';
            cell.classList.remove('status-checking');
            cell.classList.add('status-failure');
            document.body.removeChild(iframe);
        }
    }, TIMEOUT_DURATION);

    iframe.src = url;
}

statusCells.forEach(cell => {
    const url = cell.getAttribute('data-url');
    checkLinkStatus(url, cell);
});

openButtons.forEach(button => {
    button.addEventListener('click', () => {
        const url = button.getAttribute('data-url');
        window.open(url, '_blank');
    });
});