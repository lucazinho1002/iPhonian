var moi ;
var today;
var ssd;

// Date
var weekday=new Array(7);
weekday[0]="Sunday";
weekday[1]="Monday";
weekday[2]="Tuesday";
weekday[3]="Wednesday";
weekday[4]="Thursday";
weekday[5]="Friday";
weekday[6]="Saturday";

$(document).ready(function() {


$('notes').blur(function() {
 var val = $(this).text();
 var bb = $(this).attr("data");
 localStorage.setItem(bb, val);
});

$('notes').focus(function() {
var n = $("#listday li").size();
if(n == 0) $('#new').click();
});

$('bar').focus(function() {
var n = $("#listday li").size();
if(n == 0) $('#new').click();
});


$('bar').blur(function() {
 var val = $(this).text();
$("#listday li.selected").find("sp").text(val);
localStorage.setItem("Listnotes", $("#listday").html());
});


	var llNotes = localStorage.getItem('Listnotes');
	$('#listday').html(llNotes);
	var d = new Date();
	moi = d.getMonth();
	$("#m"+moi).css("background","#576679");
	$("#m"+moi).addClass("mon");
	today = d.getDate();
	//getdays(moi + 1);
	dayname = weekday[d.getDay()];
	var ai = dayname + " " + today +" , " +  d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() ;
	$("day").text( ai);
 mySwiper = $('.s2').swiper({
		//Your options here:
		mode:'horizontal',
		keyboardControl:true,
		slidesPerSlide : 1,
		loop: false
	});
	
   ssd = $('.s1').swiper({
		//Your options here:
		mode:'vertical',
		keyboardControl:true,
		grabCursor:true,
		slidesPerSlide : 7,
		scrollbar: {
        container : '.swiper-scrollbar',
        draggable : true,
        hide: true,
        snapOnRelease: true
    }
		
	});	
	
	$('#listday li.selected').dblclick();
	

	
});	


function getDaysArray(year, month) {
    var numDaysInMonth, daysInWeek, daysIndex, index, i, l, daysArray;

    numDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    daysIndex = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
    index = daysIndex[(new Date(year, month - 1, 1)).toString().split(' ')[0]];
    daysArray = [];

    for (i = 0, l = numDaysInMonth[month - 1]; i < l; i++) {
        daysArray.push("<num>" + (i + 1) + '</num>. <da>' + daysInWeek[index++] + '</da>');
        if (index == 7) index = 0;
    }

    return daysArray;
}


function getdays(s){

// <li ><num>17.</num> Monday</li>
    var arr = getDaysArray(2013, s)
//alert(arr[0])
$("#listday").html("");
	
	for (var i = 0; i < arr.length; i++) {
		var ss = String(arr[i]);
		var ddy = ss.substring(ss.indexOf(">") + 1, ss.indexOf("</num>"));
		var idp = "d"+ddy+"5";
		if(i == today - 1) $("#listday").append('<li id="'+idp+'" class="today swiper-slide" >'+arr[i]+'</li>');
		else $("#listday").append("<li id='"+idp+"' class='swiper-slide' >"+arr[i]+"</li>");
		}

		

}


Date.prototype.daysInMonth=function(mth,yr){ 
yr = yr || this.getFullYear();
mth = mth || this.getMonth();
return 32 - new Date(yr, mth, 32).getDate();
}	

/*
$(".slide").live("click", function(){
$(".slide").removeClass("mon");
$(this).addClass("mon");
id = String($(this).attr("id"));
dd = id.substring(1);
getdays(parseInt(dd) + 1);
ssd.swipeTo(0);
});
*/

$("#listday li").live("click", function(){
$("#listday li").removeClass("selected");
$(this).addClass("selected");
});

$("#listday li").live("dblclick", function(){
var da = $(this).find("sp").text();
$("bar").text(da);
var da = $(this).attr("id");
var val = localStorage.getItem(da);
$("notes").text(val);
localStorage.setItem("Listnotes", $("#listday").html());
});

$("#Bdown").live("click", function(){
ssd.swipeNext();
});

$("#Bup").live("click", function(){
ssd.swipePrev();
})

$("#trach").live("click", function(){

var id = $("#listday li.selected").attr("id");
localStorage.removeItem(id);
$("#"+id).slideDown('slow', function() {
    // Animation complete.
	$("#"+id).remove();
  });

$("notes").text("");
localStorage.setItem("Listnotes", $("#listday").html());
})

$("#new").live("click", function(){
$("notes").text("");
var d = new Date();
dayname = weekday[d.getDay()];
var ai = dayname + " " + today +" , " +  d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() ;
$("day").text( ai);
var  rr = Math.floor((Math.random()*1000)+2);
$("#listday li").removeClass("selected");
var si = '<li id="aa'+rr+'" class="swiper-slide selected" ><sp>Title</sp> <num>'+today+'/'+d.getMonth()+'/'+d.getFullYear()+'</num></li>';
$("#listday").prepend(si);
if(localStorage.Listnotes) var val = localStorage.getItem('Listnotes');
else var val = "";
localStorage.setItem("Listnotes", si + val);
$("notes").attr("data","aa"+rr);
 ssd = $('.s1').swiper({
		//Your options here:
		mode:'vertical',
		keyboardControl:true,
		grabCursor:true,
		slidesPerSlide : 7,
		scrollbar: {
        container : '.swiper-scrollbar',
        draggable : true,
        hide: true,
        snapOnRelease: true
    }
		
	});

});