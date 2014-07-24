var express = require('express'),
	swig = require('swig')
var app = express()

app.engine('html', swig.renderFile)
app.set('view engine', 'html')
app.set('views', __dirname + '/app/views')

app.use(express.static('./public'))

app.get('/', function(req, res){
	//res.send('Hello World');
	res.render('index')
})

var server = app.listen(3000, function () {
	console.log('server listen in port 3000')
})