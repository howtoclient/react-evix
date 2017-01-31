## Evix library
A simpler way to work with stores events and react.Use event constructor as the Store and avoid reducers and renders overhead

## Table of Contents

- [Instalation](#instalation)
- [Integration](#integration)
- [Using Evix](#using-evix)
    - [Configuring Your Events](#configuring-your-event)
    - [Accessing your event State](#accessing-your-event-state)
    - [Dispatching Events](#dispatching-events)
    - [Updating Event State](#updating-event-state)
    - [Ok Now What?](#ok-now-what)
    - [Adding Event Listener Directly](#adding-event-listener-directly)
    - [Whats An EventComponent](#whats-an-eventComponent)
    - [Using Event Component](#using-event-component)
- [DOCS](#docs)
    - [EventListener](#eventlistener)
    - [Event](#event)
    - [EventComponent](#eventcomponent)


## Instalation
```
    npm i react-evix --save
```

## Integration
```
    import Evix,{Event,EventComponent} from 'react-evix';
```

## Using Evix
I tried my best to make this library as automatic to use as possible and as fast as i can make it.
However to use this out of the box you still need to know a few things :

## Configuring Your Events
To create you own event store simply extend Event and add a static default stor configuration
```
    import Evix,{Event,EventComponent} from 'react-evix';

    export default class MyEvent extends Event{
        static defaultEventState={
            myStateVariable : 0
        }
    }
```
Thats it! there is nothing more to do but use :)
And here is how:
## Accessing Your Event State
```
    import MyEvent from './events/MyEvent'; //or wherever you placed it

    const eventState = MyEvent.eventState;
```
*Note that returned event state is a shallow clone of the original event State

## Dispatching Events
Dispatching events is simple, create new extended Event with new state, same as you would using ```React.setState()``` and run ```.dispatch()```
```
    import MyEvent from './events/MyEvent'; //or wherever you placed it

    (new MyEvent(
        {
            myStateVariable : 1
            myNewStateVariable : 123
        }
    ).dispatch();
```
The new ```MyEvent.eventState``` will be
```
    {
        myStateVariable : 1
        myNewStateVariable : 123
    }
```
*Note Works the same way ```React.setState``` does. Extends the existing eventState with the new data.

## Updating Event State
You cant manually update ```.eventState```, that would trigger no events and things will go out of sync.
Use ```.dispatch()``` instead as ```described above```

## Ok Now What
well after you configured your events and know how to dispatch things you probably want to know what to do with this.
If you ever worked with any type of events the following should be very familiar :)
If you have never worked with events here is a simple explanation:
```
    Events dispatched(fired/initiated) will be caught by event listeners(observers) that will run an action(function) in responce :)
```
## Adding Event Listener Directly
You can alway add an event listeners directly throgu your extend event constructor using ```.addEventListener``` and it will even return you an ```EventListener```
```
    import MyEvent from './events/MyEvent'; //or wherever you placed it

    const myEventListener = MyEvent.addEventListener( (event) => {
        do the thing!
    })
```
This is not advised when working with react cause ```EventComponent``` exists.
You can then Remove or Suspend your event handler whenever you want
```
    import MyEvent from './events/MyEvent'; //or wherever you placed it
    const myEventListener = MyEvent.addEventListener( (event) => {
        do the thing!
    });


    myEventListener.suspend(); // Puts the event handler to 'sleep' mode.
    myEventListener.restore(); // Wakes the event handler to catch all dem events!
    myEventListener.remove();  // Removes the event handler completly (cant be restored)
```
You can also run removal of ```EventListener``` by passing them to ```.removeEventListener```
```
    import MyEvent from './events/MyEvent'; //or wherever you placed it
    const myEventListener = MyEvent.addEventListener( (event) => {
        do the thing!
    });

    MyEvent.removeEventListener(myEventListener);
```
*this will simply run ```.remove()``` on the ```EventListener``` :)

## Whats An EventComponent
Well it would be a mess if i just used ```.addEventListner``` on the extended Event so i created ```EventComponent```
Its a React.Component extension with added event related functions:
First here is how you create ```EventComponent```
```
    import Evix,{Event,EventComponent} from 'react-evix';

    export default class MyComponent extends EventComponent{
        render(){
            return (
                <div />
            );
        }
    }
```

Simply import and extend, ```EventComponent``` is a valid ```React.Component``` in all aspects, hell you can even use it with Redux if you wanted to

## Using Event Component
So the things i added:
```this.addEventListener(event, handler, suspendOnUnMount = false)```
Recieves:
- extended Event instance or constructor ( doesnt matter )
- a handler function
- optional: auto-suspend when component unmounts flag ( oh yes :) )
Returns:
- ```EventListener``` instace.

Example:
```
    import Evix,{Event,EventComponent} from 'react-evix';
    import MyEvent from './events/MyEvent'; //or wherever you placed it

    export default class MyComponent extends EventComponent{
        static myEventListener;
        componentDidMount(){
            this.myEventListener =
                this.addEventListener(
                    MyEvent ,
                    (event) => {
                        do the thing!
                    },
                    true );
        }
        render(){
            return (
                <div />
            );
        }
    }
```
```this.removeEventListener(Mixed)```
As it sounds, removed a specific event or a whole group of them by type.
Recieves:
- instance of ```EventListener``` OR instace of extended Event OR extended Event constructor
Example:
```
    import Evix,{Event,EventComponent} from 'react-evix';
    import MyEvent from './events/MyEvent'; //or wherever you placed it

    export default class MyComponent extends EventComponent{

        removeSingleEvent(){
           this.removeEventListener(this.myEventListener);
        }

        removeComponentAssignEventsOfType(){
           this.removeEventListener(myEventListener);
        }

        //if another instace of this component exists its events will NOT BE REMOVED

        render(){
            return (
                <div />
            );
        }
    }
    ```
*NOTE: All the event functions are Instance controlled so you cant remove events from other Instances( use ```EventListener.remove()``` )

## DOCS
We all love a good simple whats where and why guide

## EventListener
After you subscribe to event dispather using one of the addEventListeners you will get ```EventListener```

- ```EventListener.suspend()``` - pause event listener without removing it
- ```EventListener.restore()``` - resume existing event listener
- ```EventListener.remove()``` - remove event listner
- ```EventListener.isSuspended()``` - returns event listener activity status
- ```EventListener.isRemoved()``` - returns event listener activity status
- ```EventListener.onAction()``` - empty function called when ```.suspend() or .restore() or .remove()``` are called ( mainly for debugging )

## Event

Event (not to be cofuzed with window.Event) is my take on Event with internal SHARED state per extention
Usage:
```
    import Evix,{Event,EventComponent} from 'react-evix';

    export default class MyEvent extends Event{
        static defaultEventState={
            myStateVariable : 0
        }
    }

    (new MyEvent({myStateVariable : 2})).dispatch();
    console.log(MyEvent.eventState);
    MyEvent.addEventListener
```

variables:
- ```.defaultEventState - {Object}``` - like it sounds, default event state object ( original ) ```MyEvent.defaultEventState```
- ```.eventState - {Object}``` - copy of internal eventState ```MyEvent.eventState```
- ```.eventData - {Object}``` - data passed to dispatch (only valid after creation ex:```(new MyEvent({eventData}).eventData```)
- ```.uid - {String}``` - unique ID of the event type ```MyEvent.uid``` or ```(new MyEvent()).uid)```

methods:
- ```.dispatch()``` - dispatches current event and updated the shared ```eventState```
```
    const fireEvent = (eventData)=>{
        (new MyEvent({eventData})).dispatch()
    }
```
- ```addEventListener(function(){})``` - creates event listener with given handler ( function ) and returns ```EventListener``` Instance
```
    const eventListener = MyEvent.addEventListener( (event) => {
        do the thing!
    });
```
*NOTE use EventComponent instead!
- ```removeEventListener(EventListner)``` - recieved ```EventListener``` instance and runs ```.remove()``` on it
```
    const clearEvent = (eventListener)=>{
        MyEvent.removeEventListener(eventListener)
    }
```
- ```clearAllDirectEvents()``` - removed all event listeneres registered with ```Event.addEventListener``` ONLY ( events registered with ```EventComponent```) will not be affected
```
    const cleanUp = ()=>{
        MyEvent.clearAllDirectEvents()
    }
```

## EventComponent
Extended ```React.Component``` to add/remove/suspend and auto suspend/restore event listeners

Usage:
```
    import Evix,{Event,EventComponent} from 'react-evix';

    export default class MyComponent extends EventComponent{
        render(){
            return (<div />);
        }
    }
```

methods:
- ```addEventListener(extended Event , function , autosuspend)``` - adds event listener under current ```EventComponent``` Instance
    Recieves:
    - extended Event instance or constructor ( doesnt matter )
    - a handler function
    - optional: auto-suspend when component unmounts flag ( oh yes :) )
    Returns ```EventListener``` instance

```
    import Evix,{Event,EventComponent} from 'react-evix';

    export default class MyComponent extends EventComponent{
        static myEventListener
        componentDidMount(){
            this.myEventListener = this.addEventListener( MyEvent , (event) => {
                            do the thing!
                        }, true );
            }
        render(){
            return (<div />);
        }
    }
```

- ```removeEventListener(mixed)``` - As it sounds, removed a specific event or a whole group of them by type.
Recieves:
    - instance of ```EventListener``` OR instace of extended Event OR extended Event constructor

Usage:
```
    import Evix,{Event,EventComponent} from 'react-evix';
    import MyEvent from './events/MyEvent'; //or wherever you placed it

    export default class MyComponent extends EventComponent{

        removeSingleEvent(){
            this.removeEventListener(this.myEventListener);
        }

        removeComponentAssignEventsOfType(){
            this.removeEventListener(myEventListener);
        }

        //if another instace of this component exists its events will NOT BE REMOVED

        render(){
            return ( <div /> );
        }
    }
```
*NOTE: All the event functions are Instance controlled so you cant remove events from other Instances( use ```EventListener.remove()``` )





