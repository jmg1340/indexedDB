$(function(){

	//alert("prova.js fuciona!");

	// In the following line, you should include the prefixes of implementations you want to test.
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	// DON'T use "var indexedDB = ..." if you're not in a function.
	// Moreover, you may need references to some window.IDB* objects:
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
	// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)

	if (!window.indexedDB) {
	    window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
	}




	// Let us open our database
	var request = window.indexedDB.open("MyTestDatabase", 3);
	/*
	The open request doesn't open the database or start the transaction right away. 
	The call to the open() function returns an IDBOpenDBRequest object with a result (success) 
	or error value that you handle as an event.

	The second parameter to the open method is the version of the database. 
	The version of the database determines the database schema — the object stores in the database and their structure. 
	If the database doesn't already exist, it is created by the open operation, 
	then an onupgradeneeded event is triggered and you create the database schema in the handler for this event. 
	If database does exist but you are specifying an upgraded version number, 
	an onupgradeneeded event is triggered straight away, allowing you to provide an updated schema in its handler.
	
	-------
	var request = indexedDB.open("MyTestDatabase", 2.4); // don't do this, as the version will be rounded to 2
	*/






	/*
	The first thing you'll want to do with almost all of the requests you generate is
	to add success and error handlers:

	Obviously, browsers do not want to allow some advertising network or malicious website to pollute your computer,
	so browsers prompt the user the first time any given web app attempts to open an IndexedDB for storage. 
	The user can choose to allow or deny access. Also, IndexedDB is completely disabled in the privacy modes
	of browsers (Private Browsing mode for Firefox and Incognito mode for Chrome). 
	The whole point of private browsing is to leave no footprints, so attempting to open a database fails while
	in this mode.
	*/

	request.onerror = function(event) {
		alert("Why didn't you allow my web app to use IndexedDB?!");
	};
	request.onsuccess = function(event) {
		db = request.result;
		mostrarRegistres(db);
	};


	function mostrarRegistres(db){
		
		$('#taula').empty();  //eliminar contingut taula
		
		$('#taula').append("<tbody></tbody>");
		$('#taula > tbody:last').append('<tr><th>SSN</th><th>NAME</th><th>AGE</th><th>EMAIL</th><th></th></tr>');

		var objectStore = db.transaction("customers").objectStore("customers");
		objectStore.openCursor().onsuccess = function(event) {
		  var cursor = event.target.result;
		  if (cursor) {
		    $('#taula > tbody:last').append("<tr><td>" + cursor.key + "</td>" +
		    									"<td>" + cursor.value.name + "</td>" +
		    									"<td>" + cursor.value.age + "</td>" +
		    									"<td>" + cursor.value.email + "</td>" +
		    									"<td><button class=\"eliminar\" id=\"" + cursor.key + "\">Eliminar</button></td>" +
		    								"</tr>");


		    /*jQuery('<button/>', {
			    id: cursor.key,
			    class: "eliminar",
			    text: 'eliminar!'
			    //onclick: "eliminarRegistre(" + cursor.key +")"
			}).appendTo('#pagina');

			*/

		    cursor.continue();
		  }
		  else {
		    //alert("No more entries!");
			$('#taula > tbody:last').append("<tr>" +
												//"<form id='formulari'>" +
													"<td>" +
														"<input type='text' name='txtSSN' value='a'/>" +
													"</td>" +
													"<td>" +
														"<input type='text' name='txtNAME' value='aa'/>" +
													"</td>" +
													"<td>" +
														"<input type='text' name='txtAGE' value='aaa'/>" +
													"</td>" +
													"<td>" +
														"<input type='text' name='txtEMAIL' value='aaaa'/>" +
													"</td>" +
													"<td>" +
														"<button id='afegirR'>AfegirR</button>" +
													"</td>" +
												//"</form>" +
											"</tr>");


		  }
		};		
	}


	/*
	One of the common possible errors when opening a database is VER_ERR. It indicates that the version of the database 
	stored on the disk is greater than the version that you are trying to open. 
	This is an error case that must always be handled by the error handler.


	CREATING OR UPDATING THE VERSION OF THE DATABASE

	When you create a new database or increase the version number of an existing database (by specifying a higher version 
	number than you did previously, when Opening a database), the onupgradeneeded event will be triggered. 
	In the handler for this event, you should create the object stores needed for this version of the database:
	*/

	// This event is only implemented in recent browsers
	



	// This is what our customer data looks like.
	/*const customerData = [
	  { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
	  { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
	];*/	



	request.onupgradeneeded = function(event) { 
		var db = event.target.result;

		// Create an objectStore to hold information about our customers. We're
		// going to use "ssn" as our key path because it's guaranteed to be
		// unique.
		var objectStore = db.createObjectStore("customers", { keyPath: "ssn" });

		// Create an index to search customers by name. We may have duplicates
		// so we can't use a unique index.
		objectStore.createIndex("name", "name", { unique: false });

		// Create an index to search customers by email. We want to ensure that
		// no two customers have the same email, so use a unique index.
		objectStore.createIndex("email", "email", { unique: true });

		// Use transaction oncomplete to make sure the objectStore creation is 
		// finished before adding data into it.
		/*objectStore.transaction.oncomplete = function(event) {
			// Store values in the newly created objectStore.
			var customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
			for (var i in customerData) {
			  customerObjectStore.add(customerData[i]);
			}
		}*/
  	};

	/*
	As indicated previously, onupgradeneeded is the only place where you can alter the structure of the database. 
	In it, you can create and delete object stores and build and remove indices.


	Object stores are created with a single call to createObjectStore(). 
	The method takes a name of the store, and a parameter object. Even though the parameter object is optional, 
	it is very important, because it lets you define important optional properties and refine the type of 
	object store you want to create. 
	In our case, we've asked for an object store named "customers" and defined a keyPath, which is the property 
	that makes an individual object in the store unique. That property in this example is "ssn" since a 
	social security number is guaranteed to be unique. "ssn" must be present on every object that is stored in 
	the objectStore. 

	We've also asked for an index named "name" that looks at the name property of the stored objects. 
	As with createObjectStore(), createIndex() takes an optional options object that refines the type of index 
	that you want to create. Adding objects that don't have a name property still succeeds, but the objects 
	won't appear in the "name" index.

	*/




	//ADDING DATA TO THE DATABASE
	/*$("#afegir").bind("click", function(){
		var info = {
						ssn: Math.floor(Math.random()*10E10).toString(), 
						name: "aaa", 
						age: 3, 
						email: Math.floor(Math.random()*10E7).toString() + "@company.com"
					}
		var regAfegit = afegirRegistre("customers", info)
		if(regAfegit){
			mostrarRegistres(db);
		} else{
			alert("no s'ha afegit el registre")
		}
	});*/

	

	$("#afegir").bind("click", function(){
		var transaction = db.transaction(["customers"], "readwrite");
		// Note: Older experimental implementations use the deprecated constant IDBTransaction.READ_WRITE instead of "readwrite".
		// In case you want to support such an implementation, you can write: 
		// var transaction = db.transaction(["customers"], IDBTransaction.READ_WRITE);


		// Do something when all the data is added to the database.
		transaction.oncomplete = function(event) {
		  	return true;
  		  //alert("All done!");

		  // event.target.result == customerData.ssn
		  //var txtNSS = event.target.result;
		  //$("#pagina").append(txtNSS + " <button id=\"" + txtNSS + "\">Eliminar</button>");
		};

		transaction.onerror = function(event) {
		  alert ("transaction error!!");
		  console.log(event);
		  console.trace();
		  return false;
		};

		//var txtNSS = Math.floor(Math.random()*10E10).toString();
		var objectStore = transaction.objectStore("customers");
		
		var info = {
						ssn: Math.floor(Math.random()*10E10).toString(), 
						name: "aaa", 
						age: 3, 
						email: Math.floor(Math.random()*10E7).toString() + "@company.com"
					}
		var request = objectStore.add(info);
		mostrarRegistres(db);
		
		request.onsuccess = function(event) {
			// event.target.result == customerData[i].ssn;
			var txtNSS = event.target.result;
			$("#pagina").append(txtNSS + " <button class='eliminar' id='" + txtNSS + "''>Eliminar</button>");
		};

		/*
		The result of a request generated from a call to add() is the key of the value that was added. 
		So in this case, it should equal the ssn property of the object that was added, since the object store 
		uses the ssn property for the key path. Note that the add() function requires that no object already be 
		in the database with the same key. If you're trying to modify an existing entry, or you don't care 
		if one exists already, you can use the put() function.
		*/

	

	});




	$(document).on("click", "#afegirR", function(){
    //$("#afegirR").bind("click", function(){
        var dataString = JSON.stringify($("#formulari").serialize());
        console.log(dataString);
        alert('Datos serializados: '+ dataString);
        return false;
	});








	//REMOVING DATA FROM THE DATABASE
	//$(".eliminar").bind("click", function(){
	/*function eliminarRegistre(){
		alert($(this).attr("id"));
		var request = db.transaction(["customers"], "readwrite")
		                .objectStore("customers")
		                //.delete(nss);
		                .delete($(this).attr("id"));
		
		request.onsuccess = function(event) {
		  	$("#pagina").html("");
		  	mostrarRegistres(db);
		};			
	}*/
	//});


	$(document).on('click', '.eliminar', function(){
		alert("S'eliminarà el registre [" + $(this).attr("id") + "]");
		var request = db.transaction(["customers"], "readwrite")
		                .objectStore("customers")
		                .delete($(this).attr("id"));
		
		request.onsuccess = function(event) {
		  	$("#pagina").html("");
		  	mostrarRegistres(db);
		};
		return false;			

	});

});