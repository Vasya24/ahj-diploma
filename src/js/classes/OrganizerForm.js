/* eslint-disable max-len */
/* eslint-disable no-console */
import Message from './Message';
import Geolocation from './Geolocation';
import Bot from './Bot';
import Tooltip from './Tooltip';
import Chat from './Chat';
import Server from './Server';

/**
 * Class for actions with organizer form, sending text messages, coords and audio and video recording
 *
 * @example
 * const organizerForm = new OrganizerForm();
 * await organizerForm.record('audio');
 * @todo init form
 */
class OrganizerForm {
  constructor() {
    this.container = document.querySelector('.container');
    this.input = document.getElementById('text-input');
    this.geolocationButton = document.querySelector('.geolocation-button');
    this.mediaButtons = document.querySelector('.media-buttons-group');
    this.recordButtons = document.querySelector('.record-buttons-group');
    this.audioButton = document.querySelector('.audio-button');
    this.videoButton = document.querySelector('.video-button');
    this.saveButton = document.querySelector('.save-button');
    this.closeButton = document.querySelector('.close-button');
    this.timerContainer = document.querySelector('.timer-container');
    this.server = new Server('qa-chat-organizer.herokuapp.com');
    this.geolocation = new Geolocation();
    this.chat = new Chat();
    this.bot = new Bot();
    this.tooltip = new Tooltip();
  }

  /**
   * Generate timer for recording
   * @param {Number} seconds number of seconds
   */
  static timer(seconds) {
    const timerMinutes = Math.floor(seconds / 60);
    const timerSeconds = seconds - timerMinutes * 60;
    return `${timerMinutes < 10 ? '0' : ''}${timerMinutes}:${timerSeconds < 10 ? '0' : ''}${timerSeconds}`;
  }

  /**
   * Init organizer form and server
   */
  init() {
    this.action();
    this.server.init();
  }

  /**
   * Add event listeners for organizer form events
   */
  action() {
    this.input.addEventListener('keypress', async (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (document.querySelector('.geolocation-form-active')) return;
        if (this.input.value !== '') {
          const commandRegex = /^@robot:/;
          if (this.input.value.search(commandRegex) !== -1) {
            this.bot.sendRequest(this.input.value);
            this.input.value = '';
            return;
          }
          const message = new Message(this.input.value, 'text');
          this.server.sendMessage(message);
          this.input.value = '';
        }
      }
    });
    this.mediaButtons.addEventListener('click', async (event) => {
      if (document.querySelector('.geolocation-form-active') || document.querySelector('.tooltip')) return;
      if (event.target === this.audioButton || event.target === this.videoButton) {
        this.mediaButtons.classList.remove('media-buttons-active');
        this.recordButtons.classList.add('record-buttons-active');
      }
      if (event.target === this.audioButton) {
        await this.record('audio');
      } else if (event.target === this.videoButton) {
        await this.record('video');
      }
    });
    this.geolocationButton.addEventListener('click', async () => {
      const geolocation = await this.geolocation.getCoords();
      const message = new Message(geolocation, 'geolocation');
      this.server.sendMessage(message);
    });
  }

  /**
   * Loads user file and sending it to server
   * @param {Object} file user file
   */
  uploadFile(file) {
    const fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = () => {
      const type = file.type.match(/[a-z]+/)[0];
      const message = new Message(fr.result, type, file.name);
      this.server.sendMessage(message);
    };
  }

  /**
   * Records audio or video file with browser tools
   * @param {String} type media type
   */
  async record(type) {
    if (!window.MediaRecorder) {
      this.tooltip.show(`${type}AvailableError`);
      this.mediaButtons.classList.add('media-buttons-active');
      this.recordButtons.classList.remove('record-buttons-active');
      return;
    }

    try {
      let interval = null;
      let seconds = 0;
      let save = false;
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === 'video',
      });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      const stopRecord = (event) => {
        if (document.querySelector('.geolocation-form-active') || document.querySelector('.tooltip')) return;
        if (event.target.classList.contains('save-button')) {
          save = true;
        } else {
          save = false;
        }
        this.mediaButtons.classList.add('media-buttons-active');
        this.recordButtons.classList.remove('record-buttons-active');
        recorder.stop();
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      };

      recorder.addEventListener('start', () => {
        if (type === 'video') {
          const previewBox = document.createElement('div');
          previewBox.className = 'preview-box';
          const preview = document.createElement('video');
          preview.className = 'preview';
          preview.srcObject = stream;
          preview.muted = false;
          preview.play();
          previewBox.appendChild(preview);
          this.container.appendChild(previewBox);
        }
        console.log('recording started');
        interval = setInterval(() => {
          seconds += 1;
          this.timerContainer.innerText = OrganizerForm.timer(seconds);
        }, 1000);
        this.saveButton.addEventListener('click', stopRecord);
        this.closeButton.addEventListener('click', stopRecord);
      });
      recorder.addEventListener('dataavailable', (event) => {
        console.log('data available');
        chunks.push(event.data);
      });
      recorder.addEventListener('stop', async () => {
        this.saveButton.removeEventListener('click', stopRecord);
        this.closeButton.removeEventListener('click', stopRecord);
        if (type === 'video') this.container.removeChild(document.querySelector('.preview-box'));
        console.log('recording stopped');
        clearInterval(interval);
        this.timerContainer.innerText = '00:00';
        if (save) {
          const blob = new Blob(chunks, { type: `${type}/mp4` });
          this.uploadFile(blob);
        }
      });
      recorder.start();
    } catch (e) {
      console.error(e);
      this.mediaButtons.classList.add('media-buttons-active');
      this.recordButtons.classList.remove('record-buttons-active');
      this.tooltip.show(`${type}AvailableError`);
    }
  }
}

export default OrganizerForm;
