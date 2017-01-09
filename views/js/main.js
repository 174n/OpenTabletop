	
/* global $,screenfull */


/* Context menus
======================*/

$.contextMenu({
  selector: '.viewedCard', 
  callback: function(key, options) {
	switch(key) {
  		case 'dropOnTable':
			writeToJornal({
				'type': 2,
				'from': options.$trigger.parent().attr("objectid"),
				'to': 0,
				'fromId': options.$trigger.attr("objectid")
			});
			writeToJornal({
				'type': 3,
				'objectType': 'card',
				'id': -1,
				'object': { 'color':'false' }
			});
			modal();
		break;
  		case 'takeToHand':
			writeToJornal({
				'type': 2,
				'from': options.$trigger.parent().attr("objectid"),
				'to': 0,
				'fromId': options.$trigger.attr("objectid")
			});
			writeToJornal({
				'type': 3,
				'objectType': 'card',
				'id': -1,
				'object': { "color":playerColor }
			});
			modal();
		break;
		case 'zoom':
			zoomCard(options.$trigger);
		break;
	}
  },
  items: {
	"zoom": {name: "Zoom"},
	"takeToHand": { name: "Take a card for me"},
	"dropOnTable": { name: "Drop a card on the table"}
  }
});

$.contextMenu({
  selector: '.card', 
  callback: function(key, options) {
	switch(key) {
  		case 'zoom':
			zoomCard(options.$trigger);
		break;
		case 'rotate':
			rotateObject(options.$trigger)
		break;
		case 'clearColor':
			options.$trigger.css("border", "0px solid rgb(0, 0, 0)");
			writeToJornal(getObjectProperties(options.$trigger));
		break;
		case 'myColor':
			options.$trigger.css("border", "4px solid "+playerColor);
			writeToJornal(getObjectProperties(options.$trigger));
		break;
	}
  },
  items: {
	"zoom": {name: "Zoom"},
	"rotate": {name: "Rotate"},
	"color": {
			name: "Color",
			items: {
				"myColor": { name: "My color"},
				"clearColor": { name: "Clear color"},
			}
		},
  }
});


$('.add').on('click', function(e) {
	e.preventDefault();
	$('.add').contextMenu();
});

$.contextMenu({
  selector: '.add', 
  callback: function(key, options) {
	switch(key) {
		case 'counter':
			writeToJornal({
				"type":7
			});
		break;
  		case 'add':
			addObjMenu();
		break;
		case 'changeColor':
			window.location.assign("/auth.html");
		break;
		case 'fullscreen':
			if (screenfull.enabled) {
				screenfull.toggle();
			}
		break;
	}
  },
  items: {
	"counter": {name: "Add a counter"},
	"add": {name: "Add new deck"},
	"changeColor": {name: "Change color"},
	"fullscreen": {name: "Fullscreen toggle"},
  }
});

$.contextMenu({
  selector: '.counter', 
  callback: function(key, options) {
	switch(key) {
		case 'rgb(255,50,50)': case 'rgb(50,63,255)':
		case 'rgb(50, 255, 100)': case 'rgb(239,255,50)':
		case 'random':
			var chosenColor = key === 'random' ? getRandomColor() : key;
			options.$trigger.css("background-color", chosenColor);
			plColor(options.$trigger, chosenColor);
			writeToJornal( getObjectProperties(options.$trigger) );
		break;
		case '2': case '4': case '6': case '8':
		case '10': case '12': case '20': case '100':
			options.$trigger.text(Math.floor(Math.random() * parseInt(key)) + 1);
			console.log('d'+key+' - '+options.$trigger.text());
			writeToJornal( getObjectProperties(options.$trigger) );
		break;
		case 'remove':
			writeToJornal({
				"type":7,
				"remove": true,
				"id": options.$trigger.attr("objectid")
			});
			options.$trigger.remove();
		break;
	}
  },
  items: {
	"color": {name: "Change color",
			items: {
				"rgb(255,50,50)": { name: "Red"},
				"rgb(50,63,255)": { name: "Blue"},
				"rgb(50, 255, 100)": { name: "Green"},
				"rgb(239,255,50)": { name: "Yellow"},
				"random": { name: "Random" }
			}
	},
	"dice": {name: "Roll a dice",
			items: {
				"2": { name: "Roll d2"},
				"4": { name: "Roll d4"},
				"6": { name: "Roll d6"},
				"8": { name: "Roll d8"},
				"10": { name: "Roll d10" },
				"12": { name: "Roll d12"},
				"20": { name: "Roll d20" },
				"100": { name: "Roll d100" }
			}
	},
	"remove": {name: "Remove"}
  }
});


