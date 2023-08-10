#!/bin/sh
BLUE='\033[0;34m'
WHITE= '\033[0;37m' 
RED= '\033[0;31m'
YELLOW=`tput setaf 3`
GREEN=`tput setaf 2`

echo "${YELLOW}**** Stoping the service ****"
docker-compose -f infrastructure/docker/docker-compose.dev.yaml --project-name medicaly down

echo "${GREEN}**** Service stoped ****"
