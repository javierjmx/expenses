# Expenses API

The REST API provide programmatic access to read and write expenses.

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
