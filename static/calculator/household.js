document.addEventListener('DOMContentLoaded', () => {

    // onclick + next NEW member input is made visible
    document.querySelectorAll('.add_button').forEach(button => {
        button.onclick = () => {
            document.querySelector(`#${button.dataset.id}`).classList.remove('hidden');
        }
    });

    // removes the last NEW member, regardless of which - was clicked
    document.querySelectorAll('.remove_button').forEach(button => {
        button.onclick = () => {
            let no_of_elms = document.querySelectorAll('.remove_button').length + 1;
            let i = no_of_elms;
            let done = false
            while (done === false) {
                if (!document.querySelector(`#m${i}`).classList.contains('hidden')) {
                    document.querySelector(`#m${i}`).classList.add('hidden');
                    done = true
                    i = no_of_elms;
                } else {
                    i--;
                }
            }
            
        }
    });

    // use js to remove a CURRENT member without reloading
    document.querySelectorAll('.del_member').forEach(button => {
        button.onclick = () => {
            if (window.confirm(`WARNING!\nClick "Submit Changes" to permanently delete this member.`)){
                document.querySelector(`#m${button.dataset.id}`).classList.add('hidden');
                document.querySelector(`#i${button.dataset.id}`).setAttribute('value', '');
            }
           
        }
    });

});

