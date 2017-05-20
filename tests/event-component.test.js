/**
 * Created by vladi on 05-Feb-17.
 */
import React from 'react';
import renderer from 'react-test-renderer';
import {
    __testGetCurrentUid,
    __testGetCurrentListenerRegistry,
    __testGetCurrentDispatchRegistry,
    DEFAULT_FILTER
} from '../src/EventsControl';
import EventComponent from "../src/EventComponent"
import Event from "../src/Event"
import EventListener from "../src/EventListener"
const noop = () => undefined,
    getEventListenerInfo = (uid, onStateUpdate, active, handler) => ({
        _onStateUpdate: !!onStateUpdate,
        _active: !!active,
        _eventUid: uid,
        _handler: handler === undefined ? noop : handler,
        _isFiltered : false,
        _filters:{}
    });
class MyEventOne extends Event {
    static defaultEventState = {
        myEventOneValue: false
    }
}
class MyEventTwo extends Event {
    static defaultEventState = {
        myEventTwoValue: false
    }
}
//init events to recieve 1 and 2 UIDs
MyEventOne.uid;
MyEventTwo.uid;

test('initial tests', () => {
    expect(__testGetCurrentUid()).toEqual(2);
    expect(__testGetCurrentListenerRegistry()).toEqual({});
    expect(__testGetCurrentDispatchRegistry()).toEqual({});
});

test('EventComponent trackEvents test', () => {
    class MyEventComponent extends EventComponent {
        trackEvents = [
            MyEventOne, MyEventTwo, MyEventOne
        ];

        render() {
            return (<div />)
        }
    }
    const component = renderer.create(
        <MyEventComponent />
    );
    let myEventComponent = component.getInstance();

    expect(myEventComponent.trackEvents).toBe(undefined);
    expect(myEventComponent.__mounted).toBe(true);
    expect(myEventComponent.__listenersList).toEqual([]);
    expect(myEventComponent.__stateTrackers).toEqual({
        [MyEventOne.uid ]: new EventListener(__testGetCurrentUid() - 1),
        [MyEventTwo.uid ]: new EventListener(__testGetCurrentUid())
    });
    myEventComponent.unTrackAll();
    expect(myEventComponent.__stateTrackers).toEqual({});
    expect(__testGetCurrentListenerRegistry()).toEqual({});
    expect(__testGetCurrentDispatchRegistry()).toEqual({});
    myEventComponent.trackEventState(MyEventOne);
    myEventComponent.trackEventState(MyEventOne);
    myEventComponent.trackEventState(MyEventTwo);
    expect(myEventComponent.__stateTrackers).toEqual({
        [MyEventOne.uid ]: new EventListener(__testGetCurrentUid() - 1),
        [MyEventTwo.uid ]: new EventListener(__testGetCurrentUid())
    });
    expect(__testGetCurrentListenerRegistry()).not.toEqual({});
    expect(__testGetCurrentDispatchRegistry()).not.toEqual({});


    myEventComponent.unTrackEventState(MyEventOne);
    expect(myEventComponent.__stateTrackers).toEqual({
        [MyEventTwo.uid ]: new EventListener(__testGetCurrentUid())
    });
    myEventComponent.unTrackEventState(MyEventOne);
    expect(myEventComponent.__stateTrackers).toEqual({
        [MyEventTwo.uid ]: new EventListener(__testGetCurrentUid())
    });
    myEventComponent.unTrackEventState(MyEventTwo);
    expect(myEventComponent.__stateTrackers).toEqual({});
    expect(myEventComponent.__listenersList).toEqual([]);
    expect(__testGetCurrentListenerRegistry()).toEqual({});
    expect(__testGetCurrentDispatchRegistry()).toEqual({});
});

