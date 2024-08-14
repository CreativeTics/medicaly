import express from 'express'
var app = express()

// set the view engine to ejs
app.set('view engine', 'ejs')

app.get('/informedConsent', function (req, res) {
	res.render('../templates/informedConsent.ejs')
})
app.get('/medicalCert', function (req, res) {
	res.render('../templates/medicalCert.ejs')
})

app.listen(8080)
console.log('Server is listening on port 8080')
