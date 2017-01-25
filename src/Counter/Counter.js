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
