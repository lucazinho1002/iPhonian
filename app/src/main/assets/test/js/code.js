

const appa = require('electron').remote;

 win = appa.getCurrentWindow();

var extract = require('extract-zip');
  alert("ddd");
extract("ico.zip", {dir: "./cok"}, function (err) {
 // extraction is complete. make sure to handle the err 
})


 $('body').on('keypress','.add', function (e) {
         if(e.which === 13){
               
              const webview = document.getElementById("view1") ; 
            webview.loadURL($(".add").val()); 
             webview.insertCSS("body{margin-top:200px}");  
            
         }
   });




function readapp(){
    
    const fs = require('fs');
    const app2 = require('electron').remote;
    app2.getCurrentWebContents().toggleDevTools();
    //alert("hi");
//require('remote').getCurrentWindow().toggleDevTools();
    
//const {app} = require('electron');
    const app = require('electron').remote.app;
    
    
  

    
//app.getAppPath()    app.getPath('documents');
myDir = app.getAppPath();    
apppath = app.getPath("exe");
    console.log(apppath);

    $("#dock").html("");
    fs.readdirSync(myDir+"/MaciPadian/apps").forEach(function(file){
     console.log(file);
        if(file.indexOf(".") == 0) i = 0;
        else addapp(file);
    });

}

function addapp(k){

    ap = '<li><a href="#" data-url="apps/'+k+'/index.html" data-type="apps" data-name="'+k+'"> <div class="imgicon" style="background-image: url(apps/'+k+'/icon.png);" ></div><p>'+k+'</p></a></li>';
    $("#dock").append(ap);

}




function relanch(){

const app = require('electron').remote.app;
    app.relaunch();
}

function openapp(icon,title,url,id){
	
    useragent = "Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A5345a Safari/602.1";
    
    //useragent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36";
    noda = "bg";
    //if(title == "Settings" ) noda = "nodeintegration";
    //if(title == "AppStore" ) useragent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36";
   
    if(title == "Settings" ) {
    $("main").show(5);
    $("#ctls").show(0);
	$('<webview>', {
    name: title,
    id:   title,
	width:   '100%',
	height:   '100%',
    background: '#fff;' ,   
	frameborder: '0',
    nodeintegration : false,    
    //useragent : useragent,
	src: url
	}).appendTo('main');
	
    
    }else {
    
    
        if(title == "Browser" ){
        
            $("main").show(5);
    $("#ctls").show(0);
            
            var ht = '<browser><header><tools><img class="b1" src="system/Browser/icon/back.png"/><img  class="b2" src="system/Browser/icon/next.png"/><img  class="b3" src="system/Browser/icon/book-simple-7.png"/><img  class="b4" src="system/Browser/icon/box-outgoing-7.png"/><img  class="b5" src="system/Browser/icon/add.png"/><img  class="b6" src="system/Browser/icon/squares.png"/><url><input class="add" type="url"/>    </url>    </tools><tabs></tabs></header><webview class="view" id="view1"  width="100%" height="100%" style="" useragent="Mozilla/5.0 (iPad; CPU OS 10_0 like Mac OS X) AppleWebKit/602.1.32 (KHTML, like Gecko) Version/10.0 Mobile/14A5261v Safari/602.1" src="http://www.google.com"></webview></browser>';
            
            $("main").append(ht);
        
        }else{
        
	$("main").show(5);
    $("#ctls").show(0);
	$('<webview>', {
    name: title,
    id:   title,
	width:   '100%',
	height:   '100%',
    background: '#fff;' ,   
	frameborder: '0',
    useragent : useragent,    
	src: url
	}).appendTo('main');
	
    }
    }
	$('#dockapps a').each( function(i) {
		// if($(this).hasClass("select")) $(this).removeClass('select');
	});
	
	$("#dockapps").append('<a href="#" class="myButton"><img src="'+icon+'/'+title+'/icon.png" width="20" /><span>'+title+'</span></a>');
    
}

function showapp(t){
    transs(10);
	$("webview").eq(t).show();
	$("main").show(5);
    $("#ctls").show(0);
    
	//$("#"+title).show(0);
    //alert("#"+title);

}


$(document).on( "click","#dockapps a", function() {

var tit =  $(this).find("span").text();
    //alert(tit);
    if(tit == "Browser") {
    $("browser").show(0);
        $("browser").find("webview").show();
     $("main").show(5);
    $("#ctls").show(0);
    
    }else{
  $("browser").hide();      
$("webview").hide();
showapp($(this).index());
    }
    			
			});

function mm(v){
//alert(v);
$('#dockapps a').each( function(i) {
				if($(this).hasClass("select")) $(this).removeClass('select');
			});			 
			//$(this).addClass('select');
//showapp(v);

}


function transs(v){

    $("#owl-demo").css( "-webkit-filter", "blur("+v+"px)" );
                   $("#topi").css( "backdrop-filter", "blur("+v+"px)" );
                    $("bg").css( "-webkit-filter", "blur("+v+"px)" );
        $("blur2").css( "-webkit-filter", "blur("+v+"px)" );

}

function homescreen(){
	//$("webview").hide();
    //$("browser").hide();
	//$("main").hide();
    //$("#ctls").hide();
    transs(0)
    $("main").children(':visible').hide();
    $("main").hide();
    $("#ctls").hide();
}

function closeWin() {
    window.close();   // Closes the new window
}


function appswitch(index){

}

function closeApp(){

var c = $("main").children(':visible').index();
$('#dockapps a').eq(c).remove();    
$("main").children(':visible').remove();
 homescreen();    
}

function closeApp2() {
  
    c2 = $("browser:visible").index();
    if(c2 >= 0){
    
    $("browser").remove();
    
    }else {
    CurrentIndex = $("webview:visible").index();
  alert(c2 +" "+ CurrentIndex);
		 $('#dockapps a').eq(CurrentIndex).remove();
 
		 

  $("webview:visible").each(function(){
  $(this).remove();
   homescreen();
  });
    }
    
    }