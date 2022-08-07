
# Refactoring To-do List
## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Structure code

- internals/
- public/
- src/
    - assets/ 
    - selectors/
    - sagas/
    - slices/
    - services/
    - sharedComponents/
        - index.js
        - modal/
            - index.js
            - styles.scss
            - __tests__/
                - index.test.js
        - Header/
            - index.js
            - styles.scss
            - __tests__/
                - index.test.js
        - HTabContainer.jsx,
        - Select.jsx,
        - TabContainer.jsx,
    - pages/
        - ClaimDetailsPage/
            - index.js
            - assets/
            - sharedComponents/
                - Modal/
                - Tooltip/
            - components/
                - AuditTypeContent.jsx
                - ClaimDetails.jsx
                - ClaimDetailsVerticalIconMenu.jsx
                - ClaimDetailValue.jsx
                - ClaimProcessDetails.jsx
                - ClaimValue.jsx
                - InlineEditableField.jsx
                - LocalDatePicker.jsx
            - customizedCss/
        - otherPages/
- package.json
- jest.config.js
- .babelrc

## Mockup API
- [ ] json-server
## UI component
- [ ] react-hooks
- [X] svg component
- [X] tooltips component
- [X] popup component
- [X] OutsideClickHandler component

## Styling
- [ ] react-boosttrap
## API
- [ ] Convert to axios instead of ajax
- [ ] Add services file and handle ajax interceptor