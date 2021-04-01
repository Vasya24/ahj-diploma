/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

/**
 * Chat Area where messages are displayed
 *
 * @example
 * const chat = new Chat();
 * chat.drawMessage(data, 'afterbegin');
 */
class Chat {
  constructor() {
    this.pinnedMessageContainer = document.querySelector('.pinned-message-container');
    this.container = document.querySelector('.chat-container');
  }

  /**
   * Formats date to String
   * @param {Object} data date of creation message
   */
  static formatDate(data) {
    const date = new Date(data);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear().toString().slice(2);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}.${year} ${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  }

  /**
   * Format text message
   * @param {Object} text message with text data
   */
  static formatText(text) {
    const linkRegex = /(https?:\/\/)([\w-]{1,32}\.[\w-]{1,32})[^\s@]*/;
    const codeRegex = /```(.|\n)*?```/;
    let message = text.data;

    if (message.search(linkRegex) !== -1) {
      message = message.replace(linkRegex, `<a href=${message.match(linkRegex)[0]} class="message-link">${message.match(linkRegex)[0]}</a>`);
    }
    if (message.search(codeRegex) !== -1) {
      const code = message.match(codeRegex)[0].replace(/```\n?/g, '');
      const formalCode = hljs.highlightAuto(code.trim()).value;
      message = message.replace(codeRegex, `<pre><code>${formalCode}</code></pre>`);
    }
    return message;
  }

  /**
   * Format geolocation message
   * @param {Object} geolocation message with geolocation data
   */
  static formatGeolocation(geolocation) {
    return `<span class='geolocation-icon'></span> ${geolocation.data}`;
  }

  /**
   * Format image
   * @param {Object} img message with image source
   */
  static formatImage(img) {
    const imageBox = document.createElement('div');
    imageBox.classList.add('image-box');
    const image = document.createElement('img');
    image.classList.add('image');
    image.src = img.data;
    imageBox.appendChild(image);
    return imageBox.outerHTML;
  }

  /**
   * Format audio and video files
   * @param {Object} file message with media source
   * @param {String} type media type
   */
  static formatMedia(file, type) {
    const media = document.createElement('div');
    media.className = `${type}-content`;
    media.innerHTML = `
      <${type} download=${file.name} class="${type}" src="${file.data}" controls></${type}>
    `;
    return media.outerHTML;
  }

  /**
   * Format applications
   * @param {Object} file application
   */
  static formatFile(file) {
    const fileBox = document.createElement('div');
    fileBox.className = 'application';
    fileBox.innerHTML = `
      <span class="application-icon"></span> <a href=${file.data} download=${file.name} class="application-link">${file.name}</a>
    `;
    return fileBox.outerHTML;
  }

  /**
   * Generates pinned message content
   * @param {Object} data pinned message
   */
  static createPinnedContent(data) {
    const pinnedMessageContent = document.createElement('div');
    const pinnedMessageName = document.createElement('span');
    pinnedMessageName.className = 'pinned-message-name';
    const pinnedMessageLink = document.createElement('a');
    switch (data.content.type) {
      case 'text':
      case 'geolocation':
        pinnedMessageName.innerHTML = Chat.formatText(data.content);
        break;
      case 'image':
      case 'audio':
      case 'video':
      case 'application':
        pinnedMessageName.innerText = data.content.name;
        pinnedMessageLink.innerText = 'Скачать';
        pinnedMessageLink.href = data.content.data;
        pinnedMessageLink.download = data.content.name;
        pinnedMessageLink.className = 'pinned-message-link';
        break;
      default:
        console.log(data.content.type);
    }
    pinnedMessageContent.appendChild(pinnedMessageName);
    pinnedMessageContent.appendChild(pinnedMessageLink);
    return pinnedMessageContent.outerHTML;
  }

  /**
   * Generates message content
   * @param {Object} data message
   */
  static createContent(data) {
    try {
      let сontent;
      switch (data.content.type) {
        case 'text':
          сontent = Chat.formatText(data.content);
          break;
        case 'geolocation':
          сontent = Chat.formatGeolocation(data.content);
          break;
        case 'image':
          сontent = Chat.formatImage(data.content);
          break;
        case 'audio':
        case 'video':
          сontent = Chat.formatMedia(data.content, data.content.type);
          break;
        case 'application':
          сontent = Chat.formatFile(data.content);
          break;
        default:
          console.log(data.content);
      }
      return сontent;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * Print user message to Chat area
   * @param {Object} msg user message
   * @param {String} position message position: 'beforeend', 'afterbegin' etc
   */
  printMessage(msg, position) {
    let data;
    if (typeof msg !== 'object') {
      data = JSON.parse(msg);
    } else {
      data = msg;
    }

    const content = Chat.createContent(data);
    if (content) {
      const message = document.createElement('div');
      message.className = 'message';
      message.dataset.id = data.content.id;
      message.innerHTML = `
        <div class="message-content">${content}</div>
        <div class="message-footer">
          <div class="message-date">${Chat.formatDate(data.content.date)}</div>
          <div class="message-actions-group">
            <div class="message-action pin-action"></div>
            <div class="message-action favorites-action ${data.content.favorite && 'favorites-action-active'}"></div>
          </div>
        </div>
      `;
      if (position === 'afterbegin') {
        this.container.insertAdjacentHTML(position, message.outerHTML);
      } else {
        this.container.appendChild(message);
        this.container.scrollTo(0, message.offsetTop);
      }
    }
  }

  /**
   * Print pinned message to Chat area
   * @param {Object} msg pinned message
   */
  printPinMessage(msg) {
    const content = Chat.createPinnedContent(msg);
    if (content) {
      const pinnedMessage = document.createElement('div');
      pinnedMessage.className = 'pinned-message';
      pinnedMessage.dataset.id = msg.content.id;
      pinnedMessage.innerHTML = `
        <div class="pinned-message-content">${content}</div>
        <div class="pinned-message-action"></div>
      `;
      this.pinnedMessageContainer.appendChild(pinnedMessage);
    }
  }
}

export default Chat;
