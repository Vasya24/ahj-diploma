const uuid = require('uuid');

/**
 * User message
 */
class Message {
  /**
   * @param {String} data message data: text, blob or link
   * @param {String} type type of message
   * @param {String} name name of message
   */
  constructor(data, type, name) {
    this.id = uuid.v4();
    this.data = data;
    this.type = type;
    this.name = name || 'Unnamed media';
    this.favorite = false;
    this.pinned = false;
    this.date = new Date();
  }
}

export default Message;