$.contextMenu({
  selector: '.deck', 
  callback: function(key, options) {
	switch(key) {
  		case 'dropOnTable':
			writeToJornal({
				'type': 2,
				'from': options.$trigger.attr("objectid"),
				'to': 0
			});
			writeToJornal({
				'type': 3,
				'objectType': 'card',
				'id': -1,
				'object': {
					"color":"false"
				}
			});
		break;
  		case 'takeToHand':
			writeToJornal({
				'type': 2,
				'from': options.$trigger.attr("objectid"),
				'to': 0
			});
			writeToJornal({
				'type': 3,
				'objectType': 'card',
				'id': -1,
				'object': {
					"color":playerColor
				}
			});
		break;
		case 'more':
			moreOptions(options.$trigger.attr("objectid"));
		break;
		case 'shuffle':
			writeToJornal({
				'type': 4,
				'deck': options.$trigger.attr("objectid")
			});
		break;
		case 'clearColor':
			options.$trigger.css("background-color", "rgb(33, 33, 33)");
			writeToJornal(getObjectProperties(options.$trigger));
		break;
		case 'myColor':
			options.$trigger.css("background-color", playerColor);
			writeToJornal(getObjectProperties(options.$trigger));
		break;
		case 'view':
			$.get("/deck", {'id':options.$trigger.attr("objectid")}, function(res) {
				viewDeck(options.$trigger.attr("objectid"), res);
			});
		break;
		case 'remove':
			writeToJornal({
				'type': 5,
				'deck': options.$trigger.attr("objectid")
			});
			options.$trigger.remove();
		break;
	}
  },
  items: {
		"dropOnTable": {
			name: "Take a card",
			items: {
				"takeToHand": { name: "Take a card for me"},
				"dropOnTable": { name: "Drop a card on the table"},
				"more": { name: "More options" },
			}
		},
		"view": {name: "View cards"},
		"shuffle": {name: "Shuffle deck"},
		"color": {
			name: "Color",
			items: {
				"myColor": { name: "My color"},
				"clearColor": { name: "Clear color"},
			}
		},
		"remove": {name: "Remove deck"},
  }
});

$(document).on('mousewheel', '.card', function(event){
	if(event.deltaY>0) zoomCard($(this));
});
$(document).on('mousewheel', '.modal', function(event){
	if(event.deltaY<0 && $(this).find('.zoomedCard').attr("src")) modal();
});
			
$(document).on('mousewheel', '.counter', function(event){
	$(this).text( parseInt($(this).text())+(event.deltaY>0 ? 1 : -1) );
	writeToJornal( getObjectProperties($(this)) );
});

/* Modals
======================*/

function modal(action, content){
	if(action===true){
		$('.modal-content').html('').html(content)
		$('.modal').show();
	}
	else{
		$('.modal').hide();
	}
}

$('.modal').on('click', function(e) {
  if (e.target !== this) return;
  modal();
});

/* Sync stuff
======================*/
var jornal, playerColor, dropped;


/*
Types:
	1 - properties
	2 - move
	3 - change properties
	6 - add object
	4 - shuffle
	5 - remove deck
*/

