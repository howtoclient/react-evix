/**
 * Created by vladi on 25-Jan-17.
 */

export default class Event {
    static _data = null;

    constructor(eventData) {
        this._data = {...(eventData || {})};
        this._eventState = this._eventState || {};
    }

    set eventState(state) {
        this._eventState = Object.assign(this._eventState, state);
    }

    get eventState() {
        return {...this._eventState};
    }

    _apply() {
        this.eventState = this._data;
    }

    get eventData() {
        return {...this._data};
    }
}

//testEvent0.__proto__.isPrototypeOf(testEvent1)

class CustomEvent extends Event {
    eventState = {
        value_one: 0,
        value_two: 0
    }
}

class CustomEventTwo extends Event {
    eventState = {
        two_value_one: 0,
        two_value_two: 0
    }
}

window.testEvent0 = new CustomEvent({value_five: 0});
window.testEvent0._apply();

window.testEvent1 = new CustomEvent({value_four: 0});
window.testEvent1._apply();

window.testEvent2 = new CustomEventTwo({value_three: 0});
window.testEvent2._apply();