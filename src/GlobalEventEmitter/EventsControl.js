/**
 * Created by vladi on 27-Jan-17.
 */
import Event from "./Event";
let listenerRegistry = {};
let dispatchRegistry = {};
let uid = 1;

export const
    getUid = ()=> ++uid,
    listenerExists = (listenerUid)=> !!listenerRegistry[listenerUid],
    dispatchRegistryExists = (eventUid)=> !!dispatchRegistry[eventUid],
    isListenerSuspended = (listenerUid)=> !listenerRegistry[listenerUid] || !listenerRegistry[listenerUid]._active,
    setActiveState = (listenerUid, newState)=> (listenerRegistry[listenerUid]._active = newState),
    removeListener = listenerUid => delete listenerRegistry[listenerUid],
    getListenerType = listenerUid => listenerRegistry[listenerUid]._eventUid,
    filterRemovedListeners = listenerList => listenerList.filter(listenerUid => listenerExists(listenerUid)),
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
    dispatchEvent = event => {
        if (!Event.isPrototypeOf(event) || !dispatchRegistryExists(event._uid)) return;
        for (var i = 0; i < dispatchRegistry[event._uid].length; i++) {
            const listenerUid = dispatchRegistry[event._uid][i];
            !isListenerSuspended(listenerUid) && listenerRegistry[listenerUid]._handler(event);
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
        removeListener(listenerUid);
        updateDispatcherRegistryByType(getListenerType(listenerUid));
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
