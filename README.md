# HelpDesk (built with React/Redux and Node.js)

### How to Run?

1. Install dependencies
```sh
npm install
```

2. Initialize and fill database with data
```sh
npm run init
```

3. Build production mode
```sh
npm run build:production
```

4. Start server
```sh
npm run start
```

5. [Open in browser localhost:3000/auth →](http://localhost:3000/auth)

#### User Credentials

* Role: __admin__: `admin1 : qwerty`
* Role: __engineer__: `engineer : qwerty`
* Role: __customer__: `customer1 : qwerty`


### Available Scripts

There are a few scripts that you can use.

#### 👉  `npm start`

- Use to run server in development mode
- Watches for changes in server code

#### 👉  `npm run watch` 🕶️

- Use to compile client side in development mode
- Watches for changes in client code

#### 👉  `npm run build:production` 🔨

- Use to compile client side code in production mode

#### 👉  `npm run lint`

- Use to run linting

#### 👉  `npm run hot` 🔥

- Use to compile client side in hot-reloading mode
- Watches for changes in client code and hot reload
- Run server in development mode (don't watch changes in server code)

#### 👉  `npm run init`

- Use to initialize database with default data


### Dependencies

 - Node.js 8+