function sync(){
	$.ajax({
		url: '/jornal',
		type: 'POST',
		contentType:'application/json',
		data: JSON.stringify(jornal),
		dataType:'json',
		success: function(res){
			jornal=[];
			$('.objects').html('');
			playerColor = res[0].color;
			plColor($('.playersColor'),playerColor);
			for (var i = 1; i < res.length; i++) {
				addObject(res[i]);
			}
			
			$('.card').on('mouseup', function(e) {
				if(e.which == 2) {
					e.preventDefault();
					rotateObject($(this));
				}
			});
			
			$(".deck").droppable({
				drop: function(event, ui){
					if(ui.draggable.attr('class').split(' ')[0] === "card") {
						
						writeToJornal({
							'type': 3,
		 					'objectType': 'card',
							'id': ui.draggable.attr("objectid"),
							'object': { "color":"false" }
						});
						writeToJornal({
							'type': 2,
							'from': 0,
							'to': $(this).attr("objectid"),
							'fromId': ui.draggable.attr("objectid")
						});
						ui.draggable.remove();
						dropped = true;
					}
				}
			});
			
			$(".card").droppable({
				drop: function(event, ui){
					if(ui.draggable.attr('class').split(' ')[0] === "deck") {
						
						writeToJornal({
							'type': 3,
		 					'objectType': 'card',
							'id': $(this).attr("objectid"),
							'object': { "color":"false" }
						});
						writeToJornal({
							'type': 2,
							'from': 0,
							'to': ui.draggable.attr("objectid"),
							'fromId': $(this).attr("objectid"),
							'toId': 1
						});
						dropped = true;
						$(this).remove();
					}
				}
			});
			
			
			$('.moving').draggable({
				cancel : 'a',
				containment: "document",
				start: function(event, ui) { $(this).css("z-index", 200500); }
			});
			$('.moving').mouseup(function(e){
				if(e.which === 1 && !dropped) writeToJornal(getObjectProperties($(this)));
				e.stopImmediatePropagation();
				dropped = false;
			});
			
			$('.moving').click(function(){
				$(this).css("z-index", "auto");
			});
			
		},
		error: function(){ console.log('error'); }
	});
}
sync();
setInterval(function() { sync(); }, 3500);

function writeToJornal(log){
	console.log(log);
	jornal.push(log);
}

function getObjectProperties(object){

	var objectType = object.attr('class').split(' ')[0],
			output = {
				'type': 1,
				'objectType': objectType,
				'id': $(object).attr('objectid'),
				'x': $(object).offset().left,
				'y': $(object).offset().top,
			}
	if(objectType === 'card'){
		output.link = $(object).attr('src');
		
		var rotation = $(object).getRotateAngle()[0];
		output.rotation = rotation === undefined ? 0 : rotation;
		
		var color = $(object).css('border-left-color');
		output.color = color === "rgb(0, 0, 0)" || color === undefined ? 'false' : color;
	}
	else if(objectType === 'deck'){
		var color = $(object).css('background-color');
		output.color = color === "rgb(33, 33, 33)" ? 'false' : color;
	}
	else if(objectType === 'counter'){
		output.count = isNaN($(object).text()) ? 0 : parseInt($(object).text());
		output.color = $(object).css('background-color');
	}

	return output;
}

function addObject(properties){
	$('.'+properties.objectType+'[objectId="'+properties.id+'"]').remove();
	
	if(properties.objectType === "card"){
		$('.objects').append(
			'<img src="'+properties.link+
			'" class="'+properties.objectType+
			' moving" objectid="'+properties.id+'">'
		);
		var object = $('.'+properties.objectType+'[objectId="'+properties.id+'"]');
		object.rotate(properties.rotation);
		if(properties.color !== "false" && properties.color !== undefined) object.css("border", "4px solid "+ properties.color);

	}
	else if(properties.objectType === "deck") {
		$('.objects').append(
			'<div class="'+properties.objectType+
			' moving" objectid="'+properties.id+'"><div class="deck-title">Deck '+properties.id+'</div>'+
			'<div class="deck-card-count">'+properties.quantity+'</div>'+
			'<a href="javascript:takeToHand('+properties.id+')">Take</a></div>'
		);
		var object = $('.'+properties.objectType+'[objectId="'+properties.id+'"]');
		properties.color = properties.color === "false" || properties.color === undefined ? "#212121" : properties.color;
		object.css("background-color", properties.color);
	}
	else if(properties.objectType === "counter") {
		$('.objects').append('<div class="'+properties.objectType+
		' moving" objectid="'+properties.id+'">'+properties.count+'</div>');
		var object = $('.'+properties.objectType+'[objectId="'+properties.id+'"]');
		object.css("background-color", properties.color);
		if(properties.x === 0) properties.x = 100;
		plColor(object, properties.color);
	}
	
	object.css("left", properties.x);
	object.css("top", properties.y);
}


