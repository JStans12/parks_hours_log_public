//URLs from published sheets
var shopURL = "https://docs.google.com/spreadsheets/d/1yhD34ZXY09Ehp8sjB0ZNTXa2Ml1aJysw7Tai7kMf1-4/pub?gid=1247169402&single=true&output=csv"
var employeeURL = "https://docs.google.com/spreadsheets/d/1yhD34ZXY09Ehp8sjB0ZNTXa2Ml1aJysw7Tai7kMf1-4/pub?gid=1136551263&single=true&output=csv"
var localURL = "https://docs.google.com/spreadsheets/d/1yhD34ZXY09Ehp8sjB0ZNTXa2Ml1aJysw7Tai7kMf1-4/pub?gid=1413220658&single=true&output=csv"
var objectURL = "https://docs.google.com/spreadsheets/d/1yhD34ZXY09Ehp8sjB0ZNTXa2Ml1aJysw7Tai7kMf1-4/pub?gid=1147372823&single=true&output=csv"
var activityURL = "https://docs.google.com/spreadsheets/d/1yhD34ZXY09Ehp8sjB0ZNTXa2Ml1aJysw7Tai7kMf1-4/pub?gid=340478616&single=true&output=csv"

//define function to pull data from sheets
function runGet(url, sheet, object, key){
	
	$.ajax(url)
		.done(function(result){	
		window[sheet] = result;
		str2Object(result, object, key) //arrange data into objects
	});
}

//function to turn strings from sheets into objects
function str2Object(sheet, object, key){

	//string to 2d array
	var spl = sheet.split('\n');
	for (var i=0 ; i<spl.length ; i++){	
		spl[i] = spl[i].split(',')
	}
	
	var obj = {}; //placeholder object

	//2d array to object
	spl.forEach((x)=>{
		obj[x[0]] = x.slice(1);
	})

	window[object] = obj;	//variable for the object
	window[key] = Object.keys(obj); //variable for the keys
}

//get data and setup page
$(window).load(function(){
	
	$(document).ajaxStop(function(){
		$(this).unbind('ajaxStop');
			addRow();
			populateShop();
	});
	
	getData();
	
});

function getData(){
	
	runGet(shopURL, 'shopSheet', 'shopSelect', 'shopKeys');
	runGet(employeeURL, 'employeeSheet', 'employeeSelect', 'employeeKeys');
	runGet(localURL, 'localSheet', 'localSelect', 'localKeys');
	runGet(objectURL, 'objectSheet', 'objectSelect', 'objectKeys');
	runGet(activityURL, 'activitySheet', 'activitySelect', 'activityKeys');

}

var rowCounter = 0 //counter to define unique variables for new rows

//function to add rows
function addRow(){
	
	$('#responses').append('<tr id="'+rowCounter+'"><td class="tag">Hours</td><td><input type="text"; id="hours'+rowCounter+'"></td><td class="tag">Location</td><td><select id="local'+rowCounter+'"></select></td><td class="tag">Object</td><td><select id="object'+rowCounter+'"; class="objectClass"></select></td><td class="tag">Activity</td><td><select id="activity'+rowCounter+'"></select></td><td class="tag">Equip Diff</td><td><input type="text"; id="eDif'+rowCounter+'"></td></tr>');
	populateInitialSelects();
	rowCounter++	
}

function deleteLastRow(){
	
	document.getElementById("responses").deleteRow(rowCounter-1);
	if (rowCounter>0){
	rowCounter--
	}
}

//populate shop select
function populateShop(){
	for (var i=0 ; i<shopKeys.length ; i++){
		$('#shop')
		.append('<option>'+shopKeys[i]+'</option>');
	}
}
	
function populateInitialSelects(){
	
	//populate location select
	for (var i=0 ; i<localKeys.length ; i++){
		$('#local'+rowCounter+'')
		.append('<option>'+localKeys[i]+'</option>');
	}
	
	//populate object select
	for (var i=0 ; i<objectKeys.length ; i++){
		$('#object'+rowCounter+'')
		.append('<option>'+objectKeys[i]+'</option>');
	}	
}

//populate based on changes

//populate employee select

$(document).on('change','#shop',function(){	
	$('#name')
	.find('option')
	.remove()
	.end()
	.append('<option>'+employeeKeys[0]+'</option>');
		
	var shop = document.getElementById("shop");
	var shopChoice = shop.options[shop.selectedIndex].text;
	
	for (var j=0 ; j<shopSelect[shopChoice].length ; j++){
		var currentEmployee = shopSelect[shopChoice][j];
		$('#name')
		.append('<option>'+currentEmployee+'</option>');
	}
});

