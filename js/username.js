if (typeof(Storage) !== "undefined") {
	if(localStorage.getItem('username')) {
		//This checks to see if there is a username already, if so it will not require the pop-up. 
	} else {
		//If there is not a username then it will pop-up and ask for one. 
    setTimeout(function () {
swal({   title: "Create an account!",   text: "Username:",   type: "input",   showCancelButton: true,   closeOnConfirm: false,   animation: "slide-from-top",   inputPlaceholder: "Your username" }
	, function(inputValue)
	{   if (inputValue === false) return false;      if (inputValue === "") {
	     swal.showInputError("<div class='sweetAlertText'>You need to enter a username!</div>.");     return false   }
	           swal("Nice!", "Your username is " + inputValue, "success"); 
	           localStorage.setItem('username', inputValue);
})
}, 1000);	
    // Retrieve for testing.
    setTimeout(function() {
console.log(localStorage.getItem('username'));
	}, 2000);
}
} else {
}