/**
 * Created by vladi on 04-Feb-17.
 */
import Event, {__testGetEventListenerRegistry} from '../src/Event';
import EventListener from '../src/EventListener';
import {
    __testGetCurrentUid,
    __testGetCurrentListenerRegistry,
    __testGetCurrentDispatchRegistry
} from '../src/EventsControl';
const noop = () => undefined;
class TestEvent extends Event {
    static defaultEventState = {
        stateVariable: "stateVariable"
    }
}

test('initial tests', () => {
    expect(__testGetCurrentUid()).toEqual(0);
    expect(__testGetEventListenerRegistry()).toEqual({});
    expect(__testGetCurrentListenerRegistry()).toEqual({});
    expect(__testGetCurrentDispatchRegistry()).toEqual({});
});

test('test EventListener defenitions', () => {
    const eventListener = TestEvent.addEventListener(noop);
    expect(eventListener instanceof EventListener).toBe(true);
    expect(eventListener.remove).not.toEqual(undefined);
    expect(eventListener.suspend).not.toEqual(undefined);
    expect(eventListener.restore).not.toEqual(undefined);
    expect(eventListener.isSuspended).not.toEqual(undefined);
    expect(eventListener.isRemoved).not.toEqual(undefined);
});

test('test EventListener functionality', () => {
    const eventListener = TestEvent.addEventListener(noop);
    expect(eventListener instanceof EventListener).toBe(true);
    expect(eventListener.isSuspended()).toEqual(false);
    expect(eventListener.isRemoved()).toEqual(false);

    eventListener.suspend();
    expect(eventListener.isSuspended()).toEqual(true);
    expect(eventListener.isRemoved()).toEqual(false);

    eventListener.restore();
    expect(eventListener.isSuspended()).toEqual(false);
    expect(eventListener.isRemoved()).toEqual(false);

    eventListener.remove();
    expect(eventListener.isSuspended()).toEqual(true);
    expect(eventListener.isRemoved()).toEqual(true);

    eventListener.suspend();
    expect(eventListener.isSuspended()).toEqual(true);
    expect(eventListener.isRemoved()).toEqual(true);

    eventListener.restore();
    expect(eventListener.isSuspended()).toEqual(true);
    expect(eventListener.isRemoved()).toEqual(true);
});