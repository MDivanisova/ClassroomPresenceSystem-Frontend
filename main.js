import { login, getAllUsers } from "./auth.api.js";
import { renderContent } from "./render.js";

await renderContent();

if(document.getElementById("loginButton")){
    document.getElementById("loginButton").addEventListener("click",async ()=>{
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const result = await login(username, password);
        if(result.status !== 200){
            document.getElementById('loginError').innerText = result.msg;
        }
        else{
            const twoHours = 60 * 60 * 2 * 1000;
            const expireDate = new Date(Date.now() + twoHours);
            localStorage.setItem("token", JSON.stringify(
                {
                    token: result.token,
                    expireDate: expireDate
                }
            )
            );
            const users = await getAllUsers();
            
            if(users.users){
                await renderContent();
            }
            else{
                document.getElementById('loginError').innerText = users.msg;
                localStorage.removeItem('token');
            }
        }
    })
}