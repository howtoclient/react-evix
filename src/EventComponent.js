/**
 * Created by Vladimirvl on 2017-01-25.
 */
import React from 'react';
import {
    BasicEvent,
    addEventListener,
    listenerExists,
    removeEventListenersByType,
    systemSuspendEventListenerById,
    systemRestoreEventListenerById
} from './EventsControl';
import EventListener from './EventListener';
const filterRemovedEvents = (componentListenersList) => {
    return componentListenersList.filter(listener => listenerExists(listener.listenerUid));
};

export default class EventComponent extends React.Component {
    constructor(props) {
        super(props);
        this.__mounted = false;
        this.__listenersList = [];
        this.__stateTrackers = {};
        this.__componentWillUnmount = this.componentWillUnmount;
        this.__componentDidMount = this.componentDidMount;
        this.componentWillUnmount = this._componentWillUnmount;
        this.componentDidMount = this._componentDidMount;
    }

    set trackEvents(events) {
        events && events.length && events.forEach(
            event => this.trackEventState(event)
        )
    }

    get trackEvents() {
    }

    _componentDidMount() {
        this.__mounted = true;
        this.__listenersList = filterRemovedEvents(this.__listenersList).filter(
            ({suspendOnUnMount, listenerUid}) => (
                !suspendOnUnMount || systemRestoreEventListenerById(listenerUid)
            )
        );
        for (let key in this.__stateTrackers) {
            this.__stateTrackers[key].restore();
        }
        this.__componentDidMount && this.__componentDidMount();
    }

    _componentWillUnmount() {
        this.__mounted = false;
        this.__listenersList = filterRemovedEvents(this.__listenersList).filter(
            ({suspendOnUnMount, listenerUid}) => (
                !suspendOnUnMount || systemSuspendEventListenerById(listenerUid)
            )
        );
        for (let key in this.__stateTrackers) {
            this.__stateTrackers[key].suspend();
        }
        this.__componentWillUnmount && this.__componentWillUnmount();
    }

    unTrackAll() {
        for (let key in this.__stateTrackers) {
            this.__stateTrackers[key].remove();
        }
        this.__stateTrackers = {};
    }

    unTrackEventState(event) {
        if (BasicEvent.isPrototypeOf(event) && this.__stateTrackers[event.uid]) {
            this.__stateTrackers[event.uid].remove();
            delete this.__stateTrackers[event.uid];
        }
    }

    trackEventState(event) {
        if (!BasicEvent.isPrototypeOf(event) || this.__stateTrackers[event.uid]) {
            return;
        }
        this.__stateTrackers[event.uid] = new EventListener(
            addEventListener({
                _onStateUpdate: true,
                _active: this.__mounted,
                _eventUid: event.uid,
                _handler: () => this.forceUpdate()
            })
        )
    }

    onEventStateUpdated(event, handler, suspendOnUnMount = false) {
        return this.addEventListener(event, handler, suspendOnUnMount, true);
    }

    addEventListener(event, handler, suspendOnUnMount = false, onStateUpdated) {
        if (!event || !handler || !BasicEvent.isPrototypeOf(event)) {
            console.warn("Missing or false parameters on addEventListener!");
            return null;
        }
        const listenerUid = addEventListener({
            _onStateUpdate: !!onStateUpdated,
            _active: !suspendOnUnMount || this.__mounted,
            _eventUid: event.uid,
            _handler: handler
        });
        this.__listenersList.push({
            listenerUid: listenerUid,
            eventUid: event.uid,
            suspendOnUnMount: !!suspendOnUnMount
        });
        return new EventListener(
            listenerUid,
            () => {
                this.__listenersList = filterRemovedEvents(this.__listenersList);
            }
        );
    }

    removeEventListener(mixed) {
        if (BasicEvent.isPrototypeOf(mixed)) {
            removeEventListenersByType(
                mixed.uid,
                this.__listenersList.filter(
                    ({eventUid, listenerUid}) => (
                        eventUid === mixed.uid && listenerExists(listenerUid)
                    )
                ).map(
                    ({listenerUid}) => listenerUid
                )
            );
            return this.__listenersList = filterRemovedEvents(this.__listenersList);
        }

        if (mixed instanceof EventListener && this.__listenersList.some(listener => listener.listenerUid == mixed.listenerUid)) {
            mixed.remove();
        }
    }
}