test('EventComponent add/remove EventListeners test', () => {
    class MyEventComponent extends EventComponent {
        render() {
            return (<div />)
        }
    }
    const component = renderer.create(
        <MyEventComponent />
    );
    let myEventComponent = component.getInstance();

    expect(myEventComponent.trackEvents).toBe(undefined);
    expect(myEventComponent.__mounted).toBe(true);
    expect(myEventComponent.__listenersList).toEqual([]);

    const listenerOne = myEventComponent.addEventListener(MyEventOne, noop);
    const listenerOne2 = myEventComponent.addEventListener(MyEventOne, noop);
    const listenerOne3 = myEventComponent.addEventListener(MyEventOne, noop, true);
    const listenerTwo = myEventComponent.addEventListener(MyEventTwo, noop);

    expect(myEventComponent.__listenersList).toEqual([
        {
            "eventUid": MyEventOne.uid,
            "listenerUid": __testGetCurrentUid() - 3,
            "suspendOnUnMount": false,
        },
        {
            "eventUid": MyEventOne.uid,
            "listenerUid": __testGetCurrentUid() - 2,
            "suspendOnUnMount": false,
        },
        {
            "eventUid": MyEventOne.uid,
            "listenerUid": __testGetCurrentUid() - 1,
            "suspendOnUnMount": true,
        },
        {
            "eventUid": MyEventTwo.uid,
            "listenerUid": __testGetCurrentUid(),
            "suspendOnUnMount": false,
        }
    ]);
    myEventComponent.removeEventListener();
    myEventComponent.removeEventListener(listenerTwo);
    expect(myEventComponent.__listenersList).toEqual([
        {
            "eventUid": MyEventOne.uid,
            "listenerUid": __testGetCurrentUid() - 3,
            "suspendOnUnMount": false,
        },
        {
            "eventUid": MyEventOne.uid,
            "listenerUid": __testGetCurrentUid() - 2,
            "suspendOnUnMount": false,
        },
        {
            "eventUid": MyEventOne.uid,
            "listenerUid": __testGetCurrentUid() - 1,
            "suspendOnUnMount": true,
        },
    ]);
    myEventComponent.removeEventListener(listenerOne);
    expect(myEventComponent.__listenersList).toEqual([
        {
            "eventUid": MyEventOne.uid,
            "listenerUid": __testGetCurrentUid() - 2,
            "suspendOnUnMount": false,
        },
        {
            "eventUid": MyEventOne.uid,
            "listenerUid": __testGetCurrentUid() - 1,
            "suspendOnUnMount": true,
        },
    ]);

    myEventComponent.removeEventListener(MyEventOne);
    expect(myEventComponent.__stateTrackers).toEqual({});
    expect(myEventComponent.__listenersList).toEqual([]);
    expect(__testGetCurrentListenerRegistry()).toEqual({});
    expect(__testGetCurrentDispatchRegistry()).toEqual({});

    myEventComponent.onEventStateUpdated();
    myEventComponent.onEventStateUpdated(MyEventOne, noop);
    expect(myEventComponent.__listenersList).toEqual([
        {
            "eventUid": MyEventOne.uid,
            "listenerUid": __testGetCurrentUid(),
            "suspendOnUnMount": false,
        }
    ]);
    myEventComponent.removeEventListener(MyEventOne);
    expect(myEventComponent.__stateTrackers).toEqual({});
    expect(myEventComponent.__listenersList).toEqual([]);
    expect(__testGetCurrentListenerRegistry()).toEqual({});
    expect(__testGetCurrentDispatchRegistry()).toEqual({});
});

