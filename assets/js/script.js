$(document).ready(function(){
   localStorage.setItem("API_KEY","dc6zaTOxFJmzC")
   var topic = ["cat","dog"]
    renderButtons()
    function renderButtons(){
       $(".button-animals").empty()
       topic.forEach(function(animal){
          var button = $("<button>").attr("class","btn btn-info animal")
              button.text(animal)
              $(".button-animals").append(button)
       })
        clearTEXT()
    }

    function getAPIKEY(){
       return localStorage.getItem("API_KEY")
    }

    function clearTEXT(){
        $("#image-search").val('')
    }

    function getTEXT(){
        return $("#image-search").val().trim()
    }

    function populateGif(obj){
        $("#gifs").empty()
        for (var i = 0; i<10; i++){
            var div = $("<div>").attr({ "id":"img-"+i,
                                        "class":"gif-result"
                                        })
                $("#gifs").append(div)


            $("#img-"+i).append("<h4>Rating: "+obj.data[i].rating+"</h4>")
            var img = $("<img>").attr({ "src": obj.data[i].images.fixed_height_still.url,
                                        "state":"still",
                                        "data-still":obj.data[i].images.fixed_height_still.url,
                                        "data-animate":obj.data[i].images.fixed_height.url,
                                        })
                $("#img-"+i).append(img)
        }
    }


    $("#add-animal").on("click", function(){
        if( topic.indexOf(getTEXT()) === -1 && getTEXT() !== "" ) {
            topic.push(getTEXT())
        }
        renderButtons()
    })


    $("#gifs").on("click", ".gif-result", function(){
        var state = $(this).children("img").attr("state")
           if (state === "still") {
               $(this).children("img").attr("state", "animate")
               $(this).children("img").attr("src", $(this).children("img").attr("data-animate"))
           }else{
               $(this).children("img").attr("state", "still")
               $(this).children("img").attr("src", $(this).children("img").attr("data-still"))
           }
    })


    $(".button-animals").on("click",".animal",function(){
        renderButtons()
        var term  = encodeURIComponent($(this).text().trim())
        var t0 = new Date()
        if (!localStorage.getItem(term)){
            var url = "http://api.giphy.com/v1/gifs/search?q="+term+"&api_key="+getAPIKEY()
            $.ajax({
                method: "GET",
                url: url
            }).done(function(response) {
                localStorage.setItem(term,JSON.stringify(response))
                populateGif(response)
            })
            var t1 = new Date()
            console.log(' LS  Took', (t1 - t0).toFixed(4), 'milliseconds to generate:')
        }else{
            populateGif( JSON.parse(localStorage.getItem(term))  )
            var t1 = new Date()
            console.log(' NLS Took', (t1 - t0).toFixed(4))
        }
    })
});