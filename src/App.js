import React from 'react';
import logo from './logo.svg';
import './App.css';
import Counter from './Counter/Counter';
import EventComponent from './GlobalEventEmitter/EventComponent';

class App extends EventComponent {
    state = {
        showCounters: 4,
        counted: 0
    };

    countClick(eventName, payload) {
        this.setState({
            counted: this.state.counted + 1
        })
    }

    countClickTwo(eventName, payload) {
        this.setState({
            counted: this.state.counted + 2
        })
    }

    countClickThree(eventName, payload) {
        this.setState({
            counted: this.state.counted + 3
        })
    }

    stopEvent() {
        this.removeEventListener("ClickHappened");
    }

    componentDidMount() {
        this.addEventListener("ClickHappened", this.countClick);
        this.addEventListener("ClickHappened_2", this.countClickTwo);
        this.addEventListener("ClickHappened_3", this.countClickThree);
        this.addEventListener("StopCounter", this.stopEvent);
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Welcome to React</h2>
                </div>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
                <hr />
                <Counter counted={this.state.counted}/>
                <hr />
                <Counter counted={this.state.counted}/>
                <hr />
                <Counter counted={this.state.counted}/>
                <hr />
                {this.state.showCounters >= 4 ?
                    <Counter counted={this.state.counted}/>
                    :
                    ""
                }
                <hr />
                <button onClick={() => this.setState({showCounters: 3})}>
                    Hide bottom counter
                </button>
            </div>
        );
    }
}

export default App;
