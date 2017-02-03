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
});