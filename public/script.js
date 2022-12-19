function openAuth(text) {
    if (text === 'signUp'){
        document.body.style = "overflow-y: hidden;"
        let showBlock = document.querySelector('.reg')
        showBlock?.classList.add('show')
        showBlock?.querySelector('.sign-in')?.classList.add('show')
    }
}

function clickOnClose(closeBtn){
    document.body.style = ""
    closeBtn.closest('.reg')?.classList.remove('show')
    closeBtn.closest('.sign-in')?.classList.remove('show')
}

function clickOnBluray(bluray){
    if (bluray.className.includes('reg')){
        document.body.style = ""
        bluray.classList.remove('show')
        bluray.querySelector('.sign-in')?.classList.remove('show')
    }
}