//popualte activity select
$(document).on('change','.objectClass',function(){
	
	var currentRow = $(this).closest('tr').attr('id'); //get the id of the row being changed
	
	//remove existing options
	$('#activity'+currentRow+'') 
		.find('option')
		.remove()
		.end()
		.append('<option>'+activityKeys[0]+'</option>');
		
	//variable for selected object
	var obj = document.getElementById('object'+currentRow+'');
	var objectChoice = obj.options[obj.selectedIndex].text; 
	
	for (var i=1 ; i<objectSelect[objectChoice].length ; i++){
		var currentAct = objectSelect[objectChoice][i];
		for (var j=0 ; j<activityKeys.length ; j++){
			if (currentAct === activitySelect[activityKeys[j]][0]){
				var currentActName = activityKeys[j]
				$('#activity'+currentRow+'')
					.append('<option>'+currentActName+'</option>');
			}
		}
	}

}); 

function buildForm(rowID){
	
	var date = document.getElementById('datepicker').value;
	var shop = document.getElementById('shop').value;
	var employee = document.getElementById('name').value;
	var employeeID = employeeSelect[employee][0];
	var hours = document.getElementById('hours'+rowID+'').value;
	var local = document.getElementById('local'+rowID+'').value;
	var localID = localSelect[local][0];
	var object = document.getElementById('object'+rowID+'').value;
	var objectID = objectSelect[object][0];
	var activity = document.getElementById('activity'+rowID+'').value;
	var activityID = activitySelect[activity][0];
	var eDif = document.getElementById('eDif'+rowID+'').value;
	
	document.getElementById('date').value = date
	document.getElementById('shopForm').value = shop
	document.getElementById('employee').value = employee
	document.getElementById('employeeID').value = employeeID
	document.getElementById('hours').value = hours
	document.getElementById('localID').value = localID
	document.getElementById('objectID').value = objectID
	document.getElementById('activityID').value = activityID
	document.getElementById('eDif').value = eDif
}

function errorCheck(){
	
	var date = document.getElementById('datepicker').value;
	var shop = document.getElementById('shop').value;
	var employee = document.getElementById('name').value;
	var employeeID = +employeeSelect[employee][0];
	var pWord = +document.getElementById('pWord').value;
	
	if (pWord != employeeID){
		return "Name and ID don't match."
	
	} else if (shop === ''){
		return "Missing Shop."
		
	} else if (employee === ''){
		return "Missing Name."
		
	} else if (date === ''){
		return "Missing Date."
		
	} else {
	
	for (var i=0 ; i<rowCounter ; i++){
		var hours = document.getElementById('hours'+i+'').value;
		var local = document.getElementById('local'+i+'').value;
		var object = document.getElementById('object'+i+'').value;
		var activity = document.getElementById('activity'+i+'').value;
		
		if (hours === ''){
			return "Missing Hours in row " + i+1 + "."
			
		} else if (local === ''){
			return "Missing Location in row " + i+1 + "."
		
		} else if (object === ''){
			return "Missing Object in row " + i+1 + "."
		
		} else if (activity === ''){
			return "Missing Activity in row " + i+1 + "."
		
		} else if (isNaN(hours)){
			return "Hours must be a number."
		}
	}
	}
}	
	
var request; //variable to hold request

//bind to the submit event of form
$(document).on('submit', '#sub', function(event){

	//check for errors
	if (errorCheck()){
		
		window.alert(errorCheck())
		return false
		
	} else {
		
		//find total hours
		var hoursTotal = 0
		for (var j=0 ; j<rowCounter ; j++){
			var rowHours = +document.getElementById('hours'+j+'').value;
			hoursTotal += rowHours;
		}
	
		if (confirm("Submit "+ hoursTotal +" Hours?")){
	
    // abort any pending request
		if (request) {
			request.abort();
		}

		for (var i=0 ; i<rowCounter ; i++){	

			buildForm(i);

			var $form = $('#form4Submit');
			var $inputs = $form.find("input, select, button, textarea"); //select and cache all the fields
			var serializedData = $form.serialize(); //serialize the data in the form

			request = $.ajax({
				url: "https://script.google.com/macros/s/AKfycbyHqNSWPdmNOSjuk6VvPzxPDWSPxDquyxY4KM0DPfBrH0KAnMdI/exec",
				type: "post",
				data: serializedData
		});	
	}	

		//callback handler that will be called on success
		request.done(function (response, textStatus, jqXHR){
			// Log a message to the console
			console.log("Hooray, it worked!");
			console.log(response);
			console.log(textStatus);
			console.log(jqXHR);
		});

		//callback handler that will be called on failure
		request.fail(function (jqXHR, textStatus, errorThrown){
			// Log the error to the console
			console.error(
				"The following error occurred: "+
				textStatus, errorThrown
			);
		});

		//callback handler that will be called regardless
		request.always(function () {
			//reenable the inputs
			$inputs.prop("disabled", false);
		});
		}
	
		event.preventDefault();
	}
});	

//datepicker
$(function(){
	$('#datepicker').datepicker();
});