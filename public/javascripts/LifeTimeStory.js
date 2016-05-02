'use strict'

// Ready
$(document).ready(function() {
    styleAlbumSection();
    stylePhotoSection();

    if (document.getElementById("album")) {
        loadAlbum();
    }

    if (document.getElementById("photoSection")) {
        loadGallery();
    }
});



// HomePage JS

// HomePage Animations
function joinUsPopUpShow() {
    $("#logInSec").fadeIn(1300);
    $("#logInSec").css({"visibility": "visible", "display": "block"});
    $("#home").fadeIn(2000, function() {
        $("#home").css({"background-image":'url(../public/images/seasons1.jpg)'});
    });

    $(".slogan").fadeOut(1300,function() {
        $(".slogan").css({"visibility":"hidden","display":"none"});
    });
}

function joinUsPopUpHide() {
    $("#logInSec" ).fadeOut(1300, function() {
        $("#logInSec").css({"visibility":"hidden","display":"none"});
    });
    $(".slogan").fadeIn(1300, function() {
        $(".slogan").css({"visibility":"visible", "display":"block"})
        $("#home").css({"background-image":'url(../public/images/seasons.jpg)'});

    });
}

function signUpPopUpShow() {
    $("#logInSec").fadeOut(500, function() {
        $("#logInSec").css({"visibility":"hidden","display":"none"});
    });
    $("#signUpSec").fadeIn(1300, function() {
        $("#signUpSec").css({"visibility": "visible", "display": "block"});
    });
    $(".slogan").fadeOut(1300, function () {
        $(".slogan").css({"visibility": "hidden", "display": "none"});
    });
}

function signUpPopUpHide() {
    $("#signUpSec" ).fadeOut(1300, function() {
        $("#signUpSec").css({"visibility":"hidden","display":"block"});
    });
    $(".slogan").fadeIn(1300, function() {
        $(".slogan").css({"visibility":"visible", "display":"block"})
        $("#home").css({"background-image":'url(../public/images/seasons.jpg)'});
    });
}


// HomePage Functions
function checkPassword(str) {
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,12}$/;
    return re.test(str);
}


function checkForm(form) {
    if(form.email.value == "") {
        alert("Error: Email cannot be blank!");
        form.email.focus();
        return false;
    }

    var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
    if(!re.test(form.email.value)) {
        alert("Please enter the correct email address!");
        form.email.focus();
        return false;
    }

    var nm= /[A-Za-z]{2,}/;
    if(!nm.test(form.firstName.value)) {
        alert("First Name can contain only letters!");
        form.firstName.focus();
        return false;
    }
    if(!nm.test(form.lastName.value)) {
        alert("Last Name can contain only letters!");
        form.lastName.focus();
        return false;
    }

    var gender = form.querySelectorAll('input[name="gender"]:checked');
    if (!gender.length) {
        alert('You must select male or female');
        return false;
    }
    if(form.pswd1.value != "" && form.pswd1.value == form.pswd2.value) {
        if(!checkPassword(form.pswd1.value)) {
            alert("The password you have entered is not valid! It must contain 6-12 characters including at least 1 uppercase letter, 1 lowercase letter and 1 number");
            form.pswd1.focus();
            return false;
        }
    } else {
        alert("Error: Please check that you've entered and confirmed your password!");
        form.pswd1.focus();
        return false;
    }
    return true;
}

function checkLoginform(form) {
    if(form.email.value == "") {
        alert("Error: Email cannot be blank!");
        form.email.focus();
        return false;
    }

    var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
    if(!re.test(form.email.value)) {
        alert("Please enter the correct email address!");
        form.email.focus();
        return false;
    }
    if(!checkPassword(form.pswd.value)) {
        alert("The password you have entered is not valid!");
        form.pswd.focus();
        return false;
    }
    return true;

}



// Album Page

// Album Animations and Style
function createFolderPopUpShow() {
    $("#createFolder").fadeIn(1300);
    $("#createFolder").css({"visibility":"visible","display":"block"});
}

function createFolderPopUpHide() {
    $("#createFolder" ).fadeOut(1300, function(){
        $("#createFolder").css({"visibility":"hidden","display":"none"});
    });
}

function styleAlbumSection() {
    var screenwidth = screen.width - 300;
    $("#albumSection").css({"width": screenwidth});
}

//Album page form validation

function checkFolder(form){

    var fn= /[A-Za-z]{20}/;
    if(!fn.test(form.folderName.value)) {
        alert("Folder name can contain only letters!");
        form.folderName.focus();
        return false;
    }
    var dt = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

    if(form.dateCreated.value != '' && !form.dateCreated.value.match(dt)) {
        alert("Invalid date format: " + form.dateCreated.value);
        form.dateCreated.focus();
        return false;
    }
    return true;

}

// Album Functions

function logOut() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    window.location = "http://localhost:8080/";
}

