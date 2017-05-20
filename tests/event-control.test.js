/**
 * Created by vladi on 05-Feb-17.
 */
import Event from "../src/Event"
import {
    __testGetCurrentUid,
    __testGetCurrentListenerRegistry,
    __testGetCurrentDispatchRegistry,
    EventException,
    getUid,
    listenerExists,
    dispatchRegistryExists,
    isListenerSuspended,
    setActiveState,
    removeListener,
    getListenerType,
    filterRemovedListeners,
    isEventStateUpdated,
    updateDispatcherRegistryByType,
    addEventListener,
    canFireEventHandler,
    dispatchEvent,
    removeEventListenersByType,
    removeEventListenerById,
    suspendEventListenerById,
    restoreEventListenerById,
    systemSuspendEventListenerById,
    systemRestoreEventListenerById,
    DEFAULT_FILTER
} from '../src/EventsControl';
const testGlobalListenerRegistry = __testGetCurrentListenerRegistry(),
    testGlobalDispatchRegistry = __testGetCurrentDispatchRegistry(),
    getEventListenerInfo = (uid, onStateUpdate, active, handler) => ({
        _onStateUpdate: !!onStateUpdate,
        _active: !!active,
        _eventUid: uid,
        _handler: handler === undefined ? noop : handler,
        _isFiltered: false,
        _filters: {}
    });
const noop = () => undefined;
class TestFakeEvent {

}
class TestEvent extends Event {
    defaultEventState = {}
}
class TestEvent3 extends Event {
    defaultEventState = {}
}
test('initial tests', () => {
    expect(__testGetCurrentUid()).toEqual(0);
    expect(__testGetCurrentListenerRegistry()).toEqual({});
    expect(__testGetCurrentDispatchRegistry()).toEqual({});
});

test('check basic functionality', () => {
    expect(getUid()).toEqual(1);
    expect(getUid()).toEqual(2);


    expect(isEventStateUpdated({a: 1}, {a: 2})).toEqual(true);
    expect(isEventStateUpdated({a: 1}, {b: 1})).toEqual(true);
    expect(isEventStateUpdated({a: 1}, {a: 2, b: 2})).toEqual(true);
    expect(isEventStateUpdated({a: 1}, {a: 1})).toEqual(false);

});

test('check listeners control basic add/remove/exists/suspended functionality', () => {
    const eventListener = TestEvent.addEventListener(noop);
    const eventListener2 = TestEvent.addEventListener(noop);
    const listenersList = [eventListener.listenerUid, eventListener2.listenerUid];
    const expectBeforeRemove = [eventListener.listenerUid, eventListener2.listenerUid];
    const expectedAfterRemove = [eventListener2.listenerUid];

    expect(listenersList).not.toBe(expectBeforeRemove);
    expect(listenersList).toEqual(expectBeforeRemove);
    expect(eventListener.listenerUid).not.toEqual(eventListener2.listenerUid);
    expect(getListenerType(-1)).toEqual(false);

    expect(listenerExists(eventListener.listenerUid)).toEqual(true);
    expect(isListenerSuspended(eventListener.listenerUid)).toEqual(false);
    expect(dispatchRegistryExists(TestEvent.uid)).toEqual(true);
    expect(getListenerType(eventListener.listenerUid)).toEqual(TestEvent.uid);
    expect(filterRemovedListeners(listenersList)).toEqual(expectBeforeRemove);

    eventListener.suspend();
    expect(listenerExists(eventListener.listenerUid)).toEqual(true);
    expect(isListenerSuspended(eventListener.listenerUid)).toEqual(true);
    expect(dispatchRegistryExists(TestEvent.uid)).toEqual(true);
    expect(getListenerType(eventListener.listenerUid)).toEqual(TestEvent.uid);
    expect(filterRemovedListeners(listenersList)).toEqual(expectBeforeRemove);

    eventListener.remove();
    expect(listenerExists(eventListener.listenerUid)).toEqual(false);
    expect(isListenerSuspended(eventListener.listenerUid)).toEqual(true);
    expect(dispatchRegistryExists(TestEvent.uid)).toEqual(true);
    expect(filterRemovedListeners(listenersList)).toEqual(expectedAfterRemove);
    expect(listenerExists(eventListener2.listenerUid)).toEqual(true);
    expect(isListenerSuspended(eventListener2.listenerUid)).toEqual(false);

    eventListener2.remove();
    expect(dispatchRegistryExists(TestEvent.uid)).toEqual(false);
    expect(filterRemovedListeners(listenersList)).toEqual([]);

    const listener = TestEvent.addEventListener(noop);
    const listener2 = TestEvent.addEventListener(noop);
    const listener3 = TestEvent3.addEventListener(noop);
    const eventListenerList = [listener.listenerUid, listener2.listenerUid, listener3.listenerUid];

    removeEventListenersByType(TestEvent.uid);
    expect(filterRemovedListeners(eventListenerList)).toEqual(eventListenerList);

    removeEventListenersByType(TestEvent.uid, eventListenerList);

    expect(filterRemovedListeners(eventListenerList)).toEqual([listener3.listenerUid]);

    expect(testGlobalListenerRegistry[listener.listenerUid]).toBe(undefined);
    expect(testGlobalListenerRegistry[listener2.listenerUid]).toBe(undefined);
    expect(testGlobalListenerRegistry[listener3.listenerUid]).not.toBe(undefined);

    listener3.remove();
});

