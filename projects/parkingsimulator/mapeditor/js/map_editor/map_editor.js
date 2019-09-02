/**
* GLOBAL VARS
*/
var offset        = {x:0,y:0};
var currentRasterMousePosition={x:0,y:0};
var selected      = {id:"",target:null,draggedFromNav:false};
var rasterMode    = false;
var initialScroll = 0;
/*REMOVE VARS FOR TABLETS*/
var touchtime = 0;
var delay = 800;
var action = null;
/*#######################################################################################*/
/**
* SAVE
* src:https://jsfiddle.net/koldev/cW7W5/
* src:https://stackoverflow.com/questions/3614212/jquery-get-html-of-a-whole-element
*/
var fileLink = document.createElement( 'a' );
fileLink.style.display = 'display:none';
document.body.appendChild( fileLink );
$("#save_all").click(
function(event)
{
	var mapContent=$("#map_content")[0].outerHTML;
	var blob =new Blob([mapContent],{ type: 'image/svg+xml'});//'text/plain' });
	var url=window.URL.createObjectURL(blob);
	fileLink.href=url;
	fileLink.download=$(this).data("filename");
	fileLink.click();
	window.URL.revokeObjectURL(url);
}
);
/**
* SHOW/HIDE LAYER
*/
$(".show_layer").click(
function(event){
	var layerStatus=parseInt($(this).data("status"));
	var layerIcon=$(this).data("icon");
	var layerNumber=$(this).data("layer");
	var layerNavLink=$(this).data("nav");
	
	if(layerStatus==1)
	{
		$(this).data("status","0");
		$("#"+layerIcon).attr("class","fas fa-eye-slash");
		if( !($("#"+layerNavLink).attr("class").indexOf("collapsed")>=0) ){$("#"+layerNavLink).click();}
		$("#"+layerNavLink).attr("class","nav-link disabled collapsed");
		$("#map_content image").each(
		function(event){
			if($(this).attr("tabindex")==layerNumber)
			{
					$(this).hide();
			}
		}
		);
	}else{
		$(this).data("status","1");
		$("#"+layerIcon).attr("class","fas fa-eye");
		$("#"+layerNavLink).attr("class","nav-link collapsed");
		$("#map_content image").each(
		function(event){
			if($(this).attr("tabindex")==layerNumber)
			{
					$(this).show();
			}
		}
		);
	}
	
}
);
/*#######################################################################################*/
/**
* CLEAR ALL
*/
$("#clear_all").click(
function(event)
{
	var checkstr =  confirm('Are you sure you want to delete this?');
	if(checkstr == true){
	  // do your code
	 clearMapContent();
	}
}
);

/**
* raster 
*/
$("#raster_enable").click(
function(event)
{
	rasterMode=!rasterMode;
	if(rasterMode)
	{
		$("#raster_enable_icon").attr("class","fas fa-eye");
		$("#raster").show();
	}else{
		$("#raster").hide();
		$("#raster_enable_icon").attr("class","fas fa-eye-slash");
	}
}
);
/**
* ADD ELEMENT
*/
$(".add_new_element").click(
function(event)
{
	//ADD NEW ELEMENT
	var elementName = "#"+$(this).val();
	var newElement  = $(elementName).clone();
	$(newElement).attr("x",0);
	$(newElement).attr("y",0);
	$(newElement).attr("id","");
	$("#map").append(newElement);
	refreshMapContainer();
	addEventsToMapElements();
	addEventsToRasterSquares();
}
);

$(".add_new_element").on('dragstart', 
function(event) 
{
	console.log("on dragstart triggered");
	var elementName = "#"+$(this).val();
	var newElement  = $(elementName).clone();	
	$(newElement).attr("x",0);
	$(newElement).attr("y",0);
	$(newElement).attr("id","");
	$("#map").append(newElement);
	refreshMapContainer();
	addEventsToMapElements();
	addEventsToRasterSquares();
	offset={x:0,y:0};
	selected.target=$('image').last();
	selected.draggedFromNav=true;
}
);

/**
* RECT-Raster
*/
$("rect").on('dragover', 
function(event) 
{
	event.preventDefault();  
    event.stopPropagation();
}
);
$("rect").on('drop', 
function(event) 
{
	if(rasterMode)
	{
	  if(selected.target!=null)
	  {
		  $(selected.target).attr("x",$(this).attr("x"));
		  $(selected.target).attr("y",$(this).attr("y"));
		  selected.target=null;
	  }
	}
}
);
//IMAGE 
$("image").on('dragstart', 
function(event) 
{
	if(rasterMode){return;}
	event.preventDefault();	

}
);


