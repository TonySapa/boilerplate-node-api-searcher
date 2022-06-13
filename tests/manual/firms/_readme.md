## About
Useful for debugging and as an extended documentation with use cases. It uses "REST Client" vscode extension by Huachao Mao. To send the request you need to make click on top of file on a link named "Send request".

## Get started

### Init environment and connect to "test" database collection
Init application with script
```
yarn dev-test
```
to use test environment and test collection on mongodb, which should be empty at start.

### Init database with demo firms
Send all requests stored on folder above named "0_get_started".

### Run manual tests
Send requests for each one of the files BY ORDER.

### Reset collection after finish.
Remember to manually drop the collection on mongodb after finish.
