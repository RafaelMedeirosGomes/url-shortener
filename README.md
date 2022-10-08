# URL Shortener app

[![GitHub Super-Linter](https://github.com/RafaelMedeirosGomes/url-shortener/workflows/Lint%20Code%20Base/badge.svg)](https://github.com/marketplace/actions/super-linter)

## Features

1. Creation of new shortened URLs
2. Redirect for given shortened URLs
3. Horizontal scaling with [pm2 cluster mode](https://pm2.keymetrics.io/docs/usage/cluster-mode/)

## How to run

1. Edit .env.example with the respective values:

- SERVER_PORT: The port the server is supposed to run
- DB_URI: The URI to connect to the database
- DB_USER: The database user for authorization
- DB_PASS: The database access password of above user
- DB_NAME: The database Collection name to save the documents data
- URL_PREFIX: The Domain Name this server is running on
- URL_EXPIRY_TIME: The adjustable expiration time (in days) for generated URLs

And then rename it to .env

2. Run the following commands in your terminal of choice (make sure you have [node](https://nodejs.org/en/download/) and [TypeScript](https://www.typescriptlang.org/download) installed):

- `npm ci --omit=dev` to install production dependencies
- `npm start` to run the application in cluster mode

## API

The API is pretty simple right now, it contains

1. a "root" endpoint at /api/v1 that gives you the available endpoints
2. a create endpoint at /api/v1/create for creating shortened URLs

## Next steps

1. Cache GET requests for the lifetime of the URL
2. Addition of a clicks counter for the shortened URL
3. Stress tests

## Technology stack

1. Framework: express/Node.js
2. Language: TypeScript
3. Database: MongoDB
4. Database ORM: Mongoose

## Technical choices

1. pm2 - As a Node.js process manager

Node.js is an event-driven single thread engine, it is a naturally good choice
as a HTTP server to respond to multiple data requisitions: It receives a
request and then asks for the database for the data, this registries an event
in Node.js Event Loop and the request can continue to be processed once the
database sends the data back to Node.js. <br>
When scaling horizontally we can easily start more instances of Node.js
processes, pm2 cluster mode brings not only this but also zero downtime reloads
(useful when updating the application), load balancing (better distribution of
the load between the active processes), resilience for fault exiting processes,
and exponential backoff restarting strategy. All of that while being easily
configurable through a simple config file.

2. MongoDB Atlas - As a cloud database

The biggest challenge in scaling HTTP servers that need data access is scaling
the data provider. Keeping a dedicated database server available to requests is
expensive. MongoDB Atlas makes this trivial providing Database-as-a-Service and
taking care of database availability with a Cloud-based solution while being
cheap at `$0.10 / million reads` <br>
When the dedicated database server option is preferable MongoDB offers
[Shards](https://www.mongodb.com/basics/sharding) for partitioning data in
multiple machines (allowing you to scale horizontally).

3. Mongoose - As a database ORM

Mongoose makes it easy to make MongoDB queries without having to worry about
validations and type casts while also being pretty fast to quick start.

4. REST API - Communicating with the application

For our scaling strategy to work we need to guarantee that our application is
stateless, this goes well with REST APIs since REST requests are all stateless
(they contain all the information needed to be processed).

5. URL_PREFIX - Decoupling Domain Name from data persistence

If the application is only needed to answer redirects from one Domain Name we
don't need to store the Domain Name in the database, also passing it dinamically
as an environment variable let us to change the Domain Name with zero database
alterations.

6. URL_EXPIRY_TIME - Decoupling Business Logic from data persistence

If all the generated links have the same expiration time we can move this
information from database to an environment variable. Like the above point,
this also allows us to easily change expiration time without changing anything
in the database.
