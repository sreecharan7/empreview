const commentBox =document.getElementById('comment-box-for-div');

let data=-null;



function boxMaker(i){
    var box=`<div class="col" id="${i.roleId}">
                    <a style="text-decoration: none;" href="./employee/${i.roleId}">
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

function getCommentData(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/rolesAndRequest/dataCommetsEmployee', true);
    xhr.onload = function(){
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                data=response["data"];
                commentBox.innerHTML="";
                data.forEach(i => {
                    commentBox.innerHTML+=boxMaker(i);
                });
            }
            else{
                alertToast(`${response["msg"]}`);
            }
        }
    }
    xhr.send();
}

getCommentData();