var addNew = function() {
  var add = document.getElementById('add_list');
  var includeNew = document.querySelector('.include-new-todo');
  var confirmNew = document.getElementById('confirm_new_todo');
  
  add.onclick = function() {
    TweenMax.to(includeNew, .25, {
      top: '0'
    });
    document.querySelector('.input-todo').focus();
  };
  
  confirmNew.onclick = function() {
    if (document.querySelector('.input-todo').value.length > 0) {
      var value = document.querySelector('.input-todo').value;
      console.log(value);
      TweenMax.to(includeNew, .25, {
        top: ''
      });
      $('.content ul').prepend('<li class="list-todo-item" style="height: 0; padding: 0 30px;">' + value + '</li>');
      document.querySelector('.input-todo').value = '';
      TweenMax.to('li', .5, {height: 'inherit', padding: '25px 100px 25px 30px'});
    } else {
      alert('It cant be empty. :(');
      document.querySelector('.input-todo').focus();
    }
  };
};

var remove = function() {
  //var content = document.querySelector('#content');
  //var list = document.getElementsByClassName('list-todo-item');
  
  $(document).on('click', '.list-todo-item', function(){
    TweenMax.to($(this), .4, {height: '0', padding: '0 30px'});
    
    var $that = $(this);
    
    setTimeout(function() {
      TweenMax.to($that, 0, {display: 'none'});
    },400);
  });

};

window.onload = function() {
  addNew();
  remove();
};