test('helper functions test', () => {
    const {listenerUid} = TestEvent.addEventListener(noop);
    expect(testGlobalDispatchRegistry[TestEvent.uid]).toEqual([listenerUid]);
    expect(testGlobalListenerRegistry[listenerUid]).toEqual(getEventListenerInfo(TestEvent.uid, false, true));
    expect(testGlobalDispatchRegistry[listenerUid]).toBe(undefined);

    removeEventListenerById(-1);
    expect(testGlobalListenerRegistry[listenerUid]).not.toBe(undefined)

    setActiveState(listenerUid, false);
    expect(testGlobalListenerRegistry[listenerUid]._active).toBe(false);


    removeListener(listenerUid);
    expect(testGlobalListenerRegistry[listenerUid]).toBe(undefined);

    expect(testGlobalDispatchRegistry[TestEvent.uid]).toEqual([listenerUid]);
    updateDispatcherRegistryByType(-1);
    expect(testGlobalDispatchRegistry[TestEvent.uid]).toEqual([listenerUid]);
    updateDispatcherRegistryByType(TestEvent.uid);
    expect(testGlobalDispatchRegistry[TestEvent.uid]).toBe(undefined);

    const listener = TestEvent.addEventListener(noop);
    removeEventListenerById(listener.listenerUid);
    expect(testGlobalListenerRegistry[listener.listenerUid]).toBe(undefined);
    expect(testGlobalDispatchRegistry[TestEvent.uid]).toBe(undefined);

    let testInfo = getEventListenerInfo(TestEvent.uid, false, true);
    let testInfoUpdate = getEventListenerInfo(TestEvent.uid, true, true);

    expect(canFireEventHandler(testInfo, false, DEFAULT_FILTER)).toBe(true);
    expect(canFireEventHandler(testInfoUpdate, false, DEFAULT_FILTER)).toBe(false);

    expect(canFireEventHandler(testInfo, true, DEFAULT_FILTER)).toBe(true);
    expect(canFireEventHandler(testInfoUpdate, true, DEFAULT_FILTER)).toBe(true);
});

