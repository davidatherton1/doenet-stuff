Experimenting with three.js

Good starter articles
https://blog.bitsrc.io/starting-with-react-16-and-three-js-in-5-minutes-3079b8829817

https://codeburst.io/react-16-three-js-integration-tips-2019-b6afe19c0b83

https://reactjs.org/tutorial/tutorial.html

Jack's Library
https://github.com/jackstanek/three_math_library

Important Advice for Implementing React

1) Always call super() when constructing subclasses in JS. 
This is important because many classes in React are subclasses of React.Component

2) When you need multiple child components to communicate with one another, 
It's best to store their shared state in the parent component. 
This state is then passed to the children using props.

3) Immutability >> Mutability i.e. change a state variable by reassigning with an altered copy
rather than altering the variable directly. Helps to build "pure" components. https://reactjs.org/docs/optimizing-performance.html#examples

4) It's good practice to define child components as functions rather than classes if you can.
You can do this if the child component doesn't need to store any state variables.

5) When creating list elements, assign a key value to each item to help React render the list.
By default the key of each list item is its array index, but this is very bad if the list is meant to be dynamic.
(entries are being shifted around). Without proper keys its hard for React to tell if entries in a dynamic list
are being altered or just shifted around.
