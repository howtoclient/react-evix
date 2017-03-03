/**
 * Created by vladi on 02-Feb-17.
 */

import Event, {__testGetEventListenerRegistry} from '../src/Event';
import EventListener from '../src/EventListener';
import {
    EventException,
    __testGetCurrentUid,
    __testGetCurrentListenerRegistry,
    __testGetCurrentDispatchRegistry
} from '../src/EventsControl';
const noop = () => undefined;

const testEventListenerRegistry = __testGetEventListenerRegistry(),
    testGlobalListenerRegistry = __testGetCurrentListenerRegistry(),
    testGlobalDispatchRegistry = __testGetCurrentDispatchRegistry(),
    getEventListenerInfo = (uid, onStateUpdate) => ({
        _onStateUpdate: !!onStateUpdate,
        _active: true,
        _eventUid: uid,
        _handler: noop
    });
test('initial tests', () => {
    expect(__testGetCurrentUid()).toEqual(0);
    expect(__testGetEventListenerRegistry()).toEqual({});
    expect(__testGetCurrentListenerRegistry()).toEqual({});
    expect(__testGetCurrentDispatchRegistry()).toEqual({});
});
test('Test basic Event onEventStateUpdated', () => {
    class TestEvent extends Event {
        static defaultEventState = {
            stateVariable: "stateVariable"
        }
    }
    class TestEvent2 extends Event {
        static defaultEventState = {
            stateVariable: "stateVariable"
        }
    }
    TestEvent.onEventStateUpdated(null);
    const testEventListener = TestEvent.onEventStateUpdated(noop),
        testEventListener2 = TestEvent.onEventStateUpdated(noop),
        testEventListener3 = TestEvent2.onEventStateUpdated(noop);
    expect(testEventListener instanceof EventListener).toBe(true);
    expect(testEventListenerRegistry).toEqual({
        [TestEvent.uid]: [testEventListener.listenerUid, testEventListener2.listenerUid],
        [TestEvent2.uid]: [testEventListener3.listenerUid]
    });
    expect(testGlobalDispatchRegistry).toEqual({
        [TestEvent.uid]: [testEventListener.listenerUid, testEventListener2.listenerUid],
        [TestEvent2.uid]: [testEventListener3.listenerUid]
    });
    expect(testGlobalListenerRegistry).toEqual({
        [testEventListener.listenerUid]: getEventListenerInfo(TestEvent.uid, true),
        [testEventListener2.listenerUid]: getEventListenerInfo(TestEvent.uid, true),
        [testEventListener3.listenerUid]: getEventListenerInfo(TestEvent2.uid, true),
    });
    testEventListener.remove();
    expect(testEventListenerRegistry).toEqual({
        [TestEvent.uid]: [testEventListener2.listenerUid],
        [TestEvent2.uid]: [testEventListener3.listenerUid]
    });
    expect(testGlobalDispatchRegistry).toEqual({
        [TestEvent.uid]: [testEventListener2.listenerUid],
        [TestEvent2.uid]: [testEventListener3.listenerUid]
    });
    expect(testGlobalListenerRegistry).toEqual({
        [testEventListener2.listenerUid]: getEventListenerInfo(TestEvent.uid, true),
        [testEventListener3.listenerUid]: getEventListenerInfo(TestEvent2.uid, true)
    });
    TestEvent.clearAllDirectEvents();
    TestEvent2.clearAllDirectEvents();
    expect(testEventListenerRegistry).toEqual({});
    expect(testGlobalDispatchRegistry).toEqual({});
    expect(testGlobalListenerRegistry).toEqual({});
});

