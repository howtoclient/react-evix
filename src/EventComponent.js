/**
 * Created by Vladimirvl on 2017-01-25.
 */
import React from 'react';
import {
    BasicEvent,
    filterRemovedListeners,
    addEventListener,
    listenerExists,
    removeEventListenersByType,
    systemSuspendEventListenerById,
    systemRestoreEventListenerById
} from './EventsControl';
import EventListener from './EventListener';

export default class EventComponent extends React.Component {
    constructor(props) {
        super(props);
        this.__mounted = false;
        this.__listenersList = [];
        this.__stateTrackers = {};
        this.__componentWillUnmount = this.componentWillUnmount;
        this.__componentWillMount = this.componentWillMount;
        this.componentWillUnmount = this._componentWillUnmount;
        this.componentWillMount = this._componentWillMount;

    }

    _updateEventList() {
        this.__listenersList =
            filterRemovedListeners(
                this.__listenersList
            );
    }

    _componentWillMount() {
        this.__mounted = true;
        this.__listenersList = filterRemovedListeners(this.__listenersList).filter(
            ({suspendOnUnMount, listenerUid}) => (
                !suspendOnUnMount || systemRestoreEventListenerById(listenerUid)
            )
        );
        for (let key in this.__stateTrackers) {
            this.__stateTrackers[key].restore();
        }
        this.__componentWillMount && this.__componentWillMount();
    }

    _componentWillUnmount() {
        this.__mounted = false;
        this.__listenersList = filterRemovedListeners(this.__listenersList).filter(
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
                _handler: handler
            })
        )
    }

    onEventStateUpdated(event, handler, suspendOnUnMount = false) {
        return this.addEventListener(event, handler, suspendOnUnMount, true);
    }

    addEventListener(event, handler, suspendOnUnMount = false, onStateUpdated) {
        if (!event || !handler || !BasicEvent.isPrototypeOf(event)) {
            console.warn(this, "Missing or false parameters on addEventListener!");
            return {};
        }
        const listenerUid = addEventListener({
            _onStateUpdate: !!onStateUpdated,
            _active: !suspendOnUnMount || this.__mounted,
            _eventUid: event.uid,
            _handler: handler
        });
        this.__listenersList.push({
            listenerUid: listenerUid,
            eventUid: event._uid,
            suspendOnUnMount: !!suspendOnUnMount
        });
        return new EventListener(
            listenerUid,
            this._updateEventList.bind(this)
        );
    }

    removeEventListener(mixed) {
        if (typeof mixed !== 'object') {
            return;
        }
        if (BasicEvent.isPrototypeOf(mixed)) {
            removeEventListenersByType(
                mixed._uid,
                this.__listenersList.filter(
                    ({eventUid, listenerUid}) => (
                        eventUid === mixed._uid && listenerExists(listenerUid)
                    )
                ).map(
                    ({listenerUid}) => listenerUid
                )
            );
            this._updateEventList();
        }
        if (EventListener.isPrototypeOf(mixed) && this.__listenersList.indexOf(mixed.listenerUid) > -1) {
            mixed.remove();
        }
    }
}