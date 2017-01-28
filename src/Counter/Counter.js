/**
 * Created by Vladimirvl on 2017-01-25.
 */
import React from 'react';
import CountButton from "./CountButton";
 
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
    static defaultEventState = {
        value_one: 0,
        value_two: 0
    };

}

class CustomEventTwo extends Event {
    static defaultEventState = {
        two_value_one: 0,
        two_value_two: 0
    };
}

window.CustomEventOne = CustomEventOne;
window.CustomEventTwo = CustomEventTwo;
