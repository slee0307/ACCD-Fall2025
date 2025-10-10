let gT1 = document.getElementById("galleryThumb1")
let gT2 = document.getElementById("galleryThumb2")
let gT3 = document.getElementById("galleryThumb3")
let gT4 = document.getElementById("galleryThumb4")
let thumbImages = document.querySelectorAll(".gallery-thumb")
console.log(thumbImages)
let scImage = document.getElementById("showcaseImage")
let arrRight = document.querySelector(".showcase-arrow-right")
let arrLeft = document.querySelector(".showcase-arrow-left")

let currentIndexThumb = 0

function changeImage (_image) {
    console.log(_image)
    let thumbSrc = _image.src
    scImage.src = thumbSrc

    thumbImages.forEach(function(elem){
        elem.parentElement.classList.remove("current-thumb")
    })
    
    console.log(_image.target)
    
    _image.target.parentElement.classList.add("current-thumb") 
    
    currentIndexThumb = Array.from(thumbImages).indexOf(_image)
}

for(let i = 0; i < thumbImages.length; i++) {
    thumbImages[i].addEventListener("click", function(event){
        changeImage(event.target)
    })
}

arrRight.addEventListener("click",function(){
    currentIndexThumb++
    if(currentIndexThumb >= thumbImages.legth) {
        currentIndexThumb = 0
    }
    changeImage(thumbImages[currentIndexThumb])
})
arrLeft.addEventListener("cliclk",function(){
    currentIndexThumb--
    if(currentIndexThumb < 0 ) {
        currentIndexThumb = thumbImages.length - 1
    }
    changeImage(thumbImages[currentIndexThumb])
})

gT1.addEventListener("click", changeImage)
gT2.addEventListener("click", changeImage)
gT3.addEventListener("click", changeImage)
gT4.addEventListener("click", changeImage)