$( "image" ).mousedown(
function( event ) 
{
	console.log("AQUI SI QUE ENTRA");
	if(!$(selected.target).is(event.target))
	{
		console.log("OuterWidth "+$("#map").outerWidth()+" Offset "+ ($("#map").outerWidth()/2048) );
		console.log("OuterWidth "+$("#map").outerHeight()+" Offset "+ ($("#map").outerHeight()/1536) );
		console.log("Position "+ $("#map").position().left );
		console.log("OffsetX "+($("#map").position().left-event.clientX));
		console.log("extremeX"+ ( $("#map").position().left+$("#map").outerWidth()))
	  offset.x =$(this).position().left - event.clientX;//(parseFloat( $(this).attr( 'x' ) ))- event.clientX;
	  offset.y =$(this).position().top  - event.clientY;//(parseFloat( $(this).attr( 'y' ) ))- event.clientY;
	  $( "#label_mousedown_elem_posx" ).text( "Offset coordinates (x,y) : " + offset.x+","+offset.y);
	  $( "#label_mousedown_elem_posy" ).text( "Mouse  pointer     (x,y) : " + event.clientX+","+event.clientY );
	  selected.target=event.target;
	  initialScroll= window.pageYOffset || document.documentElement.scrollTop;
	}
}
);
$( "image" ).mouseup(function( event ) 
{
	if(rasterMode){return;}
	if($(selected.target).is(event.target))
	{
		selected.target=null;
	}
});


$( "#map" ).mousemove(function( event ) {
  var pageCoords = "( " + event.pageX + ", " + event.pageY + " )";
  var clientCoords = "( " + event.clientX + ", " + event.clientY + " )";
  $( "#label_map_posx" ).text( "Page coordinates : " + pageCoords );
  $( "#label_map_posy" ).text( "Mouse coordinates : " + clientCoords );
});

/**
* DOCUMENT - MOUSEMOVE
*/
$(document).bind( "mousemove", function( event ){
	if(rasterMode && !selected.draggedFromNav){return;}
	if(selected.target!=null)
	{
		console.log("Entro "+$(selected.target).attr('name'));
		 var top  = window.pageYOffset || document.documentElement.scrollTop,
  left = window.pageXOffset || document.documentElement.scrollLeft;
  var scrollOffset=top-initialScroll;
      $(selected.target).attr( 'x' ,( event.clientX-$("#map").position().left+offset.x)*(2048/$("#map").outerWidth()));//event.clientX +offset.x);
      $(selected.target).attr( 'y',  ((event.clientY-$("#map").position().top+offset.y+scrollOffset)*(1536/$("#map").outerHeight())) );//event.clientY +offset.y);
      /*$( "#label_mousemove_elem_posx" ).text( "Target position : " + $(selected.target).attr("x")+","+$(selected.target).attr("y"));
      $( "#label_mousemove_elem_posy" ).text( "Mouse pointer   : " + event.clientX+","+event.clientY);	
	  
	   $( "#label_mouseup_elem_posx" ).text( "Pointer on map (x,y): " +  ( event.clientX-$("#map").position().left)+","+(event.clientY-$("#map").position().top)+" offset "+offset.x+","+( event.clientY-$("#map").position().top) );
	    $( "#label_mouseup_elem_posy" ).text( "Pointer on map (x,y)+offset: " +  ( event.clientX-$("#map").position().left+offset.x)*(2048/$("#map").outerWidth())+","+((event.clientY-$("#map").position().top+offset.y)*(1536/$("#map").outerHeight()))+"  hi "+top );
*/
//console.log("Target position "+$(selected.target).attr("x")+","+$(selected.target).attr("y"));
	}
});
/**
* PREVENTS FROM DROP EVENT THE LOAD OF A PREVIEW IMAGE PAGE
*/
$(document).bind("drop",function(e){
  e = e || event;
  e.preventDefault();
},false);

