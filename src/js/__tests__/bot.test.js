import Bot from '../classes/Bot'

let robo = new Bot();

test('1 ', () => {
    expect(robo.weather[0]).toBe('Облачно, с прояснениями')
})

test('2', () => {
    expect(robo.rates).toBeDefined
})

test('3', () => {
    expect(robo.todo.length).toBeGreaterThan(5)
})

test('4', () => {
    expect(!isNaN(robo.notifications[1])).tobeTruthy
})

test('5', () => {
    expect(robo.container).toBeNull
})

test('6', () => {
    expect(robo.weather[1]).notToBeUndefined
})

test('7', () => {
    expect(robo.todo[13]).toBeUndefined
})

test('8', () => {
    expect(robo.notifications[2].length).toBeLessThanOrEqual(20)
})

test('9', () => {
    for(let i = 0; i < robo.notifications.length; i++) {
        expect(robo.notifications[i]).not.toMatch('Не делать тест')
    }
})