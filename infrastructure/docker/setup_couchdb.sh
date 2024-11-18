#!/bin/bash

# load .env file

export $(cat .env | xargs)
# COUCHDB_USERNAME
# COUCHDB_PASSWORD
# MAIN_USERNAME
# MAIN_PASSWORD


# Configuración de las credenciales y URL de CouchDB
COUCHDB_URL="http://$COUCHDB_USERNAME:$COUCHDB_PASSWORD@localhost:5984"

# Nombre de las bases de datos que quieres crear
DATABASES=("auth" "general" "medical" "files")

# Asegúrate de que CouchDB esté corriendo
echo "Verificando si CouchDB está corriendo..."
if ! curl --silent --fail $COUCHDB_URL/_cluster_setup; then
    echo "CouchDB no está disponible. Asegúrate de que el servicio esté corriendo."
    exit 1
fi

# Crear las bases de datos
echo "Creando las bases de datos..."
for DB in "${DATABASES[@]}"; do
    echo "Creando la base de datos: $DB"
    curl -X PUT $COUCHDB_URL/$DB
done

echo "Configuración completada y bases de datos creadas: ${DATABASES[@]}"

# Confirmar que las bases de datos se han creado correctamente
echo "Bases de datos existentes en CouchDB:"
curl --silent $COUCHDB_URL/_all_dbs


# crear datos de inicio

# rol admin

curl -X POST $COUCHDB_URL/auth -H "Content-Type:application/json"  -d '{"_id":"e8b88ac6395129395146fc374a00565a","doctype": "roles","name": "Administrador","permissions": ["roles:list","users:list","employees:list"],"isDeleted": false, "description": "Rol de administrador"}'



# initial user

curl -X POST $COUCHDB_URL/auth  -H "Content-Type:application/json"    -d '{"_id":"user-admin","doctype": "users","name": "Administrador","type": "employee","role": "e8b88ac6395129395146fc374a00565a","username": "'$MAIN_USERNAME'","tempPassword": "","encodedPassword": "'$MAIN_PASSWORD'","roleName": "Administrador","isDeleted": false,"relations": []}'






