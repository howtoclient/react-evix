/**
 * Created by Vladimirvl on 2017-01-25.
 */
import React from 'react';
import CountButton from "./CountButton";
import ClickEvent from "./../events/ClickEvent";

class Counter extends React.Component {
    render() { 
        return (
            <div>
                { ClickEvent.eventState.counter }
                <hr />
                <CountButton />
            </div>
        );
    }
}

export default Counter;
