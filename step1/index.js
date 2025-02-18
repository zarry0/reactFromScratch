// starting code:
// const element = (
//     <div id="foo">
//       <a>bar</a>
//       <b />
//     </div>
//   )
//   const container = document.getElementById("root")
//   ReactDOM.render(element, container)


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
    return { type: 'TEXT_ELEMENT', props: { nodeValue: text, children: [] } };
}

const Didact = {
    createElement,
}

const element = Didact.createElement(
    'div',
    { id: 'foo' },
    Didact.createElement('a', null, 'bar'),
    Didact.createElement('b'),
);

/** @jsx Didact.createElement */
const jsxElement = (
    <div id="foo">
        <a>bar</a>
        <b />
    </div>
);

console.log("Element:");
console.log(element);
console.log("With jsx:");
console.log(jsxElement);



