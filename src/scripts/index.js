let btnControl = document.querySelectorAll('.container__control');
let images = $('.container__slideshow')
let container = $('.container');
let coverImg = $('.cover');
let index = 0;
let isChanging = false;
//images.style.width = `${images.childElementCount * container.offsetWidth}px`;
function handleClickControl(i) {
    //index += i;
    //C1:
    // Array.from(images.children, (element => {
    //     element.style.display = 'none';
    // }));
    // if(index > images.childElementCount - 1){
    //     index = 0;        
    // }
    // else if(index < 0)
    //     index = images.childElementCount - 1;
    // setTimeout(() => {
    //     images.children[index].style.display = 'block';
    // }, 0)
    //---------------------------------------------------------------------
    //C2
    // if(index > images.childElementCount - 1){
    //     index = 0;        
    // }
    // else if(index < 0)
    //     index = images.childElementCount - 1;
    // images.children[index].style.display = 'none';
    // images.style.transform = `translateX(${-index * container.offsetWidth}px)`;
    // images.children[index].style.display = 'inline-block';
    //C3

    if(!isChanging){
        isChanging = true;
        if (i > 0) {
            coverImg.style.display = 'none';
            images.style.transform = `translateX(${-container.offsetWidth}px)`;
            //Save      
            let el = document.createElement('img');
            let { src, alt } = images.firstElementChild;
            el.src = src;
            el.alt = alt;

            setTimeout(() => {
                //
                coverImg.src = images.children[1].src;
                coverImg.style.display = 'block';
                images.style.transform = `translateX(0px)`;
                images.append(el);
                images.firstElementChild.remove();
                isChanging = false;
            }, 400)
        } else {           
            coverImg.src = images.firstElementChild.src;
            coverImg.style.display = 'block';
            images.insertBefore(images.lastElementChild, images.firstElementChild);            
            images.style.transform = `translateX(${-container.offsetWidth}px)`;
            setTimeout(() => {
                coverImg.style.display = 'none';
                images.style.transform = `translateX(0px)`;
                isChanging = false;
            }, 200)         
        }
    }

}

btnControl[0].addEventListener('click', (e) => {
    handleClickControl(-1);
})

btnControl[1].addEventListener('click', (e) => {
    handleClickControl(1);
})

// setInterval(() => {
//     handleClickControl(1);
// }, 3000)