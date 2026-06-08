const BACKEND_BASE_PATH = "https://classroom-presence-system-backend.vercel.app/api/c";
import { getToken } from "./utils.js";
const getClassroom = async()=>{

    const token = getToken();

    const respons = await fetch(`${BACKEND_BASE_PATH}/classroom`,{
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

const removeClassroom = async(classroomID)=>{

    const token = getToken();

        const respons = await fetch(`${BACKEND_BASE_PATH}/removeClassroom`,{
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                classroomID: classroomID
            })
        });

        let data = await respons.json();
        data.status = respons.status;

        return data;
};

const editClassroom = async(classroomID, roomNumber, floor, campus, faculty, type)=>{

    const token = getToken();
        const respons = await fetch(`${BACKEND_BASE_PATH}/editClassroom`,{
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                classroomID: classroomID,
                roomNumber: roomNumber, 
                floor: floor, 
                campus: campus, 
                faculty: faculty, 
                type: type
            })
        });
        let data = await respons.json();
        data.status= respons.status;

        return data;
}

const createClassroom = async(roomNumber, floor, campus, type)=>{

    const token = getToken();

    const respons = await fetch(`${BACKEND_BASE_PATH}/classroom`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            roomNumber: roomNumber, 
            floor: floor, 
            campus: campus, 
            type: type
        })
    });
    
    let data = await respons.json();
    data.status = respons.status;

    return data;
}

export {
    createClassroom,
    editClassroom,
    removeClassroom, 
    getClassroom
}