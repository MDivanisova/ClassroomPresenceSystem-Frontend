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

const getAttendance = async(pageNumber = 1, pageSize = 6, filters = {})=>{
    const token = getToken();
    const params = new URLSearchParams({
        pageSize,
        pageNumber,
        ...(filters.teacher && { teacher: filters.teacher }),
        ...(filters.classroomType && { classroom: filters.classroomType }),
        ...(filters.date && { date: filters.date }),
    });
    const respons = await fetch(`${BACKEND_BASE_PATH}/attendance?${params}`,{
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