/* Ohter stuff
======================*/

function rotateObject(object){
	var rotate = object.getRotateAngle()[0]+90;
	rotate = rotate > 90 ? 0 : rotate
	object.rotate(rotate);
	writeToJornal(getObjectProperties(object));
}

function zoomCard(object){
	modal(true, '<img src="'+object.attr("src")+'" class="zoomedCard">');
}

function viewDeck(id, deck){
	var temp='<div class="deckList" objectid="'+id+'">';
	$.each(deck, function(i, v) {
		temp += '<img class="viewedCard" src="'+v.link+'" objectid="'+(i+1)+'">';
	});
	temp += '</div>';
	modal(true, temp);
}

function addObjMenu(){
	modal(true, '\
	<div class="addDeck">\
		<textarea placeholder="Type here card URLs"></textarea>\
		<div class="button"><button onclick="addObjs()">ADD</button></div>\
	</div>\
	');
}


function moreOptions(deck){
	modal(true, '\
	<div class="moreOptions">\
	<div class="input-field">Number of the card <input type="number" min="1" id="cardN" value="1"></div>\
	<div class="input-field">From end\
		<div class="squaredThree">\
			<input type="checkbox" id="fromEnd" name="check" checked><label for="fromEnd"></label>\
		</div>\
	</div>\
	<div class="input-field">Take card for me\
		<div class="squaredThree">\
			<input type="checkbox" id="forMe" name="check" checked><label for="forMe"></label>\
		</div>\
	</div>\
	<div class="input-field">Quantity <input type="number" min="1" id="quantity" value="1"></div>\
	<div class="input-field"><button id="drop">Drop</button></div>\
</div>');

	$('#drop').click(function() {
		writeToJornal({
			'type': 2,
			'from': deck,
			'to': 0,
			'fromId': ($("#fromEnd").prop("checked") ? $('#cardN').val()*(-1) : $('#cardN').val()),
			'quantity': $('#quantity').val()
		});
		if($("#forMe").prop("checked"))
		for (var i = 1; i <= parseInt($('#quantity').val()); i++) {
			writeToJornal({
				'type': 3,
				'objectType': 'card',
				'id': -1*i,
				'object': { "color":playerColor }
			});
		}
	});
}


function addObjs(){
	writeToJornal({
		'type': 6,
		'objs': $('.addDeck textarea').val().split('\n')
	});
}


function takeToHand(deck){
	writeToJornal({
		'type': 2,
		'from': deck,
		'to': 0
	});
	writeToJornal({
		'type': 3,
		'objectType': 'card',
		'id': -1,
		'object': {
			'color':playerColor
		}
	});
}


function getLastElement(elem){
	return $(elem).length;
}


function plColor(elem, c) {
//http://stackoverflow.com/questions/11867545
  var rgb=c.replace(/\D+/g, ',').slice(1,-1).split(',');
  var o = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) / 1000);
  (o > 125) ? elem.css('color', '#212121'): elem.css('color', '#EEE');
  elem.css('background-color', c);
  rgb[0] = Math.round(Math.random() * 255);
  rgb[1] = Math.round(Math.random() * 255);
  rgb[2] = Math.round(Math.random() * 255);
  return true;
}

function getRandomColor() {
//http://stackoverflow.com/questions/1484506
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}


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