


function createOrganisationModelSetter(){
    modalHeader.innerHTML=`<h1 class="modal-title fs-5" id="exampleModalLabel">Create the organisation</h1>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML=`<div id="model-message-shower"></div><div class="row g-3"><div class="col-auto" id="form-data"><label for="organisationName">Organisation name :-</label></div>
        <div class="col-auto">
          <input type="text" class="form-control" id="organisationName" placeholder="Organisation name">
        </div>
        <div class="col-auto input-group">
                <label for="organisationName">About organiation :- </label>
                <textarea class="form-control" aria-label="With textarea" placeholder="About organisation" name="about" id="aboutOrganisation" required></textarea>
                <div class="invalid-tooltip">
                    please provide about section
                </div>
            </div>
    </div>`;
    modalFooter.innerHTML=`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    <button type="button" class="btn btn-primary" id="create-organisation-submit" onClick="createSubmit(this)">Submit</button>`;
    var modal = new bootstrap.Modal(modalTotal);
    modal.show();
}
function createrequestModelSetter(){
    modalHeader.innerHTML=`<h1 class="modal-title fs-5" id="exampleModalLabel">Create the request to join in the organisation</h1>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML=`<div id="model-message-shower"></div><div class="row g-3"><div class="col-auto"><label for="organisationId">Organisation Id :-</label></div>
        <div class="col-auto">
          <input type="number" class="form-control" id="organisationId" placeholder="Organisation Id">
        </div>
        <div class="col-auto input-group">
        <label for="organisationName">note :- </label>
        <textarea class="form-control" aria-label="With textarea" placeholder="note to the organisation about request (optional)" name="about" id="note" required></textarea>
        <div class="invalid-tooltip">
            please provide about section
        </div>
    </div>
    </div>`;
    modalFooter.innerHTML=`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    <button type="button" class="btn btn-primary" id="create-request-submit" onClick="createSubmit(this)">Submit</button>`;
    var modal = new bootstrap.Modal(modalTotal);
    modal.show();
}

function createSubmit(element){
    const modelMessgeShower=document.getElementById("model-message-shower");
    modelMessgeShower.innerHTML='';
    let inputBox,formData,textArea;
    if(element.id=="create-organisation-submit"){
        inputBox=modalBody.querySelector("#organisationName");
        textArea=modalBody.querySelector("#aboutOrganisation");
        if(inputBox.value==''||inputBox.value.trim()==''||textArea.value==''||textArea.value.trim()==''){
            var box=`<div class="alert alert-danger" role="alert">Input cannot be empty, maybe organisation name or the about is empty</div>`
            modelMessgeShower.innerHTML=box;
            return;
        }
        formData={companyName:inputBox.value,about:textArea.value,role:"admin"};
    }
    else{
        inputBox=document.getElementById("organisationId");
        textArea=modalBody.querySelector("#note");
        if(inputBox.value<=0){
            var box=`<div class="alert alert-danger" role="alert">Input value should be greater than 0</div>`
            modelMessgeShower.innerHTML=box;
            return;  
        }
        formData={companyId:inputBox.value,role:"employee",note:textArea.value};
    }
    //disabling the button
    element.disabled=true;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/rolesAndRequest/createRolesAndRequest", true);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    var serializedData = new URLSearchParams(formData).toString();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==201){
                var box=`<div class="alert alert-success" role="alert">${response["msg"]}.</div>`
                modelMessgeShower.innerHTML=box;
                inputBox.disabled=true;
                inputBox.readonly=true;
                textArea.disabled=true;
                textArea.readonly=true;
            }
            else{
                var box=`<div class="alert alert-danger" role="alert">${response["msg"]}</div>`
                modelMessgeShower.innerHTML=box;
                element.disabled =false;
            }
        }
    };

    xhr.send(serializedData);
}


function formatDate(inputDate) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
  
    const dateObj = new Date(inputDate);
    const monthIndex = dateObj.getUTCMonth();
    const year = dateObj.getUTCFullYear();
  
    return `${months[monthIndex]}-${year}`;
}

function getThedata(element){
        const requestBox=document.getElementById("request-organisations-shower");
        const adminBox=document.getElementById("admin-organisations-shower");
        const employeeBox=document.getElementById("employee-organisations-shower");
        const bothBox=document.getElementById("both-organisations-shower");
    var xhr = new XMLHttpRequest();
    if(element){
        xhr.open("GET", "/api/rolesAndRequest/dataRequests", true);
    }
    else{
        xhr.open("GET", "/api/rolesAndRequest/dataRoles", true);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                // console.log(response);
                // let emptyText=''
                if(element){
                    requestBox.innerHTML='';
                }
                else{
                    adminBox.innerHTML='';
                    employeeBox.innerHTML='';
                    bothBox.innerHTML='';
                }
                for (let i of response.roles){
                    let box=`<div class="card me-1 mt-1 glass" aria-hidden="true" style="width:300px;">
                        <div class="card-body">
                          <h5 class="card-title ">
                            <span class="col-6">${i.companyName}</span>
                          </h5>
                          <p class="text-end">
                            ${formatDate(i.time)}
                          </p>
                          <a class="btn btn-primary  col-6" href="/v/a/${i._id}">go to edit</a>
                        </div>
                      </div>`
                    if(i.role=="admin"){
                        adminBox.innerHTML+=box;
                    }
                    else if (i.role=="employee"){
                        if(element){
                            requestBox.innerHTML+=box;
                        }
                        else{
                            employeeBox.innerHTML+=box;
                        }
                    }
                    else if(i.role=="both"){
                        bothBox.innerHTML+=box;
                    }
                }
                if(adminBox.innerHTML=='')adminBox.innerHTML=`<div class="ms-4 h2">There is no organisation you created</div>`;
                if(employeeBox.innerHTML=='')employeeBox.innerHTML='<div class="ms-4 h2">There is no organisation you are employee</div>';
                if(bothBox.innerHTML=='')bothBox.innerHTML='<div class="ms-4 h2">There is no organisation you are admin and employee</div>';
                if(requestBox.innerHTML=='')requestBox.innerHTML='<div class="ms-4 h2">There is no requests to organisation</div>';
            }
            else{

            }
        }
    };

    xhr.send();
}

getThedata();