import { users } from "./users.js";

// Login usuário
document.getElementById('loginFormUser').addEventListener('submit', function(event) {
event.preventDefault();

let emailUser = document.getElementById('emailUser').value;
let passwordUser = document.getElementById('passwordUser').value;

    const user = users.find(u => 
    u.email === emailUser &&
    u.password === passwordUser &&
    u.type === "user"
    ); 

    if(user) {
    localStorage.setItem("userLogged", JSON.stringify(user));
    window.location.href= '../index.html';
    } else {
    alert('Usuário ou senha incorretos');
    }

});

/*================================================================*/
// Login GESTOR
document.getElementById('loginFormBoss').addEventListener('submit', function(event) {
    event.preventDefault(); // preventDefault() evita que a página seja recarregada e o JS executa normalmente.
    
    let emailBoss = document.getElementById('emailBoss').value;
    let passwordBoss = document.getElementById('passwordBoss').value;
        
/* Verificação do Login e senha digitada com as informações da lista */
    const user = users.find(u => 
        u.email === emailBoss &&
        u.password === passwordBoss &&
        u.type === 'boss'
    );

    if(user) {
        localStorage.setItem('userLogged', JSON.stringify(user));
        window.location.href = '../index.html'
    } else {
        alert('Usuário ou senha incorretos');
    }
});
