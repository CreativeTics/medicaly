const COUCH_URL = process.env.COUCH_URL || 'http://localhost:5984'
const username = process.env.COUCH_USERNAME || 'admin'
const password = process.env.COUCH_PASSWORD || 'admin'
const database = 'medical'
const mangoQuery = {
  fields: ['_id', '_rev'],
  selector: {
    doctype: 'cie10',
  },
  limit: 10000,
}

// fetch all documents that match the mango query and delete them

const fetchAndDelete = async () => {
  const response = await fetch(`${COUCH_URL}/${database}/_find`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(username + ':' + password)}`,
    },
    body: JSON.stringify(mangoQuery),
  })
  const { docs } = await response.json()
  console.log(`Deleting ${docs.length} documents`)
  for (const [index, doc] of docs.entries()) {
    const response = await fetch(
      `${COUCH_URL}/${database}/${doc._id}?rev=${doc._rev}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${btoa(username + ':' + password)}`,
        },
      }
    )

    if (!response.ok) {
      console.error(`Error deleting document ${index + 1} of ${docs.length}`)
      console.error(await response.text())
      return
    }

    console.log(`Document ${index + 1} of ${docs.length} deleted`)
  }
}

fetchAndDelete()
