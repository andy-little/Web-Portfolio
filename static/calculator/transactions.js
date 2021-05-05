


document.addEventListener('DOMContentLoaded', () => {

    const balanceInfo = document.querySelector('.fa-question-circle');
    balanceInfo.onclick = () => {
        balanceInfo.classList.toggle('open')
    }
  
    let page = 1;
    let settled = false;

    window.onpopstate = function(event) {
        location.reload();
        /* page = event.state.page;
        event.state.settled === 'settled' ? settled = true : settled = false;
        LoadTable(page, settled) */
    }


    /////////
    //TABLE DISPLAY
    const tableBtns = document.querySelectorAll('.table_button');
    const tables = document.querySelectorAll('.table');
    const btnContainer = document.querySelector('.table_buttons');

    //////

    // on clicking a table button the corrosponding table will display, all others will hide, and selected button changes appearance
    btnContainer.onclick = (e) => {
        // id of btn clicked
        const target = e.target.dataset.id;
        // remove active from all btns
        tableBtns.forEach((btn) => {
            btn.classList.remove('active');
        })
        // remove active from all tables
        tables.forEach((table) => {
            table.classList.remove('active');
        })
        //add active class to clicked btn
        e.target.classList.add('active');
        //add active class to corresponding table
        document.querySelector(`.${target}-container`).classList.add('active');
        if(target  == 'settled') {
            settled = true;
            page = 1
            LoadTable(page, settled);
        } else if (target == 'unsettled'){
            settled = false;
            page = 1
            LoadTable(page, settled);
        }

    }
    LoadTable(page, settled);


});


function LoadTable (page, settled) {

    let csrftoken = getCookie('csrftoken');

    fetch(`/money/transactions/`, {
        method: 'PUT',
        headers: { "X-CSRFToken": csrftoken },
        body: JSON.stringify({
            page: page,
            settled: settled
        })
        
    })
    .then(response => response.json())
    .then(result => {
        //append page history so that back button doesnt load empty table
        hist(page, settled)
        if(result.transactions.length === 0){
            document.querySelector('.table_settled').innerHTML = '<h4 style="text-align: center;">no transactions to display</h4>'
            document.querySelectorAll('.paginate_btn').forEach((btn) => {
                btn.classList.remove('show')
            })
            document.querySelector('.page_counter').innerHTML = '';
        }else{
        if(!settled){
            let table_data = result.transactions.map((row) => {     
                return `<tr>
                <td class="table_toggle date">${row.created}</td>
                <td class="active table_toggle member">${row.member}</td>
                <td class="table_toggle description">${row.item}</td>
                <td>${row.cost}</td>
                <td class="edit"><a href="/money/item/${row.pk}"><i class="fas fa-pen"></i></a><a href="/money/delete/${row.pk}"><i class="fas fa-trash-alt"></a></i></td>
            </tr>`
            })
            document.querySelector('.table_settled').innerHTML = `<tr class="head_toggle_container">
            <th class="table_toggle date">Date<span class='arrow_right' data-id="member">&#8811</span></th>
            <th class="active table_toggle member"><span class='arrow_left' data-id="date">&#8810</span>Member<span class='arrow_right' data-id="description">&#8811</span></th>
            <th class="table_toggle description"><span class='arrow_left' data-id="member">&#8810</span>Description</th>
            <th class="amount">Amount</th>
            <th class="edit">edit</th>
            </tr>
            ${table_data.join('')}`
        } else {
            let table_data = result.transactions.map((row) => {     
                return `<tr>
                <td class="table_toggle date">${row.created}</td>
                <td class="active table_toggle member">${row.member}</td>
                <td class="table_toggle description">${row.item}</td>
                <td>${row.cost}</td>
            </tr>`
            })
            document.querySelector('.table_settled').innerHTML = `<tr class="head_toggle_container">
            <th class="table_toggle date">Date<span class='arrow_right' data-id="member">&#8811</span></th>
            <th class="active table_toggle member"><span class='arrow_left' data-id="date">&#8810</span>Member<span class='arrow_right' data-id="description">&#8811</span></th>
            <th class="table_toggle description"><span class='arrow_left' data-id="member">&#8810</span>Description</th>
            <th class="amount">Amount</th>
            </tr>
            ${table_data.join('')}`
        }
        
    
        /////////
        //TABLE COLUMN TOGGLE FOR MOB
        const toggleHeaderContainer = document.querySelector('.head_toggle_container');
        const toggleCells = document.querySelectorAll('.table_toggle');
        toggleHeaderContainer.onclick = (e) => {
    
            const nextColumn = e.target.dataset.id;
            if (nextColumn) {
                toggleCells.forEach((cell) => {
                    cell.classList.remove('active');
                })
                
                document.querySelectorAll(`.${nextColumn}`).forEach((cell) => {
                    cell.classList.add('active');
    
                })
            }
        }
        
        //PAGINATOR
        // display what page you're on and how many total
        if(result.num_pages > 1){
            document.querySelector('.page_counter').innerHTML = `${page} of ${result.num_pages}`;
        } else {
            document.querySelector('.page_counter').innerHTML = '';
        }

        // gives data to last btn so can load the end page
        const lastBtn = document.querySelector('#table_last');
        lastBtn.dataset.page = result.num_pages;

        // show relevent btns
        const prevBtn = document.querySelector('#table_prev');
        const nextBtn = document.querySelector('#table_next');
        const firstBtn = document.querySelector('#table_first');
        
        // remove show from all btns
        document.querySelectorAll('.paginate_btn').forEach((btn) => {
            btn.classList.remove('show')
        })

        if(result.has_previous){
            firstBtn.classList.add('show')
            prevBtn.classList.add('show')
        }
        if(result.has_next) {
            nextBtn.classList.add('show')
            lastBtn.classList.add('show')
        }
    }

    })


    const prevBtn = document.querySelector('#table_prev');
    const nextBtn = document.querySelector('#table_next');
    const firstBtn = document.querySelector('#table_first');
    const lastBtn = document.querySelector('#table_last');

    prevBtn.onclick = () => {
        page -= 1;
        LoadTable(page, settled);
    }
    
    nextBtn.onclick = () => {
        page += 1;
        LoadTable(page, settled);
    }

    firstBtn.onclick = () => {
        page = 1;
        LoadTable(page, settled);
    }
    lastBtn.onclick = (e) => {
        page = e.currentTarget.dataset.page;
        LoadTable(page, settled);
    }

}




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
}

function hist(page, settled){
    let table = ''
    settled ? table = 'settled' : table = 'unsettled';
    history.pushState({page: page, settled: settled}, "", "/money/transactions");
}