/* eslint-disable no-console */
import Chat from './Chat';

/**
 * Server API
 *
 * @example
 * const server = new Server('localhost:9000');
 * @todo init server
 */
class Server {
  /**
   * @param {String} url server host
   */
  constructor(url) {
    this.url = url;
    this.contentTypeHeader = { 'Content-Type': 'application/json' };
    this.chat = new Chat();
  }

  /**
   * Init new websocket server
   */
  init() {
    this.ws = new WebSocket(`wss://${this.url}/ws`);
    this.ws.addEventListener('open', () => {
      console.log('connected');
    });
    this.ws.addEventListener('message', (event) => {
      this.chat.printMessage(event.data, 'beforeend');
    });
    this.ws.addEventListener('close', (event) => {
      console.log('connection closed', event);
    });
    this.ws.addEventListener('error', () => {
      console.log('error');
    });
  }

  /**
   * Sends message to the server
   * @param {Object} message sent message
   */
  sendMessage(message) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'message',
        content: message,
      }));
    } else {
      this.ws = new WebSocket(`wss://${this.url}/ws`);
    }
  }

  /**
   * Loads all messages from server
   * @param {Number} length number of messages
   */
  loadAllMessages(length) {
    return fetch(`https://${this.url}/allmessages?length=${length}`);
  }

  /**
   * Loads messages by type from server
   * @param {String} type type of messages
   */
  loadTypeMessages(type) {
    return fetch(`https://${this.url}/allmessages/${type}`);
  }

  /**
   * Loads favorite messages from server
   */
  loadFavorites() {
    return fetch(`https://${this.url}/favorites`);
  }

  /**
   * Loads pinned message from server
   */
  loadPinned() {
    return fetch(`https://${this.url}/pinned`);
  }

  /**
   * Sends a request to change favorite message
   * @param {Number} id message id
   */
  changeFavorite(id) {
    return fetch(`https://${this.url}/favorites/${id}`, {
      method: 'PATCH',
    });
  }

  /**
   * Sends a request to change pinned message
   * @param {Number} id message id
   */
  changePinned(id) {
    return fetch(`https://${this.url}/pinned/${id}`, {
      method: 'PATCH',
    });
  }
}

export default Server;
