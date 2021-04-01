import OrganizerForm from './OrganizerForm';
import Chat from './Chat';

/**
 * Chaos Organizer Widget for saving and sorting user info, loading files and responsing to commands
 *
 * @example
 * const organizer = new Organizer();
 * organizer.init();
 * @todo init organizer
 */
class Organizer {
  constructor() {
    this.container = document.querySelector('.container');
    this.fileInput = document.getElementById('file-input');
    this.homeButton = document.querySelector('.home-button');
    this.fileButton = document.querySelector('.file-button');
    this.filterButton = document.querySelector('.filter-button');
    this.favoritesButton = document.querySelector('.favorites-button');
    this.filterMenu = document.querySelector('.filter-toggle');
    this.dragArea = document.querySelector('.organizer-chat');
    this.pinnedMessageContainer = document.querySelector('.pinned-message-container');
    this.chatContainer = document.querySelector('.chat-container');
    this.organizerForm = new OrganizerForm();
    this.chat = new Chat();
    this.messagesLength = 0;
    this.favoritesMode = false;
    this.typeMode = false;
  }

  /**
   * Init organizer and organizer form
   */
  async init() {
    this.organizerForm.init();
    this.action();
    await this.initMessages();
  }

  /**
   * Loads init messages from server and print it
   */
  async initMessages() {
    this.pinnedMessageContainer.innerHTML = '';
    this.chatContainer.innerHTML = '';
    this.favoritesMode = false;
    this.typeMode = false;
    this.messagesLength = 0;
    await this.printAllMessages();
    const pinnedMessages = await this.organizerForm.server.loadPinned()
      .then((response) => response.json());
    pinnedMessages.forEach((el) => this.chat.printPinMessage(el));
  }

  /**
   * Loads all messages from server and print it
   */
  async printAllMessages() {
    const allMessages = await this.organizerForm.server.loadAllMessages(this.messagesLength)
      .then((response) => response.json());
    allMessages.forEach((el) => this.chat.printMessage(el, 'afterbegin'));
    this.messagesLength += allMessages.length;
  }

  /**
   * Loads favorite messages from server and print it
   */
  async printFavorites() {
    const favorites = await this.organizerForm.server.loadFavorites()
      .then((response) => response.json());
    favorites.forEach((el) => this.chat.printMessage(el, 'beforeend'));
  }

  /**
   * Loads messages by type from server and print it
   * @param {String} type message type
   */
  async printTypeMessages(type) {
    const typeMessages = await this.organizerForm.server.loadTypeMessages(type)
      .then((response) => response.json());
    typeMessages.forEach((el) => this.chat.printMessage(el, 'beforeend'));
  }

  /**
   * Adds event listeners for organizer menu events
   */
  action() {
    this.chatContainer.addEventListener('scroll', async () => {
      if (this.chatContainer.scrollTop === 0) {
        if (this.favoritesMode || this.typeMode) return;
        await this.printAllMessages();
      }
    });
    this.dragArea.addEventListener('dragover', (event) => {
      event.preventDefault();
      this.dragArea.classList.add('drag-and-drop-area');
    });
    this.dragArea.addEventListener('drop', (event) => {
      event.preventDefault();
      this.dragArea.classList.remove('drag-and-drop-area');
      const { files } = event.dataTransfer;
      files.forEach(async (el) => {
        this.organizerForm.uploadFile(el);
      });
    });
    this.dragArea.addEventListener('click', async (event) => {
      if (event.target.classList.contains('favorites-action')) {
        event.target.classList.toggle('favorites-action-active');
        const { id } = event.target.closest('.message').dataset;
        await this.organizerForm.server.changeFavorite(id);
      }
      if (event.target.classList.contains('pin-action') || event.target.classList.contains('pinned-message-action')) {
        let id;
        if (event.target.classList.contains('pin-action')) {
          event.target.classList.toggle('pin-action-active');
          id = event.target.closest('.message').dataset.id;
        } else {
          id = event.target.closest('.pinned-message').dataset.id;
        }
        await this.organizerForm.server.changePinned(id);
        this.pinnedMessageContainer.innerHTML = '';
        const pinned = await this.organizerForm.server.loadPinned()
          .then((response) => response.json());
        pinned.forEach((el) => this.chat.printPinMessage(el));
      }
      if (event.target.classList.contains('pinned-message-name')) {
        const { id } = event.target.closest('.pinned-message').dataset;
        const pinned = this.chatContainer.querySelector(`[data-id="${id}"]`);
        this.chatContainer.scrollTo(0, pinned.offsetTop);
      }
    });
    this.homeButton.addEventListener('click', async () => {
      await this.initMessages();
    });
    this.fileButton.addEventListener('click', () => {
      this.fileInput.dispatchEvent(new MouseEvent('click'));
    });
    this.fileInput.addEventListener('change', (event) => {
      const { files } = event.currentTarget;
      files.forEach(async (el) => {
        this.organizerForm.uploadFile(el);
      });
      this.fileInput.value = '';
    });
    this.favoritesButton.addEventListener('click', async () => {
      this.pinnedMessageContainer.innerHTML = '';
      this.chatContainer.innerHTML = '';
      this.favoritesMode = true;
      await this.printFavorites();
    });
    this.filterButton.addEventListener('click', () => {
      this.filterMenu.classList.toggle('filter-toggle-active');
    });
    this.filterMenu.addEventListener('click', async (event) => {
      if (event.target.classList.contains('filter-item')) {
        this.pinnedMessageContainer.innerHTML = '';
        this.chatContainer.innerHTML = '';
        this.typeMode = true;
        this.favoritesMode = false;
        const { type } = event.target.dataset;
        await this.printTypeMessages(type);
        this.filterMenu.classList.toggle('filter-toggle-active');
      }
    });
  }
}

export default Organizer;