function createAlbum() {
    var albumName = document.getElementById("createFolderForm").elements.namedItem("folderName").value;
    var albumDate = document.getElementById("createFolderForm").elements.namedItem("dateCreated").value;

    $.ajax({
        type: "POST",
        url: "/albums",
        data: JSON.stringify({
            "folderName": albumName,
            "dateCreated": albumDate
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
            createFolderPopUpHide();
        },
        failure: function(errMsg) {
            alert(errMsg);
        }
    });

    var div = document.createElement("div");
    div.className = "albumDiv";
    document.getElementById("albumSection").appendChild(div);

    var a = document.createElement("a");
    a.className = "albumName";
    div.appendChild(a);
    var node1 = document.createTextNode(albumName);
    a.appendChild(node1);

    a.href = "http://localhost:8080/renderGallery";
    a.addEventListener("click", function() {
        sessionStorage.clear();
        sessionStorage.setItem('albumName', albumName);
    });

    var p2 = document.createElement("p");
    p2.className = "albumDate";
    div.appendChild(p2);
    var node2 = document.createTextNode(albumDate);
    p2.appendChild(node2);

    createFolderPopUpHide();

    document.getElementById("createFolderForm").reset();
}

function loadAlbum() {
    var albumName;
    var albumDate;

    $.ajax({
        type: "GET",
        url: '/albums',
        data: {
            format: 'json'
        },
        success: function (data) {
            for (var i = 0; i < data.length; i ++) {
                albumName = data[i].folderName;
                albumDate = data[i].dateCreated;

                var div = document.createElement("div");
                div.className = "albumDiv";
                document.getElementById("albumSection").appendChild(div);

                var a = document.createElement("a");
                a.className = "albumName";
                div.appendChild(a);
                var node1 = document.createTextNode(albumName);
                a.appendChild(node1);

                a.href = "http://localhost:8080/renderGallery";
                a.addEventListener("click", function(albumName) {
                    return function() {
                        sessionStorage.setItem('albumName', albumName);
                    };
                }(albumName));

                var p2 = document.createElement("p");
                p2.className = "albumDate";
                div.appendChild(p2);
                var node2 = document.createTextNode(albumDate);
                p2.appendChild(node2);
            }
        },
        failure: function(errMsg) {
            alert(errMsg);
        }
    });
}



// Gallery Page

// Gallery Animations and Styles
function createPhotoPopUpShow(){
    $("#addPhoto").fadeIn(1300);
    $("#addPhoto").css({"visibility":"visible","display":"block"});
}

function createPhotoPopUpHide(){
    $("#addPhoto" ).fadeOut(1300, function(){
        $("#addPhoto").css({"visibility":"hidden","display":"none"});
    });
}

function imgDisappear(){
    $("#container" ).fadeOut(1300, function(){
        $("#container").css({"visibility":"hidden","display":"none"});
    });
    $("#addPhotoBtn").css({"visibility":"visible"});
    $("#photoSection").css({"visibility":"visible"});

    var e = document.getElementById("imgText");
    e.parentNode.removeChild(e);
}

function stylePhotoSection(){
    var screenwidth = screen.width - 300;
    $("#photoSection").css({"width": screenwidth});
}

function settingsContentShow(){
    $(".settings-content").css({"display":"block"});
}

function settingsContentHide(){
    $(".settings-content").css({"display":"none"});
}


//Gallery Functions
function changeGalleryBackground() {
    var e = document.getElementById("menu");
    var selectOption = e.selectedIndex;

    if (selectOption == 1) {
        $("#gallery").css({"background-image":"url('../public/images/love.png')"});
    } else if (selectOption == 2) {
        $("#gallery").css({"background-image":"url('../public/images/sky.png')"});
    } else if (selectOption == 3) {
        $("#gallery").css({"background-image":"url('../public/images/blue.jpg')"});
    } else if (selectOption == 4) {
        $("#gallery").css({"background-image":"url('../public/images/star.png')"});
    }
}

function backToAlbum() {
    window.location = 'http://localhost:8080/album';
    var currCookie = document.cookie;
    var album = sessionStorage.getItem('albumName');
    document.cookie = currCookie.replace(album,'');
}

function loadGallery() {
    var name = sessionStorage.getItem('albumName');

    var usr = document.cookie;
    document.cookie = usr + name;

    var res = $.ajax({
        type: "GET",
        url: '/gallery',
        dataType: "json"
    });

    res.done(function(data) {
        for(var i = 0; i < data.length; i ++) {
            var content = data[i]

            var imgUrl = content["img"];
            var txt = content["text"];

            var image = document.createElement("img");
            image.className = "photoImg";
            var ps = document.getElementById("photoSection");
            if(ps){
                ps.appendChild(image);
            } else {
                console.log(null);
            }

            image.src = imgUrl;

            image.addEventListener("click", function() {
                var view = document.getElementById("viewImage");
                view.src = imgUrl;

                var node3 = document.createTextNode(txt);
                var p3 = document.createElement("p");
                p3.id = "imgText";
                document.getElementById("back").appendChild(p3);
                p3.appendChild(node3);

                $("#container").fadeIn(1300);
                $("#container").css({"visibility":"visible", "display":"block"});
                $("#addPhotoBtn").css({"visibility":"hidden"});
                $("#photoSection").css({"visibility":"hidden"});
            });
        }
    });
}

function addPhoto() {
    var img = document.createElement("img");
    img.className = "photoImg";
    document.getElementById("photoSection").appendChild(img);

    createPhotoPopUpHide();

    var file = document.querySelector('input[type=file]').files[0];
    var txt = document.getElementById("photoText").value;
    var name = sessionStorage.getItem('albumName');

    var reader = new FileReader();

    reader.onloadend = function() {
        img.src = reader.result;

        var data = JSON.stringify({
            albumName: name,
            img_B64: reader.result,
            text: txt
        });

        $.ajax({
            type: "POST",
            url: '/gallery',
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) {
                alert("On the way to server");
            },
            failure: function(errMsg) {
                alert(errMsg);
            }
        });
    };
    reader.readAsDataURL(file);

    img.addEventListener("click", function() {
        var view = document.getElementById("viewImage");
        view.src = img.src;

        var text = document.getElementById("photoText").value;
        var node3 = document.createTextNode(text);
        var p3 = document.createElement("p");
        p3.id = "imgText";
        document.getElementById("back").appendChild(p3);
        p3.appendChild(node3);

        $("#container").fadeIn(1300);
        $("#container").css({"visibility":"visible", "display":"block"});
        $("#addPhotoBtn").css({"visibility":"hidden"});
        $("#photoSection").css({"visibility":"hidden"});
    });
}