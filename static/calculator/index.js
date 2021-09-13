document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.querySelector('#mobileMenu');
    const overlay = document.querySelector('#overlay');
    const header = document.querySelector('.header');
    const body = document.querySelector('body');
    
    document.querySelector('#toggleMenu').onclick = () => {
        // show menu
        header.classList.toggle('open')
        body.classList.toggle('open')

        if(mobileMenu.classList.contains('hidden')){

            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('show');
            overlay.classList.add('overlay');

        } else {
            // hide menu
            mobileMenu.classList.remove('show');
            mobileMenu.classList.add('hidden');
            overlay.classList.remove('overlay');
        }

    }


    
    // Getting started slides


    //layout images side by side
    const images = document.querySelectorAll('.step-img');
    images.forEach((img, index) => {
        img.style.left = `${index * 200}%`
    })

    const toggleLeft = document.querySelector('#left');
    const toggleRight = document.querySelector('#right');

    const SLIDES = 4;
    let counter = 1;

    toggleLeft.onclick = () => {
        counter -= 1;
        counter < 1 ? counter = SLIDES : null;
        loadSlide(counter);

        
    }
    toggleRight.onclick = () => {
        counter += 1;
        counter > SLIDES ? counter = 1 : null;
        loadSlide(counter);
    }

 
    

    function loadSlide(slideNum) {
        // hides all text
        const text = document.querySelectorAll('.step');
        text.forEach((item) => {
            item.classList.remove('show');
        })
        // shows text numbered slideNum
        const showSlide = document.querySelectorAll(`.step${counter}`);
        showSlide.forEach((item) => {
            item.classList.add('show');
        })
        //moves images by percentage
        images.forEach((img) => {
            img.style.transform = `translateX(-${(slideNum - 1) * 200}%)`
        })

    }

});
