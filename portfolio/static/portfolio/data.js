const img = 'portfolio/images/'
export const data = [
    {
        site: "https://www.anyonecanlearntoplayguitar.com",
        code: "https://github.com/andy-little/AnyoneCanLearnToPlayGuitar",
        title: "learn to play guitar",
        subtitle: "In my time as a teacher I wrote a book. Here it is implemented as a website.",
        text: 'This was a front-end heavy project where I focused on responsive design. Functionality of the site includes <ul> <li> Personal account creation </li><li> Secure login </li><li> Password management via email </li><li> Track and save progress </li><li> Dynamically styled audio player </li></ul>',
        img: `${static_url}${img}lapmob-gtr-1.png`
    },
    {
        site: "/money",
        code: "https://github.com/andy-little/Web-Portfolio/tree/main/calculator",
        title: "money squared",
        subtitle: "An app I built for managing household bills and other shared costs.",
        text: "Users first create a household. Members of this household can add their transactions to the group. Members can also:<ul><li> View their entire transaction history </li><li> Easily see who owes whom what </li><li> Settle debts </li><li> Edit/delete transactions not yet settled </li></ul>In this project I created my own paginator api which, unlike Django's, can be used asynchronously.",
        img: `${static_url}${img}lapmob-money-1.png`
    },
    {
        site: "https://jaffalondon.herokuapp.com",
        code: "TODO",
        title: "jaffa london",
        subtitle: "A simple website I designed and created for Jaffa Digital.",
        text: "TODO",
        img: `${static_url}${img}lapmob-jaffa.png`
    },
    {
        site: "https://google-style-hacker-news.netlify.app/",
        code: "TODO",
        title: "hacker news",
        subtitle: "Using hacker news api to create a google style search engine",
        text: "I used React and pure css to create this project. I used the context API and useReducer to keep the code clean and maintainable. <ul><li>search hacker news database</li><li>easily hide results</li><li>fun pagination</li><li>clean and easy to use UI</li></ul>",
        img: `${static_url}${img}hacker-news.png`
    },

]