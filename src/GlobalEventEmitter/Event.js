/**
 * Created by vladi on 25-Jan-17.
 */
let uid = 0;
export default class Event {
    constructor(eventData) {
        this._data = {...(eventData || {})};
        this.__proto__._eventState = this.__proto__._eventState || {};
    }

    set eventState(state) {
        this._eventState = Object.assign(this._eventState, state);
    }

    _apply() {
        this.eventState = this._data;
        this.onEventStateUpdated();
    }

    get eventState() {
        return {...this._eventState};
    }

    get eventData() {
        return {...this._data};
    }

    onEventStateUpdated() {
    }
}

//testEvent0.__proto__.isPrototypeOf(testEvent1)

class CustomEvent extends Event {
    eventState = {
        value_one: 0,
        value_two: 0
    };

    onEventStateUpdated() {
        console.log("CustomEventIsUpdated!")
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

window.testEvent2 = new CustomEventTwo({two_value_three: 0});
window.testEvent2._apply();

window.testEvent3 = new CustomEventTwo({two_value_zero: 0});
window.testEvent3._apply();