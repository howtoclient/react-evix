/**
 * Created by vladi on 25-Jan-17.
 */
import EventListener from './EventListener';
import {
    dispatchEvent,
    getUid,
    BasicEvent,
    addEventListener,
    removeEventListenersByType,
    filterRemovedListeners,
    isEventStateUpdated,
    EventException,
} from './EventsControl';
const ListenerRegistry = {},
    updateEventList = (uid) => {
        ListenerRegistry[uid] =
            filterRemovedListeners(
                ListenerRegistry[uid] || []
            );
    };
export const __getListenerRegistry = () => typeof __JEST_TEST__ != 'undefined' && ListenerRegistry;
export default class Event extends BasicEvent {
    constructor(eventData) {
        super();
        //i don't want to keep the event prototype or constructor for comparing i will create unique id per constructor
        this.constructor.prototype._uid =
            this.constructor.prototype._uid || getUid();
        this.constructor.prototype._eventState =
            this.constructor.prototype._eventState || {...(this.constructor.defaultEventState || {})};
        this.constructor.prototype._isDispatching =
            this.constructor.prototype._isDispatching === undefined ? false : this.constructor.prototype._isDispatching;
        this._data = {...(eventData || {})};
        //remove references from Instances
        this.clearAllDirectEvents =
            this.onEventStateUpdated =
                this.removeEventListener =
                    this.addEventListener =
                        this._isDispatching =
                            this._eventState =
                                this._uid = undefined;
    }

    get uid() {
        return this.constructor.prototype._uid;
    }

    get eventState() {
        return {...this.constructor.prototype._eventState};
    }

    get eventData() {
        return {...this._data};
    }

    dispatch() {
        if (this.constructor.prototype._isDispatching) {
            throw new EventException("Event-ception - (Event fired withing itself) detected at:" + this.constructor.name);
        }
        this.constructor.prototype._isDispatching = true;
        const eventStateUpdate = this._data && isEventStateUpdated(this.constructor.prototype._eventState, this._data);
        if (eventStateUpdate) {
            this.constructor.prototype._eventState =
                Object.assign(this.constructor.prototype._eventState, this._data);
        }
        dispatchEvent(this, eventStateUpdate);
        this.constructor.prototype._isDispatching = false;
        return this;
    }

    static removeEventListener(eventListener) {
        if (typeof eventListener !== 'object'
            || !EventListener.isPrototypeOf(eventListener)
            || !ListenerRegistry[this.uid]
            || ListenerRegistry[this.uid].indexOf(eventListener.listenerUid) == -1) {
            return;
        }
        eventListener.remove();
    }

    static clearAllDirectEvents() {
        removeEventListenersByType(
            this.uid, ListenerRegistry[this.uid] || []
        );
        delete ListenerRegistry[this.uid];
    }

    static onEventStateUpdated(handler) {
        return this.addEventListener(handler, true);
    }

    static addEventListener(handler, onStateUpdated) {
        if (!handler) {
            return;
        }
        const listenerUid = addEventListener({
            _onStateUpdate: !!onStateUpdated,
            _active: true,
            _eventUid: this.uid,
            _handler: handler
        });
        ListenerRegistry[this.uid] = ListenerRegistry[this.uid] || [];
        ListenerRegistry[this.uid].push(listenerUid);
        return new EventListener(
            listenerUid,
            updateEventList.bind(null, this.uid)
        );
    }

    static get eventState() {
        return {...(this.prototype._eventState || (new this()).eventState)};
    }

    static get uid() {
        return this.prototype._uid || (new this()).uid;
    }
}



