$('.add_new_map').click(
				function(event)
				{
					var dataURL= $(this).data('url');
					$.ajax({
					url: dataURL, 
					beforeSend: function( xhr ) {
						xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
					}
				}).done(
					function(data){
						var checkstr =  confirm('Are you sure you want to load a new map?');
						if(checkstr == true){
							// do your code
							loadNewMap(data);
							refreshMapContent();
							addEventsToMapElements();
							addEventsToRasterSquares();
						}
					});	
				});

/**
* 1.- Cleans the previous map content.
* 2.- Loads the new selected map.
*/
function loadNewMap(data){
	$("#map_content").remove();
	$('#map').append(data);
	$("#map").html($("#map").html());
}