/**
 * Created by Vladimirvl on 2017-01-25.
 */
import React from 'react';
import ClickEvent from "./../events/ClickEvent";

class CountButton extends React.Component {
    dispatchClickEvent(counter) { 
        (new ClickEvent({
            counter : ClickEvent.eventState.counter + counter
        })).dispatch();
    }
    render() {
        console.log("CountButton rendered");
        return (
            <div>
                <button onClick={() => this.dispatchClickEvent(1)}>
                    add 1
                </button>
                <button onClick={() => this.dispatchClickEvent(2)}>
                    add 2
                </button>
                <button onClick={() => this.dispatchClickEvent(3)}>
                    add 3
                </button>
            </div>
        );
    }
}

export default CountButton;
