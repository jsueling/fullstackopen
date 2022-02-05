## part5
https://fullstackopen.com/en/part5

This part is centered around developing the frontend for the bloglist app connecting to the backend made in part4. We cloned [this](https://github.com/fullstack-hy/bloglist-frontend) pre-built React frontend and modified it to synchronise with our new backend features: posting and deleting blogs, updating blogs, creating users, login and token-based authentication. This included storing the token after login success, retrieving it on app start and removing it when logging out, from the browser's local storage.

We expanded our testing to the frontend of the bloglist using the [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/). The component unit tests that I created are ```components/Blog.test.js``` and ```components/AddBlogForm.test.js```. They include firing events to interact with the rendered component and creating mock functions to test event handlers and verify the results. We then explored end-to-end testing using [Cypress](https://www.cypress.io/). To allow us to reset the database before each test we added the endpoint ```/api/testing/reset``` that is only mounted when the backend is running in test mode with ```NODE_ENV=test```. With this environment variable the config also changes to use the database for testing to prevent manipulating our production data. The endpoint resets the database by deleting the blogs and users collections. The tests can be found in ```cypress/integration/blog_app.spec.js```.