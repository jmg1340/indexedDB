$(function(){

	$("#pagina").html("<h1>IndexDDB</h1>");


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





	// ------ This is what our customer data looks like. --------
	const customerData = [
	  { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
	  { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
	];
	// ------ This is what our customer data looks like. --------


	const dbName = "the_name";
	var request = indexedDB.open(dbName, 2);
	var db = null;
	
	request.onsuccess = function (e) {
        // e.target.result has the connection to the database
        db = e.target.result;

        console.log(db);
        console.log("DB Opened!");
    }


	request.onerror = function(event) {
	  console.log(event)
	};

	
	request.onupgradeneeded = function(event) {
		db = event.target.result;

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


		/*
		// Use transaction oncomplete to make sure the objectStore creation is 
		// finished before adding data into it.
		objectStore.transaction.oncomplete = function(event) {
			// Store values in the newly created objectStore.
			var customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
			for (var i in customerData) {
				customerObjectStore.add(customerData[i]);
			}
	  	};
		*/

	};


	//***********************************************************************************************************
	//***********************************************************************************************************



	$("#boto").bind("click", function(){

		//ADDING DATA TO THE DATABASE

		var transaction = db.transaction(["customers"], "readwrite");
		// Note: Older experimental implementations use the deprecated constant IDBTransaction.READ_WRITE instead of "readwrite".
		// In case you want to support such an implementation, you can write: 
		// var transaction = db.transaction(["customers"], IDBTransaction.READ_WRITE);	


		// Do something when all the data is added to the database.
		transaction.oncomplete = function(event) {
		  //alert("Dades introduides!");
		  $("#pagina").append("dades introduides (ON COMPLETE)");
		};

		transaction.onerror = function(event) {
		  console.log(event.target);
		  console.trace();
		  alert("alguna cosa no ha anat bé");
		};





		// ------ This is what our customer data looks like. --------
		var txtSSN = Math.floor(Math.random()*10E10).toString();
		$("#pagina").append("<h2>nou ssn: " + txtSSN + "</h2>");
		var customerData2 = { ssn: txtSSN, name: "Bill", age: 35, email: "bill@company.com" };
		// ------ This is what our customer data looks like. --------


		var objectStore = transaction.objectStore("customers");
		var request = objectStore.put({ssn: txtSSN, name: "Bill", age: 35, email: "bill@company.com"});
		request.onsuccess = function(event) {
		    // event.target.result == customerData[i].ssn;
		    $("#pagina").append("dades introduides (ON SUCCESS)");
		};
		
		/*
		for (var i in customerData) {
		  var request = objectStore.add(customerData2[i]);
		  request.onsuccess = function(event) {
		    // event.target.result == customerData[i].ssn;
		    $("#pagina").append("dades introduides (ON SUCCESS)");
		  };
		}
		*/

	});

});