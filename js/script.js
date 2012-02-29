var loadPage = function(){
  var main = $("#content"), level1re = /^#(home|about)$/ ,level2re = /^#(photo)\/?(all|cat|flower)?$/;
  if( document.location.hash =="" || level1re.test(document.location.hash)){
    main.html("<div class='loading'>Loading</div>");
    $("header nav").find("a").removeClass("selected").filter("[href='"+ (document.location.hash || "#home")+"']").addClass("selected");
    var htmlUrl = document.location.hash !="" ? "html/"+document.location.hash.match(level1re)[1]+".html" : "html/home.html"; 
    $.get(htmlUrl, function(data){
      main.html(data);
    });
    //hide 2nd nav
    $("header nav ul").find(".l2nav").removeClass('open');
    $("header nav ul li:visible:last").addClass("last");
  }else if( level2re.test(document.location.hash)){
    var m = document.location.hash.match(level2re);
    $("header nav").find("a").removeClass("selected").filter("[href='#" + m[1] + "']").addClass("selected").parent("li").removeClass("last");
    $("header nav ul").find(".l2nav").filter("[name='"+m[1]+"']").addClass('open').filter(":first").addClass("arrow"); 
    if(m[2]==undefined){
      
    }else{
      
    }
  }else{
    main.html("<div class='loading'>Page Not Found!</div>");
  }
  
}
$(function(){
  loadPage();
  if($("html.lt-ie8").length > 0){ //ie7 compatible
    $("header > nav").find("a").click(function(e){
      if(e.target.href != document.location.hash){
        $(window).trigger("hashchange");
      }
    });
  }
  $(window).bind("hashchange",function(e){
    loadPage();
  });
});
