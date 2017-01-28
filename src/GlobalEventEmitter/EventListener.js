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
    constructor(listenerUid, onRemoveCallback) {
        this.listenerUid = listenerUid;
        this._onRemoveCallback = onRemoveCallback || (()=>undefined);
    }

    remove() {
        if (this.isRemoved()) {
            return;
        }
        removeEventListenerById(this.listenerUid);
        this._onRemoveCallback();
        this.onRemoved(this);
        this.onAction(this);
    }

    suspend() {
        suspendEventListenerById(this.listenerUid);
        this.onSuspend(this);
        this.onAction(this);
    }

    restore() {
        restoreEventListenerById(this.listenerUid);
        this.onRestore(this);
        this.onAction(this);
    }

    isSuspended() {
        return isListenerSuspended(this.listenerUid);
    }

    isRemoved() {
        return !listenerExists(this.listenerUid);
    }

    onSuspend() {
    }

    onRestore() {
    }

    onRemoved() {
    }

    onAction() {

    }
}