$(document).bind("mouseup",function(e){

	if(selected.draggedFromNav)
	{
		if(rasterMode){
			$(selected.target).attr("x",currentRasterMousePosition.x);
			$(selected.target).attr("y",currentRasterMousePosition.y);
		}
		selected.target=null;
	}
});
/**
*DOCUMENT - READY
*/
$(document).ready(
function(event)
{
 buildRaster();
 refreshSVGContainer();
 addEventsToRasterSquares();
 if(rasterMode)
 {
   $("#raster").show();	
 }else{
  $("#raster").hide();	
 }
	$.ajax({
		url: "./img/sidewalks/", 
		beforeSend: function( xhr ) {
			xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
		}
	}).done(
	function(data){
		onLoadDoneHtml(data,"./img/sidewalks/","#sprites_sidewalks",30);
	}
	);

	$.ajax({
		url: "./img/road_surface/", 
		beforeSend: function( xhr ) {
			xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
		}
	}).done(
	function(data){
		onLoadDoneHtml(data,"./img/road_surface/","#sprites_road_surface",10);
	}
	);
	$.ajax({
		url: "./img/parking_slots/", 
		beforeSend: function( xhr ) {
			xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
		}
	}).done(
	function(data){
		onLoadDoneHtml(data,"./img/parking_slots/","#sprites_parking_slots",20);
	}
	);
	
	
	$.ajax({
		url: "./img/sewer_caps/", 
		beforeSend: function( xhr ) {
			xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
		}
	}).done(
	function(data){
		onLoadDoneHtml(data,"./img/sewer_caps/","#sprites_sewer",40);
	}
	);
	
	$.ajax({
		url: "./img/vegetation/", 
		beforeSend: function( xhr ) {
			xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
		}
	}).done(
	function(data){
		onLoadDoneHtml(data,"./img/vegetation/","#sprites_vegetation",50);
	}
	);
		
}
);

/**
* BuildRaster
*/
function buildRaster()
{
	var raster = {width:2048 ,height:1536};
	var square = {width:64  ,height:64};
	var rasterDimensions  ={rows:0,cols:0}
	rasterDimensions.rows =(raster.height/square.height);
	rasterDimensions.cols =(raster.width/square.width);
	var elementsAmount    =rasterDimensions.rows*rasterDimensions.cols;
	for(var i=0;i<elementsAmount;i++)
	{
		var rectElement = $('<rect class="raster_rect" x="'+((i%rasterDimensions.cols)*square.width)+'" y="'+(parseInt(i/rasterDimensions.cols)*square.height)+'" width="64" height="64" style="stroke: lightgray;fill: transparent"/>');
				//END EVENTS
		$("#raster").append(rectElement);
		
	}
}

