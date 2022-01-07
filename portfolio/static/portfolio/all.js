import {data} from './data.js'

const titleEl = document.querySelector('.project-title-text');
const subtitleEl = document.querySelector('.project-subtitle');
const textEl = document.querySelector('.project-text');
const imgEl = document.querySelector('.project-laptop');
const btn = document.querySelector('.site');
const codeBtn = document.querySelector('.code');
const animatedItems = document.querySelectorAll('.move');
let index = 0;
let interval;
const slideDuration = 10000;

// toggle through projects
// set data
function loadProject(){
    const {code, img, site:url, subtitle, text, title} = data[index];
    imgEl.src = img;
    btn.href = url;
    codeBtn.href = code;
    titleEl.textContent = title;
    titleEl.href = url;
    subtitleEl.textContent = subtitle;
    textEl.innerHTML = text;
}
//animate project change
function changeProject(direction){
    clearInterval(interval);
    let step1 = 'translateX(100vw)';
    let step2 = 'translateX(-100vw)';
    if(direction === 'prev'){
        index--;
        if (index < 0) {
            index = data.length - 1;
        }
    }else{
        //swaps values so that animation is reversed
        [step1, step2] = [step2, step1];
        index++;
        if(index >= data.length){
            index = 0;
        }
    }
    animatedItems.forEach((item)=>{
        item.style.transform =  step1;
        setTimeout(()=>{
            loadProject();
            item.style.opacity =  0;
            item.style.transform =  step2;
        },100);
        
        setTimeout(()=>{
            item.style.opacity =  1;
            item.style.transform = 'translateX(0vw)';
        },200);
        
    });
    interval = setInterval(changeProject, slideDuration);
}

document.addEventListener('DOMContentLoaded', () => {

    //Toggle between hamburger and close symbol
    const hamBurger = document.querySelector('.mob-tog');
    const mobLinks = document.querySelector('.mob-links');
    const overlay = document.querySelector('.overlay');
    const closeMobLinks = document.querySelectorAll('.mob-links-close')
    
    hamBurger.onclick = () => {
        hamBurger.classList.toggle('open');
        mobLinks.classList.toggle('open');
        overlay.classList.toggle('open');
    }
    
    closeMobLinks.forEach((btn) => {
        btn.onclick = () => {
            mobLinks.classList.remove('open')
            hamBurger.classList.remove('open')
            overlay.classList.remove('open')
        }
    });
    
    
    const nextProject = document.querySelector('.next-project');
    const prevProject = document.querySelector('.prev-project')
    nextProject.onclick = () => changeProject('next');
    prevProject.onclick = () => changeProject('prev');
    /* uncomment line below for slides to scroll automatically */
    //interval = setInterval(changeProject, slideDuration);

});

    window.onload = () => {
        
        //Replace desktop menu with minimize sign when scrolling past header 
        const deskMenu = document.querySelector('.desk-menu');
        
        
        
        window.addEventListener('scroll', () => {
            //AND hide minimise sign and menu when at contact section
            const contact = document.querySelector('#contact');
            const contactPosition = contact.offsetTop - 250;
            //hide menu and show
            if (window.pageYOffset > 315 && deskMenu.classList.contains('open')) {
                deskMenu.classList.remove('open')
            } else if (window.pageYOffset < 315 && !deskMenu.classList.contains('open')) {
                deskMenu.classList.add('open');
            } else if (window.pageYOffset > contactPosition) {
                //hide minimise sign and show
                deskMenu.classList.add('close');
            } else if (window.pageYOffset < contactPosition) {
                deskMenu.classList.remove('close');
            }

        // turn off project auto scroll when lower on page
        // this prevents the page resizing and jumping
            let imgBottom = imgEl.offsetTop + imgEl.getBoundingClientRect().height;
            if(window.pageYOffset > imgBottom - 20 && interval !== 0){
                clearInterval(interval);
                interval = 0;
                
            } else if(window.pageYOffset < imgBottom - 20 && interval === 0){
                interval = setInterval(changeProject, slideDuration);
        }
    });
};
