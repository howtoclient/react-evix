/**
 * Created by vladi on 05-Feb-17.
 */
import {
    __testGetCurrentUid,
    __testGetCurrentListenerRegistry,
    __testGetCurrentDispatchRegistry
} from '../src/EventsControl';
const noop = () => undefined;

test('initial tests', () => {
    expect(__testGetCurrentUid()).toEqual(0);
    expect(__testGetCurrentListenerRegistry()).toEqual({});
    expect(__testGetCurrentDispatchRegistry()).toEqual({});
});