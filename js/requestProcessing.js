// Состояние приложения
let requestsData = {
    requests: [],
    chatHistory: []
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadRequests();
    initChatBot();
    initRequestForm();
});

// Функции для работы с обращениями
async function loadRequests() {
    try {
        // TODO: Здесь будет API запрос для загрузки обращений
        // Временные тестовые данные
        requestsData.requests = [
            {
                id: 1,
                type: 'technical',
                text: 'Отсутствует отопление',
                status: 'completed',
                date: '2025-02-15',
                contactMethod: 'phone',
                contactInfo: '+7(999)123-45-67'
            },
            {
                id: 2,
                type: 'billing',
                text: 'Вопрос по начислениям',
                status: 'processing',
                date: '2025-02-16',
                contactMethod: 'email',
                contactInfo: 'user@example.com'
            }
        ];
        updateRequestsList();
    } catch (error) {
        console.error('Ошибка при загрузке обращений:', error);
    }
}

function updateRequestsList() {
    const requestsList = document.getElementById('requestsList');
    requestsList.innerHTML = requestsData.requests.map(request => `
        <div class="request-item">
            <div class="request-date">${formatDate(request.date)}</div>
            <div class="request-info">
                <div class="request-type">${getRequestTypeText(request.type)}</div>
                <div class="request-text">${request.text}</div>
            </div>
            <div class="request-status status-${request.status}">${getStatusText(request.status)}</div>
        </div>
    `).join('');
}

function initRequestForm() {
    const form = document.getElementById('requestForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            type: document.getElementById('requestType').value,
            text: document.getElementById('requestText').value,
            contactMethod: document.getElementById('contactMethod').value,
            contactInfo: document.getElementById('contactInfo').value,
            date: new Date().toISOString().split('T')[0],
            status: 'new'
        };

        try {
            // TODO: Здесь будет API запрос для отправки обращения
            console.log('Отправка обращения:', formData);
            // Временная имитация успешной отправки
            requestsData.requests.unshift({
                id: requestsData.requests.length + 1,
                ...formData
            });
            updateRequestsList();
            form.reset();
            showNotification('Обращение успешно отправлено!');
        } catch (error) {
            console.error('Ошибка при отправке обращения:', error);
            showNotification('Произошла ошибка при отправке обращения', 'error');
        }
    });
}

// Функции для работы с чат-ботом
function initChatBot() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendMessage');

    sendButton.addEventListener('click', () => sendMessage());
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

async function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    if (!message) return;

    try {
        addMessageToChat('user', message);
        chatInput.value = '';
        chatInput.disabled = true;

        // TODO: Здесь будет API запрос к сервису чат-бота
        // Временная имитация ответа бота
        const botResponse = await getBotResponse(message);
        
        if (!botResponse) {
            throw new Error('Пустой ответ от бота');
        }

        addMessageToChat('bot', botResponse);
    } catch (error) {
        console.error('Ошибка при обработке сообщения:', error);
        addMessageToChat('bot', 'Извините, произошла ошибка. Попробуйте позже.');
    } finally {
        chatInput.disabled = false;
        chatInput.focus();
    }
}

function addMessageToChat(type, text) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    requestsData.chatHistory.push({ type, text, timestamp: new Date() });
}

async function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Объект с ключевыми словами и соответствующими ответами
    const responses = {
        // Технические проблемы
        'отопление': `Если у вас проблемы с отоплением, пожалуйста, укажите:
1. Ваш точный адрес
2. Описание проблемы (нет отопления, слабый нагрев, шум и т.д.)
3. Когда возникла проблема

Вы можете оставить заявку через форму обращения выше, выбрав тип "Техническая проблема".`,
        'авария': `В случае аварийной ситуации немедленно сообщите по телефону аварийной службы: +7(856)304-53-31. Для неаварийных ситуаций используйте форму обращения на сайте.`,
        'горячая вода': `При проблемах с горячим водоснабжением, пожалуйста, сообщите:
1. Ваш адрес
2. Характер проблемы (нет воды, недостаточная температура)
3. Затронуты ли соседние квартиры

Оставьте заявку через форму обращения, выбрав "Техническая проблема".`,
        
        // Вопросы оплаты
        'оплата': `По вопросам оплаты:
1. Проверить начисления можно в личном кабинете
2. Оплатить услуги можно:
   - Через сайт
   - В отделениях банков
   - В кассах расчетного центра
3. По вопросам начислений обращайтесь: +7(856)304-53-31`,
        'счет': `Информация по счетам:
1. Получить детализацию начислений: личный кабинет или расчетный центр
2. Сверить показания счетчиков: +7(856)304-53-31
3. Заявить о несогласии с начислениями: через форму обращения`,
        'долг': `По вопросам задолженности:
1. Проверить сумму долга: личный кабинет или +7(856)304-53-31
2. Оформить рассрочку: обратитесь в расчетный центр
3. Оспорить начисления: через форму обращения`,
        
        // Общие вопросы
        'график': `График работы организации:
Пн-Пт: 8:00 - 17:00
Обед: 12:00 - 13:00
Сб-Вс: выходной

Аварийная служба работает круглосуточно: +7(856)304-53-31`,
        'контакты': `Наши контакты:
1. Телефон: +7(856)304-53-31
2. Email: donbassteploenergo@mail.ru
3. Адрес: ул. Ленина, 15

График работы:
Пн-Пт: 8:00 - 17:00`,
        'документы': `Для оформления документов потребуются:
1. Паспорт
2. Документы на собственность
3. Предыдущие квитанции

Обратитесь в офис компании или оставьте заявку через форму обращения.`
    };

    // Поиск подходящего ответа по ключевым словам
    for (const [keyword, response] of Object.entries(responses)) {
        if (lowerMessage.includes(keyword)) {
            return response;
        }
    }

    // Если не найдено совпадений по ключевым словам
    return `Здравствуйте! Я виртуальный помощник компании "Донбасстеплоэнерго".

Я готов помочь вам по следующим вопросам:

1. 🔧 Технические проблемы:
   • Отопление (температура, давление, шум)
   • Горячее водоснабжение
   • Аварийные ситуации

2. 💰 Вопросы оплаты:
   • Начисления и тарифы
   • Способы оплаты
   • Задолженность и рассрочка

3. ℹ️ Общая информация:
   • График работы организации
   • Контактные данные
   • Необходимые документы

Для срочных аварийных ситуаций:
Телефон аварийной службы (круглосуточно): +7(856)304-53-31

Для подачи официального обращения воспользуйтесь формой выше.
Чем я могу помочь вам сейчас?`;
    }


// Вспомогательные функции
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('ru-RU');
}

function getRequestTypeText(type) {
    const types = {
        technical: 'Техническая проблема',
        billing: 'Вопросы по оплате',
        service: 'Качество обслуживания',
        other: 'Другое'
    };
    return types[type] || type;
}

function getStatusText(status) {
    const statuses = {
        new: 'Новое',
        processing: 'В обработке',
        completed: 'Выполнено',
        rejected: 'Отклонено'
    };
    return statuses[status] || status;
}

function showNotification(message, type = 'success') {
    // TODO: Реализовать красивые уведомления
    alert(message);
}