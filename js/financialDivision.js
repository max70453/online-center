// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadPaymentHistory();
    loadCurrentBills();
    loadDebtStatus();
    initializePaymentForm();
    loadBillsArchive();
    initializeArchiveFilters();
});

// Инициализация формы оплаты
function initializePaymentForm() {
    const paymentForm = document.getElementById('paymentForm');
    paymentForm.addEventListener('submit', handlePaymentSubmit);
}

// Обработка отправки формы оплаты
async function handlePaymentSubmit(event) {
    event.preventDefault();
    
    const accountNumber = document.getElementById('accountNumber').value;
    const amount = document.getElementById('paymentAmount').value;

    try {
        // Здесь будет интеграция с платежной системой
        const paymentResult = await processPayment(accountNumber, amount);
        if (paymentResult.success) {
            showNotification('Платеж успешно выполнен', 'success');
            loadPaymentHistory(); // Обновление истории платежей
            loadDebtStatus(); // Обновление статуса задолженности
        } else {
            showNotification('Ошибка при выполнении платежа', 'error');
        }
    } catch (error) {
        showNotification('Произошла ошибка при обработке платежа', 'error');
        console.error('Payment error:', error);
    }
}

// Обработка платежа (заглушка для демонстрации)
async function processPayment(accountNumber, amount) {
    // Здесь будет реальная интеграция с платежной системой
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true, transactionId: Date.now() });
        }, 1000);
    });
}

// Загрузка истории платежей
async function loadPaymentHistory() {
    const historyList = document.getElementById('paymentHistoryList');
    try {
        // Здесь будет запрос к API для получения истории платежей
        const payments = await fetchPaymentHistory();
        displayPaymentHistory(payments);
    } catch (error) {
        console.error('Error loading payment history:', error);
        historyList.innerHTML = '<p>Ошибка при загрузке истории платежей</p>';
    }
}

// Загрузка текущих счетов
async function loadCurrentBills() {
    const billsList = document.getElementById('currentBillsList');
    try {
        // Здесь будет запрос к API для получения текущих счетов
        const bills = await fetchCurrentBills();
        displayCurrentBills(bills);
    } catch (error) {
        console.error('Error loading current bills:', error);
        billsList.innerHTML = '<p>Ошибка при загрузке текущих счетов</p>';
    }
}

// Загрузка статуса задолженности
async function loadDebtStatus() {
    const debtInfo = document.getElementById('debtStatusInfo');
    try {
        // Здесь будет запрос к API для получения информации о задолженности
        const debtStatus = await fetchDebtStatus();
        const debtHistory = await fetchDebtHistory();
        displayDebtStatus(debtStatus);
        displayDebtHistory(debtHistory);
    } catch (error) {
        console.error('Error loading debt status:', error);
        debtInfo.innerHTML = '<p>Ошибка при загрузке информации о задолженности</p>';
    }
}

// Отображение истории платежей
function displayPaymentHistory(payments) {
    const historyList = document.getElementById('paymentHistoryList');
    historyList.innerHTML = payments.map(payment => `
        <div class="payment-item">
            <div class="payment-date">${formatDate(payment.date)}</div>
            <div class="payment-amount">${formatCurrency(payment.amount)}</div>
            <div class="payment-status ${payment.status}">${getStatusText(payment.status)}</div>
        </div>
    `).join('');
}

// Отображение текущих счетов
function displayCurrentBills(bills) {
    const billsList = document.getElementById('currentBillsList');
    billsList.innerHTML = bills.map(bill => `
        <div class="bill-item" style="margin-bottom: 10px;">
            <div class="bill-period">${bill.period}</div>
            <div class="bill-amount">${formatCurrency(bill.amount)}</div>
            <div class="bill-due-date">До: ${formatDate(bill.dueDate)}</div>
            <button onclick="downloadBill(${bill.id})" class="btn-secondary">Скачать квитанцию</button>
        </div>
    `).join('');
}

