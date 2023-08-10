#!/bin/sh
YELLOW=`tput setaf 3`
GREEN=`tput setaf 2`
chmod +x stop.sh
chmod +x restart.sh



# Start the service
echo "${YELLOW}**** Starting the service ****"
docker-compose -f infrastructure/docker/docker-compose.dev.yaml --project-name medicaly up -d --build

echo "${GREEN}**** Service started ****"


