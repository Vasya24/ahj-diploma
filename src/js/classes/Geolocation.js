/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
import validateCoords from '../validateCoords';
import Tooltip from './Tooltip';

/**
 * Class for getting geolocation position using browser tools or user coords input
 *
 * @example
 * const geolocation = new Geolocation();
 * await geolocation.getCoords();
 */
class Geolocation {
  constructor() {
    this.form = document.forms.geolocation;
    this.input = document.getElementById('geolocation-input');
    this.cancelButton = document.querySelector('.cancel-button');
    this.sendButton = document.querySelector('.send-button');
    this.tooltip = new Tooltip();
  }

  /**
   * Async function for getting coords using browser navigator tools or user coords input
   */
  getCoords() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          resolve(`${latitude}, ${longitude}`);
        }, (error) => {
          console.log(error);
          this.form.classList.add('geolocation-form-active');
          this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (document.querySelector('.tooltip')) return;
            if (validateCoords(this.input.value)) {
              this.form.classList.remove('geolocation-form-active');
              resolve(validateCoords(this.input.value));
            } else {
              this.tooltip.show('coordsValueError');
            }
          });
          this.cancelButton.addEventListener('click', () => {
            if (document.querySelector('.tooltip')) return;
            this.form.classList.remove('geolocation-form-active');
            this.tooltip.show('coordsAvailableError');
            reject('cancel');
          });
        });
      } else {
        this.form.classList.remove('geolocation-form-active');
        this.tooltip.show('coordsAvailableError');
        reject('error');
      }
    });
  }
}

export default Geolocation;
