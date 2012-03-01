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
      url += "?format=json&jsoncallback=?&tagmode=any"
      if(options!=null){
        if(options.uid){
          url += ((options.uid instanceof Array)?"&ids=":"&id=") +this.join(options.uid);
        }
        if(options.tags != null && (options.tags instanceof Array)){
          url += "&tags=" + this.join(options.tags);
        }
      }
      return url;
    },
    giveMeBigImg: function(data){
      for(var i = 0 ; i < data.items.length ; i++){
        var link = data.items[i].media.m;
        data.items[i].media.b = link.replace("_m.jpg","_b.jpg")
      }
      return data;
    }
  }
  return {
    getJSON : function(options, callback){
      console.log(_private.getUrl(options));
      $.getJSON(_private.getUrl(options),function(data){
        data = _private.giveMeBigImg(data);
        callback(data);
      });
    }
  }
})();

var contentManager = (function(){
  var _private = {
    tagMapping : {
      "cat" : ["貓咪","大咪"],
      "flower" : ["小花","花",]
    }
  };
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
        
        var selectedSubCate = ((m[2]==undefined) ? "all":m[2]);
        $("header nav").find("a").filter("[href='#" + m[1] + "/" + selectedSubCate + "']").addClass("selected");
        var flickrOptions = { uid: "82749119@N00" };
        if(selectedSubCate != "all"){
          flickrOptions.tags = _private.tagMapping[selectedSubCate];
        }
        //load images
        flickerManager.getJSON(flickrOptions, function(data){
          main.html("");
          for(var i = 0 ; i < data.items.length ; i++){
            var item = "<a class='fancybox' rel='gallery1' href='" + data.items[i].media.b  + "' title='" + data.items[i].title + "'>" +
              "<img src='" + data.items[i].media.m + "' alt='"+ data.items[i].title +"' /></a>"
            main.append( item );
          }
          $(".fancybox").fancybox({
            openEffect  : 'none',
            closeEffect : 'none'
          });
        });
        
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
