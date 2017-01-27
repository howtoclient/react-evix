/**
 * Created by vladi on 27-Jan-17.
 */
import {
    removeEventListenerById,
    suspendEventListenerById,
    restoreEventListenerById,
    isListenerSuspended,
    listenerExists
} from './EventsControl';
export default class EventListener {
    constructor(listenerUid) {
        this.listenerUid = listenerUid;
    }

    remove() {
        removeEventListenerById(this.uid);
    }

    suspend() {
        suspendEventListenerById(this.uid);
    }

    restore() {
        restoreEventListenerById(this.uid);
    }

    isSuspended() {
        return isListenerSuspended(this.uid);
    }

    isRemoved() {
        return !listenerExists(this.uid);
    }
}