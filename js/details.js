// let urlAddress = window.location.search
// let urlParams = new URLSearchParams(urlAddress)
// let id = urlParams.get('id')
// console.log(id);

let urlAddress = window.location.href
let urlParams = new URL(urlAddress)
let id = urlParams.searchParams.get('id')
let user_id = localStorage.getItem('user_id')
let favouriteMovies = []
let lists = []
let isFavouriteMovie = false

if(session_id && user_id){
    $.get(`
    https://api.themoviedb.org/3/account/${user_id}5/favorite/movies?api_key=7fb495ea2c47e3fd13a6761abeecf50d&session_id=${session_id}`,(res)=>{
        favouriteMovies =res.results;
        if(favouriteMovies.length){
            let exist = favouriteMovies.find(elem => elem.id == id)
            if(exist){
                isFavouriteMovie = true
               }
            if(isFavouriteMovie){
                $('.favourite-btn').css('color', 'red')
            }
        }
    })
    $.get(`
    https://api.themoviedb.org/3/account/${user_id}/lists?api_key=7fb495ea2c47e3fd13a6761abeecf50d&session_id=${session_id}`,(res)=>{
        lists = res.results
        let content = "<div onclick='openCreateListPage()'>+Create new list</div>"
        if(lists.length){
           
            lists.forEach(item => {
                content += `<div onclick='addToList(${item.id})'>${item.name}</div>`
            })
            
        }
        $('.select-lists').html(content)
    })
}

function openCreateListPage(){
    window.location.href = '/createList.html'
}

function addToList(list_id){
    $.ajax({
        url:`https://api.themoviedb.org/3/list/${list_id}/add_item?api_key=7fb495ea2c47e3fd13a6761abeecf50d&session_id=${session_id}`,
        method: "post",
        data: {
           "media_id": id,
           },
        success: function(data){
            $('.select-lists').hide();  
           
        }
    })
}

$.get(`https://api.themoviedb.org/3/movie/${id}?api_key=2bc06158cec438c68a78d1754264f9f4&language=en-US`,(result) =>{
    let imgUrl = ''
    if(result?.poster_path){
        imgUrl = `https://image.tmdb.org/t/p/w500/${result?.poster_path}`
    }else {
        imgUrl = 'https://admin.itsnicethat.com/images/v_3z_AiDn20ajFJs-21SUknlPEA=/51850/width-1440%7Cformat-jpeg/5530f22d5c3e3c1893000f8e.png'
    }
    let genreStr = ''
    if(result?.genres.length > 0){
        for(let genre of result?.genres){
            genreStr += genre.name + ', '
        }
    }
    let score = result.vote_average / 10 * 100
    
    let content = `<div class="movie-poster">
                        <img src="${imgUrl}" />
                    </div>
                    <div>
                        <h1>${result.title} <span>${result.release_date}</span></h1>
                        <p>${genreStr}</p>
                        <div>
                            <span>${score.toFixed()} %</span>
                        </div>
                        <div>
                        <button class="favourite-btn" onclick="markFavourite(${result.id})">&#10084</button>
                        <button class="lists-btn" onclick="addList(${result.id})">&#9776;</button>
                       
                        <div class='select-lists'>
                        </div>
                        </div>
                        <p>Overview</p>
                        <p>${result.overview}</p>
                    </div>`
    $('.movie-details').html(content);
    $('.movie-details').css('background-image', `url(https://image.tmdb.org/t/p/w500/${result?.backdrop_path})`)
    
}) 
function addList(id){
$('.select-lists').show()
}

function markFavourite(i){
    isFavouriteMovie = !isFavouriteMovie
$.ajax({
    url:`https://api.themoviedb.org/3/account/${user_id}/favorite?api_key=7fb495ea2c47e3fd13a6761abeecf50d&session_id=${session_id}`,
    method: "post",
    data: {
       "media_type": "movie",
       "media_id": id,
       "favorite": isFavouriteMovie 
    },
    success: function(data){
        if(isFavouriteMovie){
            $('.favourite-btn').css('color', 'red')
        } else{
            $('.favourite-btn').css('color', 'black')
        }
       
    }
})
}


$.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=2bc06158cec438c68a78d1754264f9f4&language=en-US`, (data) => {
    let content = ''
    let castList = sortCastList(data.cast)
    if(castList.length){
        for(let actor of castList){
            let imgUrl = ''
            if(actor?.profile_path){
                imgUrl = `https://image.tmdb.org/t/p/w500/${actor?.profile_path}`
            }else {
                imgUrl = 'https://admin.itsnicethat.com/images/v_3z_AiDn20ajFJs-21SUknlPEA=/51850/width-1440%7Cformat-jpeg/5530f22d5c3e3c1893000f8e.png'
            }
            content += `<div>
                <img src='${imgUrl}' />
                <h5>${actor.original_name}</h5>
            </div>`
        }
        $('.movie-cast').html(content);
    }
})

function sortCastList(list){
    return list.sort((a) => {
        if(a?.profile_path) return -1
        if(a?.profile_path === null) return 1
        return 0
    })
}

// let idMovie = null;

// $.get('https://api.themoviedb.org/3/movie/550/reviews?api_key=7fb495ea2c47e3fd13a6761abeecf50d', (result) => {
    
//     console.log(result);
//     let content = '';
//     if(result?.results){
//         for(let movie of result?.results)
//         content += `<div>
//         <h5></h5>
//         <p>${movie.content}</p>
//         </div>`
//     }
    
//     $('.review__content').html(content)
// }
// )
