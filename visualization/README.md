# Webapp

```sh
# Dev
npm install
npm run dev
# Prod
# > Build
npm install
npm run build
npm prune --omit=dev
# > Run
npm run start
```

TODO Automatically create a toc

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Using Docker

1. [Install Docker](https://docs.docker.com/get-docker/) on your machine and start the docker daemon
   - linux with `systemd`: `systemctl start docker`
2. Build your container: `docker build --tag nextjs-docker .`
   - `docker build [OPTIONS] PATH`
   - `--tag list`: Name and optionally a tag in the "name:tag" format
3. Run your container: `docker run --publish 3000:3000 nextjs-docker`
   - `docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`
   - `--publish list`: Publish a container's port(s) to the host

You can view your images created with `docker images`.

### In existing projects

To add support for Docker to an existing project, just copy the [`Dockerfile`](https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile) into the root of the project and add the following to the `next.config.js` file:

```js
// next.config.js
module.exports = {
  // ... rest of the configuration.
  output: "standalone",
};
```

This will build the project as a standalone app inside the Docker image.

## Old

The Webapp is built on top of the JavaScript front-end library React using the TypeScript language.
This allows for strongly typed programming and makes building HTML user interfaces easy by integrating HTML elements into the syntax of the language.

## TypeScript

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

TODO: Add more (https://www.typescriptlang.org/)

## React

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

Using the front-end library React the syntax of JavaScript/Typescript can be extended to support HTML components (`.tsx`/`.jsx` files):

```tsx
export const Content = () => {
  return (
    <div id="content">
        <p>Paragraph.</p>
        <p>New Paragraph.</p>
    </div>
  );
}
```

TODO: Add how TypeScript can be used in the components

TODO: Add React signals

TODO: Add more features (https://react.dev/learn)

### React Framework Next.js

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

TODO: Add more features (https://nextjs.org/docs#main-features)

## i18n

In computing i18n is an abbreviation for internationalization and localization meaning adapting computer software to different languages, regional peculiarities and technical requirements of a target locale.
i18next is an internationalization-framework for JavaScript that supports plurals, context, interpolation format, ...

TODO: Add examples (https://www.i18next.com/)

## Project Setup

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

### Feature: Favicon

### Feature: Web manifest

With the file [`manifest.ts`](src/app/manifest.ts) next.js automatically creates a web app manifest.

TODO: Use the locale for different manifests, add routine on when it is used

### Use i18n to support multiple languages

## Explanation of Next.js React project

In the `src` directory are:

### `.tsx` files

In these files HTML components can be declared and with `{...}` TypeScript can be executed.
A HTML component can be declared using the following syntax and must always be one element:

```tsx
import styles from './styles.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <p>Page content</p>
    </main>
  );
}
```
