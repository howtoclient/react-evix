/**
 * Created by vladi on 25-Jan-17.
 */

import {dispatchEvent, getUid} from './EventsControl';

export default class Event {
    constructor(eventData) {
        //i don't want to keep the event prototype or constructor for comparing i will create unique id per constructor
        this.constructor.prototype._uid =
            this.constructor.prototype._uid || getUid();
        this.constructor.prototype._eventState =
            this.constructor.prototype._eventState || {...(this.constructor.defaultEventState || {})};
        this._data = {...(eventData || {})};
        this._eventState = this._uid = undefined;
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
        this.constructor.prototype._eventState = Object.assign(this.constructor.prototype._eventState, this._data);
        dispatchEvent(this);
    }

    static get eventState() {
        return this.prototype._eventState || (new this()).eventState;
    }

    static get uid() {
        return this.prototype._uid || (new this()).uid;
    }
}



