/**
 * Created by vladi on 27-Jan-17.
 */
let listenerRegistry = {};
let dispatchRegistry = {};
let uid = 1;

export class BasicEvent {
}
export const
    getUid = ()=> ++uid,
    listenerExists = (listenerUid)=> !!listenerRegistry[listenerUid],
    dispatchRegistryExists = (eventUid)=> !!dispatchRegistry[eventUid],
    isListenerSuspended = (listenerUid)=> !listenerRegistry[listenerUid] || !listenerRegistry[listenerUid]._active,
    setActiveState = (listenerUid, newState)=> (listenerRegistry[listenerUid]._active = newState),
    removeListener = listenerUid => delete listenerRegistry[listenerUid],
    getListenerType = listenerUid => listenerRegistry[listenerUid]._eventUid,
    filterRemovedListeners = listenerList => listenerList.filter(listenerUid => listenerExists(listenerUid)),
    isEventStateUpdated = (eventState, data) => {
        const dataKeys = Object.keys(data);
        return dataKeys && dataKeys.some(
                key => (!eventState[key] || eventState[key] !== data[key])
            );
    },
    updateDispatcherRegistryByType = (eventUid)=> {
        if (!dispatchRegistryExists(eventUid)) return;
        dispatchRegistry[eventUid] = dispatchRegistry[eventUid].filter(
            listenerUid => listenerExists(listenerUid)
        )
    },
    addEventListener = (eventInfo)=> {
        const eventUid = eventInfo._eventUid,
            listenerUid = getUid();
        listenerRegistry[listenerUid] = eventInfo;
        dispatchRegistry[eventUid] = dispatchRegistry[eventUid] || [];
        dispatchRegistry[eventUid].push(listenerUid);
        return listenerUid;
    },
    canFireEventHandler = (stateUpdated, listenerInfo) => {
        return listenerInfo._active && (stateUpdated || !listenerInfo._onStateUpdate);
    },
    dispatchEvent = (event, stateUpdated = false) => {
        if (!BasicEvent.isPrototypeOf(event.constructor) || !dispatchRegistryExists(event.uid)) {
            return;
        }
        for (let i = 0; i < dispatchRegistry[event.uid].length; i++) {
            const listenerInfo = listenerRegistry[dispatchRegistry[event.uid][i]];
            listenerInfo && canFireEventHandler(listenerInfo) && listenerInfo._handler(event);
        }
    },
    removeEventListenersByType = (eventUid, listenersList)=> {
        if (dispatchRegistryExists(eventUid)) {
            for (var i = 0; i < listenersList.length; i++) {
                removeListener(listenersList[i]);
            }
            updateDispatcherRegistryByType(eventUid);
        }
    },
    removeEventListenerById = (listenerUid) => {
        if (!listenerExists(listenerUid)) {
            return false;
        }
        const eventUid = getListenerType(listenerUid);
        removeListener(listenerUid);
        updateDispatcherRegistryByType(eventUid);
        return true;
    },
    suspendEventListenerById = (listenerUid) => {
        listenerExists(listenerUid) && setActiveState(listenerUid, false);
    },
    restoreEventListenerById = (listenerUid)=> {
        listenerExists(listenerUid) && setActiveState(listenerUid, true);
    },
    systemSuspendEventListenerById = (listenerUid) => {
        listenerExists(listenerUid) && listenerRegistry[listenerUid]._active === true && setActiveState(listenerUid, null);
        return true;
    },
    systemRestoreEventListenerById = (listenerUid)=> {
        listenerExists(listenerUid) && listenerRegistry[listenerUid]._active === null && setActiveState(listenerUid, true);
        return true;
    };