/**
*addEventsToSVGElements
*/
function addEventsToRasterSquares()
{
		$("rect").each(
		function(index){
										//EVENTS
		$(this).on("drop", 
			function(event) 
			{
				if(rasterMode)
				{
				
				  if(selected.target!=null)
				  {
					  
					  $(selected.target).attr("x",$(this).attr("x"));
					  $(selected.target).attr("y",$(this).attr("y"));
					  
					   $( "#label_mousemove_elem_posx" ).text( "Target position : " + $(selected.target).attr("x")+","+$(selected.target).attr("y"));
					  $( "#label_mousemove_elem_posy" ).text( "Mouse pointer : " + event.clientX+","+event.clientY);
					  
					  selected.target=null;
				  }
				}
			}
			);
			
			$(this).on('dragover', 
			function(event) 
			{
				event.preventDefault();  
				event.stopPropagation();
			}
			);
			
			$(this).on("dragleave", function(event) {
    event.preventDefault();  
    event.stopPropagation();
});
$(this).on("mouseover", function(event) {
	currentRasterMousePosition.x=$(this).attr("x");
	currentRasterMousePosition.y=$(this).attr("y");
});

			
		}
		);
	
}
/**
*addEventsToMapElements
*/
function addEventsToMapElements()
{
		$("#map_content image").each(
		function(index){
			
	$(this).on('dragstart', 
function(event) 
{
	if(rasterMode){
		var img= document.createElement("img");
		img.src="./img/ondrag.svg";
		img.width='32px';
		img.height='32px';
		event.originalEvent.dataTransfer.setDragImage(img, 0, 0); // add this line
		return;}
	event.preventDefault();	
}
);
/**
*REMOVE ON TABLETS
*src: https://stackoverflow.com/questions/27560653/jquery-on-double-click-event-dblclick-for-mobile
*/
$(this).on("click", function() {
  /*Double Click */
  if((new Date().getTime() - touchtime) < delay){
     touchtime=0;
	 var checkstr =  confirm('are you sure you want to delete this?');
		if(checkstr == true){
		  // do your code
		  $(this).remove();
		}
  }
  /* Single Click */
  else{
     touchtime = new Date().getTime();
  }
});
/*END REMOVE ON TABLETS*/
$(this).on('mousedown',
function( event ) 
{
	switch(event.which){
		
		case 1: //LEFT
		if(!$(selected.target).is(event.target))
	{
		console.log("OuterWidth "+$("#map").outerWidth()+" Offset "+ ($("#map").outerWidth()/2048) );
		console.log("OuterWidth "+$("#map").outerHeight()+" Offset "+ ($("#map").outerHeight()/1536) );
		console.log("Position "+ $("#map").position().left );
		console.log("OffsetX "+($("#map").position().left-event.clientX));
		console.log("extremeX"+ ( $("#map").position().left+$("#map").outerWidth()))
	  offset.x =$(this).position().left - event.clientX;//(parseFloat( $(this).attr( 'x' ) ))- event.clientX;
	  offset.y =$(this).position().top  - event.clientY;//(parseFloat( $(this).attr( 'y' ) ))- event.clientY;
	  $( "#label_mousedown_elem_posx" ).text( "Offset coordinates (x,y) : " + offset.x+","+offset.y);
	  $( "#label_mousedown_elem_posy" ).text( "Mouse  pointer     (x,y) : " + event.clientX+","+event.clientY );
	  selected.target=event.target;
	  selected.draggedFromNav=false;
	  initialScroll= window.pageYOffset || document.documentElement.scrollTop;
	}
		break;
		case 2://MIDDLE
		
		break;
		case 3://RIGHT
		var checkstr =  confirm('are you sure you want to delete this?');
		if(checkstr == true){
		  // do your code
		  $(this).remove();
		}
		break;
	}
	
}
);
$( this).mouseup(function( event ) 
{
	if(rasterMode){return;}
	if($(selected.target).is(event.target))
	{
		selected.target=null;
		
	}
});
		}
		);
		
}
/**
* REFRESHES THE SVG HTML
*/
function refreshSVGContainer()
{
	$("#raster").html($("#raster").html());
}
/**
* REFRESHES THE SVG HTML
*/
function refreshMapContainer()
{
	$("#map").html($("#map").html());
}
/**
*
*/
function refreshMapContent(){
	$("#map_content").html($("#map_content").html());
	var sortedMapItems = $("#map_content image").sort(
		function(a,b)
		{
			//console.log("Sorting "+"names "+$(a).attr("name")+"-"+$(b).attr("name") +  (  parseInt($(a).attr("tabindex"))-parseInt($(b).attr("tabindex")) ) );
			var contentA=parseInt($(a).attr("tabindex"));
			var contentB=parseInt($(b).attr("tabindex"));
			return contentA-contentB;
		}
	);
	$("#map_content").html(sortedMapItems);
}
/**
*
*/
function clearMapContent(){
	$("#map_content").html("");
	
}
/**
* REFRESHES THE HTML PAGE
*/
function refreshPage(){
	
	$("body").html($("body").html());
}


