/**
*DOCUMENT - READY
*/
$(document).ready(
function(event)
{
	$.ajax({
		url: "./img/maps/", 
		beforeSend: function( xhr ) {
			xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
		}
	}).done(
	function(data){
		onMapsReceived(data,"./img/maps/","#preloaded_maps");
		

	}
	);	
}
);

/**
* MAPS MANAGER
*/
/**
*GETS ALL MAPS FROM A FOLDER
*src:https://forums.adobe.com/thread/2144429
*src:https://stackoverflow.com/questions/18480550/how-to-load-all-the-images-from-one-of-my-folder-into-my-web-page-using-jquery
*/
function onMapsReceived(data, folderName, menuID)
{
	var lines= data.split("\n");
	for(var i=0;i<lines.length;i++)
	{
		if(lines[i].search('.svg')>0)
		{
			//console.log(lines[i]);
			//console.log(lines[i].split(" ")[1]);
			
			var fileName=lines[i].split(" ")[1];
			var elementName=fileName.split('.')[0];
			var elementID=elementName;
			var fileLink=folderName+fileName;
			var newButton=$('<button class="btn btn-link add_new_element text-white" style="text-decoration:none;"  value="'+elementID+'" data-url="'+fileLink+'"><i class="fa fa-fw fa-map-pin"></i> '+elementName+'</button>');
			console.log(elementName);
			
			
			$(newButton).click(
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
			$(menuID).append(newButton);
			
		}
	}
}
/**
* 1.- Cleans the previous map content.
* 2.- Loads the new selected map.
*/
function loadNewMap(data){
	$("#map_content").remove();
	$('#map').append(data);
	$("#map").html($("#map").html());
}