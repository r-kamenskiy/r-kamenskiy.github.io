
$( document ).ready(function() {
	var btn = $("#collapseLeftPanel");
    btn.click(function(){
    	$(".left-panel-content").toggleClass("left-panel-expanded");

    	if(btn.text().trim() === ">"){
    		btn.text("<");
    	} else{
    		btn.text(">");
    	}
    });
});