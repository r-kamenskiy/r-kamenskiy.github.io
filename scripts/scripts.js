$( document ).ready(function() {
    $(".copyright").hide();
    $(".social-detail").hide();
    		
	var btn = $("#collapseLeftPanel");
    btn.click(function(){
    	$(".left-panel-content").toggleClass("left-panel-expanded");
    	$(".left-panel").toggleClass("left-panel-expanded");
    	$(".social-link").toggleClass("social-link-expanded");
    	
    	if(btn.text().trim() === ">"){
    		$(".copyright").show();
    		$(".social-detail").show();
    		btn.text("<");
    	} else{
    		$(".copyright").hide();
    		$(".social-detail").hide();

    		btn.text(">");
    	}
    });
});