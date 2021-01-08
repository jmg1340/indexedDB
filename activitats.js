$(function(){


	$("#posicioData").html(formattedDate(Date.now()),null);
	$("#diaSetmana").html(diaSetmana());


	$("#botoInforme").bind("click", function(){
		window.open('./Informe.html?fecha=' + $("#posicioData").html() ,'_blank');
		return false;
	});

	
	$("#botoEndavant").bind("click", function(){
		//alert($("#posicioData").html());
		var data = $("#posicioData").html().split("/");
		data = [data[1], data[0], data[2]].join("/");		
		var data2 = formattedDate(data, +1);
		
		$("#posicioData").html(data2);
		$("#diaSetmana").html(diaSetmana());
		//comptador = 0;
		mostrarRegistres(db);
		//$("#comptadorRegistres").html("Registres: " + comptador);
		
	});

	$("#botoEnrere").bind("click", function(){
		var data = $("#posicioData").html().split("/");
		data = [data[1], data[0], data[2]].join("/");		
		var data2 = formattedDate(data, -1);
		
		$("#posicioData").html(data2);
		$("#diaSetmana").html(diaSetmana());
		//comptador = 0;
		mostrarRegistres(db);
		//$("#comptadorRegistres").html("Registres: " + comptador);

	});


	function diaSetmana(){
		var data = $("#posicioData").html().split("/");
		data = [data[1], data[0], data[2]].join("/");		
		data = new Date(data);
		
		var dia = "";
		switch(data.getDay()){
			case 0:
			  dia = "Diumenge";
			  break;
			case 1:
			  dia = "Dilluns";
			  break;
			case 2:
			  dia = "Dimarts";
			  break;
			case 3:
			  dia = "Dimecres";
			  break;
			case 4:
			  dia = "Dijous";
			  break;
			case 5:
			  dia = "Divendres";
			  break;
			case 6:
			  dia = "Dissabte";
			  break;		
		}
		return dia;
	}


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


	function formattedDate(date, incrementDia) {
	    var d = new Date(date || Date.now());
	        
	    if ((incrementDia != null) || (incrementDia != undefined)){
	    	d.setDate(d.getDate() + incrementDia);
	    }
        day = '' + d.getDate();
        month = '' + (d.getMonth() + 1);
        year = d.getFullYear();

	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;

	    //alert ("dia :" + day + "\nmes: " + month + "\nany: " + year);
	    return [day, month, year].join('/');
	}
	
	
	//var comptador = 0;
	function mostrarRegistres(db){
		var comptador = 0;

		$('#taula').empty();  //eliminar contingut taula
		
		$('#taula').append("<tbody></tbody>");
		$('#taula > tbody:last').append("'<tr><th class='cldata'>DATA</th><th class='clactivitat'>ACTIVITAT</th><th class='clss'>SS</th><th class='clestat'>ESTAT SS</th><th class='botons'></th></tr>");

		
		var objectStore = db.transaction("activitats").objectStore("activitats");
		var index = objectStore.index("data");
		
		var vData = $("#posicioData").html().split("/");
		vData = [vData[1], vData[0], vData[2]].join("/");		

		var rang = IDBKeyRange.only(vData);
		index.openCursor(rang).onsuccess = function(event) {
		//objectStore.openCursor().onsuccess = function(event) {
		  var cursor = event.target.result;
		  if (cursor) {
		  	
		    $('#taula > tbody:last').append("<tr><td class='cldata'>" + formattedDate(cursor.value.data,null) + "</td>" +
		    									"<td class='clactivitat'>" + cursor.value.activitat + "</td>" +
		    									"<td class='clss'>" + cursor.value.ss + "</td>" +
		    									"<td class='clestat'>" + cursor.value.estat + "</td>" +
		    									"<td class='botons'><button class='eliminar' id='" + cursor.value.timeStamp + "'>Eliminar</button>" +
		    										"<button class='editar' id='" + cursor.value.timeStamp + "xxx'>editar</button>" +
		    									"</td>" +
		    								"</tr>");


		    comptador++;
		    cursor.continue();
		  } else {
			$('#taula > tbody:last').append("<tr>" +
												//"<form id='formulari'>" +
													"<td class='cldata'>" +
														"<input type='hidden' name='timeStamp' value='" + new Date() + "'/>" +
														"<input type='date' name='data' value='" + $("#posicioData").html() + "'/>" +
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

			//console.log("registres (DINS BUCLE): " + comptador);
			$("#comptadorRegistres").html("Registres: " + comptador);
		  }
		};
		
		//console.log("registres (FORA BUCLE): " + comptador);
		//alert(comptador);
		//$("#comptadorRegistres").html("Registres: " + comptador);      // no funciona (registres = 0). Ho he hagut de posar a dins de la funcio anterior.

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
		var data2 = info.data.split("/");
		info.data = [data2[1], data2[0], data2[2]].join("/");        
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
		var index = objectStore.index("data");
		
		var vData = $("#posicioData").html().split("/");
		vData = [vData[1], vData[0], vData[2]].join("/");		

		var rang = IDBKeyRange.only(vData);
		index.openCursor(rang).onsuccess = function(event) {
		  var cursor = event.target.result;
		  if (cursor) {
		    //alert("cursor.key: " + cursor.key + "\n$(this).attr('id'): " + $(this).attr("id"));
		    if ((cursor.value.timeStamp + "xxx") == idBotoEditar){
				$('#taula > tbody:last').append("<tr>" +
													//"<form id='formulari'>" +
													//"<td>" +
													//"</td>" +
													"<td class='cldata'>" +
														"<input type='hidden' name='timeStamp' value='" + cursor.value.timeStamp + "'/>" +
														"<input type='date' name='data' value='" + formattedDate(cursor.value.data,null) + "'/>" +
													"</td>" +
													"<td class='clactivitat'>" +
														"<input type='text' name='activitat' value='" + cursor.value.activitat + "'/>" +
													"</td>" +
													"<td class='clss'>" +
														"<input type='text' name='ss' value='" + cursor.value.ss + "'/>" +
													"</td>" +
													"<td class='clestat'>" +
														"<input list='estats' name='estat' value='" + cursor.value.estat + "'/>" +
														"<datalist id='estats'>" +
															"<option value='oberta'>" +
															"<option value='treballada'>" +
															"<option value='tancada'>" +
														"</datalist>" +
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
		//alert(info.data);
		var data2 = info.data.split("/");
		info.data = [data2[1], data2[0], data2[2]].join("/");
		//alert(info.data);

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


	$("#botoExportar").bind("click", function(){
		//var transaction = db.transaction([objectstore], "readonly");
		//var objectStore = transaction.objectStore(objectstore);
		activitatsExportar = [];
		var objectStore = db.transaction("activitats").objectStore("activitats");
		
		objectStore.openCursor().onsuccess = function(event) {
		  var cursor = event.target.result;
		  if (cursor) {
		    activitatsExportar.push(cursor.value);
		    cursor.continue();
		  }
		  else {
		    var serializedData = JSON.stringify(activitatsExportar);
		    alert("Got all activitats: \n" + serializedData);

		    var fs = require('fs');

			var outputFilename = 'c:\\temp\\activitatsJSON.txt';

			fs.writeFile(outputFilename, JSON.stringify(myData, null, 4), function(err) {
			    if(err) {
			      console.log(err);
			    } else {
			      console.log("JSON saved to " + outputFilename);
			    }
			});


		  }
		};

		/*
		objectStore.getAll().onsuccess = function(evt) {
		    var url = window.URL.createObjectURL(new Blob(evt.target.results, {'type': 'application/octet-stream'}));
		    link.attr('href', url);
		    link.trigger('click');
		};
		*/		
	});


});