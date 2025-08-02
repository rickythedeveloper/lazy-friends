# DB
This folder provides tools to manage database migrations.

## Prerequisites
- Docker

## Start DB
- `docke compose up db -d`

## Run migration
- `docker-compose run migrate`

## Debugging
- `docker-compose run migrate bash -i` to get a shell into the container

## Inspect database
- `docker-compose exec db bash` to enter the db container shell
- `psql -U postgres -d postgres` to connect to the database