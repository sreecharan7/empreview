
const commetBoxContainer = document.getElementById("commet-box-container");

let data=[];

var truncateStyles = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '230px',
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


const currentUrl = window.location.href;

const url = new URL(currentUrl);

const pathname = url.pathname;

const pathSegments = pathname.split('/').filter(segment => segment !== '');

const toWhomId = pathSegments[3];


  function commentFencth(){

    var xhr = new XMLHttpRequest();
    xhr.open("GET", `/api/comment/viewComments?toWhomId=${toWhomId}`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                data=response["data"];
                CommentsBoxAdder(response["data"]);
            }
            else{
                alertToast(`${response["msg"]}`);
            }
        }
    };
    xhr.send();
}

function CommentsBoxAdder(data){
    if(data.length==0){
        commetBoxContainer.innerHTML=`<h5 class="text-center" style="width:600px" >There is no comment to show</h5>`;
        return;
    }
    commetBoxContainer.innerHTML='';
    for(let i of data){commetBoxContainer.innerHTML+=commetBoxMaker(i)};
}

function commetBoxMaker(i){
    var box=`
    <div style="color:  gray;" >
      <div class="glass p-3 m-3 rounded" style="width: 250px;">
        <h5  onclick="toggleText(this)" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 230px; cursor: pointer;">Name:-${i.name}</h5>
    
        <div class="d-flex justify-content-center">
            <h6>rating:&nbsp; </h6>
            <div class="rounded" style="width: 1000px;height: 5px; background-color: white; margin-top: 8px;">
                <div style="width: ${i.rating*20}%;height: 5px; background-color: yellow;"></div>
            </div>
            <div style="margin-top: -2px;"> &nbsp;&nbsp;(${i.rating}/5)</div>
        </div>
    
        <h6  onclick="toggleText(this)" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 230px; cursor: pointer;">comment:- ${i.msg}</h6>
        <div class="d-flex justify-content-end">
            <button class="btn btn-outline-primary btn-sm" onclick="editComment('${i._id}')">Edit</button>
        </div>
      </div>
    </div>`;
    return box;
}


commentFencth();



function editComment(id){
    let comment=data.find((i)=>i._id==id);
    editCommentModelMaker(comment);
};

function editCommentModelMaker(i){
    modalHeader.innerHTML=`<h1 class="modal-title fs-5" id="exampleModalLabel">Edit the comment</h1>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML=`<div id="model-message-shower">
    <div id="model-msg-shower"></div>
    <form id="comment-update-form">
    <div class="mb-3 input-group">
        <label for="name" class="input-group-text">Name</label>
        <input type="text" value="${i.name}" class="form-control" id="name" aria-describedby="emailHelp" readonly>
    </div>
    <div class="mb-3 input-group">
        <label for="rating" class="input-group-text">Rating</label>
        <input type="number" value="${i.rating}" class="form-control" id="rating" min=1 max=5>
    </div>
    <div class="mb-3 input-group">
        <label for="msg" class="input-group-text">Comment</label>
        <textarea class="form-control" id="msg" rows="3">${i.msg}</textarea>
    </div>
    <form>
    <div class="d-flex ">
        <button type="button" class="btn btn-outline-danger" onClick="deleteComment(this,'${i._id}')">Delete comment</button>
    </div>
    </div>`;
    modalFooter.innerHTML=`<button type="button" class="btn btn-outline-success" onClick="updateComment(this,'${i._id}')">Update comment</button><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    `;
    var modal = new bootstrap.Modal(modalTotal);
    modal.show();
}

function deleteComment(element,id){
    element.disabled=true;
    const data={_id:id,toWhomId:toWhomId};
    const modelMsgShower=document.getElementById("model-msg-shower");
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", `/api/comment/deleteComment`, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var serializedData = new URLSearchParams(data).toString();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                modelMsgShower.innerHTML=`<div class="alert alert-success" role="alert"> ${response["msg"]} </div>`;
                alertToast(`${response["msg"]}`);
                commentFencth();
            }
            else{
                modelMsgShower.innerHTML=`<div class="alert alert-danger" role="alert"> ${response["msg"]} </div>`;
                alertToast(`${response["msg"]}`);
            }
        }
    };
    xhr.send(serializedData);
}

function updateComment(element,id){
    element.disabled=true;
    const form=document.getElementById("comment-update-form");
    const modelMsgShower=document.getElementById("model-msg-shower");
    const data={
        rating:form["rating"].value,
        msg:form["msg"].value,
        toWhomId:toWhomId,
        _id:id
    }
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `/api/comment/updateComment`, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var serializedData = new URLSearchParams(data).toString();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                modelMsgShower.innerHTML=`<div class="alert alert-success" role="alert"> ${response["msg"]} </div>`;
                alertToast(`${response["msg"]}`);
                commentFencth();
            }
            else{
                modelMsgShower.innerHTML=`<div class="alert alert-danger" role="alert"> ${response["msg"]} </div>`;
                alertToast(`${response["msg"]}`);
            }
        }
    };
    xhr.send(serializedData);
}
