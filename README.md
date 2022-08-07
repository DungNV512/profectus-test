
# Refactoring To-do List
## Structure code
├── internals/
├── public/
├── src/
│   ├── assets/
│   ├── selectors/
│   ├── sagas/
│   ├── slices/
│   ├── services/
│   ├── SharedComponents
│   │   ├── index.js
│   │   ├── modal/
|   │   │   ├── index.js
|   │   │   ├── styles.scss
|   │   │   ├── __tests__
|   │   |   │   ├── index.test.js
│   │   ├── Header/
|   │   │   ├── index.js
|   │   │   ├── styles.scss
|   │   │   ├── __tests__
|   │   |   │   ├── index.test.js
│   │   ├── HTabContainer.jsx
│   │   ├── Select.jsx
│   │   ├── TabContainer.jsx
│   ├── pages/
│   │   ├── ClaimDetailsPage/
|   │   │   ├── index.js
|   │   │   ├── assets/
|   │   │   ├── sharedComponents/
|   │   │   |   ├── Modal/
|   │   │   |   ├── Tooltip/
|   │   │   ├── components/
|   │   │   |   ├── AuditTypeContent.jsx
|   │   │   |   ├── ClaimDetails.jsx
|   │   │   |   ├── ClaimDetailsVerticalIconMenu.jsx
|   │   │   |   ├── ClaimDetailValue.jsx
|   │   │   |   ├── ClaimProcessDetails.jsx
|   │   │   |   ├── ClaimValue.jsx
|   │   │   |   ├── InlineEditableField.jsx
|   │   │   |   ├── LocalDatePicker.jsx
|   │   │   ├── customizedCss/
│   │   ├── otherPages/
├── package.json
├── jest.config.js
├── .babelrc
        
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