/**
 * Created by Vladimirvl on 2017-01-25.
 */
import React from 'react';
import EventComponent from "../GlobalEventEmitter/EventComponent";

class CountButton extends EventComponent {
    render() {
        return (
            <div>
                <button onClick={() => this.dispatch("ClickHappened", {data: "lalala-data"})}>
                    add 1
                </button>
                <button onClick={() => this.dispatch("ClickHappened_2", {data: "lalala-data-2"})}>
                    add 2
                </button>
                <button onClick={() => this.dispatch("ClickHappened_3", {data: "lalala-data-2"})}>
                    add 3
                </button>
                <button onClick={() => this.dispatch("StopCounter")}>
                    stop event Listener ( +1 )
                </button>

            </div>
        );
    }
}

export default CountButton;
