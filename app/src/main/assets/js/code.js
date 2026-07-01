// Removido os requires de Electron do PC que quebravam o script no Android

$('body').on('keypress', '.add', function (e) {
    if(e.which === 13){
        const webview = document.getElementById("view1"); 
        if(webview) {
            webview.src = $(".add").val(); 
        }
    }
});

// LISTA TOTAL DE APLICATIVOS (Coloque TODOS os nomes das suas pastas aqui!)
function readapp(){
    $(".dock").html("");
    
    // Aqui você adiciona quantos apps quiser! O script cria páginas automáticas.
    var appsPadrao = [
        "AppStore", "Calculator", "Clock", "Notes", "Weather",
        "Whatsapp", "Browser", "Mail", "Music", "Settings", "Photos",
        "YouTube", "Facebook", "Instagram", "Maps", "Reminders", "Calendar"
    ];
    
    appsPadrao.forEach(function(file){
        addapp(file);
    });
}

function pages(){
    // Cria dinamicamente uma nova página se a anterior lotar
    var content = '<div class="pago"><ul id="dock" class="grido"></ul></div>';
    
    // Verifica se o OwlCarousel está inicializado para usar o método correto
    var owl = $("#owl-demo").data('owlCarousel');
    if (owl) {
        owl.addItem(content);
    } else {
        $("#owl-demo").append(content);
    }
    
    // Retorna o índice da nova página criada
    return $('.grido').length - 1;
}

function addapp(k){
    // Verifica qual é a última página atual
    var totalPaginas = $('.grido').length;
    var pg = totalPaginas - 1;
    
    // Se a última página já tiver 14 aplicativos, cria uma nova página
    var totalAppsNaPagina = $('.grido').eq(pg).children().length; 
    if(totalAppsNaPagina >= 14) {
        pg = pages();
    }
    
    // Código visual do ícone
    var ap = '<li><a href="#" data-url="apps/'+k+'/index.html" data-type="apps" data-name="'+k+'"> <div class="imgicon" style="background-image: url(apps/'+k+'/icon.png);" ></div><p>'+k+'</p></a></li>';
   
    // Adiciona o aplicativo na página correspondente
    $('.grido').eq(pg).append(ap);
}

function relanch(){
    window.location.reload();
}

function openapp(icon, title, url, id){
    if(title == "Browser" ){
        $("main").show(5);
        $("#ctls").show(0);
        
        var ht = '<browser><header><tools><img class="b1" src="system/Browser/icon/back.png"/><img  class="b2" src="system/Browser/icon/next.png"/><img  class="b3" src="system/Browser/icon/book-simple-7.png"/><img  class="b4" src="system/Browser/icon/box-outgoing-7.png"/><img  class="b5" src="system/Browser/icon/add.png"/><img  class="b6" src="system/Browser/icon/squares.png"/><url><input class="add" type="url"/>    </url>    </tools><tabs></tabs></header><iframe class="view" id="view1" width="100%" height="100%" src="http://www.google.com"></iframe></browser>';
        
        $("main").append(ht);
    } else {
        $("main").show(5);
        $("#ctls").show(0);
        
        $('<iframe>', {
            name: title,
            id:   title,
            style: 'width:100%; height:100%; border:none; background:#fff;',
            src: url
        }).appendTo('main');
    }
    
    $("#dockapps").append('<a href="#" class="myButton"><img src="apps/'+title+'/icon.png" width="20" onerror="this.src=\'icons/appstore.png\'" /><span>'+title+'</span></a>');
}

function showapp(t){
    transs(10);
    $("main").children().hide();
    $("main").children().eq(t).show();
    $("main").show(5);
    $("#ctls").show(0);
}

$(document).on( "click","#dockapps a", function() {
    var tit = $(this).find("span").text();
    if(tit == "Browser") {
        $("browser").show(0);
        $("browser").find("iframe").show();
        $("main").show(5);
        $("#ctls").show(0);
    } else {
        $("browser").hide();      
        $("iframe").hide();
        showapp($(this).index());
    }			
});

function transs(v){
    $("#owl-demo").css( "-webkit-filter", "blur("+v+"px)" );
    $("#topi").css( "backdrop-filter", "blur("+v+"px)" );
    $("bg").css( "-webkit-filter", "blur("+v+"px)" );
    $("blur2").css( "-webkit-filter", "blur("+v+"px)" );
}

function homescreen(){
    transs(0);
    $("main").children().hide();
    $("main").hide();
    $("#ctls").hide();
}

function closeWin() {
    homescreen();
}

function closeApp(){
    var visivel = $("main").children(':visible');
    var c = visivel.index();
    if (c >= 0) {
        $('#dockapps a').eq(c).remove();    
        visivel.remove();
    }
    homescreen();    
}