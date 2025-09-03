# Gratistoria

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.2.

## Setting a certificate for HTTPS

To enable HTTPS for local development, follow these steps:

1. Install `mkcert` by following the instructions at [mkcert GitHub](https://github.com/FiloSottile/mkcert).
2. Run `mkcert -install` to set up a local CA (Certificate Authority).
3. Generate certificates by running:
   ```
   > cd certs
   > mkcert localhost.gratistoria.com 
   ```
   This will create the `localhost.gratistoria.com.pem` and `localhost.gratistoria.com-key.pem` files in the `certs` directory.

## Development server

Run `npm start` for a dev server. Navigate to `https://localhost.gratistoria.com:4200/`. This runs `make start` which uses `ng serve` with all the appropriate settings to run secure locally.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
