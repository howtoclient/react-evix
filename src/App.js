import React from 'react';
import logo from './logo.svg';
import './App.css';
import Counter from './Counter/Counter';
import EventComponent from './GlobalEventEmitter/EventComponent';
import ClickEvent from './events/ClickEvent';

class App extends EventComponent {
    state = {
        counted: 0,
        listener: null
    };

    componentDidMount() {
        const listener = this.addEventListener(ClickEvent, ()=> {
            this.forceUpdate();
        });
        listener.onAction = ()=>this.forceUpdate();
        this.setState({
            listener: listener
        });
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
                <Counter/>
                <hr />
                <Counter/>
                <hr />
                <Counter/>
                <hr />
                {this.state.listener ?
                    this.state.listener.isSuspended() ?
                        <button onClick={() =>  this.state.listener.restore()}>
                            restore Events
                        </button>
                        :
                        <button onClick={() =>  this.state.listener.suspend()}>
                            suspend Events
                        </button>
                    : "Event not defined yet"}
            </div>
        );
    }
}

export default App;
