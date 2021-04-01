/**
 * Chat Bot. Users can interact with bot by sending commands starting with '@chaos'.
 *
 * @example
 * const bot = new Bot();
 * bot.sendRequest('@chaos: погода');
 */
class Bot {
  constructor() {
    this.container = document.querySelector('.chat-container');
    this.weather = [
      'Облачно, с прояснениями',
      'В ближайшие 2 часа осадков не ожидается',
      'Будет преобладать юго-западный ветер, 1–2 м/с',
      'Пасмурно, местами небольшие дожди',
      'Атмосферное давление в пределах нормы (748—750 мм рт.ст.)',
      'Погода ожидается облачная и очень холодная',
      'Температура воздуха 8-10°C',
      'Ближе к вечеру ожидаются кратковременные грозы',
      'Солнечно, воздух прогреется до +28°С',
      'Сегодня теплее, чем вчера',
    ];
    this.rates = [
      'USD: 73.9735, EUR: 89.2546',
      '↓ USD: 73.5453, EUR: 89.3304',
      '↑ USD: 74.2663, EUR: 90.3227',
      'USD: 74.5157, EUR: 90.8123',
      'USD: 73.8757, EUR: 89.2546',
    ];
    this.oracle = [
      'Перспективы хорошие',
      'Определенно, да',
      'Подумай и спроси опять',
      'Весьма спорно',
      'Мой ответ - нет',
      'Вероятнее всего',
    ];
    this.todo = [
      'Подготовиться к экзамену',
      'Выучить новые слова',
      'Сходить на тренировку',
      'Записаться к врачу',
      'Сделать генеральную уборку',
      'Пройти 10000 шагов',
      'Прочитать книгу',
      'Посмотреть лекцию',
    ];
    this.notifications = [
      'День рождения мамы через 3 дня',
      'Заплатить за квартиру завтра',
      'Новый год через 5 дней',
      'Платеж по кредитной карте сегодня',
      'Ближайших напоминаний нет',
    ];
  }

  /**
   * Create response message to user
   * @param {String} request user command
   */
  sendRequest(request) {
    this.printMessage(request);
    const requestBody = request.replace(/^@chaos: /, '');

    switch (requestBody) {
      case 'погода':
        this.printMessage(this.weather[Math.floor(Math.random() * (this.weather.length))], 'bot');
        break;
      case 'курс валют':
        this.printMessage(this.rates[Math.floor(Math.random() * (this.rates.length))], 'bot');
        break;
      case 'список дел':
        this.printMessage(this.todo[Math.floor(Math.random() * (this.todo.length))], 'bot');
        break;
      case 'магический шар':
        this.printMessage(this.oracle[Math.floor(Math.random() * (this.oracle.length))], 'bot');
        break;
      case 'напоминания':
        this.printMessage(this.notifications[Math.floor(Math.random() * (this.notifications.length))], 'bot');
        break;
      default:
        this.printMessage('Извините, я вас не понял', 'bot');
    }
  }

  /**
   * Print user or bot message
   * @param {String} data user or bot message
   * @param {String} author message's author
   */
  printMessage(data, author) {
    const message = document.createElement('div');
    message.className = `message ${author}`;
    message.innerHTML = `
      <div class="message-content">${data}</div>
      `;
    this.container.appendChild(message);
    this.container.scrollTo(0, message.offsetTop);
  }
}

export default Bot;
