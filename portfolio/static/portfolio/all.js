import {data} from './data.js'

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
    
    
    const titleEl = document.querySelector('.project-title-text');
    const subtitleEl = document.querySelector('.project-subtitle');
    const textEl = document.querySelector('.project-text');
    const imgEl = document.querySelector('.project-laptop');
    const btn = document.querySelector('.site');
    const codeBtn = document.querySelector('.code');
    const animatedItems = document.querySelectorAll('.move');
    let index = 0;
    let interval;
    const slideDuration = 7000;

    
    
    function loadProject(){
        const {code, img, site:url, subtitle, text, title} = data[index];
        titleEl.textContent = title;
        titleEl.href = url;
        subtitleEl.textContent = subtitle;
        textEl.innerHTML = text;
        imgEl.src = img;
        btn.href = url;
        codeBtn.href = code;
    }
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
            [step1, step2] =[step2, step1];
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
    const nextProject = document.querySelector('.next-project');
    const prevProject = document.querySelector('.prev-project')
    nextProject.onclick = () => changeProject('next');
    prevProject.onclick = () => changeProject('prev');
    loadProject();
    interval = setInterval(changeProject, slideDuration);
    
    
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
        
    });
};

/*     function loadProject(project) {
        let csrftoken = getCookie('csrftoken');
        fetch(`/project/${project}`, {
            method: 'GET',
            headers: { "X-CSRFToken": csrftoken },
        })
        .then(response => response.json())
        .then(result => {
            //do something with object here
            console.log(result)
        }).catch(error => console.log(error));
        
    } */




/* 

// handle csrf token for fetch()
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
} */