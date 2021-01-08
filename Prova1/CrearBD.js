$("docuement").ready(function(){

	$("#nouRegistre").bind("click", function(){

		db.open({
					nom: "ActivitatsBD",
					versio: 2,
					esquema:{
						registres: {
							key: {
								keypath: "id",
								autoincrement: true
							},
							indexes:{
								data: {unique: false}
							}
						}
					}
				}).done(function(transaccio){
				    // The database was successfully opened. We can
				    // run transactions using the transaccio varaible

				    
				    // Listen for the document ready event, as we will
				    // be working with the dom
					
				    $(function(){

						var registres = $("#registres");


						// On dom.ready, select all registres and update the #registres ul
						transaccio.registres.query().filter().execute().done(function(resultat){
							if (!resultat){
								return;
							}

							$.each(resultat, function(){
								crearRegistre(this);
							});
						});


						$("#nouRegistre").bind("click", function(){
							var registre = {
								text: "aquest es un nou registre",
								color: colors[ Math.floor( Math.random()*colors.length )]
							};

							transaccio.registres.add(registre).done(function(){
								crearRegistre(registre);
							});
						});


						function crearRegistre(reg){
							var tmpRegistre = $("<li></li>");

							tmpRegistre.addClass()
								.data("id", reg.id )
								.text(reg.text + "<a href='#'>Eliminar</a>");


							registres.append(tmpRegistre);

						}




						// When an registre is clicked, remove it from the database.
						$("#registres").on("click", "a", function(){
							var registre = $(this);
							transaccio.registres.remove(registre.id).done(function(){
								registre.fadeOut();
							});
						});


				});





				}).fail(function(error){
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

});