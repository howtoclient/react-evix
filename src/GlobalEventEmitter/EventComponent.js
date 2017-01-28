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
        this.__listenersList = [];
        this.__componentWillUnmount = this.componentWillUnmount;
        this.componentWillUnmount = this._componentWillUnmount.bind(this);
        this.__componentDidMount = this.componentDidMount;
        this.componentDidMount = this._componentDidMount.bind(this);

    }

    _updateEventList() {
        console.log("EventComponent->_updateEventList");
        this.__listenersList =
            filterRemovedListeners(
                this.__listenersList
            );
    }

    _componentDidMount() {
        this.__listenersList = filterRemovedListeners(this.__listenersList).filter(
            ({suspendOnUnMount, listenerUid}) => (
                !suspendOnUnMount || systemRestoreEventListenerById(listenerUid)
            )
        );
        this.__componentDidMount && this.__componentDidMount();
    }

    _componentWillUnmount() {
        this.__listenersList = filterRemovedListeners(this.__listenersList).filter(
            ({suspendOnUnMount, listenerUid}) => (
                !suspendOnUnMount || systemSuspendEventListenerById(listenerUid)
            )
        );
        this.__componentWillUnmount && this.__componentWillUnmount();
    }

    addEventListener(event, handler, suspendOnUnMount = false) {
        if (!event || !handler || !BasicEvent.isPrototypeOf(event)) {
            console.warn(this, "Missing or false parameters on addEventListener!");
            return {};
        }
        const listenerUid = addEventListener({
            _active: true,
            _eventUid: event.uid,
            _handler: handler
        });
        this.__listenersList.push({
            listenerUid: listenerUid,
            eventUid: event._uid,
            suspendOnUnMount: suspendOnUnMount
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
                    ({listenerUid})=>listenerUid
                )
            );
            this._updateEventList();
        }
        if (EventListener.isPrototypeOf(mixed) && this.__listenersList.indexOf(mixed.listenerUid)>-1) {
            mixed.remove();
        }
    }
}