$("document").ready(function(){



		db
			.open({
					name: "ActivitatsBD",
					version: 4,
					schema:{
						persones: {
							key: {
								keypath: "id",
								autoincrement: true
							}
						}
					}
				})

			.done(function(transaccio){
				    // The database was successfully opened. We can
				    // run transactions using the transaccio varaible

				    
				    // Listen for the document ready event, as we will
				    // be working with the dom
					
				    $(function(){


						var registres = $("#registres");


						$("#nouRegistre").bind("click", function(){
							var registre = {
								nom: "jordi",
								cognom: "miserachs"
							};

							transaccio.persones
								.add(registre)
								.done(function(){
									alert("fafsadfsadf");
									mostrarRegistre(registre);
								});
						});


						function mostrarRegistre(reg){
							var tmpRegistre = $("<li></li>");

							tmpRegistre.addClass()
								.data("id", reg.id )
								.text(reg.text + "<a href='#'>Eliminar</a>");


							registres.append(tmpRegistre);

						}




						// When an registre is clicked, remove it from the database.
						$("#registres").on("click", "a", function(){
							var registre = $(this);
							transaccio.registres.remove(registre.id)
								.done(function(){
									registre.fadeOut();
								});
						});


					});

				})
			
			.fail(function(error){
					console.error("hi ha hagut un error: ", error);
				});




		//$("#contingut").html("<h1>Magatzem d'objectes javascript creat !!!</bd>")


	/*
		$.indexedDB("ActivitatsBD"){
				"esquema": function(versioTransaccio){
					var activitat = versioTransaccio.createObjectStore("activitat",{
						
					})
				}

		}
	*/


});