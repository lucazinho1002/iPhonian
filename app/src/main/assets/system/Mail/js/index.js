$(function(){
  $(".quick-message").on("swipeleft",function(){
    $(this).next().addClass('show');
  });    
 $(".quick-message").on("swiperight",function(){
    $(this).prev().addClass('show');
  }); 

  $(".contact-info").on("swipeleft",function(){
    $(this).removeClass('show');
  });   

 $(".manage-message").on("swiperight",function(){
    $(this).removeClass('show');
  }); 
  $('.from-account').eq(0).css('background-color', 'hotpink');
  $('.from-account').eq(1).css('background-color', '#3496db');
  $('.from-account').eq(2).css('background-color', '#3496db');
  $('.from-account').eq(3).css('background-color', '#ec8242');
  $('.from-account').eq(4).css('background-color', '#3496db');
  $('.from-account').eq(5).css('background-color', 'hotpink');
  $('.from-account').eq(6).css('background-color', 'hotpink');
  $('.from-account').eq(7).css('background-color', '#ec8242');
  $('.from-account').eq(8).css('background-color', 'hotpink');
  $('.from-account').eq(9).css('background-color', '#ec8242');
   
  $('.toggle').click(function() {
    $('#main-nav').slideToggle();
    $('.hamburger-1').toggleClass('cross-right');
    $('.hamburger-2').toggleClass('cross-hide');
    $('.hamburger-3').toggleClass('cross-left');   
  });
  $('#mail-boxes li').click(function() {
    $('#mail-boxes li').removeClass('active-mailbox');
    $(this).addClass('active-mailbox');
  });
  
});