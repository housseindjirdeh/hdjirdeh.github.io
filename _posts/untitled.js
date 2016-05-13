function functionFirst() {
	setTimeout(function() {
		console.log('Damn Daniel');
	}, 3000);
}

function functionSecond() {
	console.log('Back at it again!');
}

functionFirst();
functionSecond();


function functionFirst(callback) {
  setTimeout(function() {
    console.log('Damn Daniel');
    callback && callback();
  }, 3000);
}

function functionSecond() {
	console.log('Back at it again!');
}

functionFirst( function(){
  functionSecond();
});