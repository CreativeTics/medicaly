
# create users db
# curl -X PUT http://192.168.101.6:5984/db/_users -H "Content-Type: application/json" -H "Authorization: Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh"


curl -X POST http://localhost:5984/files/_compact  -H "Content-Type: application/json" -H "Authorization: Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh"



curl -X POST http://192.168.101.6:5984/_replicate -H "Content-Type: application/json" -H "Authorization: Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh" -d '
{
  "source": {
    "url": "http://192.168.101.6/db/auth",
    "headers": {
      "Authorization": "Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh"
    }
  },
  "target": {
    "url": "http://192.168.101.6:5984/auth",
    "headers": {
      "Authorization": "Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh"
    }
  },
  "create_target": true,
  "continuous": true
}'

curl -X POST http://192.168.101.6/db/_replicate -H "Content-Type: application/json" -H "Authorization: Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh" -d '
{
  "target": {
    "url": "http://192.168.101.6/db/auth",
    "headers": {
      "Authorization": "Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh"
    }
  },
  "source": {
    "url": "http://192.168.101.6:5984/auth",
    "headers": {
      "Authorization": "Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh"
    }
  },
  "create_target": true,
  "continuous": true
}'

# # files

curl -X POST http://192.168.101.6:5984/_replicate -H "Content-Type: application/json" -H "Authorization: Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh" -d '
{
  "source": {
    "url": "http://192.168.101.6/db/files",
    "headers": {
      "Authorization": "Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh"
    }
  },
  "target": {
    "url": "http://192.168.101.6:5984/files",
    "headers": {
      "Authorization": "Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh"
    }
  },
  "create_target": true,
  "continuous": true
}'

curl -X POST http://192.168.101.6/db/_replicate -H "Content-Type: application/json" -H "Authorization: Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh" -d '
{
  "target": {
    "url": "http://192.168.101.6/db/files",
    "headers": {
      "Authorization": "Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh"
    }
  },
  "source": {
    "url": "http://192.168.101.6:5984/files",
    "headers": {
      "Authorization": "Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh"
    }
  },
  "create_target": true,
  "continuous": true
}'

# # general

curl -X POST http://192.168.101.6:5984/_replicate -H "Content-Type: application/json" -H "Authorization: Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh" -d '
{
  "source": {
    "url": "http://192.168.101.6/db/general",
    "headers": {
      "Authorization": "Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh"
    }
  },
  "target": {
    "url": "http://192.168.101.6:5984/general",
    "headers": {
      "Authorization": "Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh"
    }
  },
  "create_target": true,
  "continuous": true
}'

curl -X POST http://192.168.101.6/db/_replicate -H "Content-Type: application/json" -H "Authorization: Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh" -d '
{
  "target": {
    "url": "http://192.168.101.6/db/general",
    "headers": {
      "Authorization": "Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh"
    }
  },
  "source": {
    "url": "http://192.168.101.6:5984/general",
    "headers": {
      "Authorization": "Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh"
    }
  },
  "create_target": true,
  "continuous": true
}'

# medical
curl -X POST http://192.168.101.6:5984/_replicate -H "Content-Type: application/json" -H "Authorization: Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh" -d '
{
  "source": {
    "url": "http://192.168.101.6/db/medical",
    "headers": {
      "Authorization": "Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh"
    }
  },
  "target": {
    "url": "http://192.168.101.6:5984/medical",
    "headers": {
      "Authorization": "Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh"
    }
  },
  "create_target": true,
  "continuous": true
}'

curl -X POST http://192.168.101.6/db/_replicate -H "Content-Type: application/json" -H "Authorization: Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh" -d '
{
  "target": {
    "url": "http://192.168.101.6/db/medical",
    "headers": {
      "Authorization": "Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh"
    }
  },
  "source": {
    "url": "http://192.168.101.6:5984/medical",
    "headers": {
      "Authorization": "Basic NGRtMW4tdXMzcjo0ZG0xbi1wNHNzdzByZCEh"
    }
  },
  "create_target": true,
  "continuous": true
}'