// Отображение статуса задолженности
function displayDebtStatus(debtStatus) {
    const debtInfo = document.getElementById('debtStatusInfo');
    debtInfo.innerHTML = `
        <div class="debt-amount ${debtStatus.amount > 0 ? 'debt-warning' : ''}">
            <h4>Сумма задолженности:</h4>
            <p>${formatCurrency(debtStatus.amount)}</p>
        </div>
        <div class="debt-period">
            <h4>Период:</h4>
            <p>${debtStatus.period}</p>
        </div>
        ${debtStatus.amount > 0 ? `
            <div class="debt-warning-message">
                <p>Рекомендуется погасить задолженность до ${formatDate(debtStatus.dueDate)}</p>
            </div>
        ` : ''}
    `;
}

// Вспомогательные функции
function formatDate(date) {
    return new Date(date).toLocaleDateString('ru-RU');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
    }).format(amount);
}

function getStatusText(status) {
    const statusMap = {
        success: 'Выполнен',
        pending: 'В обработке',
        failed: 'Ошибка'
    };
    return statusMap[status] || status;
}

function showNotification(message, type) {
    // Здесь будет реализация системы уведомлений
    alert(message);
}

// Заглушки для демонстрации (будут заменены на реальные API-запросы)
async function fetchPaymentHistory() {
    return [
        { date: '2025-01-15', amount: 5000, status: 'success' },
        { date: '2025-01-01', amount: 4500, status: 'success' },
        { date: '2025-12-15', amount: 5500, status: 'success' }
    ];
}

async function fetchCurrentBills() {
    return [
        { id: 1, period: 'Январь 2025', amount: 5000, dueDate: '2025-02-15' },
        { id: 2, period: 'Декабрь 2025', amount: 4500, dueDate: '2025-01-15' }
    ];
}

async function fetchDebtStatus() {
    return {
        amount: 3500,
        period: 'Март 2024',
        dueDate: '2024-04-15'
    };
}

// Получение истории задолженности
async function fetchDebtHistory() {
    return [
        {
            period: 'Март 2024',
            amount: 3500,
            dueDate: '2024-04-15',
            status: 'active'
        },
        {
            period: 'Февраль 2024',
            amount: 4200,
            dueDate: '2024-03-15',
            status: 'paid',
            paymentDate: '2024-03-10'
        },
        {
            period: 'Январь 2024',
            amount: 3800,
            dueDate: '2024-02-15',
            status: 'paid',
            paymentDate: '2024-02-12'
        },
        {
            period: 'Декабрь 2023',
            amount: 4500,
            dueDate: '2024-01-15',
            status: 'paid',
            paymentDate: '2024-01-10'
        },
        {
            period: 'Ноябрь 2023',
            amount: 3200,
            dueDate: '2023-12-15',
            status: 'paid',
            paymentDate: '2023-12-12'
        },
        {
            period: 'Октябрь 2023',
            amount: 2800,
            dueDate: '2023-11-15',
            status: 'paid',
            paymentDate: '2023-11-10'
        }
    ];
}

// Отображение истории задолженности
function displayDebtHistory(debtHistory) {
    const historyContainer = document.getElementById('debtHistoryList');
    if (!historyContainer) return;

    historyContainer.innerHTML = debtHistory.map(debt => `
        <div class="debt-history-item ${debt.status}" style="margin-bottom: 10px;">
            <div class="debt-history-period">${debt.period}</div>
            <div class="debt-history-amount">${formatCurrency(debt.amount)}</div>
            <div class="debt-history-due-date">Срок оплаты: ${formatDate(debt.dueDate)}</div>
            ${debt.status === 'paid' ? 
                `<div class="debt-history-payment-date">Оплачено: ${formatDate(debt.paymentDate)}</div>` : 
                `<div class="debt-history-status">Статус: Активна</div>`
            }
        </div>
    `).join('');
}

