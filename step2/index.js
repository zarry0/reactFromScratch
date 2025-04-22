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


