
let user_id = localStorage.getItem('user_id')
if(session_id){
    $.get(`https://api.themoviedb.org/3/account?api_key=7fb495ea2c47e3fd13a6761abeecf50d&session_id=${session_id}`,(res) => {
        $('.user-div h1').html(res.username)
        $('.user-div h3').html(res.username[0].toUpperCase())
        localStorage.setItem('user_id', res.id)
    })
}

let urlAddress = window.location.href
let urlParams = new URL(urlAddress)
let currentTab = urlParams.searchParams.get('tab')

const tabs = $('.tab-header')
const tabsContent = $('.tab-content')
for (let index = 0; index < tabs.length; index++) {
    const element = tabs[index];
    element.addEventListener('click', ()=>{
        for(let i = 0; i < tabs.length; i++){
            tabs[i].className = 'tab-header'
            tabsContent[i].className = 'tab-content'
        }
        element.className = 'tab-header active-header'
        tabsContent[index].className = 'tab-content active-content'
    })
    if(currentTab && currentTab === 'Lists'){
        tabs[1].className = 'tab-header active-header'
        tabsContent[1].className = 'tab-content active-content'
    }else{
        tabs[0].className = 'tab-header active-header'
        tabsContent[0].className = 'tab-content active-content'
    }
}
if(session_id && user_id){
    $.get(`
    https://api.themoviedb.org/3/account/${user_id}/favorite/movies?api_key=7fb495ea2c47e3fd13a6761abeecf50d&session_id=${session_id}`,(res)=>{
        renderMovies(res.results)
    })
    $.get(`
    https://api.themoviedb.org/3/account/${user_id}/lists?api_key=7fb495ea2c47e3fd13a6761abeecf50d&session_id=${session_id}`,(res)=>{
        console.log(res);
        if(res.results.length === 0){
            let content = `<span>"You havent created any lists."</span>
            <button class='create-btn onclick='openCreateListPage()'>Create list</button>
            `
            $('.lists-content').html(content)
        } else{
            let content = ''
            res.results.forEach(elem => {
            content += `
            <div class='list-item'>
            <h1>${elem.name}</h1>
            <p>${elem.item_count} item</p>
            <p>${elem.description}</p>
            <img onclick="deleteList(${elem.id})" class='lists-delete' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBi32HcSiBA8RBgI6awpRvGRQ--Tqtrj9N4A&usqp=CAU" alt="delete">
            </div>`   
            })
            $('.lists-content').html(content)
        }
           
        
       
    })
}
function openCreateListPage(){
    window.location.href = '/createList.html'
}

function renderMovies(list){
    let content = ''
    if(list){
        for(let movie of list){
            let imgUrl = ''
            if(movie?.poster_path){
                imgUrl = `https://image.tmdb.org/t/p/w500/${movie?.poster_path}`
            }else {
                imgUrl = 'https://admin.itsnicethat.com/images/v_3z_AiDn20ajFJs-21SUknlPEA=/51850/width-1440%7Cformat-jpeg/5530f22d5c3e3c1893000f8e.png'
            }
            content += `<div class='movie-card' onclick='openMovie(${movie.id})'>
            <img src='${imgUrl}' />
            <h4>${movie?.title}</h4>
            <p>${movie?.release_date}</p>
            </div>`
        }
        $('.active-content').html(content)
    }
}
// let id = elem.id
function deleteList(id){
    $.ajax({
        url:`https://api.themoviedb.org/3/list/${id}?api_key=7fb495ea2c47e3fd13a6761abeecf50d&session_id=${session_id}`,
        method: "delete",
        success: function (result) {

        },
        error: function (error) {
            window.location.href = '/profile.html?tab=lists'
        }
        
    });
}
