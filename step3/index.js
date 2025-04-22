const TEXT_ELEMENT = 'TEXT_ELEMENT';

function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child => typeof child === 'object' ? child : createTextElement(child)),
        },
    }
}

function createTextElement(text) {
    return { type: TEXT_ELEMENT, props: { nodeValue: text, children: [] } };
}


/**
 *   Element is: { type: String, props }
 *          where type is one of
 *              - a String that represents a DOM node (eg. 'div' represents a <div>)
 *              - a TEXT_ELEMENT
 *   Props is { children: [Element], ...propKeys }
 *          where children is an array of Elements
 *   Node is a DOM node 
 *      eg. a <div>
 */

// element, node -> void
// creates a tree of Nodes based on the input element and appends it to the container
function render(element, container) {
    const dom = createDOM(element)
    container.appendChild(dom);
}

// Element -> Node
// produces a Node created from the given Element including the children
function createDOM(element) {
    const {children, ...props} = element.props;
    const dom = createNode(element.type, props);
    children.forEach(child => dom.appendChild(createDOM(child)));
    return dom 
}

// type, ..keyProps -> Node
// produces a Node created from the given Element
function createNode(type, props) {
    const node = type === TEXT_ELEMENT ? document.createTextNode('') : document.createElement(type);
    Object.entries(props).forEach(([key,value]) => node[key] = value );
    return node;
}

const Didact = {
    createElement,
    render
}


const element = (
    <div id="foo" className='baz'>
        <h1>bar</h1>
        <br />
    </div>
);

console.log("Element:");
console.log(element);

const container = document.getElementById('root');
Didact.render(element, container);

// ==========================================================================================

/**
 *   Fiber is: {
 *          type: String,
 *          props,
 *          parent: a Fiber,
 *          child: a Fiber,
 *          sibiling: a Fiber,
 *          dom: a Node                         
 *      }
 *   where type is one of
 *              - a String that represents a DOM node (eg. 'div' represents a <div>)
 *              - a TEXT_ELEMENT
 *   Props is { children: [Element], ...propKeys }
 *          where children is an array of Fibers
 *   Node is a DOM node 
 *      eg. a <div>
 */

/**
 * New render:
 *      - takes element & container
 *      - creates the root fiber from the container
 *      - sets the element as the root fiber's child
 */

// Element, Node -> void
// adds the root fiber to nextUnitOfWork
function render(element, container) {
    nextUnitOfWork = {
        dom: container,
        props: {
            children: [element]
        }
    };
}

let nextUnitOfWork = null;
function workloop(idleDeadline) {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

        shouldYield = idleDeadline.timeRemaining() < 1;
    }
    requestIdleCallback(workloop);
}

requestIdleCallback(workloop);

// Fiber -> Fiber
// consumes a Fiber that represents the nextUnitOfWork
// creates a node from the fiber type and props (excluding the children) and adds it to the fiber dom
// creates Fibers from the element children and
// produces the Fiber that should represent the new nextUnitOfwork
function performUnitOfWork(fiber) {
    // add element to the dom
    if (!fiber.dom) { 
        fiber.dom = createNode(fiber.type, fiber.props);
    }

    if (fiber.parent) {
        fiber.parent.dom.appendChild(fiber.dom);    
    }
    // create new fibers from the children
    let lastSibiling = null;
    fiber.props.children.forEach(element => {
        const newFiber = {
            type: element.type,
            props: element.props,
            dom: null,
            parent: fiber
        };
        // add sibilings
        if (!lastSibiling) {
            fiber.child = newFiber;
        } else {
            lastSibiling.sibiling = newFiber;
        }
        lastSibiling = newFiber;
    });
    // return next unit of work
    if (fiber.child) {
        return fiber.child;
    }
    let curr = fiber;
    while (curr) {
        if (curr.sibiling) {
            return curr.sibiling
        }
        curr = curr.parent; 
    }
    return null; // return null if there are no nextUnitsOfWork
}

// type, Props -> Node
// takes a type and props from a fiber and produces a Node of the correct type
// ignoring the children
function createNode(type, props) {
    const { children, ...fiberProps } = props;
    const node = type === TEXT_ELEMENT ? document.createTextNode('') : document.createElement(type);
    Object.entries(fiberProps).forEach(([key,value]) => node[key] = value );
    return node;
}
