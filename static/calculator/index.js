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


});