test('Test basic Event addEventListener', () => {

    class TestEvent extends Event {
        static defaultEventState = {
            stateVariable: "stateVariable"
        }
    }
    class TestEvent2 extends Event {
        static defaultEventState = {
            stateVariable: "stateVariable"
        }
    }
    TestEvent.addEventListener(null);
    const testEventListener = TestEvent.addEventListener(noop),
        testEventListener2 = TestEvent.addEventListener(noop),
        testEventListener3 = TestEvent2.addEventListener(noop);
    expect(testEventListener instanceof EventListener).toBe(true);
    expect(testEventListenerRegistry).toEqual({
        [TestEvent.uid]: [testEventListener.listenerUid, testEventListener2.listenerUid],
        [TestEvent2.uid]: [testEventListener3.listenerUid]
    });
    expect(testGlobalDispatchRegistry).toEqual({
        [TestEvent.uid]: [testEventListener.listenerUid, testEventListener2.listenerUid],
        [TestEvent2.uid]: [testEventListener3.listenerUid]
    });
    expect(testGlobalListenerRegistry).toEqual({
        [testEventListener.listenerUid]: getEventListenerInfo(TestEvent.uid),
        [testEventListener2.listenerUid]: getEventListenerInfo(TestEvent.uid),
        [testEventListener3.listenerUid]: getEventListenerInfo(TestEvent2.uid)
    });
    testEventListener.remove();
    expect(testEventListenerRegistry).toEqual({
        [TestEvent.uid]: [testEventListener2.listenerUid],
        [TestEvent2.uid]: [testEventListener3.listenerUid]
    });
    expect(testGlobalDispatchRegistry).toEqual({
        [TestEvent.uid]: [testEventListener2.listenerUid],
        [TestEvent2.uid]: [testEventListener3.listenerUid]
    });
    expect(testGlobalListenerRegistry).toEqual({
        [testEventListener2.listenerUid]: getEventListenerInfo(TestEvent.uid),
        [testEventListener3.listenerUid]: getEventListenerInfo(TestEvent2.uid)
    });
    TestEvent.clearAllDirectEvents();
    TestEvent2.clearAllDirectEvents();
    expect(testEventListenerRegistry).toEqual({});
    expect(testGlobalDispatchRegistry).toEqual({});
    expect(testGlobalListenerRegistry).toEqual({});
});

test('Test basic Event removeEventListener', () => {
    class TestEvent extends Event {
        static defaultEventState = {
            stateVariable: "stateVariable"
        }
    }
    class TestEvent2 extends Event {
        static defaultEventState = {
            stateVariable: "stateVariable"
        }
    }
    const testEventListener = TestEvent.onEventStateUpdated(noop);
    expect(testEventListener instanceof EventListener).toBe(true);

    expect(testEventListenerRegistry).toEqual({
        [TestEvent.uid]: [testEventListener.listenerUid]
    });
    expect(testGlobalDispatchRegistry).toEqual({
        [TestEvent.uid]: [testEventListener.listenerUid]
    });
    expect(testGlobalListenerRegistry).toEqual({
        [testEventListener.listenerUid]: getEventListenerInfo(TestEvent.uid, true)
    });

    TestEvent.removeEventListener(testEventListener);
    expect(testEventListenerRegistry).toEqual({});
    expect(testGlobalDispatchRegistry).toEqual({});
    expect(testGlobalListenerRegistry).toEqual({});

    const testEventListener2 = TestEvent2.addEventListener(noop);

    expect(testEventListenerRegistry).toEqual({
        [TestEvent2.uid]: [testEventListener2.listenerUid]
    });
    expect(testGlobalDispatchRegistry).toEqual({
        [TestEvent2.uid]: [testEventListener2.listenerUid]
    });
    expect(testGlobalListenerRegistry).toEqual({
        [testEventListener2.listenerUid]: getEventListenerInfo(TestEvent2.uid)
    });

    TestEvent.removeEventListener(testEventListener2);
    expect(testEventListenerRegistry).toEqual({
        [TestEvent2.uid]: [testEventListener2.listenerUid]
    });
    expect(testGlobalDispatchRegistry).toEqual({
        [TestEvent2.uid]: [testEventListener2.listenerUid]
    });
    expect(testGlobalListenerRegistry).toEqual({
        [testEventListener2.listenerUid]: getEventListenerInfo(TestEvent2.uid)
    });

    TestEvent2.removeEventListener(testEventListener2);
    expect(testEventListenerRegistry).toEqual({});
    expect(testGlobalDispatchRegistry).toEqual({});
    expect(testGlobalListenerRegistry).toEqual({});

});
test('Test Event-Seption exception', () => {
    class TestEvent extends Event {
        static defaultEventState = {
            stateVariable: "stateVariable"
        }
    }
    const eventListener = TestEvent.addEventListener(() => {
        (new TestEvent()).dispatch();
    });
    const dispatcher = new TestEvent();
    expect(dispatcher.dispatch.bind(dispatcher)).toThrowError(EventException);
    TestEvent.clearAllDirectEvents();
});

