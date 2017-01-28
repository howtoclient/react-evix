/**
 * Created by Vladimirvl on 2017-01-25.
 */
import React from 'react';
import CountButton from "./CountButton";
import Event, {eventState} from "./../GlobalEventEmitter/Event";

class Counter extends React.Component {
    render() {
        return (
            <div>
                { this.props.counted }
                <hr />
                <CountButton />
            </div>
        );
    }
}

export default Counter;

class CustomEventOne extends Event {
    eventState = {
        value_one: 0,
        value_two: 0
    };

    onEventStateUpdated() {
    }
}

class CustomEventTwo extends Event {
    eventState = {
        two_value_one: 0,
        two_value_two: 0
    };

    onEventStateUpdated() {
        console.log("CustomEventTwo IsUpdated!")
    }
}

window.CustomEventOne = CustomEventOne;
window.CustomEventTwo = CustomEventTwo;


window.testEvent0 = new CustomEventOne({value_five: 0});
window.testEvent0.dispatch();

window.testEvent1 = new CustomEventOne({value_four: 0});
window.testEvent1.dispatch();

window.testEvent2 = new CustomEventTwo({two_value_three: 0});
window.testEvent2.dispatch();

window.testEvent3 = new CustomEventTwo({two_value_zero: 0});
window.testEvent3.dispatch();