// Функция для скачивания квитанции
function downloadBill(billId) {
    // Здесь будет реализация скачивания квитанции
    alert(`Скачивание квитанции #${billId}`);
}

// Загрузка архива квитанций
async function loadBillsArchive() {
    const archiveList = document.getElementById('billsHistoryList');
    if (!archiveList) return;

    try {
        const bills = await fetchBillsArchive();
        displayBillsArchive(bills);
    } catch (error) {
        console.error('Error loading bills archive:', error);
        archiveList.innerHTML = '<p>Ошибка при загрузке архива квитанций</p>';
    }
}

// Получение архива квитанций (демо-данные)
async function fetchBillsArchive() {
    return [
        {
            id: 1,
            date: '2024-02-15',
            amount: 2500,
            status: 'paid',
            period: 'Январь 2024'
        },
        {
            id: 2,
            date: '2024-01-15',
            amount: 2300,
            status: 'paid',
            period: 'Декабрь 2023'
        },
        {
            id: 3,
            date: '2023-12-15',
            amount: 2400,
            status: 'paid',
            period: 'Ноябрь 2023'
        }
    ];
}

// Отображение архива квитанций
function displayBillsArchive(bills) {
    const archiveList = document.getElementById('billsHistoryList');
    if (!archiveList) return;

    // Добавляем фильтр по периоду, если его еще нет
    if (!document.getElementById('periodFilter')) {
        const filterHtml = `
            <div class="bills-filter" style="margin-bottom: 15px;">
                <select class="filter-select" id="periodFilter">
                    <option value="all">Все периоды</option>
                    ${[...new Set(bills.map(bill => bill.period))]
                        .map(period => `<option value="${period}">${period}</option>`)
                        .join('')}
                </select>
            </div>
        `;
        archiveList.insertAdjacentHTML('beforebegin', filterHtml);

        // Добавляем обработчик изменения фильтра
        const periodFilter = document.getElementById('periodFilter');
        periodFilter.addEventListener('change', (e) => {
            updateBillsArchive(bills, e.target.value);
        });
    }

    // Первоначальное отображение списка
    updateBillsArchive(bills, 'all');
}

// Обновление списка квитанций с учетом фильтра
function updateBillsArchive(bills, selectedPeriod) {
    const archiveList = document.getElementById('billsHistoryList');
    if (!archiveList) return;

    const filteredBills = selectedPeriod === 'all'
        ? bills
        : bills.filter(bill => bill.period === selectedPeriod);

    archiveList.innerHTML = filteredBills.map(bill => `
        <div class="bill-item" data-id="${bill.id}" style="margin-bottom: 10px;">
            <div class="bill-info">
                <div class="bill-date">${formatDate(bill.date)}</div>
                <div class="bill-amount">${formatCurrency(bill.amount)}</div>
                <div class="bill-period">${bill.period}</div>
            </div>
            <div class="bill-status ${bill.status === 'paid' ? 'status-paid' : 'status-pending'}">
                ${bill.status === 'paid' ? 'Оплачено' : 'Ожидает оплаты'}
            </div>
            <div class="bill-actions">
                <button class="btn-view" onclick="viewBillDetails(${bill.id})">
                    Просмотр
                </button>
            </div>
        </div>
    `).join('');
}

// Просмотр деталей квитанции
function viewBillDetails(billId) {
    fetchBillsArchive().then(bills => {
        const bill = bills.find(b => b.id === billId);
        if (bill) {
            alert(`Детали квитанции:\nПериод: ${bill.period}\nДата: ${formatDate(bill.date)}\nСумма: ${formatCurrency(bill.amount)}\nСтатус: ${bill.status === 'paid' ? 'Оплачено' : 'Ожидает оплаты'}`);
        }
    });
}

// Инициализация фильтров архива
function initializeArchiveFilters() {
    const filterForm = document.getElementById('archiveFilters');
    if (filterForm) {
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            applyArchiveFilters();
        });
    }
}

