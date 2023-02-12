var xhr = new XMLHttpRequest();
var timerId = null;
var tx = document.getElementsByTagName('textarea');

for (var i = 0; i < tx.length; i++) {
    tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;');
    tx[i].addEventListener("input", OnInput, false);
}

function OnInput() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
}

function openAuth(text) {
    if (text === 'signUp'){
        document.body.style = "overflow-y: hidden;"
        let showBlock = document.querySelector('.reg')
        showBlock?.classList.add('show')
        showBlock?.querySelector('.sign')?.classList.add('show')
    } else if (text === 'signIn'){
        document.body.style = "overflow-y: hidden;"
        let showBlock = document.querySelector('.log')
        showBlock?.classList.add('show')
        showBlock?.querySelector('.sign')?.classList.add('show')
    }
}

function clickOnClose(closeBtn){
    document.body.style = ""
    closeBtn.closest('.bluray')?.classList.remove('show')
    closeBtn.closest('.sign')?.classList.remove('show')
    closeBtn.closest('.burger-menu')?.classList.remove('show')
}

function openBurger(){
    document.body.style = "overflow-y: hidden;"
    document.querySelector('.bluray.burger').classList.add('show')
    document.querySelector('.burger-menu').classList.add('show')
}

document.body.addEventListener('click', (e) =>{
    if (e.target.tagName !== 'svg' && e.target.tagName !== 'use') clickElem(e);
})

function clickElem (e) {
    if(e.target.className.includes('reg')){
        document.body.style = ""
        e.target.classList.remove('show')
        e.target.querySelector('.sign')?.classList.remove('show')
    } else if (e.target.className.includes('log')){
        document.body.style = ""
        e.target.classList.remove('show')
        e.target.querySelector('.sign')?.classList.remove('show')
    } else if (e.target.className.includes('burger')){
        document.body.style = ""
        e.target.classList.remove('show')
        e.target.querySelector('.burger-menu')?.classList.remove('show')
    }
}

function showPass(pass) {
    let input = pass.parentNode.querySelector('input')

    if (input.type == 'password'){
        input.type = 'text'
    } else if (input.type == 'text'){
        input.type = 'password'
    }
}

async function signInFunc(clickSign) {
    let valueLogin = clickSign.querySelector('.login').value
    let valuePass = clickSign.querySelector('.pass').value
    let body = 'login=' + valueLogin + '&pass=' + valuePass

    clickSign.querySelector('.loader')?.classList.add('show')

    xhr.open("POST", '/auth/sign-in', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(body);

    xhr.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200 ){
            if (this.responseText == 'true'){
                window.location.href = '/'
            } else {
                clickSign.querySelector('.loader')?.classList.remove('show')
                clickSign.querySelector('.login').style = 'border-color: red;'
                clickSign.querySelector('.pass').value = ''
                clickSign.querySelector('.err').innerHTML  = 'Invalid username or password'
            }
        }
    }
}

async function checkInp(input) {
    let inputValue = input.value.trim();
    let lastTime = performance.now();
    

    if (timerId) {
        clearTimeout(timerId);
    }

    timerId = setTimeout(function() {
        if (performance.now() - lastTime > 500 && inputValue.length > 4) {
            let body = 'login=' + inputValue

            input.setCustomValidity('')
            input.style = ''

            xhr.open("POST", '/auth/checkLogin', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(body);
            xhr.onreadystatechange = function () {
                if(this.readyState == 4 && this.status == 200 ){
                    if (this.responseText == 'true'){
                        input.setCustomValidity('')
                        input.style = ''
                    } else {
                        input.style = 'border-color: red;'
                        input.setCustomValidity('Логин уже занят')
                        input.reportValidity()
                    }
                }
            }
            
        }else if(inputValue.length < 4){
            input.style = 'border-color: red;'
            input.setCustomValidity('Не менее 4 символов')
            input.reportValidity()
        }
    }, 500);
}

function checkPass(valuePass){
    let pass = valuePass.closest('.inp-block').querySelector('.pass')
    let lastTime = performance.now();

    if (timerId) {
        clearTimeout(timerId);
    }

    timerId = setTimeout(function() {
        if(performance.now() - lastTime > 1000 && valuePass.value === pass.value){
            valuePass.setCustomValidity('')
            valuePass.closest('.password').style = ''
            pass.closest('.password').style = ''
        } else {
            valuePass.closest('.password').style = 'border-color: red;'
            pass.closest('.password').style = 'border-color: red;'
            valuePass.setCustomValidity('Пароли не совпадают')
            valuePass.reportValidity()
        }
    }, 1000)
}

async function signUpFunc(clickSign) {
    let valueLogin = clickSign.querySelector('.login').value
    let valuePass = clickSign.querySelector('.pass').value
    let body = 'login=' + valueLogin + '&pass=' + valuePass

    clickSign.querySelector('.loader')?.classList.add('show')

    xhr.open("POST", '/auth/sign-up', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(body);

    xhr.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200 ){
            if (this.responseText == 'true'){
                window.location.href = '/'
            } else {
                clickSign.querySelector('.loader')?.classList.remove('show')
                clickSign.querySelector('.login').style = 'border-color: red;'
            }
        }
    }
}

function scrollRec(row){
    let scrollElem = row.closest('.recommendation').querySelector('.items')
    
    if(row.className.indexOf('next') > -1){
        scrollElem.scrollBy({
            left: 200,
            behavior: 'smooth'
        });
    }
    if(row.className.indexOf('back') > -1){
        scrollElem.scrollBy({
            left: -200,
            behavior: 'smooth'
          });
    }
    
}