test('EventComponent autoSuspend tests', () => {
    let eventRenderTest = jest.fn();
    let eventHandler = jest.fn();
    let eventHandlerAuto = jest.fn();
    let eventStateHandler = jest.fn();
    let eventStateHandlerAuto = jest.fn();

    class MyEventComponent extends EventComponent {
        trackEvents = [
            MyEventOne, MyEventOne, MyEventTwo
        ];

        render() {
            eventRenderTest();
            return (<div />)
        }
    }
    const component = renderer.create(
        <MyEventComponent />);
    let myEventComponent = component.getInstance();
    expect(myEventComponent.__mounted).toBe(true);
    expect(eventRenderTest).toHaveBeenCalledTimes(1);

    myEventComponent.addEventListener(MyEventOne, eventHandler);
    myEventComponent.addEventListener(MyEventOne, eventHandlerAuto, true);
    myEventComponent.onEventStateUpdated(MyEventOne, eventStateHandler);
    myEventComponent.onEventStateUpdated(MyEventOne, eventStateHandlerAuto, true,);


    (new MyEventOne()).dispatch();
    (new MyEventTwo()).dispatch();
    expect(eventRenderTest).toHaveBeenCalledTimes(1);
    expect(eventHandler).toHaveBeenCalledTimes(1);
    expect(eventHandlerAuto).toHaveBeenCalledTimes(1);
    expect(eventStateHandler).toHaveBeenCalledTimes(0);
    expect(eventStateHandlerAuto).toHaveBeenCalledTimes(0);


    (new MyEventOne({myEventOneValue: 1})).dispatch();
    (new MyEventTwo({myEventTwoValue: 1})).dispatch();
    expect(eventRenderTest).toHaveBeenCalledTimes(3);
    expect(eventHandler).toHaveBeenCalledTimes(2);
    expect(eventHandlerAuto).toHaveBeenCalledTimes(2);
    expect(eventStateHandler).toHaveBeenCalledTimes(1);
    expect(eventStateHandlerAuto).toHaveBeenCalledTimes(1);


    myEventComponent.componentWillUnmount();
    expect(myEventComponent.__mounted).toBe(false);

    (new MyEventOne()).dispatch();
    (new MyEventTwo()).dispatch();
    expect(eventRenderTest).toHaveBeenCalledTimes(3);

    expect(eventHandler).toHaveBeenCalledTimes(3);
    expect(eventHandlerAuto).toHaveBeenCalledTimes(2);
    expect(eventStateHandler).toHaveBeenCalledTimes(1);
    expect(eventStateHandlerAuto).toHaveBeenCalledTimes(1);


    (new MyEventOne({myEventOneValue: 2})).dispatch();
    (new MyEventTwo({myEventTwoValue: 2})).dispatch();
    expect(eventRenderTest).toHaveBeenCalledTimes(3);

    expect(eventHandler).toHaveBeenCalledTimes(4);
    expect(eventHandlerAuto).toHaveBeenCalledTimes(2);
    expect(eventStateHandler).toHaveBeenCalledTimes(2);
    expect(eventStateHandlerAuto).toHaveBeenCalledTimes(1);


    myEventComponent.componentWillMount();
    myEventComponent.componentDidMount();
    expect(myEventComponent.__mounted).toBe(true);
    expect(eventRenderTest).toHaveBeenCalledTimes(3);

    (new MyEventOne()).dispatch();
    (new MyEventTwo()).dispatch();
    expect(eventRenderTest).toHaveBeenCalledTimes(3);
    expect(eventHandler).toHaveBeenCalledTimes(5);
    expect(eventHandlerAuto).toHaveBeenCalledTimes(3);
    expect(eventStateHandler).toHaveBeenCalledTimes(2);
    expect(eventStateHandlerAuto).toHaveBeenCalledTimes(1);


    (new MyEventOne({myEventOneValue: 3})).dispatch();
    (new MyEventTwo({myEventTwoValue: 3})).dispatch();
    expect(eventRenderTest).toHaveBeenCalledTimes(5);
    expect(eventHandler).toHaveBeenCalledTimes(6);
    expect(eventHandlerAuto).toHaveBeenCalledTimes(4);
    expect(eventStateHandler).toHaveBeenCalledTimes(3);
    expect(eventStateHandlerAuto).toHaveBeenCalledTimes(2);

    component.unmount();
    expect(myEventComponent.__mounted).toBe(false);

    (new MyEventOne()).dispatch();
    (new MyEventTwo()).dispatch();
    expect(eventRenderTest).toHaveBeenCalledTimes(5);
    expect(eventHandler).toHaveBeenCalledTimes(7);
    expect(eventHandlerAuto).toHaveBeenCalledTimes(4);
    expect(eventStateHandler).toHaveBeenCalledTimes(3);
    expect(eventStateHandlerAuto).toHaveBeenCalledTimes(2);


    (new MyEventOne({myEventOneValue: 4})).dispatch();
    (new MyEventTwo({myEventTwoValue: 4})).dispatch();
    expect(eventRenderTest).toHaveBeenCalledTimes(5);
    expect(eventHandler).toHaveBeenCalledTimes(8);
    expect(eventHandlerAuto).toHaveBeenCalledTimes(4);
    expect(eventStateHandler).toHaveBeenCalledTimes(4);
    expect(eventStateHandlerAuto).toHaveBeenCalledTimes(2);

    myEventComponent.removeEventListener(MyEventOne);
    myEventComponent.unTrackEventState(MyEventOne);
    myEventComponent.unTrackEventState(MyEventTwo);
    expect(myEventComponent.__stateTrackers).toEqual({});
    expect(myEventComponent.__listenersList).toEqual([]);
    expect(__testGetCurrentListenerRegistry()).toEqual({});
    expect(__testGetCurrentDispatchRegistry()).toEqual({});
});

test('EventComponent dispatch between willMount and DidMout reRender test', () => {
    let ReadyEventRenderTest = jest.fn();
    class InnerComponent extends React.Component {
        constructor(props) {
            super(props);
            (new MyEventOne({myEventOneValue: 123})).dispatch()
        }

        render() {
            return (<span/>)
        }
    }
    class MyEventComponent extends EventComponent {
        trackEvents = [
            MyEventOne, MyEventOne, MyEventTwo
        ];

        render() {
            ReadyEventRenderTest();
            return (<div>
                <InnerComponent />
            </div>)
        }
    }
    const component = renderer.create(<MyEventComponent />);

    expect(ReadyEventRenderTest).toHaveBeenCalledTimes(2);
})