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

# Asegúrate de que CouchDB esté corriendo antes de continuar
echo "Verificando si CouchDB está corriendo..."

while ! curl --silent --fail $COUCHDB_URL; do
    echo "CouchDB no está disponible. Intentando nuevamente en 5 segundos..."
    sleep 5
done


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


echo "Creando indices"

# initial index for general

curl -X POST $COUCHDB_URL/general/_index -H "Content-Type:application/json" -d '{"index": {"fields": ["doctype","isDeleted"]},"name": "doctype-index","type": "json"}'

curl -X POST $COUCHDB_URL/general/_index -H "Content-Type:application/json" -d '{"index": {"fields": ["doctype","isDeleted","name"]},"name": "by-name-index","type": "json"}'

curl -X POST $COUCHDB_URL/general/_index -H "Content-Type:application/json" -d '{"index": {"fields": ["doctype","isDeleted","code"]},"name": "by-code-index","type": "json"}'


# initial index for medical

curl -X POST $COUCHDB_URL/medical/_index -H "Content-Type:application/json" -d '{"index": {"fields": ["doctype","isDeleted"]},"name": "doctype-index","type": "json"}'

echo "Indices creados"

echo "Creando datos iniciales"

# crear datos de inicio
DATE=$(date -u +"%Y-%m-%dT%H:%M:%S.%3Z")

# rol admin

curl -X POST $COUCHDB_URL/auth -H "Content-Type:application/json"  -d '{"_id":"e8b88ac6395129395146fc374a00565a","doctype": "roles","name": "Administrador","permissions": ["roles:list","users:list","employees:list"],"isDeleted": false, "description": "Rol de administrador"}'



# initial user

curl -X POST $COUCHDB_URL/auth  -H "Content-Type:application/json"    -d '{"_id":"user-admin","doctype": "users","name": "Administrador","type": "employee","role": "e8b88ac6395129395146fc374a00565a","username": "'$MAIN_USERNAME'","tempPassword": "","encodedPassword": "'$MAIN_PASSWORD'","roleName": "Administrador","isDeleted": false,"relations": [], "createdAt": "'$DATE'","updatedAt": "'$DATE'","updatedBy": "user-admin"}'


# initial position


curl -X POST $COUCHDB_URL/general -H "Content-Type:application/json" -d '{"_id":"ca6ed7c97762d574d3c4501e7c001114","doctype": "positions","name": "ADMINISTRADOR","allowFinishServiceOrder": false,"createdAt": "'$DATE'","updatedAt": "'$DATE'","updatedBy": "user-admin","isDeleted": false}'


# Exam types

curl -X POST $COUCHDB_URL/medical -H "Content-Type:application/json" -d '{"_id":"78562cce6597f42f93b6cece2400d62b","doctype": "exam-types","code": "EXAM","name": "EXAMEN","createdAt": "'$DATE'","updatedAt": "'$DATE'","updatedBy": "user-admin","isDeleted": false}'

curl -X POST $COUCHDB_URL/medical -H "Content-Type:application/json" -d '{"_id":"78562cce6597f42f93b6cece2400d62c","doctype": "exam-types","code": "PARACLINIC","name": "PARACLINICO","createdAt": "'$DATE'","updatedAt": "'$DATE'","updatedBy": "user-admin","isDeleted": false}'

curl -X POST $COUCHDB_URL/medical -H "Content-Type:application/json" -d '{"_id":"78562cce6597f42f93b6cece2400d62d","doctype": "exam-types","code": "LABORATORY","name": "LABORATORIO","createdAt": "'$DATE'","updatedAt": "'$DATE'","updatedBy": "user-admin","isDeleted": false}'

echo "Datos iniciales creados"

echo "Configuración finalizada"













