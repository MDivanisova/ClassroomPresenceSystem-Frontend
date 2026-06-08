import { getToken } from "./utils.js";

const BACKEND_BASE_PATH = "https://classroom-presence-system-backend.vercel.app/api/a";

const removeAttendee = async(attendeesID)=>{

    const token = getToken();

    const respons = await fetch(`${BACKEND_BASE_PATH}/deleteAttendees`,{
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            attendeesID: attendeesID
        })
    });

    let data = await respons.json();
    data.status = respons.status;

    return data;
};

const getAttendees = async()=>{
     
    const token = getToken();


    const respons = await fetch(`${BACKEND_BASE_PATH}/getAttendees`,{
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

const createAttendees = async(attendee, attendance, enterIn)=>{

    const token = getToken();


    const respons = await fetch(`${BACKEND_BASE_PATH}/attendees`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            attendee: attendee,
            attendance: attendance,
            enterIn: enterIn
        })
    });
    
    let data = await respons.json();
    data.status = respons.status;

    return data;
};

const editAttendees = async(attendeesID, attendee, attendance, enterIn)=>{

    const token = getToken();


    const respons = await fetch(`${BACKEND_BASE_PATH}/editAttendees`,{
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            attendeesID: attendeesID,
            attendee: attendee,
            attendance: attendance,
            enterIn: enterIn
        })
    });
    let data = await respons.json();
    data.status= respons.status;

    return data;
};

export{
    removeAttendee,
    getAttendees,
    createAttendees,
    editAttendees
}
