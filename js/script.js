var flickerManager = (function(){
  var _private = {
    baseUrl : "http://api.flickr.com/services/feeds/photos_public.gne",
    join: function(s){
      var r = "";
      if(s!=null){
        if(s instanceof Array){
          for(var i = 0 ; i < s.length; i++){
            r += s[i];
            if(i != (s.length-1))  r+=",";
          }
        }else{
          r+=s;
        }
      }
      return encodeURIComponent(r);
    },
    getUrl: function(options){
      var url = this.baseUrl;
      url += "?format=json"
      if(options!=null){
        if(options.uid){
          url += ((options.uid instanceof Array)?"&ids=":"&id=") +this.join(options.uid);
        }
        if(options.tags != null && (options.tags instanceof Array)){
          url += "&tags=" + this.join(options.tags);
        }
      }
      
    }
  }
  return {
    getJSON : function(options, callback){
      $.getJSON(_private.getUrl(options),function(data){
        callback(data);
      });
    }
  }
})();

var contentManager = (function(){
  var _private = {};
  return {
    loadPage : function(){
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
  }
})();
$(function(){
  contentManager.loadPage();
  if($("html.lt-ie8").length > 0){ //ie7 compatible
    $("header > nav").find("a").click(function(e){
      if(e.target.href != document.location.hash){
        $(window).trigger("hashchange");
      }
    });
  }
  $(window).bind("hashchange",function(e){
    contentManager.loadPage();
  });
});
