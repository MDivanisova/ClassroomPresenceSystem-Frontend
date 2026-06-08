const BACKEND_BASE_PATH = "https://classroom-presence-system-backend.vercel.app/api/at";
import { getToken } from "./utils.js";

const createAttendance = async(classroomID, title)=>{

        const token = getToken();


    const respons = await fetch(`${BACKEND_BASE_PATH}/createAttandance`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            classroomID: classroomID,
            title: title
        })
    });
    
    let data = await respons.json();
    data.status = respons.status;

    return data;
};

const getAttendance = async()=>{

    const token = getToken();


    const respons = await fetch(`${BACKEND_BASE_PATH}/attendance`,{
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

const removeAttendance = async(attendanceID)=>{

    const token = getToken();

    const respons = await fetch(`${BACKEND_BASE_PATH}/removeAttendance`,{
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            attendanceID: attendanceID
        })
    });
    let data = await respons.json();
    data.status = respons.status;

    return data;
};

const endAttendance = async(attendanceID)=>{

    const token = getToken(); 

    const respons = await fetch(`${BACKEND_BASE_PATH}/endAttandance`,{
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            attendanceID: attendanceID
        })
    });
    let data = await respons.json();
    data.status= respons.status;

    return data;
};

export {
    createAttendance,
    getAttendance,
    removeAttendance,
    endAttendance
}