test('Test Event dispatch functionality', () => {
    class TestEvent extends Event {
        static defaultEventState = {
            stateVariable: "stateVariable"
        }
    }
    let standardCallback = jest.fn();
    let onEventStateUpdateCallback = jest.fn();
    const standardListener = TestEvent.addEventListener(standardCallback);
    const onUpdateListener = TestEvent.onEventStateUpdated(onEventStateUpdateCallback);

    const testDispatcher = new TestEvent();
    const testStateDispatcher = new TestEvent({stateVariable: "updatedStateVariable"});
    const testStateDispatcher2 = new TestEvent({stateVariable: "moreUpdatedStateVariable"});
    const testStateDispatcher3 = new TestEvent({stateVariable: "eventMoreUpdatedStateVariable"});
    const testStateDispatcher4 = new TestEvent({stateVariable: "finalEventMoreUpdatedStateVariable"});

    expect((new TestEvent()).dispatch().eventState).toEqual({
        stateVariable: "stateVariable"
    });
    expect(standardCallback).toHaveBeenCalled();
    expect(standardCallback).toBeCalledWith(testDispatcher);
    expect(onEventStateUpdateCallback).not.toHaveBeenCalled();


    expect(testStateDispatcher.dispatch().eventState).toEqual({
        stateVariable: "updatedStateVariable"
    });
    expect(standardCallback).toHaveBeenCalledTimes(2);
    expect(onEventStateUpdateCallback).toHaveBeenCalled();
    expect(onEventStateUpdateCallback).toBeCalledWith(testStateDispatcher);
    expect(onEventStateUpdateCallback).not.toBeCalledWith(testDispatcher);

    standardListener.suspend();
    onUpdateListener.suspend();
    testStateDispatcher2.dispatch();
    expect(standardCallback).toHaveBeenCalledTimes(2);
    expect(onEventStateUpdateCallback).toHaveBeenCalledTimes(1);

    standardListener.restore();
    onUpdateListener.restore();
    testStateDispatcher3.dispatch();
    expect(standardCallback).toHaveBeenCalledTimes(3);
    expect(onEventStateUpdateCallback).toHaveBeenCalledTimes(2);

    standardListener.remove();
    onUpdateListener.remove();
    standardListener.restore();
    onUpdateListener.restore();
    testStateDispatcher4.dispatch();
    expect(standardCallback).toHaveBeenCalledTimes(3);
    expect(onEventStateUpdateCallback).toHaveBeenCalledTimes(2);
});

test('Test basic Event functionality', () => {
    class TestEvent extends Event {
        static defaultEventState = {
            stateVariable: "stateVariable"
        }
    }
    const newTestEvent = new TestEvent({stateVariable: "updatedStateVariable"});

    expect(newTestEvent.uid).toEqual(__testGetCurrentUid());
    expect(newTestEvent.eventData).toEqual({stateVariable: "updatedStateVariable"});
    expect((newTestEvent).dispatch().eventState).toEqual({stateVariable: "updatedStateVariable"});
    expect(TestEvent.eventState).toEqual({stateVariable: "updatedStateVariable"});

    const newTestEvent2 = new TestEvent({stateVariable: "updatedStateVariableData"});
    expect(newTestEvent2.eventData).toEqual({stateVariable: "updatedStateVariableData"});
    expect(newTestEvent2.updateEventData()).toEqual(newTestEvent2);
    expect(newTestEvent2.updateEventData().eventData).toEqual({stateVariable: "updatedStateVariableData"});
    expect(newTestEvent2.updateEventData({stateVariable: null}).eventData).toEqual({stateVariable: null});
    expect((newTestEvent2).dispatch().eventState).toEqual({stateVariable: null});
    expect(TestEvent.eventState).toEqual({stateVariable: null});
});

test('Test basic Event Initial functionality [uid]', () => {
    class TestEvent extends Event {
        static defaultEventState = {
            stateVariable: "stateVariable"
        }
    }
    expect(TestEvent.uid).toEqual(__testGetCurrentUid());
});

test('Test basic Event Initial functionality [uid]', () => {
    class TestEvent extends Event {
        static defaultEventState = {
            stateVariable: "stateVariable"
        }
    }
    expect(TestEvent.eventState).toEqual({stateVariable: "stateVariable"});
});

test('Test immutable eventState and eventData', () => {
    class TestEvent extends Event {
        static defaultEventState = {
            stateVariable: "stateVariable"
        }
    }
    const stateUpdate = {
            stateVariable: "updatedStateVariable"
        },
        newEvent = new TestEvent(stateUpdate),
        newEvent2 = new TestEvent(stateUpdate);

    expect(TestEvent.eventState).toEqual(TestEvent.eventState);
    expect(newEvent.eventData).toEqual(newEvent.eventData);
    expect(newEvent.eventData).toEqual(newEvent2.eventData);

    expect(TestEvent.eventState).not.toBe(TestEvent.eventState);
    expect(newEvent.eventData).not.toBe(newEvent.eventData);
    expect(newEvent.eventData).not.toBe(newEvent2.eventData);

});

