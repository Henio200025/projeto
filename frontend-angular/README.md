# FrontendAngular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Project notes (Uma Mãozinha)

- Implementação atual inclui mocks de API para acelerar o desenvolvimento front-end sem depender do backend. O serviço mock está em `src/app/services/mock-api.service.ts` e fornece endpoints simulados para `categories`, `services` e `service/:id`.
- Componentes novos criados para reutilização: `ServiceCard` (src/app/components/service-card) e `CategoryCard` (src/app/components/category-card).
- Para integrar com o backend real, substitua chamadas ao `MockApiService` por `HttpClient` para os endpoints reais e remova/limpe o serviço mock.

- Endpoint mock adicional implementado: `POST /requests` (simulado via `MockApiService.postRequest`) para enviar pedidos de orçamento. Use `MockApiService.getRequestsByUser(userId)` para recuperar pedidos do usuário.

### Run tests

Rodar todos os testes unitários:

```bash
ng test
```

