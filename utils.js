const getToken = ()=>{
    const result = JSON.parse(localStorage.getItem('token'));
    
    if(result && new Date(result.expireDate) <= new Date()){
        localStorage.removeItem('token');
        window.location.reload();
    }
    if(!result){
        return undefined;
    }
    return result.token;
    
}


export {
    getToken
}