test('Test eventState separations', () => {
    class TestEvent extends Event {
        static defaultEventState = {
            stateVariable: "stateVariable"
        }
    }
    class TestEvent2 extends Event {
        static defaultEventState = {
            stateVariable: "stateVariable2"
        }
    }
    const
        newEvent = new TestEvent({
            stateVariable: "updatedStateVariable"
        }),
        newEvent2 = new TestEvent2({
            stateVariable: "updatedStateVariable2"
        });

    expect(TestEvent.eventState).not.toEqual(TestEvent2.eventState);
    expect(newEvent.eventData).not.toEqual(newEvent2.eventData);
    expect(newEvent.eventState).not.toEqual(newEvent2.eventState);

});

test('Test Extended Event constructor definitions', () => {
    class TestEvent extends Event {
        static defaultEventState = {
            stateVariable: "stateVariable"
        }
    }

    expect(TestEvent._isDispatching).toBe(undefined);
    expect(TestEvent._eventState).toBe(undefined);
    expect(TestEvent._uid).toBe(undefined);

    expect(TestEvent.removeEventListener).not.toBe(undefined);
    expect(TestEvent.addEventListener).not.toBe(undefined);
    expect(TestEvent.clearAllDirectEvents).not.toBe(undefined);
    expect(TestEvent.onEventStateUpdated).not.toBe(undefined);
    expect(TestEvent.dispatch).toBe(undefined);

    const newEvent = new TestEvent();

    expect(TestEvent._isDispatching).toBe(undefined);
    expect(TestEvent._eventState).toBe(undefined);
    expect(TestEvent._uid).toBe(undefined);

    expect(TestEvent.removeEventListener).not.toBe(undefined);
    expect(TestEvent.addEventListener).not.toBe(undefined);
    expect(TestEvent.clearAllDirectEvents).not.toBe(undefined);
    expect(TestEvent.onEventStateUpdated).not.toBe(undefined);
    expect(TestEvent.dispatch).toBe(undefined);

    newEvent.dispatch();

    expect(newEvent._isDispatching).toBe(undefined);
    expect(newEvent._eventState).toBe(undefined);
    expect(newEvent._uid).toBe(undefined);

    expect(newEvent.removeEventListener).toBe(undefined);
    expect(newEvent.addEventListener).toBe(undefined);
    expect(newEvent.clearAllDirectEvents).toBe(undefined);
    expect(newEvent.onEventStateUpdated).toBe(undefined);
    expect(newEvent.dispatch).not.toBe(undefined);

    TestEvent.addEventListener(noop);

    expect(TestEvent._isDispatching).toBe(undefined);
    expect(TestEvent._eventState).toBe(undefined);
    expect(TestEvent._uid).toBe(undefined);

    expect(TestEvent.removeEventListener).not.toBe(undefined);
    expect(TestEvent.addEventListener).not.toBe(undefined);
    expect(TestEvent.clearAllDirectEvents).not.toBe(undefined);
    expect(TestEvent.onEventStateUpdated).not.toBe(undefined);
    expect(TestEvent.dispatch).toBe(undefined);
});

test('Test Extended Event Instance definitions', () => {
    class TestEvent extends Event {
        static defaultEventState = {
            stateVariable: "stateVariable"
        }
    }
    const newEvent = new TestEvent();

    expect(newEvent._isDispatching).toBe(undefined);
    expect(newEvent._eventState).toBe(undefined);
    expect(newEvent._uid).toBe(undefined);

    expect(newEvent.removeEventListener).toBe(undefined);
    expect(newEvent.addEventListener).toBe(undefined);
    expect(newEvent.clearAllDirectEvents).toBe(undefined);
    expect(newEvent.onEventStateUpdated).toBe(undefined);
    expect(newEvent.dispatch).not.toBe(undefined);

    newEvent.dispatch();

    expect(newEvent._isDispatching).toBe(undefined);
    expect(newEvent._eventState).toBe(undefined);
    expect(newEvent._uid).toBe(undefined);

    expect(newEvent.removeEventListener).toBe(undefined);
    expect(newEvent.addEventListener).toBe(undefined);
    expect(newEvent.clearAllDirectEvents).toBe(undefined);
    expect(newEvent.onEventStateUpdated).toBe(undefined);
    expect(newEvent.dispatch).not.toBe(undefined);

    TestEvent.addEventListener(noop);

    expect(newEvent._isDispatching).toBe(undefined);
    expect(newEvent._eventState).toBe(undefined);
    expect(newEvent._uid).toBe(undefined);

    expect(newEvent.removeEventListener).toBe(undefined);
    expect(newEvent.addEventListener).toBe(undefined);
    expect(newEvent.clearAllDirectEvents).toBe(undefined);
    expect(newEvent.onEventStateUpdated).toBe(undefined);
    expect(newEvent.dispatch).not.toBe(undefined);
});