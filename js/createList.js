function createList(){
let name = $('.list-name').val();
let description = $('.list-description').val();
console.log(name, description)
console.log(session_id)
if(session_id){
    $.ajax({
        url: `https://api.themoviedb.org/3/list?api_key=7fb495ea2c47e3fd13a6761abeecf50d&session_id=${session_id}`,
        method: "post",
        data:{
            "name": name,
            "description": description,
            "language": "en"
        },
        success: function() {
    window.location.href = '/profile.html?tab=lists'
        }
    }) 
}else{
    alert('You should login!')
}

}