#!/bin/sh
YELLOW=`tput setaf 3`
GREEN=`tput setaf 2`
chmod +x stop.sh
chmod +x restart.sh



# Start the service
echo "${YELLOW}**** Starting the service ****"
docker-compose -f infrastructure/docker/docker-compose.dev.yaml --project-name medicaly up -d --build

echo "${GREEN}**** Service started ****"

# run migrations

export DATABASE_URL=postgres://postgres:pgp4ssw0rd@localhost:5432/medicaly

echo "${YELLOW}**** Running migrations ****"

yarn workspace data-migration install

yarn workspace data-migration migrate up

echo "${GREEN}**** Migrations completed ****"




