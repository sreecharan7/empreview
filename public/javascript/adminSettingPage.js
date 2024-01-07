const privateInput=document.getElementById("PrivateInput");
const NoCommentsInput=document.getElementById("NoCommentsInput");
const NoMoreCommentsInput=document.getElementById("NoMoreCommentsInput");
const EachOtherComments=document.getElementById("EachOtherComments");

window.addEventListener('load', function() {
    alertToast("Loading...");
});


function deleteModalSetter(){
    modalHeader.innerHTML=`<h1 class="modal-title fs-5" id="exampleModalLabel">Delete the organisation</h1>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML=`<div id="model-message-shower">
    <div class="alert alert-danger" role="alert">Once you delete the organisation you cannot recover it back.All the data related to the organisation will be deleted</div>
    <h5>Are you sure you want to delete the organisation?</h5>
    </div>`;
    modalFooter.innerHTML=`<button type="button" class="btn btn-danger" id="delete-organisation-confirm-button" onClick="deleteConfirm(this)">delete</button><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    `;
    var modal = new bootstrap.Modal(modalTotal);
    modal.show();
}

function deleteConfirm(element){
    element.disabled=true;
    const modelMessgeShower=document.getElementById("model-message-shower");
    modelMessgeShower.innerHTML='';
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/api/company/deleteCompany", true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                alertToast(response.msg);
                var box=`<div class="alert alert-danger" role="alert">Organisation is deleted, redirecting to the home</div>`
                modelMessgeShower.innerHTML=box;
                setTimeout(()=>{
                    window.location.href="/v";
                },2000);
            }
            else{
                alertToast(err.msg);
            }
        }
    };

    xhr.send();
}

function getOptions(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/company/getOptions", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                privateInput.checked=response.data.privateComment;
                NoCommentsInput.checked=response.data.NoComments;
                NoMoreCommentsInput.checked=response.data.NoMoreComments;
                EachOtherComments.checked=response.data.EachOtherComments;
                privateInput.disabled=false;
                NoCommentsInput.disabled=false;
                NoMoreCommentsInput.disabled=false;
                EachOtherComments.disabled=false;
            }
            else{
                alertToast(response.msg);
            }
        }
    };
    xhr.send();
}

function updateModalSetter(){
    var data={
        EachOtherComments:EachOtherComments.checked,
        privateComment:privateInput.checked,
        NoComments:NoCommentsInput.checked,
        NoMoreComments:NoMoreCommentsInput.checked
    }
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/company/updateOptions", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                alertToast(response.msg);
            }
            else{
                alertToast(response.msg);
            }
        }
    };
    xhr.send(JSON.stringify(data));

}


getOptions();