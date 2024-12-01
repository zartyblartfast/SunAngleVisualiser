// Track events on a specific element
function monitorEvents(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id ${elementId} not found`);
        return;
    }

    const eventLog = new Set();
    const eventTypes = ['input', 'change', 'blur', 'focus'];

    eventTypes.forEach(eventType => {
        element.addEventListener(eventType, function(event) {
            console.log(`${elementId} ${eventType} event:`, {
                value: this.value,
                event: event
            });
            eventLog.add({
                type: eventType,
                value: this.value,
                timestamp: new Date()
            });
        }, true);
    });

    // Return a function to get the event log
    return () => Array.from(eventLog);
}

// Function to print all current event listeners
export function printEventListeners(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id ${elementId} not found`);
        return;
    }

    console.log(`=== Event Listeners for ${elementId} ===`);
    
    // Print direct event listeners
    const listeners = element.getEventListeners?.() || {};
    Object.entries(listeners).forEach(([type, handlers]) => {
        console.log(`${type}: ${handlers.length} handler(s)`);
        handlers.forEach((handler, i) => {
            console.log(`  ${i + 1}. ${handler.toString()}`);
        });
    });

    // Check for inline events
    const inlineEvents = [];
    for (let prop in element) {
        if (prop.startsWith('on') && element[prop]) {
            inlineEvents.push(`${prop}: ${element[prop].toString()}`);
        }
    }
    if (inlineEvents.length) {
        console.log('Inline events:');
        inlineEvents.forEach(e => console.log(`  ${e}`));
    }

    // Check for delegated events
    console.log('Checking for delegated events...');
    let parent = element.parentElement;
    while (parent) {
        const parentListeners = parent.getEventListeners?.() || {};
        if (Object.keys(parentListeners).length) {
            console.log(`Delegated from ${parent.tagName}#${parent.id}:`);
            Object.entries(parentListeners).forEach(([type, handlers]) => {
                console.log(`  ${type}: ${handlers.length} handler(s)`);
            });
        }

        parent = parent.parentElement;
    }
}

// Export a function to start monitoring
export function startEventMonitoring(elementId) {
    const getEvents = monitorEvents(elementId);
    printEventListeners(elementId);
    return getEvents;
}
