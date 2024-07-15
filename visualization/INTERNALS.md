# Webserver: Visualization > Internals

- [TypeScript](#typescript)
- [React](#react)
- [i18n](#i18n)
- [Project Setup](#project-setup)

The Webapp is built on top of the JavaScript front-end library React using the TypeScript language.
This allows for strongly typed programming and makes building HTML user interfaces easy by integrating HTML elements into the syntax of the language.

## TypeScript

> https://www.typescriptlang.org/

Default JavaScript is executed on an interpreter and does not have any native types.
This can result in a lot of run time errors just because there is a syntax error somewhere or because a property/function does not exist or a multitude of other errors.

TypeScript adds additional syntax to JavaScript and uses type inference while compiling it's code to JavaScript which means a lot of errors can be caught before entering the runtime (`.ts` files):

```ts
const user = {
  firstName: "Angela",
  lastName: "Davis",
  role: "Professor",
}
// TypeScript compiler does not compile this file
// since the property 'name' does not exist while
// per default this would result in a runtime error
console.log(user.name)

// Types can be defined
interface User {
  id: number
  firstName: string
  lastName: string
  role: string
}

// And with types functions arguments or variables can be
// written in a more understandable way which also allows
// for better checks before compiling it to JavaScript
function updateUser(id: number, update: Partial<User>) {
  const user = getUser(id)
  const newUser = { ...user, ...update }
  saveUser(id, newUser)
}
```

## React

> https://react.dev/learn

Default JavaScript/Typescript is not really designed to create or build HTML components.

```html
<div id="content">
  <p>Paragraph.</p>
</div>
```

```ts
const pElementParagraph2 = document.createElement("p");
const node = document.createTextNode("New Paragraph.");
pElementParagraph2.appendChild(node);

const divElementContent = document.getElementById("content");
divElementContent.appendChild(pElementParagraph2);
```

Using the front-end library React the syntax of JavaScript/Typescript can be extended to support HTML components (`.tsx`/`.jsx` files).

```tsx
export function Component1() {
  return (
    <div id="content">
        <p>Paragraph.</p>
        <p>New Paragraph.</p>
    </div>
  );
}
```

Functions that return such a JSX element as return values (and when starting with an uppercase character) can be imported and written just like an HTML tag:

```tsx
import {Component1} from "./file";

export function Component2() {
  return (
    <Component1></Component1>
    <Component1 />
  );
}
```

To pass values to such a component a properties object is used:

```tsx
export interface ComponentProps {
  name: string;
  description: string;
}

export function Component1(props: ComponentProps) {
  const {name, description} = props;
  return (
    <div id="content">
        <p>Name: {name}</p>
        <p>Description: {description}</p>
    </div>
  );
}

export function Component2({name, description}: ComponentProps) {
  return (
    <div id="content">
        <p>Name: {name}</p>
        <p>Description: {description}</p>
    </div>
  );
}

export function Component3() {
  const nameProps = {name: "Ameliea", description: "This is a demo"};
  return (
    <Component1 name="Rolf" description="This is a demo" />
    <Component1 {...nameProps} />
  );
}
```

Furthermore JSX/HTML child elements can be injected using the special child property or be a property:

```tsx
import type {ReactElement, PropsWithChildren} from 'react';

export interface ComponentProps {
  name: string;
  content: ReactElement;
}

export function Component1({name, children, content}: PropsWithChildren<ComponentProps>) {
  return (
    <div id="content">
        <p>Name: {name}</p>
        {content}
        {children}
    </div>
  );
}

export function Component2() {
  const contentElement = <p>Content</p>;
  return (
    <Component1 name="Rolf" content={contentElement}>
      <p>Description: Test</p>
    </Component1>
  );
}
```

Every time an input property is updated the component is rerendered.
And React normally also rerenders a component whenever its parent rerenders.
To easily do this and *react* to changes of properties react provides states:

```tsx
import {useEffect, useState} from 'react';

export function Component() {
  const [stateCount, setStateCount] = useState<number>(0);
  useEffect(() => {
    console.log(`stateCount was updated to ${stateCount}`);
  }, [stateCount]);
  useEffect(() => {
    console.log('Runs only on the first render (runs twice during dev)');
  }, []);
  return (
    <p>Counter: {stateCount}</p>
    <button onclick={() => setStateCount(prev => prev + 1)}>Increase</button>
    <button onClick={() => setStateCount(0)}>Reset</button>
  );
}
```

An important note is that while there won't be an component update/rerender if the react state does not change for `number`s, `boolean`s, `String`s and other basic data types any object change even if it doesn't actually change any properties (e.g. `{name: 'A'}` -> `{name: 'A'}`) will trigger an component update/rerender.

This can lead to excessive rerenders/calculations of certain components in which case the react `memo` should be used to skip re-rendering a component when its props are unchanged as well as `useMemo` to cache a value/calculation between re-renders.

> https://react.dev/reference/react/memo

> https://react.dev/reference/react/useMemo

### React Framework Next.js

> https://nextjs.org/docs#main-features

With Next.js writing full-stack Web applications gets even more easy by bundling web features (routing, i18n, CSS, middleware, ...) into one toolkit:

```css
.main {
  text-align: center;
  color: red;
}
```

```tsx
import styles from './styles.css'

export const Home = () => {
  return (
    <main className={styles.main}>
      <p>Page content</p>
    </main>
  );
}
```

It also provides as one of few react frameworks server side rendering of components that do not make use of react states/effects.

## i18n

> https://www.i18next.com/

In computing i18n is an abbreviation for internationalization and localization meaning adapting computer software to different languages, regional peculiarities and technical requirements of a target locale.
i18next is an internationalization-framework for JavaScript that supports plurals, context, interpolation format, ...

## Project Setup

This is a description on how the project was set up

### Create basic project structure

```sh
mkdir webapp && cd webapp
npx create-next-app@latest

Need to install the following packages:
create-next-app@14.0.4
Ok to proceed? (y) y
✔ What is your project named? … vis_ride_pool_concept
✔ Would you like to use TypeScript? … No / Yes
✔ Would you like to use ESLint? … No / Yes
✔ Would you like to use Tailwind CSS? … No / Yes
✔ Would you like to use `src/` directory? … No / Yes
✔ Would you like to use App Router? (recommended) … No / Yes
✔ Would you like to customize the default import alias (@/*)? … No / Yes
Creating a new Next.js app in /home/niklas/Documents/GitHub/bachelor-thesis-wip/webapp/vis_ride_pool_concept.

Using npm.

Initializing project with template: app


Installing dependencies:
- react
- react-dom
- next

Installing devDependencies:
- typescript
- @types/node
- @types/react
- @types/react-dom
- eslint
- eslint-config-next


added 281 packages, and audited 282 packages in 23s

106 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
Success! Created vis_ride_pool_concept at webapp/vis_ride_pool_concept
```
