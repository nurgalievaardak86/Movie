let searchInput = $('.search-input')
let searchBtn = $('.search-btn')

searchBtn.click(() => {
    let city = searchInput.val()
    if(city.length > 1){
         $.ajax({url: `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=c05c1e37c38ab839523ad145494f7269`, method:'POST', }).done(
         (res) => {
            if(res && res.length){
                let lat = res[0].lat
                let lon =  res[0].lon
                $.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=c05c1e37c38ab839523ad145494f7269&units=metric`,
                (data) => {
                    console.log(data);
                    $('.result').html(`<h4>${data?.weather[0]?.main}</h4><h2>${data?.main?.temp} C</h2><h3>Wind: ${data?.wind?.speed} km/s</h3>`)
                })
            }else{
                $('.result').html('<p>Invalid city name. Enter correct city name!</p>')
            }    
        }).fail(error => {
            $('.result').html(`<h1>${error?.status}</h1><p>${error?.responseJSON?.message}</p>`)
        })
    }
})
