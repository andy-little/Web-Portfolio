const img = "portfolio/images/";
export const data = [
    {
        site: "https://eartraining.netlify.app",
        code: "https://github.com/andy-little/ear-training",
        title: "ear trainer",
        subtitle:
            "An app for musicians to improve on identifying notes relative to a chosen key.",
        text: `This is an original app and my most up-to-date coding example so please browse
                    the source code! I tried to keep the code clean and dry and I made reusable components/custom-hooks wherever
                    applicable. I built this app with the view to expand it into a much larger project.
                    <ul>
                        <li>React App</li>
                        <li>Integration/unit tests</li>
                        <li>Responsive design</li>
                        <li>Best reflection of my current abilty</li>
                    </ul>`,
        img: `${static_url}${img}lapmob-ear-trainer.png`,
    },
    {
        site: "/money",
        code: "https://github.com/andy-little/Web-Portfolio/tree/main/calculator",
        title: "money squared",
        subtitle:
            "An app I built for managing household bills and other shared costs.",
        text: "Users first create a household. Members of this household can add their transactions to the group. Members can also:<ul><li> View their entire transaction history </li><li> Easily see who owes whom what </li><li> Settle debts </li><li> Edit/delete transactions not yet settled </li></ul>In this project I created my own paginator api which, unlike Django's, can be used asynchronously.",
        img: `${static_url}${img}lapmob-money-1.png`,
    },
    /* {
        site: "https://www.anyonecanlearntoplayguitar.com",
        code: "https://github.com/andy-little/AnyoneCanLearnToPlayGuitar",
        title: "learn to play guitar",
        subtitle: "In my time as a teacher I wrote a book. Here it is implemented as a website.",
        text: 'This was a front-end heavy project where I focused on responsive design. Functionality of the site includes <ul> <li> Personal account creation </li><li> Secure login </li><li> Password management via email </li><li> Track and save progress </li><li> Dynamically styled audio player </li></ul>',
        img: `${static_url}${img}lapmob-gtr-1.png`
    }, */
    {
        site: "https://jaffalondon.herokuapp.com",
        code: "https://github.com/andy-little/jaffa",
        title: "jaffa london",
        subtitle: "A simple website I designed and created for Jaffa Digital.",
        text: "I built this site using sass and vanilla javascript. I designed the site incorporating the company styles and logos.<ul><li>Responsive design</li><li>Parallax effects with fallback</li><li>Animated cards with phone fallback</li><li>Contact form sends emails in the backend with django</li><li>Hosted with Heroku</li></ul>",
        img: `${static_url}${img}lapmob-jaffa.png`,
    },
    {
        site: "https://google-style-hacker-news.netlify.app/",
        code: "https://github.com/andy-little/hacker-news",
        title: "hacker news",
        subtitle:
            "Using hacker news api to create a google style search engine",
        text: "I used React and pure css to create this project. I used the context API and useReducer to keep the code clean and maintainable. <ul><li>Search hacker news database</li><li>Easily hide results</li><li>Fun pagination</li><li>Clean and easy to use UI</li><li>Hosted with netlify</li></ul>",
        img: `${static_url}${img}hacker-news.png`,
    },
    {
        site: "https://light-dark-gallery.netlify.app",
        code: "https://github.com/andy-little/unsplash",
        title: "light/dark gallery",
        subtitle: "Using unsplash api and React to create a light/dark UI",
        text: "Based on a React tutorial I created an interface to search for unsplash images. I then refactored the code to be more maintainable, added my touches to the project and added a stylised light/dark switch.<ul><li>Light dark toggle switch</li><li>Stores preference in local storage</li><li>Infinite scroll</li><li>Using api keys with environment variables</li><li>Modular maintainable design using context api</li></ul>",
        img: `${static_url}${img}night-dark.png`,
    },
    {
        site: "https://tints-and-shades-genorator.netlify.app",
        code: "https://github.com/andy-little/colour",
        title: "tints and shades",
        subtitle: "Produce tints and shades of a given colour",
        text: "This React project uses Values.js to produce a desired amount of colour swatches. When clicked the hex code is copied to your clipboard. There is also the option to generate a random colour. Since the colours are dynamic I used tinycolour2 to ensure overlaying text is always readable.<ul><li>Uses 3rd party libraries</li><li>Uses props and controlled inputs</li><li>Stylised slider inputs</li></ul>",
        img: `${static_url}${img}colour.png`,
    },
];
