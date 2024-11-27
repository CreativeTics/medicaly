
YELLOW=`tput setaf 3`
GREEN=`tput setaf 2`
chmod +x setup_couchdb.sh
chmod +x migrate.sh

# Start the service
echo "${YELLOW}**** Starting services ****"
docker-compose -f ./docker-compose.prod.yaml --project-name medicaly_prod up -d --build

echo "${GREEN}**** Services started ****"


# setup couchdb

echo "${YELLOW}**** Setting up CouchDB ****"

./setup_couchdb.sh

echo "${GREEN}**** CouchDB setup completed ****"

# run migrations

./migrate.sh

echo "${GREEN}**** Setup completed ****"


