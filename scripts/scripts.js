$( document ).ready(function() {
    $(".copyright").hide();
    $(".social-detail").hide();

	var btn = $("#collapseLeftPanel");
    btn.click(function(){
    	$(".left-panel-content").toggleClass("left-panel-expanded");
    	$(".left-panel").toggleClass("left-panel-expanded");
    	$(".social-link").toggleClass("social-link-expanded");
        $(".center-panel").toggleClass("content-expanded");
        $(".progman").toggleClass("progman-expanded");

    	if(btn.hasClass("fa-arrow-right")){
    		$(".copyright").show();
    		$(".social-detail").show();

    		btn.removeClass("fa-arrow-right");
    		btn.addClass("fa-arrow-left");
    	} else{
    		$(".copyright").hide();
    		$(".social-detail").hide();

    		btn.addClass("fa-arrow-right");
    		btn.removeClass("fa-arrow-left");
    	}
    });
});