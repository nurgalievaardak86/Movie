// - проект TheMovie

let request_token = null
let session_id = localStorage.getItem('session_id')
let userInfo = localStorage.getItem('username')
if(userInfo){
    checkUser(userInfo)
}
function openIndexPage(){
    window.location.href = '/index.html'
}

$.get(`https://api.themoviedb.org/3/movie/popular?api_key=7fb495ea2c47e3fd13a6761abeecf50d`,
(data) => {
    renderMovies(data.results)
    $.get('https://api.themoviedb.org/3/authentication/token/new?api_key=7fb495ea2c47e3fd13a6761abeecf50d', (res) => {
        request_token = res.request_token
    })
})

$.get('https://api.themoviedb.org/3/genre/movie/list?api_key=7fb495ea2c47e3fd13a6761abeecf50d', (result) => {
    if(result.genres.length){
        let genresContent = ''
        for(let genre of result.genres){
            genresContent += `<button>${genre.name}</button>`
        }
        $('.genre-btns').html(genresContent)
    }
}
)

$('.movie-search-btn').click(() => {
    let movieName = $('.movie-search-input').val()
    if(movieName.length > 1){
        $.get(`https://api.themoviedb.org/3/search/movie?api_key=7fb495ea2c47e3fd13a6761abeecf50d&language=en-US&page=1&include_adult=false&query=${movieName}`,
        (data) => {
            renderMovies(data.results)  
        })
    } 
}
)

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
        $('.result-movie').html(content)
    }
}

function openMovie(id){
    window.location.href = '/details.html?id=' + id
  //  window.location.replace('/details.html?id=' + id)
  //  window.location.assign('/details.html')
}

function showLoginModal(){
    $('.modal-login').show()
}

let modal = document.querySelector('.modal-login')

window.onclick = function(event){
    if(event.target == modal){
        $('.modal-login').hide()
    }
}

document.querySelector('.modal-login-content')?.addEventListener('submit', function(event){
    event.preventDefault()
})

function loginUser(e){
    let username = $('.username').val()
    let password = $('.password').val()
    let body = {
        username,
        password,
        request_token
    }
    $.ajax(
        {
            url: 'https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=7fb495ea2c47e3fd13a6761abeecf50d',
            method: 'post',
            data: body, 
            success: function(data){   /* функция которая будет выполнена после успешного запроса.  */
               // alert(data); 
               console.log(data);
               if(data.success){
                    checkUser(username)
                    localStorage.setItem('username', username)
                    localStorage.setItem('resquet_token', request_token)
                    $.ajax({
                        url: "https://api.themoviedb.org/3/authentication/session/new?api_key=7fb495ea2c47e3fd13a6761abeecf50d",
                        method: 'post',
                        data: {request_token}, 
                        success: (res) => {
                            localStorage.setItem('session_id', res.session_id)
                        }
                    })
               }
            },
            error: function(data){   /* функция которая будет выполнена после успешного запроса.  */
               // alert(data.responseJSON.status_message); 
                $('.error-message').html(data.responseJSON.status_message);
                $('.error-message').css('color', 'red');
                $('.error-message').css('font-size', '12px');
                $('.error-message').css('margin-bottom', '12px');
            } 
        })
}

function logout(){
    localStorage.removeItem('username')
    localStorage.removeItem('resquet_token')
    localStorage.removeItem('session_id')
    $('.login-btn').show()
    $('.auth-block').hide()
}

function checkUser(username){
    $('.login-btn').hide()
    $('.auth-block h4').html(username)
    $('.modal-login').hide()
    $('.auth-block').show()
    $('.auth-block').css('display', 'flex')
}

function openProfilePage(){
    window.location.href = '/profile.html'
}


