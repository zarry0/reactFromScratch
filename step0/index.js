
// const element = <h1 title="foo">Hello</h1>          // create a react element
// const container = document.getElementById("root")   // selects the root node from the DOM
// ReactDOM.render(element, container)                 // renders the react component into the container

// React code transformed into JS:

const element = {
    type: 'h1',
    props: {
        title: "foo",
        children: "Hello"
    }
}

const container = document.getElementById("root");

const node = document.createElement(element.type);
node["title"] = element.props.title

const text = document.createTextNode("")
text["nodeValue"] = element.props.children

node.appendChild(text)
container.appendChild(node)


