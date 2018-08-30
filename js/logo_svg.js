function partHoverAnimation(e)
{
	//alert("hiii");
	e.style.transition="all 1s";
	e.style.opacity	=	0.75;
	e.style.transform="scale(1.5)";
}

function partHoverOutAnimation(e)
{
	e.style.transition="all 1s";
	e.style.opacity	=	1;
	e.style.transform="scale(1)";

}

jQuery(document).ready(
function()
{
	var count		=	1.0;//Secs
	var wait		=	0.25;//Secs
	//alert("ON READY");
	jQuery(".logo-part").each(
		function(e){
			count+=wait;
			jQuery(this).css("animation","onLoadLogoAnimation "+count+"s");
		}
	);
}
);