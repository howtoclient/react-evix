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
const getTestRegisty = (isFiltered, filters) => {
    return {
        _active: true,
        _eventUid: 1,
        _filters: filters,
        _handler: noop,
        _isFiltered: isFiltered,
        _onStateUpdate: false,
    }
};
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

    const eventListener = new EventListener();
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

test('test Filtering functionality', () => {
    const eventListener = TestEvent.addEventListener(noop);
    expect(__testGetCurrentListenerRegistry()).toEqual({"3": getTestRegisty(false, {})});


    eventListener.filter("test");
    expect(__testGetCurrentListenerRegistry()).toEqual({
        "3": getTestRegisty(true, {
            test: true
        })
    });
    eventListener.filter("test2");
    expect(__testGetCurrentListenerRegistry()).toEqual({
        "3": getTestRegisty(true, {
            test: true,
            test2: true,
        })
    });

    eventListener.unFilter("test2");
    eventListener.unFilter("test3");
    expect(__testGetCurrentListenerRegistry()).toEqual({
        "3": getTestRegisty(true, {
            test: true
        })
    });

    eventListener.unFilter("test");
    expect(__testGetCurrentListenerRegistry()).toEqual({"3": getTestRegisty(false, {})});

    eventListener.filter(["test", "test2"]);
    expect(__testGetCurrentListenerRegistry()).toEqual({
        "3": getTestRegisty(true, {
            test: true,
            test2: true,
        })
    });

    eventListener.filter(["test3", "test4"]);
    expect(__testGetCurrentListenerRegistry()).toEqual({
        "3": getTestRegisty(true, {
            test: true,
            test2: true,
            test3: true,
            test4: true,
        })
    });

    eventListener.unFilter(["test", "test4", "test5"]);
    expect(__testGetCurrentListenerRegistry()).toEqual({
        "3": getTestRegisty(true, {
            test2: true,
            test3: true
        })
    });

    eventListener.unFilter();
    expect(__testGetCurrentListenerRegistry()).toEqual({"3": getTestRegisty(false, {})});

    eventListener.filter(["test", "test2"]).unFilter(["test", "test2","test3"]);
    expect(__testGetCurrentListenerRegistry()).toEqual({"3": getTestRegisty(false, {})});
});