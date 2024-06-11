# Webapp

- [Run](#run)
  - [Node.js](#nodejs)
  - [Docker](#docker)
  - [Logs](#logs)
- [Structure](#structure)
  - [Webpages](#webpages)
  - [Static files](#static-files)
  - [Translations](#translations)
- [Dev](#dev)
  - [Commands](#commands)
  - [Internals](#internals)
  - [Project Setup](#project-setup)

## Run

Per default running it will create a web server on the port `3000`.
Open [http://localhost:3000](http://localhost:3000) with your browser to view.

### Node.js

1. [Install Node.js (`node` + `npm`)](https://nodejs.org/en/download) and run the following commands:

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

### Docker

1. [Install Docker (`docker` + `docker-compose`)](https://docs.docker.com/get-docker/) and start the docker daemon
   - Linux:
     1. Install (e.g. via `sudo pacman -S docker docker-compose`)
     2. Use `systemd` to start the service: `systemctl start docker`
     3. If it's not yet working create the docker group (if it does not exist): `sudo groupadd docker`
     4. Add your user to this group: `sudo usermod -aG docker $USER`
     5. Log in to the new docker group since the current shells may not yet "know" about being added to the docker group (alternatively run `newgrp docker`)
   - Windows:
     1. Install (e.g. via `winget install -e --id Docker.DockerDesktop`)
     2. Add the binaries to the PATH: `C:\Program Files\Docker\Docker\resources\bin`
     3. Start `Docker Desktop` to start the docker engine
2. Build container declared in a `Dockerfile` in the current directory: `docker build --tag nextjs-docker .`
   - `docker build [OPTIONS] PATH`
   - `--tag list`: Name and optionally a tag in the "name:tag" format
   - Windows: In case there are line endings errors from copying files into a docker container you can convert all relevant files to the Linux line endings via e.g. `find . -type f -name '*.tsx' -not -path '*/node_modules/*' -exec dos2unix {} +`
3. Run container: `docker run --publish 3000:3000 nextjs-docker`
   - `docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`
   - `--publish list`: Publish a container's port(s) to the host

You can view:

- the created images created with `docker images`
- the currently running containers and their IDs/ports/states with `docker ps`
- stop a running container with `docker stop $ID` (stop all of them via `docker ps -aq | xargs docker stop`)
- to inspect an image use the command `docker run --rm -it --entrypoint=/bin/bash $TAG`
  (in case the image has no `bash` you may have to add it in the `Dockerfile` e.g. `RUN apk add --no-cache bash`)
- to inspect a running container use the command `docker exec -t -i $ID /bin/bash`

If you are finished you can:

- stop the docker service: `systemctl stop docker`
- prune all docker caches: `docker system prune -a`

> Make sure that all files that should not be copied to the docker container are listed in the [`.dockerignore`](.dockerignore) file!

> The `Dockerfile` was copied from the [vercel `next.js` repository `Dockerfile`](https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile) into the root of the project and the `next.config.js` was update to contain the following change:
>
> ```js
> // next.config.js
> module.exports = {
>   // ... rest of the configuration.
>   output: "standalone",
> };
> ```

### Logs

The server logs are stored in `$LOG_DIR=/app/logs/`.

To copy them out of a docker container run: `docker cp $ID:$LOG_DIR ./app_logs`

## Structure

This app uses a middleware for localization in order to support multiple languages.
This means that web requests can have a local prefix (e.g. `http://localhost:3000/[optional language prefix + /]` => `http://localhost:3000/de/about`) in order to request a page not in the default locale (`en`) but another locale (language).

### Webpages

The `nextjs` router renders every file named `page.tsx` in the directory [`src/app/[locale]`](src/app/[locale]) and the subdirectories as webpage:

- `/[optional language prefix]`: rendered by [`src/app/[locale]/page.tsx`](src/app/[locale]/page.tsx)
- `/[optional language prefix + /]customPage`: rendered by `src/app/[locale]/customPage/page.tsx`

### Static files

All the files in [`public/en`](public/en) will be provided as static files with the prefix `/` but it is still possible to put files into for example `public/de` which will fetch the files located in that directory instead (if found):

- `/favicon.ico`: rendered by [`public/en/favicon.ico`](public/en/favicon.ico)
- `/de/graph_with_text.png`: rendered by `public/de/graph_with_text.png` if it would exist, otherwise falls back to `public/en/graph_with_text.png`

### Translations

Translations can be updated by modifying the JSON files in [`src/lang`](src/lang).

Furthermore:

- To change the text direction of the locale edit [`src/services/intl.ts`](src/services/intl.ts)
- To change what locales should be supported edit [`i18n-config.ts`](i18n-config.ts)

## Dev

### Commands

| Command | Description |
| --- | --- |
| `npm run check:circular` | Check for circular dependencies |
| `npm run check:exports` | Check for unused exports |
| `npm run fix` | Fix code style based on [`eslint` rules](.eslintrc.json) |
| `npm run lint` | Check code style based on [`eslint` rules](.eslintrc.json) and on `next` internals |
| `npm run test` | Run tests defined in [`src/__tests__`](src/__tests__) |

### Internals

The Webapp is built on top of the JavaScript front-end library React using the TypeScript language.
This allows for strongly typed programming and makes building HTML user interfaces easy by integrating HTML elements into the syntax of the language.

#### TypeScript

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

#### React

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

#### React Framework Next.js

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

#### i18n

> https://www.i18next.com/

In computing i18n is an abbreviation for internationalization and localization meaning adapting computer software to different languages, regional peculiarities and technical requirements of a target locale.
i18next is an internationalization-framework for JavaScript that supports plurals, context, interpolation format, ...

### Project Setup

This is a description on how the project was set up

#### Create basic project structure

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
