const employeeBoxFromCompany=document.getElementById("employee-box-from-company");
const searchForm=document.getElementById("search-form");

let employee=null;

var truncateStyles = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '200px',
    cursor: 'pointer'
  };

  var expandedStyles = {
    whiteSpace: 'normal',
    overflow: 'visible',
    textOverflow: 'initial'
  };

  function applyStyles(element, styles) {
    for (var property in styles) {
      element.style[property] = styles[property];
    }
  }

  function toggleText(element) {
    var isExpanded = element.classList.toggle("expanded");
    var styles = isExpanded ? expandedStyles : truncateStyles;
    applyStyles(element, styles);
  }

  function requestBoxMaker(i){
    var box=`<div class="col" id="${i._id}">
                    <a style="text-decoration: none;" href="./employee/${i._id}">
                    <div class="card mb-3 custom-card glass" style="max-width: 540px;">
                        <div class="row g-0">
                        <div class="col-4 ">
                            <img src="${i.photo}" class="img-fluid rounded-start" alt="image of the employee" style="height: 150px;width: 100%; object-fit:cover">
                        </div>
                        <div class="col-8">
                            <div class="card-body">
                            <h5 class="card-title" id="highlight-text">Name:- ${i.name}</h5>
                            <br>
                            <p class="card-text"  onclick="toggleText(this)" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 230px; cursor: pointer;"><small class="text-body-secondary" >About:- ${i.about}</small></p>
                            </div>
                        </div>
                        </div>
                    </div>
                    </a>
                </div>`;
                return box;
  }

  function dataRequestsSentToCompany(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/rolesAndRequest/dataEmployees", true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                employee=response.data;
                employeeBoxFromCompany.innerHTML='';
                if(!response.data||response.data.length==0){
                    employeeBoxFromCompany.innerHTML=`<h3 class="text-center" style="width:600px" >There is no employee in the organisation</h3>`;
                    return;
                }
                for(let i of response.data){
                    if(!i.note){
                        i.note="No note kept";
                    }
                employeeBoxFromCompany.innerHTML=employeeBoxFromCompany.innerHTML+requestBoxMaker(i);
                }
            }
            else{
                alertToast(err.msg);
            }
        }
    };

    xhr.send();
}

function searchFormSubmission(event){
    event.preventDefault();
    var formData= new FormData(this);
    employeeBoxFromCompany.innerHTML='';
    alertToast("Searching...");
    var arr=searchGivenInput(formData.get("search"));
    if(arr.length==0){
        employeeBoxFromCompany.innerHTML=`<h3 class="text-center" style="width:600px" >There is no request to the keyword</h3>`;
        return;
    }
    for(let i of arr){
        employeeBoxFromCompany.innerHTML=employeeBoxFromCompany.innerHTML+requestBoxMaker(i);
    }
    alertToast("Searched for the keyword");
}
function searchGivenInput(data){
    data=data.trim();
    data=new RegExp(data.split('').map(char => `[${char.toUpperCase()}${char.toLowerCase()}]`).join(''), 'i');
    let newArray=employee.filter(function(element){
        if(data.test(element.name)||data.test(element.about)){
            return true;
        }
        else{
            return false;
        }
    })
    return newArray;
}

dataRequestsSentToCompany();


searchForm.addEventListener("submit",searchFormSubmission);