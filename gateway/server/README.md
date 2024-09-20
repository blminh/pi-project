# Run project

## init

- yarn install
- copy file .env.example -> .env && config it

## gen db

- create db: yarn run migrate:up
- insert data: yarn run seed:up

## build and run

- build project: yarn run build
- start project: yarn run start
- or watch project when dev: yarn run watch

# Database

- Create new table: yarn sequelize-cli migration:generate --name migration-example
- Generate migration: yarn run migrate:up
- Undo migration: yarn run migrate:undo

- Generate seed file: yarn sequelize-cli seed:generate --name model_name
- Run seed file: yarn sequelize-cli db:seed:all
- Undo seed: yarn sequelize-cli db:seed:undo
