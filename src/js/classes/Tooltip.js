/**
 * Error Tooltip
 *
 * @example
 * const tooltip = new Tooltip();
 * tooltip.show('coordsValueError');
 */

class Tooltip {
  constructor() {
    this.container = document.querySelector('.container');
  }

  /**
   * Shows message by error type
   * @param {String} type error type
   */
  show(type) {
    const errors = {
      coordsValueError: 'Пожалуйста, проверьте корректность введенных координат и повторите попытку.',
      coordsAvailableError: 'Нам не удалось определить ваши координаты. Пожалуйста, разрешите использование вашей геолокации в настройках браузера и повторите попытку.',
      audioAvailableError: 'Чтобы воспользоваться этой функцией, разрешите, пожалуйста, использование микрофона в настройках браузера либо воспользуйтесь другим браузером.',
      videoAvailableError: 'Чтобы воспользоваться этой функцией, разрешите, пожалуйста, использование камеры в настройках браузера либо воспользуйтесь другим браузером.',
    };
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerHTML = `
      <p class="tooltip-message">${errors[type]}</p>
      <button type="button" class="tooltip-button">Закрыть</button>
    `;
    this.container.appendChild(tooltip);
    const tooltipButton = document.querySelector('.tooltip-button');
    tooltipButton.addEventListener('click', () => {
      this.container.removeChild(tooltip);
    });
  }
}

export default Tooltip;
