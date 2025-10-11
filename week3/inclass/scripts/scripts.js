let gT1 = document.getElementById("galleryThumb1")
let gT2 = document.getElementById("galleryThumb2")
let gT3 = document.getElementById("galleryThumb3")
let gT4 = document.getElementById("galleryThumb4")
let thumbImages = document.querySelectorAll(".gallery-thumb")

let scImage = document.getElementById("showcaseImage")
let arrRight = document.querySelector(".showcase-arrow-right")
let arrLeft = document.querySelector(".showcase-arrow-left")

let currentIndexThumb = 0

function changeImage (_image) {
    let thumbSrc = _image.src
    scImage.src = thumbSrc

    thumbImages.forEach(function(elem){
        elem.parentElement.classList.remove("current-thumb")
    })

    console.log(_image)
    
    _image.parentElement.classList.add("current-thumb")
    
    console.log(Array.from(thumbImages).indexOf(_image))
    
    currentIndexThumb = Array.from(thumbImages).indexOf(_image)
}

// for(let i = 0; i < thumbImages.length; i++) {
//     thumbImages[i].addEventListener("click", function(event){
//         changeImage(event.target)
//     })
// }

arrRight.addEventListener("click",function(){
    currentIndexThumb++
    if(currentIndexThumb >= thumbImages.legth) {
        currentIndexThumb = 0
    }
    changeImage(thumbImages[currentIndexThumb])
})
arrLeft.addEventListener("click",function(){
    currentIndexThumb--
    if(currentIndexThumb < 0 ) {
        currentIndexThumb = thumbImages.length - 1
    }
    changeImage(thumbImages[currentIndexThumb])
})

gT1.addEventListener("click", (e)=>{
    changeImage(e.target)
})
gT2.addEventListener("click",  (e)=>{
    changeImage(e.target)
})
gT3.addEventListener("click",  (e)=>{
    changeImage(e.target)
})
gT4.addEventListener("click",  (e)=>{
    changeImage(e.target)
})