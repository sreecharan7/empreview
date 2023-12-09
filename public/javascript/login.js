const fin= document.getElementById("form-login");
const submitButton=document.getElementById("submit-button");
const checkBox=document.getElementById("flexCheckDefault");
const wholePageMessageShower=document.getElementById("message-shower");

function formSubmission(event){
    event.preventDefault();
    var formData= new FormData(this);
    //checking for checkbox is checked or not
    if(!checkBox.checked){
        checkBox.classList.add('is-invalid');
        return;
    }
    else{
        checkBox.classList.remove('is-invalid');
    }
    //verifying the data
    //disabling the button
    submitButton.disabled=true;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/user/login", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    var serializedData = new URLSearchParams(formData).toString();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                console.log("sucess");
                var box=`<div class="alert alert-success" role="alert">${response["msg"]}. redirecting to home page...</div>`
                wholePageMessageShower.innerHTML=box;
                setTimeout(function(){window.location.replace('/');},2000)
            }
            else{
                var box=`<div class="alert alert-danger" role="alert">${response["msg"]}</div>`
                wholePageMessageShower.innerHTML=box;
                submitButton.disabled =false;
            }
        }
    };

    xhr.send(serializedData);

}

fin.addEventListener("submit",formSubmission);

