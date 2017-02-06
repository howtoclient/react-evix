/**
 * Created by vladi on 05-Feb-17.
 */
import Event from "../src/Event"
import {
    __testGetCurrentUid,
    __testGetCurrentListenerRegistry,
    __testGetCurrentDispatchRegistry,
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
    systemRestoreEventListenerById
} from '../src/EventsControl';
const testGlobalListenerRegistry = __testGetCurrentListenerRegistry(),
    testGlobalDispatchRegistry = __testGetCurrentDispatchRegistry(),
    getEventListenerInfo = (uid, onStateUpdate) => ({
        _onStateUpdate: !!onStateUpdate,
        _active: true,
        _eventUid: uid,
        _handler: noop
    });
const noop = () => undefined;
class TestEvent extends Event {
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
});