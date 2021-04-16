import Organizer from './classes/Organizer';

test('Testing...', () => {
   const initialize = organizer.init();
    // Bot.sendRequest(request)
    expect(typeof initialize === 'function').toBe(true)
})