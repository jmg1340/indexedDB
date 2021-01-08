$(function(){


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
	var request = window.indexedDB.open("ActivitatsDB", 1);

	request.onerror = function(event) {
		alert("Why didn't you allow my web app to use IndexedDB?!");
	};
	request.onsuccess = function(event) {
		db = request.result;
		mostrarRegistres(db);
	};



	request.onupgradeneeded = function(event) { 
		var db = event.target.result;

		var objectStore = db.createObjectStore("activitats", { keyPath: "timeStamp" });

		// Create an index to search activitats by data. We may have duplicates
		// so we can't use a unique index.
		objectStore.createIndex("data", "data", { unique: false });
		objectStore.createIndex("activitat", "activitat", { unique: false });
		objectStore.createIndex("ss", "ss", { unique: false });

  	};


	function formattedDate(date) {
	    var d = new Date(date || Date.now()),
	        month = '' + (d.getMonth() + 1),
	        day = '' + d.getDate(),
	        year = d.getFullYear();

	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;

	    return [day, month, year].join('/');
	}
	

	function mostrarRegistres(db){
		
		$('#taula').empty();  //eliminar contingut taula
		
		$('#taula').append("<tbody></tbody>");
		$('#taula > tbody:last').append("'<tr><th class='cldata'>DATA</th><th class='clactivitat'>ACTIVITAT</th><th class='clss'>SS</th><th class='clestat'>ESTAT SS</th><th class='botons'></th></tr>");

		var objectStore = db.transaction("activitats").objectStore("activitats");
		objectStore.openCursor().onsuccess = function(event) {
		  var cursor = event.target.result;
		  if (cursor) {
		    $('#taula > tbody:last').append("<tr><td class='cldata'>" + formattedDate(cursor.value.data) + "</td>" +
		    									"<td class='clactivitat'>" + cursor.value.activitat + "</td>" +
		    									"<td class='clss'>" + cursor.value.ss + "</td>" +
		    									"<td class='clestat'>" + cursor.value.estat + "</td>" +
		    									"<td class='botons'><button class='eliminar' id='" + cursor.key + "'>Eliminar</button>" +
		    										"<button class='editar' id='" + cursor.key + "xxx'>editar</button>" +
		    									"</td>" +
		    								"</tr>");


		    cursor.continue();
		  } else {
		    //alert("No more entries!");
			$('#taula > tbody:last').append("<tr>" +
												//"<form id='formulari'>" +
													"<td class='cldata'>" +
														"<input type='hidden' name='timeStamp' value='" + new Date() + "'/>" +
														"<input type='date' name='data' value='" + formattedDate() + "'/>" +
													"</td>" +
													"<td class='clactivitat'>" +
														"<input type='text' name='activitat'/>" +
													"</td>" +
													"<td class='clss'>" +
														"<input type='text' name='ss'/>" +
													"</td>" +
													"<td class='clestat'>" +
														"<input list='estats' name='estat'/>" +
														"<datalist id='estats'>" +
															"<option value='oberta'>" +
															"<option value='treballada'>" +
															"<option value='tancada'>" +
														"</datalist>" +
													"</td>" +
													"<td class='botons'>" +
														"<button id='afegir'>Afegir</button>" +
													"</td>" +
												//"</form>" +
											"</tr>");


		  }
		};		
	}




	function afegirRegistre(magatzem, dataJSON){
		
		var registreAfegit = false;

		var transaction = db.transaction([magatzem], "readwrite");

		// Do something when all the data is added to the database.
		transaction.oncomplete = function(event) {
		  	//alert("registre afegit");
		  	//registreAfegit = true;

		  	//alert("despres d executar T1 (hauria de ser true): " + registreAfegit);
  		  //alert("All done!");

		  // event.target.result == customerData.ssn
		  //var txtNSS = event.target.result;
		  //$("#pagina").append(txtNSS + " <button id=\"" + txtNSS + "\">Eliminar</button>");
		};


		transaction.onerror = function(event) {
		  alert ("transaction error!!");
		  console.log(event);
		  console.trace();
		  //registreAfegit = false;
		};

		//var txtNSS = Math.floor(Math.random()*10E10).toString();
		var objectStore = transaction.objectStore(magatzem);
		//alert("JSON.stringify(dataJSON, '\t'):\n" + JSON.stringify(dataJSON, "\t"));
		var request = objectStore.add(dataJSON);
		
		/*request.onsuccess = function(event) {
			// event.target.result == customerData[i].ssn;
			var txtNSS = event.target.result;
			$("#pagina").append(txtNSS + " <button class='eliminar' id='" + txtNSS + "''>Eliminar</button>");
		};*/

		if (transaction.oncomplete){
			registreAfegit = true;
		}

		return registreAfegit;

	};




	$(document).on("click", "#afegir", function(){

        var info = $('#formulari').serializeObject();
        //alert('Datos serializados: '+ JSON.stringify(info));
        
		var regAfegit = afegirRegistre("activitats", info);
		//alert ("regAfegit2: " + regAfegit);
		if(regAfegit){
			mostrarRegistres(db);
		}else{
			alert("no s'ha afegit el registre");
		}

	});



	$.fn.serializeObject = function()
	{
	    var o = {};
	    var a = this.serializeArray();
	    $.each(a, function() {
	        if (o[this.name] !== undefined) {
	            if (!o[this.name].push) {
	                o[this.name] = [o[this.name]];
	            }
	            o[this.name].push(this.value || '');
	        } else {
	            o[this.name] = this.value || '';
	        }
	    });
	    return o;
	};




	$(document).on('click', '.eliminar', function(){
		var confirmar = confirm("S'eliminarà el registre [" + $(this).attr("id") + "]");
		if (confirmar){
			var request = db.transaction(["activitats"], "readwrite")
			                .objectStore("activitats")
			                .delete($(this).attr("id"));
			
			request.onsuccess = function(event) {
			  	//$("#pagina").html("");
			  	mostrarRegistres(db);
			};
		}
		return false;			

	});
	

	// ********   EDITAR REGISTRE  ********
	$(document).on('click', '.editar', function(){
		
		var idBotoEditar = $(this).attr("id");
		
		// canviar id del formulari
		$("#formularAfegirDades").attr("id", "formulariEdicio");

		// eliminem el cos de la taula (no la capçalera)
		$('#taula > tbody:last').empty();
		$('#taula > tbody:last').append("<tr><th class='cldata'>DATA</th><th class='clactivitat'>ACTIVITAT</th><th class='clss'>SS</th><th class='clestat'>ESTAT SS</th><th class='botons'></th></tr>");


		// tornar a llistar registres establint un formulari al registre a editar
		var objectStore = db.transaction("activitats").objectStore("activitats");
		objectStore.openCursor().onsuccess = function(event) {
		  var cursor = event.target.result;
		  if (cursor) {
		    //alert("cursor.key: " + cursor.key + "\n$(this).attr('id'): " + $(this).attr("id"));
		    if ((cursor.key + "xxx") == idBotoEditar){
				$('#taula > tbody:last').append("<tr>" +
													//"<form id='formulari'>" +
													//"<td>" +
													//"</td>" +
													"<td class='cldata'>" +
														"<input type='hidden' name='timeStamp' value='" + cursor.key + "'/>" +
														"<input type='date' name='data' value='" + formattedDate(cursor.value.data) + "'/>" +
													"</td>" +
													"<td class='clactivitat'>" +
														"<input type='text' name='activitat' value='" + cursor.value.activitat + "'/>" +
													"</td>" +
													"<td class='clss'>" +
														"<input type='text' name='ss' value='" + cursor.value.ss + "'/>" +
													"</td>" +
													"<td class='clestat'>" +
														"<select name='estat'>" +
														//"<datalist id='estats'>" +
															"<option value='oberta' " + (cursor.value.estat == "oberta")? "selected='selected'": "" + ">oberta</option>" +
															"<option value='treballada' " + (cursor.value.estat == "treballada")? "selected='selected'": "" + ">treballada</option>" +
															"<option value='tancada' " + (cursor.value.estat == "tancada")? "selected='selected'": "" + ">tancada</option>" +
														"</select>" +
													"</td>" +
													"<td class='botons'>" +
														"<button id='guardar'>Guardar</button>" +
													"</td>" +
													//"</form>" +
												"</tr>");

		    }else{
			    $('#taula > tbody:last').append("<tr>" +
			    								//"<td></td>" +
			    								"<td class='cldata'>" + cursor.value.data + "</td>" +
		    									"<td class='clactivitat'>" + cursor.value.activitat + "</td>" +
		    									"<td class='clss'>" + cursor.value.ss + "</td>" +
		    									"<td class='clestat'>" + cursor.value.estat + "</td>" +
		    									"<td class='botons'></td>" +
			    								"</tr>");


		    }
		    cursor.continue();
		  }

		}

		return false;			

	});




	// ********   GUARDAR OBJECTE EDITAT  ********
	$(document).on('click', '#guardar', function(){
		//alert("Boto 'guardar' clicat");
	  
		//recopilem dades formulari
		var info = $('#formulari').serializeObject();
		//alert('Datos serializados: '+ JSON.stringify(info));

		var tx = db.transaction(["activitats"], "readwrite");
		var store = tx.objectStore("activitats");

		tx.oncomplete = function(e){
			//mostrarRegistres(db);
		};

		tx.onerror = function(e){
			alert('Error TRANSACCIO al guardar objecte: '+e);
		};

		var request = store.put(info);



		if(tx.oncomplete){
			mostrarRegistres(db);
		}else{
			alert('Error al guardar objecte');
		}


		
		//request.onsuccess = function(e){
		
		//request.onerror = function(e){
		


	});





});