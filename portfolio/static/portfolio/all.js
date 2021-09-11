import {data} from './data.js'

document.addEventListener('DOMContentLoaded', () => {

    //Toggle between hamburger and close symbol
    const hamBurger = document.querySelector('.mob-tog');
    const mobLinks = document.querySelector('.mob-links');
    const overlay = document.querySelector('.overlay');
    const closeMobLinks = document.querySelectorAll('.mob-links-close')
    
    console.log(`${static_url}portfolio/images/logo.png`);
    
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
    const animatedItems = document.querySelectorAll('.move');
    let index = 0;
    function loadProject(){
        const {code, img, site, subtitle, text, title} = data[index];
        titleEl.textContent = title;
        subtitleEl.textContent = subtitle;
        textEl.innerHTML = text;
        imgEl.src = img;
        btn.href = site;
    }
    function changeProject(direction){
        if(direction === 'next'){
            index++;
            if(index >= data.length){
                index = 0;
            }
        }else{
            index--;
            if (index < 0) {
                index = data.length - 1;
            }
        }
        animatedItems.forEach((item)=>{
            item.style.transform =  'translateX(-100vw)';
            setTimeout(()=>{
                item.style.transform =  'translateX(0)';
            },150);
        });
        loadProject(); 
    }
    const nextProject = document.querySelector('.next-project');
    const prevProject = document.querySelector('.prev-project')
    nextProject.onclick = () => changeProject('next');
    prevProject.onclick = () => changeProject('prev');
    loadProject();
    
    
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