API URL: https://realguru-api.herokuapp.com/

## Endpoints

### User Services (/users - endpoint)

1. [GET] - Get user info
    endpoint: /
    headers:
        Authorization: Bearer <token>
    
2. [POST] - Create new user
    endpoint: /signup
    parameters:
        name, phone, email, username, password, confirmPassword
    required:
        name, email, username, password, confirmPassword

3. [POST] - Login user
    endpoint: /signin
    parameters:
        username, password
    required:
        username, password 

4. [PATCH] - Update user info
    endpoint: /update
    parameters:
        username, name, email, password, phone
    required:
        username
    headers:
        Authorization: Bearer <token>

5. [DELETE] - Delete user
    endpoint: /delete
    parameters:
        username
    required:
        username
    headers:
        Authorization: Bearer <token>


### Project Services (/workspaces - endpoint)


1. [POST] - Create new project
    endpoint: /publish
    parameters:
        title, project, theme, path, userId, username, published, publish_status, domain_name
    required:
       title, project, theme
    headers:
        Authorization: Bearer <token>

2. [GET] - Get all projects
    endpoint: /
    headers:
        Authorization: Bearer <token>

3. [PUT] - Update project
    endpoint: /update/:id
    parameters:
        id; title, project, theme, path, published, publish_status, domain_name
    required:
        id; title, project, theme
    headers:
        Authorization: Bearer <token>

4. [DELETE] - Delete project
    endpoint: /delete/:id
    parameters:
        id
    required:
        id
    headers:
        Authorization: Bearer <token>


### Plans Services (/plans - endpoint)

1. [GET] - Get all plans
    endpoint: /

2. [GET] - Get a plan
    endpoint: /:id
    parameters:
        id
    required:
        id

3. [POST] - Create a plan
    endpoint: /add
    parameters:
        name, price, description
    required:
        name, price, description
    headers:
        Authorization: Bearer <token>

4. [PUT] - Update a plan
    endpoint: /update/:id
    parameters:
        id; name, price, description
    required:
        id; name, price, description
    headers:
        Authorization: Bearer <token>

### Purchases Services (/purchases - endpoint)

1. [POST] - Purchase a plan
    endpoint: /purchase
    parameters:
        planId
    required:
        planId
    headers:
        Authorization: Bearer <token>

2. [GET] - Get all purchases
    endpoint: /

All purchased plans will be expired after 1 year.
So user should renew the plan after 1 year. Prompt it to the user.