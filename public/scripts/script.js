window.onload=function(){
    const bookmarks = document.getElementsByClassName('bookmarks');
    const likeBtn =document.getElementById('likeBtn')
    const dislikeBtn =document.getElementById('disLikeBtn')
    const comment = document.getElementById('comment')
    const commentHolder=document.getElementById('comment-holder');



    [...bookmarks].forEach(bookmark=>{
        bookmark.style.cursor = 'pointer'
        bookmark.addEventListener('click',function(e){
            let target = e.target.parentElement
            let headers = new Headers()
            headers.append('Accept','Application/JSOB')
            let req = new Request(`/api/bookmarks/${target.dataset.post}`,{
                method: 'GET',
                headers,
                mode: 'cors'
            })
            fetch(req)
            .then(res=>res.json())
            .then(data=>{
                if(data.bookmark){
                    target.innerHTML= '<i class="fas fa-bookmark"></i>'
                }else{
                    target.innerHTML= '<i class="far fa-bookmark"></i>'
                }
            })
            .catch(e=>{
                console.log(e.response.data)
                alert(e.response.data)
            })
        })
    });

    likeBtn.addEventListener('click',function(e){
        let postId =likeBtn.dataset.post
        reqLikeDisLike('likes',postId)
        .then(res=>res.json())
        .then(data=>{
            let likeText = data.liked ? 'Liked' : 'Like'
            likeText=likeText + ` (${data.totalLikes})`
            let dislikeText = `Dislike (${data.totalDisLikes})`
            likeBtn.innerHTML=likeText
            dislikeBtn.innerHTML=dislikeText
        })
        .catch(e=>{
            console.log(e)
            alert(e.response.data.error)
        })
    })

    dislikeBtn.addEventListener('click',function(e){
        let postId =dislikeBtn.dataset.post
        reqLikeDisLike('dislikes',postId)
        .then(res=>res.json())
        .then(data=>{
            let dislikeText = data.disliked ? 'disliked' : 'dislike'
            dislikeText=dislikeText + ` (${data.totalDisLikes})`
            let likeText = `like (${data.totalLikes})`
            likeBtn.innerHTML=likeText
            dislikeBtn.innerHTML=dislikeText
        })
        .catch(e=>{
            console.log(e)
            alert(e.response.data.error)
        })
    })

    function reqLikeDisLike(type,postId){
        let headers = new Headers()
        headers.append('Accept','Application/JSON')
        headers.append('Content-Type','Application/JSON')

        let req = new Request(`/api/${type}/${postId}`,{
           method: 'GET',
           headers,
           mode:'cors'
        })

        return fetch(req)
    };

    
    comment.addEventListener('keypress',function(e){
        if(e.key == 'Enter'){
           
let postId =comment.dataset.post

let data ={
    body: e.target.value
}

let req = commentRequest(`/api/comments/${postId}`,'POST',data)
fetch(req)
.then(res=>res.json())
.then(data=>

    {
    
    let commentElement=createComment(data)
    commentHolder.insertBefore(commentElement,commentHolder.children[0])
        e.target.value= ''
        
}
)
.catch(e=>{
    console.log(e)

})


        }
    })

commentHolder.addEventListener('keypress',function(e){
if(commentHolder.hasChildNodes(e.target)){
    if(e.key=='Enter'){
        let commentId = e.target.dataset.comment
        let value = e.target.value

        if(value){
            let data= {
                body: value
            }

            let req = commentRequest(`/api/comments/replices/${commentId}`,'POST',data)
            fetch(req)
            .then(res=>res.json())
            .then(data=>{
       let replyElement = createReplyElement(data)
        let parent = e.target.parentElement
        parent.previousElementSibling.appendChild(replyElement)
        e.target.value =''
            })
            .catch(e=>{
                console.log(e)
                alert(e.message)
            })
        }else{
            alert('Please Enter A valid Reply')
        }
    }
}
    })

}
function  commentRequest(url,method,body){
    let headers = new Headers()
    headers.append('Accept','Application/JSON')
    headers.append('Content-Type','Application/JSON')

    let req = new Request(url,{
        method,
        headers,
        body: JSON.stringify(body),
        mode: 'cors'
    })

    return req
}







function createComment(comment){
    let innerHTML=`
    <img  src="${comment.user.profilePic}"
    class="rounded-cricle mx-3 my-3"
    style="width: 40px;">

   <div class="media-body my-3">
    <p class="text-muted">
    Comment By <a href="/author/${comment.user._id }">${comment.user.username}</a>
    ${comment.createdAt}

    </p> 
    <p>  ${comment.body}</p>
    <div class="my-3">
    <input type="text"
     class="form-control rounded-pill"
     name="Reply"
      placeholder="Press Enter to reply"
      data-comment="${comment._id}"/>
</div>
`
 let div = document.createElement('div')
 div.className='media border'
 div.innerHTML =innerHTML
 return div
}



function createReplyElement(reply){
    let innerHTML=`                                             
    <img src="${ reply.profilePic }"
    class="align-self-start rounded-cricle mx-3 my-3 "
    style="width: 40px;">
    <div class="media-body mt-3">
     <p class="text-muted">
        Reply By <a href="/author/<%=reply.user._id %>">${reply.username}</a>,

     </p> 
           <p>${reply.body}</p>
    </div>
`
 let div = document.createElement('div')
 div.className='media border'
 div.innerHTML =innerHTML
 return div






}