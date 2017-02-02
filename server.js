var express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  app = express(),
  validUrl = require('valid-url'),
  objects = [
	[{"color": "false", "counters": [] }]];

app.use(cookieParser())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));



var merge = function() {
//http://stackoverflow.com/questions/14974864/combine-or-merge-json-on-node-js-without-jquery
	var destination = {},
		sources = [].slice.call( arguments, 0 );
	sources.forEach(function( source ) {
		var prop;
		for ( prop in source ) {
			if ( prop in destination && Array.isArray( destination[ prop ] ) ) {
				destination[ prop ] = destination[ prop ].concat( source[ prop ] );
			} else if ( prop in destination && typeof destination[ prop ] === "object" ) {
				destination[ prop ] = merge( destination[ prop ], source[ prop ] );
			} else {
				destination[ prop ] = source[ prop ];
			}
		}
	});
	return destination;
};



function shuffle(array) {
//http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

	var currentIndex = array.length, temporaryValue, randomIndex;
	while (0 !== currentIndex) {

		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}



function authorized(req, res, next){
	if(req.cookies.color || req.url == "/auth.html" || req.url == "/auth") next()
	else res.redirect('/auth.html');
}

function move(color, from, to, fromId, quantity, toId){
	quantity = Number.isNaN(quantity) ? 1 : quantity,
	fromId = Number.isNaN(fromId) ? objects[from].length-1 : fromId,
	toId = Number.isNaN(toId) ? objects[to].length : toId;
	if (fromId<0) fromId = objects[from].length+fromId*quantity;
  
  if(
	Array.isArray(objects[from]) && Array.isArray(objects[to]) &&
	fromId !== 0 && toId !== 0  && objects[from][fromId] !== undefined &&
	(objects[from][0].color === color || objects[from][0].color === "false") &&
	(objects[to][0].color === color || objects[to][0].color === "false") &&
	((objects[to][toId] !== undefined && (objects[to][toId].color === color || objects[to][toId].color === "false")) || objects[to][toId] === undefined) &&
	(objects[from][fromId].color === color || objects[from][fromId].color === "false")
	/* && objects[from].slice((fromId>0 ? fromId : objects[from].length-fromId), fromId+quantity-1).length === quantity*/
	)
	objects[to].splice.apply(objects[to], [toId, 0].concat(objects[from].splice(fromId, quantity)) );
  else console.log('Error in move()');
}


function doJornal(log, color){
  
  for (var i = 0; i < log.length; i++) {
	if(log[i] !== undefined)
	switch (log[i].type) {
	  //edit object
	  case 1:
		if(log[i].color === color || log[i].color === "false" || log[i].objectType === 'counter')
		switch (log[i].objectType) {
		  case 'card':
			if(objects[0][parseInt(log[i].id)] !== undefined && objects[0][parseInt(log[i].id)].color === "false" || objects[0][parseInt(log[i].id)].color === color)
			objects[0][parseInt(log[i].id)] = {
			  x: log[i].x,
			  y: log[i].y,
			  link: log[i].link,
			  rotation: log[i].rotation,
			  color: log[i].color
			};
		  break;
		  case 'deck':
			if(objects[parseInt(log[i].id)][0] !== undefined && objects[parseInt(log[i].id)][0].color === "false" || objects[parseInt(log[i].id)][0].color === color)
			objects[parseInt(log[i].id)][0] = {
			  x: log[i].x,
			  y: log[i].y,
			  color: log[i].color
			};
		  break;
		  case 'counter':
			if(objects[0][0].counters[parseInt(log[i].id)] !== undefined)
			objects[0][0].counters[parseInt(log[i].id)] = {
			  x: log[i].x,
			  y: log[i].y,
			  count: log[i].count,
			  color: log[i].color
			};
		  break;
		}
	  break;
	  //move card
	  case 2://from,to
		move(color, parseInt(log[i].from), parseInt(log[i].to), parseInt(log[i].fromId), parseInt(log[i].quantity), parseInt(log[i].toId), parseInt(log[i].toDirection));
	  break;
	  //edit object properties
	  case 3://objectType, id, object
		switch (log[i].objectType) {
		  case 'card':
			if(log[i].id !== undefined && log[i].id < 0) log[i].id = objects[0].length+log[i].id;
			if(objects[0][parseInt(log[i].id)] !== undefined && (objects[0][parseInt(log[i].id)].color === "false" || objects[0][parseInt(log[i].id)].color === color))
			  objects[0][parseInt(log[i].id)] = merge(objects[0][parseInt(log[i].id)], log[i].object);
		  break;
		  case 'deck':
			if(objects[parseInt(log[i].id)][0] !== undefined && (objects[parseInt(log[i].id)][0].color === "false" || objects[parseInt(log[i].id)][0].color === color))
			  objects[parseInt(log[i].id)][0] = merge(objects[parseInt(log[i].id)][0], log[i].object);
		  break;
		}
	  break;
	  //shuffle deck
	  case 4:
		//console.log(objects[log[i].deck]);
		if(Array.isArray(objects[log[i].deck]) && objects[log[i].deck].length>1 && (objects[log[i].deck][0].color === color || objects[log[i].deck][0].color === "false")/* && (objects[log[i].deck][0].color === "false" || objects[log[i].deck][0].color === color) */)
		  objects[log[i].deck] = [objects[log[i].deck][0]].concat( shuffle(objects[log[i].deck].slice(1)) )
		  else console.log("error in shuffle");
	  break;
	  //remove deck
	  case 5:
		if(Array.isArray(objects[log[i].deck]) && log[i].deck !== 0 && (objects[log[i].deck][0].color === color || objects[log[i].deck][0].color === "false"))
		  objects.splice(log[i].deck, 1);
	  break;
	  //add object
	  case 6:
		var temp=true;
		for (var j = 0; j < log[i].objs.length; j++) {
		  if (!validUrl.isUri( log[i].objs[j] )) temp = false;
		}
		if(temp === true){
		  var d = objects.push([{
			"color": color
		  }])-1;
		  for (var j = 0; j < log[i].objs.length; j++) {
			objects[d].push({
			  "link": log[i].objs[j],
			  "color": "false"
			});
		  }
		}
		else if(log[i].objs[0] === '' || log[i].objs.length === 1) objects.push([{ "color": color }]);
	  break;
	  //add counter
	  case 7:
		if(log[i].remove && log[i].id !== undefined && objects[0][0].counters[log[i].id] !== undefined)
		  objects[0][0].counters.splice(log[i].id, 1);
		else objects[0][0].counters.push({
		  "x":100,
		  "y":0,
		  "count": 0,
		  "color":"rgb(33, 33, 33)"
		});
	  break;
	}
  }
  
}

app.post('/jornal', authorized, function(req, res){
	var output=[{"color":req.cookies.color}],n;

	doJornal(req.body, req.cookies.color);
  
	for (var i = 1; i < objects[0].length; i++) {//cards
		n = output.push(Object.assign({}, objects[0][i])) -1;
		if(output[n].color !== req.cookies.color && output[n].color !== "false"){
		  output[n].link = "/img/blank.gif";
		}
		output[n].id = i;
		output[n].objectType = "card";
	}
  
	for (var i = 1; i < objects.length; i++) {//decks
		n = output.push(Object.assign({}, objects[i][0])) -1;
		output[n].id = i;
		output[n].objectType = "deck";
		output[n].quantity = objects[i].length-1;
	}
  
  
	for (var i = 0; i < objects[0][0].counters.length; i++) {//decks
		n = output.push(Object.assign({}, objects[0][0].counters[i])) -1;
		output[n].id = i;
		output[n].objectType = "counter";
	}

	res.json(output);
});



app.get('/deck', authorized, function(req, res){
	if(req.query.id>0) {
		if(
			Array.isArray(objects[req.query.id]) &&
			(objects[req.query.id][0].color === req.cookies.color ||
			objects[req.query.id][0].color === "false")
		){
			res.json(objects[req.query.id].slice(1));
		}
	}
  else res.json([]);
});

app.get('/auth', function(req, res){
	if(req.query.color !== undefined) {
		var arr = req.query.color.split(','), temp=true;
		for (var i = 0; i < arr.length; i++) {
		  if(!(parseInt(arr[i])>0 && parseInt(arr[i])<=255)) temp = false;
		}
		if(temp) res.cookie('color', 'rgb('+arr.join(', ')+')');
	}
	res.redirect("/");
});




app.use(authorized, express.static(__dirname + '/views'));

var server_port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT ||  80;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '127.0.0.1';

server.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", port " + server_port )
});


/*

Copyright 2016-2017 Ivan Alexandrov

This file is part of OpenTabletop.

    OpenTabletop is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    OpenTabletop is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with OpenTabletop.  If not, see <http://www.gnu.org/licenses/>.

*/