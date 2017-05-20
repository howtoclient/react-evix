/**
 * Created by vladi on 27-Jan-17.
 */
import {
    removeEventListenerById,
    suspendEventListenerById,
    restoreEventListenerById,
    isListenerSuspended,
    listenerExists,
    addTypeFilter,
    addTypeFilters,
    resetTypeFilter,
    removeTypeFilter,
    removeTypeFilters
} from './EventsControl';
export default class EventListener {
    constructor(listenerUid, onRemoveCallback) {
        this.listenerUid = listenerUid;
        this._onRemoveCallback = onRemoveCallback;
    }

    filter(mixed) {
        if (mixed) {
            Array.isArray(mixed) ? addTypeFilters(this.listenerUid, mixed) : addTypeFilter(this.listenerUid, mixed)
        }
        return this;
    }

    unFilter(mixed) {
        if (mixed) {
            Array.isArray(mixed) ? removeTypeFilters(this.listenerUid, mixed) : removeTypeFilter(this.listenerUid, mixed)
        } else {
            resetTypeFilter(this.listenerUid);
        }
        return this;
    }

    remove() {
        if (this.isRemoved()) {
            return;
        }
        removeEventListenerById(this.listenerUid);
        this._onRemoveCallback && this._onRemoveCallback();
        return this;
    }

    suspend() {
        suspendEventListenerById(this.listenerUid);
        return this;
    }

    restore() {
        restoreEventListenerById(this.listenerUid);
        return this;
    }

    isSuspended() {
        return isListenerSuspended(this.listenerUid);
    }

    isRemoved() {
        return !listenerExists(this.listenerUid);
    }
}