test('test suspend/restore/systemSuspend/systemRestore', () => {
    const {listenerUid} = TestEvent.addEventListener(noop);
    expect(testGlobalListenerRegistry[listenerUid]._active).toBe(true);

    suspendEventListenerById(listenerUid);
    expect(testGlobalListenerRegistry[listenerUid]._active).toBe(false);

    restoreEventListenerById(listenerUid);
    expect(testGlobalListenerRegistry[listenerUid]._active).toBe(true);

    systemSuspendEventListenerById(listenerUid);
    expect(testGlobalListenerRegistry[listenerUid]._active).toBe(null);

    systemRestoreEventListenerById(listenerUid);
    expect(testGlobalListenerRegistry[listenerUid]._active).toBe(true);

    suspendEventListenerById(listenerUid);
    systemRestoreEventListenerById(listenerUid);
    expect(testGlobalListenerRegistry[listenerUid]._active).toBe(false);
    removeEventListenerById(listenerUid);
});

test('test add and dispatch functionality', () => {
    expect(testGlobalListenerRegistry).toEqual({});
    expect(testGlobalDispatchRegistry).toEqual({});

    let eventListenerActiveCb = jest.fn();
    let eventListenerActiveUpdateCb = jest.fn();
    let eventListenerInactiveCb = jest.fn();
    let eventListenerInactiveUpdateCb = jest.fn();
    let otherEventListenerActiveCb = jest.fn();

    const eventListenerActive = addEventListener(getEventListenerInfo(TestEvent.uid, false, true, eventListenerActiveCb));
    const eventListenerActiveUpdate = addEventListener(getEventListenerInfo(TestEvent.uid, true, true, eventListenerActiveUpdateCb));
    const eventListenerInactive = addEventListener(getEventListenerInfo(TestEvent.uid, false, false, eventListenerInactiveCb));
    const eventListenerInactiveUpdate = addEventListener(getEventListenerInfo(TestEvent.uid, true, false, eventListenerInactiveUpdateCb));
    const otherEventListenerActive = addEventListener(getEventListenerInfo(TestEvent3.uid, false, true, otherEventListenerActiveCb));

    expect(addEventListener(getEventListenerInfo(TestEvent.uid, false, true, null))).toBe(null);

    dispatchEvent(new TestFakeEvent());
    expect(eventListenerActiveCb).not.toHaveBeenCalled();
    expect(eventListenerActiveUpdateCb).not.toHaveBeenCalled();
    expect(eventListenerInactiveCb).not.toHaveBeenCalled();
    expect(eventListenerInactiveUpdateCb).not.toHaveBeenCalled();
    expect(otherEventListenerActiveCb).not.toHaveBeenCalled();

    dispatchEvent(new TestEvent3());
    expect(eventListenerActiveCb).not.toHaveBeenCalled();
    expect(eventListenerActiveUpdateCb).not.toHaveBeenCalled();
    expect(eventListenerInactiveCb).not.toHaveBeenCalled();
    expect(eventListenerInactiveUpdateCb).not.toHaveBeenCalled();
    expect(otherEventListenerActiveCb).toHaveBeenCalled();

    dispatchEvent(new TestEvent());
    expect(eventListenerActiveCb).toHaveBeenCalled();
    expect(eventListenerActiveUpdateCb).not.toHaveBeenCalled();
    expect(eventListenerInactiveCb).not.toHaveBeenCalled();
    expect(eventListenerInactiveUpdateCb).not.toHaveBeenCalled();
    expect(otherEventListenerActiveCb).toHaveBeenCalledTimes(1);

    dispatchEvent(new TestEvent(), true);
    expect(eventListenerActiveCb).toHaveBeenCalledTimes(2);
    expect(eventListenerActiveUpdateCb).toHaveBeenCalled();
    expect(eventListenerInactiveCb).not.toHaveBeenCalled();
    expect(eventListenerInactiveUpdateCb).not.toHaveBeenCalled();
    expect(otherEventListenerActiveCb).toHaveBeenCalledTimes(1);
});

test('test dispatch-seption exeption', () => {
    expect(new EventException("test")).toEqual({message: "test", name: "EventException"});

});