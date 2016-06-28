# Expenses API

The REST API provide programmatic access to read and write expenses.

## Development

Requires node.js => 4.0 and a PostgreSQL installation.

Clone this repo, copy `default-config.json` to `config.json` and run `npm start`.

Includes a live linter: `npm run linter:live`.

## Authentication on all endpoints

It is required to clients to authenticate all of their requests with [JSON Web Token](https://jwt.io/).

## API

### POST /register

Create a new account and authenticate.

Parameters are read from body in JSON format.

#### Parameters

##### email `required`

An email address. If it's already in the database, it will return a 400.

##### password `required`

A password.

##### confirmation `required`

A confirmation password. It must be the same as password. If it's not, a 400 will be returned.

#### Result

```javascript
{
  "user": {
    "id": 123,
    "email": "hello@expenses.com"
  },
  "token": "a_really_long_string"
}
```

### POST /authenticate

Authentication endpoint.

Parameters are read from body in JSON format.

#### Parameters

##### email `required`

An email address.

##### password `required`

The password of such account.

#### Result

```javascript
{
  "message": "Authentication successful.",
  "token": "a_really_long_string"
}
```

### GET /categories

List categories.

Parameters are read from URL query.

#### Parameters

##### name `optional`

Filter categories by name.

#### Result

```javascript
[
  {
    "id": 9,
    "name": "food",
    "userid": 3
  }
]
```

### POST /categories

Create category.

Parameters are read from URL query.

#### Parameters

##### name `required`

Name of the category.

#### Result

```javascript
{
  "id": 9,
  "name": "food",
  "userid": 3
}
```

### GET /categories/:id

Get category.

#### Result

```javascript
{
  "id": 9,
  "name": "food",
  "userid": 3
}
```

### PUT /categories/:id

Update category.

Parameters are read from URL query.

#### Parameters

##### name `required`

Name of the category.

#### Result

```javascript
{
  "id": 9,
  "name": "health",
  "userid": 3
}
```

### DELETE /categories/:id

Remove category.

#### Result

```javascript
{
  "id": 9,
  "name": "health",
  "userid": 3
}
```

### GET /expenses

List expenses.

Parameters are read from URL query.

#### Parameters

##### start `optional`

Filter expenses by a start date.

##### end `optional`

Filter expenses by an end date.

##### category_id `optional`

Filter expenses by category id.

#### Result

```javascript
[
  {
    "id": 9,
    "quantity": 100,
    "categoryid": 3,
    "date": "2016-06-26"
  }
]
```

### POST /expenses

Create an expense.

Parameters are read from URL query.

#### Parameters

##### quantity `required`

Quantity of the expense.

##### category_id `required`

Category id of the expense.

##### date `optional`

Date of the expense. Defaults to today.

#### Result

```javascript
{
  "id": 9,
  "quantity": 100,
  "categoryid": 3,
  "date": "2016-06-26"
}
```

### GET /expenses/:id

Get expense.

#### Result

```javascript
{
  "id": 9,
  "quantity": 100,
  "categoryid": 3,
  "date": "2016-06-26"
}
```

### PUT /expenses/:id

Update expense.

Parameters are read from URL query.

#### Parameters

##### quantity `optional`

Quantity of the expense.

##### category_id `optional`

Category id of the expense.

##### date `optional`

Date of the expense. Defaults to today.

#### Result

```javascript
{
  "id": 9,
  "quantity": 100,
  "categoryid": 3,
  "date": "2016-06-26"
}
```

### DELETE /expense/:id

Remove expense.

#### Result

```javascript
{
  "id": 9,
  "quantity": 100,
  "categoryid": 3,
  "date": "2016-06-26"
}
```
