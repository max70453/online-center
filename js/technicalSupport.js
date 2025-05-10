// Тестовые данные для приборов учета
const metersData = [
    {
        id: 'M001',
        location: 'ул. Ленина, 15',
        currentReading: '45.7',
        lastUpdate: '2024-01-15 14:30',
        status: 'active',
        type: 'Теплосчётчик'
    },
    {
        id: 'M002',
        location: 'пр. Мира, 78',
        currentReading: '32.4',
        lastUpdate: '2024-01-15 13:45',
        status: 'warning',
        type: 'Расходомер'
    },
    {
        id: 'M003',
        location: 'ул. Гагарина, 23',
        currentReading: '28.9',
        lastUpdate: '2024-01-15 15:00',
        status: 'inactive',
        type: 'Теплосчётчик'
    }
];

// Функция для отображения данных приборов учета
function displayMetersData() {
    const metersContainer = document.getElementById('metersData');
    if (!metersContainer) return;

    metersContainer.innerHTML = '';

    metersData.forEach(meter => {
        const statusClass = `status-${meter.status}`;
        const meterCard = document.createElement('div');
        meterCard.className = `meter-card ${statusClass}`;
        
        meterCard.innerHTML = `
            <div class="meter-header">
                <h4>${meter.type} ${meter.id}</h4>
                <span class="meter-status ${statusClass}"></span>
            </div>
            <div class="meter-info">
                <p><strong>Расположение:</strong> ${meter.location}</p>
                <p><strong>Текущие показания:</strong> ${meter.currentReading} Гкал</p>
                <p><strong>Последнее обновление:</strong> ${meter.lastUpdate}</p>
            </div>
        `;

        metersContainer.appendChild(meterCard);
    });
}

// Данные об аварийных ситуациях
const emergencies = [
    {
        coordinates: [48.015884, 37.802850],
        type: 'Прорыв трубопровода',
        address: 'ул. Ленина, 45',
        time: '15.12.2023 14:30',
        status: 'В работе'
    },
    {
        coordinates: [48.020000, 37.810000],
        type: 'Отсутствие теплоносителя',
        address: 'ул. Гагарина, 12',
        time: '15.12.2023 13:15',
        status: 'Новое'
    },
    {
        coordinates: [48.010000, 37.795000],
        type: 'Низкое давление',
        address: 'пр. Мира, 78',
        time: '15.12.2023 10:45',
        status: 'Устранено'
    }
];

// Данные о состоянии оборудования
const equipmentData = [
    {
        name: 'Котел №1',
        details: 'Последняя проверка: 15.01.2024',
        status: 'normal'
    },
    {
        name: 'Насосная станция',
        details: 'Требуется плановое обслуживание',
        status: 'warning'
    },
    {
        name: 'Теплообменник',
        details: 'В работе с 10.01.2024',
        status: 'normal'
    }
];

// Данные о состоянии коммуникационных линий
const communicationData = [
    {
        name: 'Магистральная линия №1',
        details: 'Рабочее давление в норме',
        status: 'normal'
    },
    {
        name: 'Распределительная сеть',
        details: 'Обнаружена утечка',
        status: 'error'
    },
    {
        name: 'Резервная линия',
        details: 'Готова к работе',
        status: 'normal'
    }
];

// Функция для отображения состояния оборудования
function displayEquipmentStatus() {
    const container = document.getElementById('equipmentStatus');
    if (!container) return;

    container.innerHTML = equipmentData.map(item => `
        <div class="status-item">
            <div class="status-info">
                <div class="status-name">${item.name}</div>
                <div class="status-details">${item.details}</div>
            </div>
            <div class="status-indicator status-${item.status}"></div>
        </div>
    `).join('');
}

// Функция для отображения состояния коммуникационных линий
function displayCommunicationStatus() {
    const container = document.getElementById('communicationStatus');
    if (!container) return;

    container.innerHTML = communicationData.map(item => `
        <div class="status-item">
            <div class="status-info">
                <div class="status-name">${item.name}</div>
                <div class="status-details">${item.details}</div>
            </div>
            <div class="status-indicator status-${item.status}"></div>
        </div>
    `).join('');
}

// Инициализация карты Яндекс.Карт
function initEmergencyMap() {
    // Добавляем скрипт Яндекс.Карт
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=ваш_API_ключ&lang=ru_RU';
    script.onload = function() {
        ymaps.ready(createMap);
    };
    document.head.appendChild(script);
}

// Создание карты и добавление меток
function createMap() {
    const map = new ymaps.Map('emergencyMap', {
        center: [48.015884, 37.802850],
        zoom: 12,
        controls: ['zoomControl', 'fullscreenControl']
    });

    emergencies.forEach(emergency => {
        const marker = new ymaps.Placemark(emergency.coordinates, {
            balloonContent: `
                <div class="emergency-balloon">
                    <h3>${emergency.type}</h3>
                    <p>Адрес: ${emergency.address}</p>
                    <p>Время: ${emergency.time}</p>
                    <p>Статус: ${emergency.status}</p>
                </div>
            `
        }, {
            preset: getPresetByStatus(emergency.status)
        });

        map.geoObjects.add(marker);
    });
}

// Определение стиля метки в зависимости от статуса
function getPresetByStatus(status) {
    switch(status) {
        case 'Новое':
            return 'islands#redDotIcon';
        case 'В работе':
            return 'islands#orangeDotIcon';
        case 'Устранено':
            return 'islands#greenDotIcon';
        default:
            return 'islands#blueDotIcon';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация отображения данных приборов учета
    displayMetersData();
    // Инициализация карты
    initEmergencyMap();
    // Инициализация отображения состояния оборудования
    displayEquipmentStatus();
    // Инициализация отображения состояния коммуникационных линий
    displayCommunicationStatus();

    // Тестовые данные для графиков
    const dailyData = {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [{
            label: 'Потребление за день (Гкал)',
            data: [2.1, 1.8, 2.5, 3.2, 2.8, 2.3],
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            fill: true
        }]
    };

    const monthlyData = {
        labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
        datasets: [{
            label: 'Потребление за месяц (Гкал)',
            data: [150, 130, 100, 80, 40, 20],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            fill: true
        }]
    };

    // Настройки графиков
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        }
    };

    // Инициализация графиков
    const dailyChart = new Chart(
        document.getElementById('dailyConsumptionChart'),
        {
            type: 'line',
            data: dailyData,
            options: chartOptions
        }
    );

    const monthlyChart = new Chart(
        document.getElementById('monthlyConsumptionChart'),
        {
            type: 'line',
            data: monthlyData,
            options: chartOptions
        }
    );
});