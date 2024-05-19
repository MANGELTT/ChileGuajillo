//UI
let cardUserName = document.getElementById('cardUserName')
const navAuth = document.getElementById('navAuth');
const navGuest = document.getElementById('navGuest');

//buttons
const btnLogOut = document.getElementById("btnLogOut");
//logica
const userName = localStorage.getItem("userSession_Verified");
const user = JSON.parse(userName)


if(!userName){
    navGuest.className = "gap-2 md:flex xs:hidden items-center p-3";
    navAuth.className = "hidden"
    btnLogOut.className = "hidden"
}
else{
    cardUserName.innerHTML = user.name
    navGuest.className = "hidden";
    navAuth.className = " md:flex items-center gap-7 xs:hidden p-2 py-4 rounded-full cursor-pointer text-zinc-300"
    btnLogOut.className = "flex p-2 rounded hover:text-indigo-200 font-medium transition-all delay-0 hover:bg-indigo-950/20"
}

btnLogOut.addEventListener('click', () => {
    localStorage.clear();
    window.location.reload();
});
