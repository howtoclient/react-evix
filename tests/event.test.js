/**
 * Created by vladi on 02-Feb-17.
 */

import Event from '../src/Event';
import EventListener from '../src/EventListener';
import {
    __testGetCurrentUid,
    __testGetCurrentListenerRegistry,
    __testGetCurrentDispatchRegistry
} from '../src/EventsControl';
const noop = () => undefined;

test('Test Extended Event addEventListener and removeEventListener', () => {
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
    const testEventListener = TestEvent.addEventListener(noop);
    expect(testEventListener instanceof EventListener).toBe(true);

    const testEventListener2 = TestEvent2.addEventListener(noop);


    console.log(__testGetCurrentListenerRegistry());
    console.log(__testGetCurrentDispatchRegistry());
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

test('Test eventState saparations', () => {
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

    expect(TestEvent.__listenersList).toBe(undefined);
    expect(TestEvent._isDispatching).toBe(undefined);
    expect(TestEvent._eventState).toBe(undefined);
    expect(TestEvent._uid).toBe(undefined);

    expect(TestEvent.removeEventListener).not.toBe(undefined);
    expect(TestEvent.addEventListener).not.toBe(undefined);
    expect(TestEvent.clearAllDirectEvents).not.toBe(undefined);
    expect(TestEvent.onEventStateUpdated).not.toBe(undefined);
    expect(TestEvent.dispatch).toBe(undefined);

    const newEvent = new TestEvent();

    expect(TestEvent.__listenersList).toBe(undefined);
    expect(TestEvent._isDispatching).toBe(undefined);
    expect(TestEvent._eventState).toBe(undefined);
    expect(TestEvent._uid).toBe(undefined);

    expect(TestEvent.removeEventListener).not.toBe(undefined);
    expect(TestEvent.addEventListener).not.toBe(undefined);
    expect(TestEvent.clearAllDirectEvents).not.toBe(undefined);
    expect(TestEvent.onEventStateUpdated).not.toBe(undefined);
    expect(TestEvent.dispatch).toBe(undefined);

    TestEvent.addEventListener(noop);

    expect(TestEvent.__listenersList).not.toBe(undefined);
    expect(TestEvent._isDispatching).toBe(undefined);
    expect(TestEvent._eventState).toBe(undefined);
    expect(TestEvent._uid).toBe(undefined);

    console.error("MOVE __listenersList TO FOLLOW OBJECT!")
    expect(TestEvent.removeEventListener).toEqual([__testGetCurrentUid()]);
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

    expect(newEvent.__listenersList).toBe(undefined);
    expect(newEvent._isDispatching).toBe(undefined);
    expect(newEvent._eventState).toBe(undefined);
    expect(newEvent._uid).toBe(undefined);

    expect(newEvent.removeEventListener).toBe(undefined);
    expect(newEvent.addEventListener).toBe(undefined);
    expect(newEvent.clearAllDirectEvents).toBe(undefined);
    expect(newEvent.onEventStateUpdated).toBe(undefined);
    expect(newEvent.dispatch).not.toBe(undefined);

    TestEvent.addEventListener(noop);

    expect(newEvent.__listenersList).toBe(undefined);
    expect(newEvent._isDispatching).toBe(undefined);
    expect(newEvent._eventState).toBe(undefined);
    expect(newEvent._uid).toBe(undefined);

    expect(newEvent.removeEventListener).toBe(undefined);
    expect(newEvent.addEventListener).toBe(undefined);
    expect(newEvent.clearAllDirectEvents).toBe(undefined);
    expect(newEvent.onEventStateUpdated).toBe(undefined);
    expect(newEvent.dispatch).not.toBe(undefined);
});