#!/bin/sh
YELLOW=`tput setaf 3`
GREEN=`tput setaf 2`

# load .env file

export $(cat .env | xargs)

export DATABASE_URL=postgres://$WAREHOUSE_POSTGRES_USER:$WAREHOUSE_POSTGRES_PASSWORD@localhost:5432/medicaly

echo "${YELLOW}**** Running migrations ****"

yarn workspace data-migration install

yarn workspace data-migration migrate up

echo "${GREEN}**** Migrations completed ****"


