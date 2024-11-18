#!/bin/sh
YELLOW=`tput setaf 3`
GREEN=`tput setaf 2`
chmod +x stop.sh
chmod +x restart.sh

# load .env file

export $(cat .env | xargs)
# WAREHOUSE_POSTGRES_USER
# WAREHOUSE_POSTGRES_PASSWORD
# WAREHOUSE_DB_URL

# run migrations to datawarehouse

export DATABASE_URL=postgres://$WAREHOUSE_POSTGRES_USER:$WAREHOUSE_POSTGRES_PASSWORD@localhost:5432/medicaly



echo "${YELLOW}**** Running migrations ****"

yarn workspace data-migration install

yarn workspace data-migration migrate up

echo "${GREEN}**** Migrations completed ****"


