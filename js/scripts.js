var url = "http://localhost:8888";



function registerUser() {
     var username = document.getElementsByClassName("username");
     var password = document.getElementsByClassName("password");

     $.ajax({
         url: url + "/register",
         method: "post",
         data: {
             username: username[0].value,
             password: password[0].value
         }
     }).success(function(response){
                  document.getElementsByClassName("regMsg")[0].innerHTML =(response.message);

     }).error(function(response) {
         document.getElementsByClassName("regMsg")[0].innerHTML =(response.message);
     });
}

function loginUser() {
    var username = document.getElementsByClassName("username");
    var password = document.getElementsByClassName("password");

    $.ajax({
        url: url + "/login",
        method: "post",
        data: {
            username: username[0].value,
            password: password[0].value
        }
    }).success(function(response){
     window.location.assign("/home");
 }).error(function(response) {
    document.getElementsByClassName("logMsg")[0].innerHTML =("Incorrect username or password!");
 });
}

function getUser() {
    var username = document.getElementsByClassName("username");

    $.ajax({
        url: url + "/user",
        method: "get"
    }).success(function(response){
        document.getElementsByClassName("username")[0].innerHTML = response.username;

        if(response.username=='A')
        {
            document.getElementsByClassName("messg")[0].innerHTML = "Welcome to Goldironhacks.";

        }
        else if(response.username=='B')
        {
            document.getElementsByClassName("messg")[0].innerHTML = "Welcome to Blackironhacks.";

        }
        document.getElementsByClassName("messg2")[0].innerHTML = "Welcome to Purdue IronHack, your userID is "+response._id ;
        




    }).error(function(response) {
        alert("Cannot fetch data. Please try again");
    });
}