import { getToken } from "./utils.js";
const BACKEND_BASE_PATH = "https://classroom-presence-system-backend.vercel.app/api/au";

 
 const login = async(username, password)=>{
    
    const respons = await fetch(`${BACKEND_BASE_PATH}/login`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username, 
            password: password
        })
    });

    let data = await respons.json();
    data.status = respons.status;

    return data;
 };

 const register = async(index, name, surname, email, username, password, role)=>{
    
    const token = JSON.parse(localStorage.getItem("token")).token;

    const respons = await fetch(`${BACKEND_BASE_PATH}/register`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            index: index, 
            name: name, 
            surname: surname, 
            email: email, 
            username: username, 
            password: password, 
            role: role
        })
    });
    
    let data = await respons.json();
    data.status = respons.status;

    return data;
 };

    const getAllUsers = async ()=>{
        
        const token = getToken();

        const respons = await fetch(`${BACKEND_BASE_PATH}/getAllUsers`,{
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        let data = await respons.json();
        data.status = respons.status;

        return data;
    };

    const removeUser = async(userID)=>{

        const token = getToken();

        const respons = await fetch(`${BACKEND_BASE_PATH}/removeUser`,{
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                userID: userID
            })
        });

        let data = await respons.json();
        data.status = respons.status;

        return data;
    }

    const editUser = async(userID, index, name, surname, email, username, role)=>{

        const token = getToken();

        const respons = await fetch(`${BACKEND_BASE_PATH}/editUser`,{
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                userID: userID,
                index: index, 
                name: name, 
                surname: surname, 
                email: email, 
                username: username,
                role: role
            })
        });
        let data = await respons.json();
        data.status= respons.status;

        return data;
    }

 export {
    login, 
    register, 
    getAllUsers,
    removeUser,
    editUser
 }