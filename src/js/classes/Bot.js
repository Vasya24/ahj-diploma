/**
 * Chat Bot. Users can interact with bot by sending commands starting with '@robot'.
 *
 * @example
 * const bot = new Bot();
 * bot.sendRequest('@robot: погода');
 */
class Bot {
  constructor() {
    this.container = document.querySelector('.chat-container');
    this.weather = [
      'Облачно, с прояснениями',
      'Гроза, местами град',
      'Ближе к вечеру ожидаются кратковременные кислотные дожди',
      'Ветер северо-западный, порывистый, до 8 м/с',
      'Солнечно, без осадков, температура воздуха 25-27°C',
      'Утром вероятно наводнение',
      'Местами метеоритный дождь, к вечеру возможен Апокалипсис'
    ];
    this.rates = [
      'USD: 73.9735, EUR: 89.2546',
      '↓ USD: 73.5453, EUR: 89.3304',
      '↑ USD: 74.2663, EUR: 90.3227',
      'USD: 74.5157, EUR: 90.8123',
      'USD: 73.8757, EUR: 89.2546',
    ];
    this.todo = [
      'Похудеть',
      'Купить коляску',
      'Купить новый лоток котам',
      'Изучить JS и React',
      'Подготовиться к поступлению',
      'Сдать на права',
    ];
    this.notifications = [
      'Отменить автозаказ на Petshop',
      'Починить сервер СКУД на работе',
      'Вернуть билет',
      'Ближайших напоминаний нет',
    ];
  }

  /**
   * Create response message to user
   * @param {String} request user command
   */
  sendRequest(request) {
    this.printMessage(request);
    const requestBody = request.replace(/^@robot: /, '');

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