// Применение фильтров к архиву
async function applyArchiveFilters() {
    const period = document.getElementById('filterPeriod').value;
    const service = document.getElementById('filterService').value;
    const status = document.getElementById('filterStatus').value;

    try {
        const bills = await fetchBillsArchive(period, service, status);
        displayBillsArchive(bills);
    } catch (error) {
        console.error('Error applying filters:', error);
        showNotification('Ошибка при применении фильтров', 'error');
    }
}

// Просмотр деталей квитанции
function viewBillDetails(billId) {
    // Здесь будет реализация просмотра деталей квитанции
    alert(`Просмотр деталей квитанции #${billId}`);
}

// Заглушка для получения архива квитанций
async function fetchBillsArchive(period = '', service = '', status = '') {
    // Здесь будет реальный API-запрос с фильтрами
    const archiveData = [
        {
            id: 1,
            period: 'Март 2024',
            amount: 5800,
            service: 'Отопление',
            status: 'pending',
            date: '2024-03-10',
            description: 'Отопление за март 2024'
        },
        {
            id: 2,
            period: 'Февраль 2024',
            amount: 5200,
            service: 'Электричество',
            status: 'paid',
            date: '2024-02-15',
            description: 'Электроэнергия за февраль 2024'
        },
        {
            id: 3,
            period: 'Февраль 2024',
            amount: 3200,
            service: 'Водоснабжение',
            status: 'paid',
            date: '2024-02-15',
            description: 'Холодное и горячее водоснабжение'
        },
        {
            id: 4,
            period: 'Январь 2024',
            amount: 5500,
            service: 'Отопление',
            status: 'paid',
            date: '2024-01-15',
            description: 'Отопление за январь 2024'
        },
        {
            id: 5,
            period: 'Январь 2024',
            amount: 2800,
            service: 'Электричество',
            status: 'paid',
            date: '2024-01-15',
            description: 'Электроэнергия за январь 2024'
        },
        {
            id: 6,
            period: 'Декабрь 2023',
            amount: 4800,
            service: 'Отопление',
            status: 'paid',
            date: '2023-12-15',
            description: 'Отопление за декабрь 2023'
        },
        {
            id: 7,
            period: 'Декабрь 2023',
            amount: 3100,
            service: 'Водоснабжение',
            status: 'paid',
            date: '2023-12-15',
            description: 'Водоснабжение за декабрь 2023'
        },
        {
            id: 8,
            period: 'Ноябрь 2023',
            amount: 4200,
            service: 'Отопление',
            status: 'paid',
            date: '2023-11-15',
            description: 'Отопление за ноябрь 2023'
        },
        {
            id: 9,
            period: 'Ноябрь 2023',
            amount: 2600,
            service: 'Электричество',
            status: 'paid',
            date: '2023-11-15',
            description: 'Электроэнергия за ноябрь 2023'
        },
        {
            id: 10,
            period: 'Октябрь 2023',
            amount: 3800,
            service: 'Отопление',
            status: 'paid',
            date: '2023-10-15',
            description: 'Отопление за октябрь 2023'
        },
        {
            id: 11,
            period: 'Октябрь 2023',
            amount: 2900,
            service: 'Водоснабжение',
            status: 'paid',
            date: '2023-10-15',
            description: 'Водоснабжение за октябрь 2023'
        },
        {
            id: 12,
            period: 'Сентябрь 2023',
            amount: 3500,
            service: 'Электричество',
            status: 'paid',
            date: '2023-09-15',
            description: 'Электроэнергия за сентябрь 2023'
        }
    ];

    return archiveData.filter(bill => {
        const matchesPeriod = !period || bill.period.includes(period);
        const matchesService = !service || bill.service === service;
        const matchesStatus = !status || bill.status === status;
        return matchesPeriod && matchesService && matchesStatus;
    });
}