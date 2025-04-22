# InnoitPrimeNgAssignment

A learning experience using Prime NG for first time based on InnoIt requested assignment
It contains some angular-started features based on an existing project: [Angular Starter] (https://github.com/wlucha/angular-starter). Thanks to [Wilfried Lucha](https://github.com/wlucha) for simplify Jest, Linter, Prettier and Cypress initial config time in Angular 19

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.7.

## App Running Link
The App is published using [Netlify](https://www.netlify.com/) in the following link: https://innoit-prime-ng-assignment.netlify.app/home

## Installation issues found at 22 April, 2025
There is a known issue with PrimeNg @angular/animations dependencies version: https://github.com/primefaces/primeng/issues/18116
To skip these issue until solved, please run this command:

```bash
npm i --force
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Jest](https://github.com/jestjs/jest) test runner, use the following command:

```bash
npm run test:coverage
```

It will create a report coverage on folder /coverage/lcov-report/index.html

## Running end-to-end tests

For end-to-end (e2e) testing using [Cypress](https://www.cypress.io/), run:

```bash
npm run cypress:run
```

If you want to run Cyppress on Browser run:

```bash
npm run cypress:open
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Project Features

### Contact Page

A simple form component made with Reactive Forms and PrimeNg components. The page is also integrated with a custom State Service that follows the Redux Pattern principles.

![image](https://github.com/user-attachments/assets/034e5165-bc58-4d63-977a-c7f35cf7f6ca)

Upon completing all fields and checking the Terms of Agreement (ToA), the 'Send Message' button becomes active, allowing you to send the message. 
A toast notification will then indicate whether the message was sent successfully or if an error occurred. Since this application doesn't connect to a real server, a mock HttpService is used, which randomly simulates success or error responses. On a successful send, the form is reset and a green toast notification is displayed. In case of an error, the entered information in the form is preserved, and a red toast notification appears.

Related code for the feature:
https://github.com/alexdedekelena/innoit-prime-ng-assignment/tree/main/src/app/features/contact-page
https://github.com/alexdedekelena/innoit-prime-ng-assignment/blob/main/src/app/shared/services/contact-page-http-mock.service.ts
https://github.com/alexdedekelena/innoit-prime-ng-assignment/blob/main/src/app/shared/services/state/contact-page-state.service.ts

### Countries Page

A table that contains all the country you want to add to the project.

![image](https://github.com/user-attachments/assets/70cdd1ae-c2f0-42d7-b700-b2bc1dda0da2)

When the 'Add a Country' button is clicked, a dialog appears, allowing you to search for and select a country from the provided dropdown list. Upon selecting a country and pressing the 'Add' button, it is added to the Countries Table. To avoid duplication, once a country is added, it is no longer available as an option in the dropdown.

![image](https://github.com/user-attachments/assets/93b08d19-4919-457c-a8d2-9400310e7191)

The API used to retrieve all countries data is [REST Countries](https://restcountries.com/)

Related code for the feature:
https://github.com/alexdedekelena/innoit-prime-ng-assignment/tree/main/src/app/features/countries-page
https://github.com/alexdedekelena/innoit-prime-ng-assignment/blob/main/src/app/shared/services/countries-page-http.service.spec.ts
https://github.com/alexdedekelena/innoit-prime-ng-assignment/blob/main/src/app/shared/services/state/contact-page-state.service.ts

### Pricing Page

It is just an static HTML page made with PrimeNg components and PrimeFlex styling classes.

![image](https://github.com/user-attachments/assets/39043859-d1e5-4a3e-80cb-47d547a8e614)

There are some differences regardig the intial Figma design specially on the background since is faster and easier to use just a css gradient background.
This screen was initially made with Gemini 2.0. The initial html snippet is a fair approximation of the expected result.

Used prompt altogether with the attached image from Figma:

```
"Generate an HTML code snippet that represents an image screen layout using PrimeNG components and PrimeFlex styles for an Angular application. Ensure the code is compatible with the latest version that supports Angular 19. Avoid using custom CSS styling and maintain a responsive layout for both desktop and mobile screens."
```

Initial generated HTML snippet rendering
![image](https://github.com/user-attachments/assets/376f1b30-b86a-4a4c-a98f-3f48760c9db4)

Related code for the feature:
https://github.com/alexdedekelena/innoit-prime-ng-assignment/tree/main/src/app/features/pricing-page

## Code highlights

- The State Services implements the Redux pattern principles following guidelines written by [Deborah Kurata](https://github.com/deborahk): [A Redux-like Pattern for Managing State with Angular signals](https://www.youtube.com/watch?v=rHQa4SpekaA).
- Reactive Forms in Angular do not yet have built-in support for Signals. To manage this, I've implemented a mechanism to keep both FormGroups and a Signal-based state synchronized. When a FormGroup is initialized, it takes the current value from the Signal. Subsequently, whenever focus leaves an input field within the FormGroup (on the focusout event), the corresponding Signal is updated with the emitted value. This approach using the focusout event is preferred over the FormControl's valueChanges method, as valueChanges emits on every keystroke, leading to numerous unnecessary updates and potential performance degradation. However, for FormControls like Checkboxes, which are triggered only on a click event, relying on the valueChanges method to update the Signal is acceptable..










