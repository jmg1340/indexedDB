$(function(){

	//alert("dilluns: " + obtenirData(leerGET(), 1) + 
	//		"\ndiumenge: " + obtenirData(leerGET(), 7));

	$("#setmana").html("Setmana:    " + obtenirData(leerGET(), 1) + "  -  " + obtenirData(leerGET(), 7));

	function leerGET(){
	  var cadGET = location.search.substr(1,location.search.length);
	  var arrGET = cadGET.split("&");
	  var aux = arrGET[0].split("=");
	  return aux[1];
	  /*
	  var asocGET = new Array();
	  var variable = "";
	  var valor = "";
	  for(i=0;i<arrGET.length;i++){
	    var aux = arrGET[i].split("=");
	    variable = aux[0];
	    valor = aux[1];
	    asocGET[variable] = valor;
	  }
	  return asocGET;
	  */
	} 


	function diaSetmana(data){
		//var data = $("#posicioData").html().split("/");
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
	
	function StringMMDDAAAA(formatDDMMAA){
		//formatDDMMAA = DD/MM/AAAA
		var vData = formatDDMMAA.split("/");
		// format vData = MM/DD/AAAA
		vData = [vData[1], vData[0], vData[2]].join("/");		
		return vData
	}

	
	function obtenirData(data, diaSetmana){
		// getDay() -->   0: Diumenge; 6: Dissabte
		var dataObtinguda = "";
		data2 = StringMMDDAAAA(data);
		data2 = new Date(data2);
		var numDiaSetmana = data2.getDay();
		
		day = data2.getDay();
		switch (diaSetmana){
			case 1:   //DILLUNS
				console.log("sequencia DILLUNS");
				if (day == 0){ 		//diumenge
					dataObtinguda = data2.getDate() - 6
				}else if(day == 1){		//dilluns
					dataObtinguda = data2.getDate();
				}else if (day > 1){
					dataObtinguda = data2.getDate() - (data2.getDay() - 1);
				}
				console.log("dataObtinguda: " + dataObtinguda);							
				break;

			case 7:   //DIUMENGE
				console.log("sequencia DIUMENGE");			
				if (day == 0){ 		//diumenge
					dataObtinguda = data2.getDate();
				}else if(day >= 1){		//dilluns
					dataObtinguda = data2.getDate() + (7 - data2.getDay());
				}
				console.log("dataObtinguda: " + dataObtinguda);							
				break;
		}
        dataObtinguda = '' + dataObtinguda;
        month = '' + (data2.getMonth() + 1);
        year = data2.getFullYear();

	    if (month.length < 2) month = '0' + month;
	    if (dataObtinguda.length < 2) dataObtinguda = '0' + dataObtinguda;

	    //alert ("dia :" + day + "\nmes: " + month + "\nany: " + year);
	    return [dataObtinguda, month, year].join('/');
	}


	function mostrarRegistres(db){
		var comptadorRegistres = 0;
		var comptadorObertes = 0;
		var comptadorTreballades = 0;
		var comptadorTancades = 0;
		var canviData = "";

		
		var objectStore = db.transaction("activitats").objectStore("activitats");
		var index = objectStore.index("data");
		

		var data1 = StringMMDDAAAA(obtenirData(leerGET(), 1));
		var data2 = StringMMDDAAAA(obtenirData(leerGET(), 7));


		var rang = IDBKeyRange.bound(data1, data2);
		
		//$taula = $('<table></table>').addClass("taula");
		var $body = $("<tbody></tbody>");
		

		index.openCursor(rang).onsuccess = function(event) {
		//objectStore.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;
			
			
			if (cursor) {
				
				//console.debug("formattedDate(cursor.value.data,null): " + formattedDate(cursor.value.data,null) +"\tcanviData: " + canviData);
				
				if(formattedDate(cursor.value.data,null) != canviData){
					
					// No imprimir la primera taula abans de generar-la
					if(canviData != ""){
						$taula.append($body);
						$("#resultat").append($taula);
						$("#resultat").append("<div id='recompte'>Registres: " + comptadorRegistres + 
													"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; SS obertes: " + comptadorObertes + 
													"&nbsp;&nbsp;&nbsp;&nbsp; SS treballades: " + comptadorTreballades + 
													"&nbsp;&nbsp;&nbsp;&nbsp; SS tancades: " + comptadorTancades + "</div>");
						$("#resultat").append("</br></br>");

					}


					// creacio de nova taula
					$taula = $('<table></table>').addClass("taula")
					$body = $("<tbody></tbody>");
					
					//capçalera taula
					var $tr = $("<tr></tr>");
					$tr.append($("<th></th>").addClass("cldata").html("DATA"));
					$tr.append($("<th></th>").addClass("clactivitat").html("ACTIVITAT"));
					$tr.append($("<th></th>").addClass("clss").html("SS"));
					$tr.append($("<th></th>").addClass("clestat").html("ESTAT SS"));
					comptadorObertes = 0; comptadorTreballades = 0; comptadorTancades = 0;
					$body.append($tr);

					// primer registre
					var $tr = $("<tr></tr>");
					$tr.append($("<td></td>").addClass("cldata").html(formattedDate(cursor.value.data,null)));
					$tr.append($("<td></td>").addClass("clactivitat").html(cursor.value.activitat));
					$tr.append($("<td></td>").addClass("clss").html(cursor.value.ss));
					$tr.append($("<td></td>").addClass("clestat").html(cursor.value.estat));
					comptadorObertes += (cursor.value.estat == "oberta")? 1 : 0 ;
					comptadorTreballades += (cursor.value.estat == "treballada")? 1 : 0 ;
					comptadorTancades += (cursor.value.estat == "tancada")? 1 : 0 ;
					$body.append($tr);
					
					canviData = formattedDate(cursor.value.data,null);
					comptadorRegistres = 0;					
				
				} else {
					// la resta de registres
					var $tr = $("<tr></tr>");
					$tr.append($("<td></td>").addClass("cldata").html(formattedDate(cursor.value.data,null)));
					$tr.append($("<td></td>").addClass("clactivitat").html(cursor.value.activitat));
					$tr.append($("<td></td>").addClass("clss").html(cursor.value.ss));
					$tr.append($("<td></td>").addClass("clestat").html(cursor.value.estat));
					comptadorObertes += (cursor.value.estat == "oberta")? 1 : 0 ;
					comptadorTreballades += (cursor.value.estat == "treballada")? 1 : 0 ;
					comptadorTancades += (cursor.value.estat == "tancada")? 1 : 0 ;
					$body.append($tr);
					
				}
				

				comptadorRegistres++;
				console.debug("comptadorRegistres: " + comptadorRegistres);
				cursor.continue();
			
			} else {
			//console.log("registres (DINS BUCLE): " + comptadorRegistres);
				$taula.append($body);
				//alert("tl" + num);
				$("#resultat").append($taula);
				//$taula.empty();
				$("#resultat").append("<div id='recompte'>Registres: " + comptadorRegistres + 
											"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; SS obertes: " + comptadorObertes + 
											"&nbsp;&nbsp;&nbsp;&nbsp; SS treballades: " + comptadorTreballades + 
											"&nbsp;&nbsp;&nbsp;&nbsp; SS tancades: " + comptadorTancades + "</div>");
				$("#resultat").append("</br></br>");
			

			}
		};
		

	}




});