/**
* IMAGES MANAGER
*/
/**
*GETS ALL IMAGES FROM A FOLDER
*src:https://forums.adobe.com/thread/2144429
*src:https://stackoverflow.com/questions/18480550/how-to-load-all-the-images-from-one-of-my-folder-into-my-web-page-using-jquery
*/
function onLoadDoneHtml(data, folderName, menuID, zindex)
{
	console.log("***DROGA***"+folderName+"***");
	var lines= new Array();//data.split("\n");
	 $(data).find("td > a").each(function(){
		 if($(this).attr("href").search('.png') > 0 && !($(this).attr("href").search('light')>0))
		 {
			lines.push($(this).attr("href"));
		 }
         });
	for(var i=0;i<lines.length;i++)
	{
			var fileName=lines[i];
			var elementName=fileName.split('.')[0];
			var elementID="clone_"+elementName;
			var fileLink=folderName+fileName;
			
			console.log(fileLink);
			var newButton=$('<button class="btn btn-link add_new_element text-white" style="text-decoration:none;"  value="'+elementID+'" ><img src="'+fileLink+'" width="32" id="'+elementID+'_img"/></button>');
			var newImageElement  = $('#clone_me').clone();
			newImageElement.attr("name",elementName);
			newImageElement.attr("id",elementID);
			newImageElement.attr("xlink:href",fileLink);
			newImageElement.attr("tabindex",zindex);
			
			$(newButton).click(
				function(event)
				{
					//ADD NEW ELEMENT
					var elementName  = "#"+$(this).val();
				    var elementImage = new Image();
					var elementImageName =$("#"+$(this).val()+"_img");
					var newElement   = $(elementName).clone();
					elementImage.src=elementImageName.attr("src");
					console.log(elementImageName.attr("src")+"-"+elementImage.naturalWidth);
					$(newElement).attr("x",0);
					$(newElement).attr("y",0);
					$(newElement).attr("id","");
					$(newElement).attr("width",elementImage.naturalWidth);
					$(newElement).attr("height",elementImage.naturalHeight);
					
					$("#map_content").append(newElement);
					refreshMapContent();
					addEventsToMapElements();
					addEventsToRasterSquares();
				}
			);
			
			$(newButton).on('dragstart', 
				function(event) 
				{
					var elementName = "#"+$(this).val();
					var newElement  = $(elementName).clone();
					var elementImage = new Image();	
					var elementImageName =$("#"+$(this).val()+"_img");					
					elementImage.src=elementImageName.attr("src");
					console.log(elementImageName.attr("src")+"-"+elementImage.naturalWidth);
					$(newElement).attr("x",0);
					$(newElement).attr("y",0);
					$(newElement).attr("id","_dragged_");
					$(newElement).attr("width",elementImage.naturalWidth);
					$(newElement).attr("height",elementImage.naturalHeight);
					$("#map_content").append(newElement);
					refreshMapContent();
					addEventsToMapElements();
					addEventsToRasterSquares();
					offset={x:0,y:0};
					selected.target=$('#_dragged_');
					$(selected.target).attr("id","");
					selected.draggedFromNav=true;
				
				}
			);
			
			$("defs").first().append(newImageElement);
			$(menuID).append(newButton);
		
	}
}
/**
* PLAIN TEXT
*/
function onLoadDone(data, folderName, menuID, zindex)
{
	var lines= data.split("\n");
	
	for(var i=0;i<lines.length;i++)
	{
		if(lines[i].search('.png')>0 && !(lines[i].search('light')>0))
		{
			//console.log("*START*"+lines[i]+"*END*");
			//console.log(lines[i].split(" ")[1]);
			
			var fileName=lines[i].split(" ")[1];
			var elementName=fileName.split('.')[0];
			var elementID="clone_"+elementName;
			var fileLink=folderName+fileName;
			var newButton=$('<button class="btn btn-link add_new_element text-white" style="text-decoration:none;"  value="'+elementID+'" ><img src="'+fileLink+'" width="32" id="'+elementID+'_img"/></button>');
			var newImageElement  = $('#clone_me').clone();
			newImageElement.attr("name",elementName);
			newImageElement.attr("id",elementID);
			newImageElement.attr("xlink:href",fileLink);
			newImageElement.attr("tabindex",zindex);
			
			$(newButton).click(
				function(event)
				{
					//ADD NEW ELEMENT
					var elementName  = "#"+$(this).val();
				    var elementImage = new Image();
					var elementImageName =$("#"+$(this).val()+"_img");
					var newElement   = $(elementName).clone();
					elementImage.src=elementImageName.attr("src");
					console.log(elementImageName.attr("src")+"-"+elementImage.naturalWidth);
					$(newElement).attr("x",0);
					$(newElement).attr("y",0);
					$(newElement).attr("id","");
					$(newElement).attr("width",elementImage.naturalWidth);
					$(newElement).attr("height",elementImage.naturalHeight);
					
					$("#map_content").append(newElement);
					refreshMapContent();
					addEventsToMapElements();
					addEventsToRasterSquares();
				}
			);
			
			$(newButton).on('dragstart', 
				function(event) 
				{
					var elementName = "#"+$(this).val();
					var newElement  = $(elementName).clone();
					var elementImage = new Image();	
					var elementImageName =$("#"+$(this).val()+"_img");					
					elementImage.src=elementImageName.attr("src");
					console.log(elementImageName.attr("src")+"-"+elementImage.naturalWidth);
					$(newElement).attr("x",0);
					$(newElement).attr("y",0);
					$(newElement).attr("id","_dragged_");
					$(newElement).attr("width",elementImage.naturalWidth);
					$(newElement).attr("height",elementImage.naturalHeight);
					$("#map_content").append(newElement);
					refreshMapContent();
					addEventsToMapElements();
					addEventsToRasterSquares();
					offset={x:0,y:0};
					selected.target=$('#_dragged_');
					$(selected.target).attr("id","");
					selected.draggedFromNav=true;
				
				}
			);
			
			$("defs").first().append(newImageElement);
			$(menuID).append(newButton);
		}
	}
}