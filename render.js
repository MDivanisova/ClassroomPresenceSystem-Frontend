import { getAllUsers, editUser, removeUser, register } from "./auth.api.js";
import { getClassroom, editClassroom, removeClassroom, createClassroom } from "./classroom.api.js";
import { getToken } from "./utils.js";

const rednerLeftChild = async ()=>{
    document.getElementsByClassName('leftChild')[0].innerHTML = `
        <div class="picture"></div>
        <div class="buttonWraper">
            <button id="logOut">Log out</button>
        </div>
        <div class="menu">
            <ul>
            <li class="selected">Dashboard</li>
            <li >User Panel</li>
            <li >Attendances</li>
            <li >Classrooms</li>
            </ul>
        </div>
    `;

    document.getElementById('logOut').addEventListener('click',()=>{
        localStorage.removeItem('token');
        window.location.reload();
    });

    const ul = document.getElementsByClassName('menu')[0].children[0];
    for(let i=0;i<4;i++){
        ul.children[i].addEventListener('click', async ()=>{
            ul.children[0].className = "";
            ul.children[1].className = "";
            ul.children[2].className = "";
            ul.children[3].className = "";

            ul.children[i].className = "selected";
            if(i==0){
                await rednerRightChild("Dashboard")
            }
            if(i==1){
                await rednerRightChild("User Panel")
            }
            if(i==2){
                await rednerRightChild("Attendances")
            }
            if(i==3){
                await rednerRightChild("Classrooms")
            }
        });
    }
}

const renderDashboard = async () =>{}

const renderUserPanel = async () => {
    const users = await getAllUsers();

    document.getElementsByClassName('rightChild')[0].innerHTML = `
        <div class="container mt-4">
            <div class="row g-3">
                <!-- Add New User Card -->
                <div class="col-md-4">
                    <div class="card shadow-sm h-100 border-dashed" id="addUserCard" style="cursor:pointer; border: 2px dashed #adb5bd;">
                        <div class="card-body d-flex flex-column justify-content-center align-items-center text-muted">
                            <i class="bi bi-plus-circle" style="font-size: 3rem;"></i>
                            <h5 class="mt-2">Add New User</h5>
                        </div>
                    </div>
                </div>

                ${users.users.map(user => `
                    <div class="col-md-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-body">
                                <h5 class="card-title">${user.name} ${user.surname}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">@${user.username}</h6>
                                <hr/>
                                <p class="card-text mb-1">
                                    <i class="bi bi-envelope"></i> ${user.email}
                                </p>
                                <p class="card-text">
                                    <span class="badge bg-primary">${user.role}</span>
                                </p>
                            </div>
                            <div class="card-footer d-flex justify-content-between align-items-center">
                                <span class="text-muted small">ID: ${user._id}</span>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${user._id}">
                                        <i class="bi bi-pencil"></i> Edit
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${user._id}">
                                        <i class="bi bi-trash"></i> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Edit Modal -->
        <div class="modal fade" id="editModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit User</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="editUserId"/>
                        <div class="mb-2">
                            <label class="form-label">Index</label>
                            <input type="text" class="form-control" id="editIndex"/>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Name</label>
                            <input type="text" class="form-control" id="editName"/>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Surname</label>
                            <input type="text" class="form-control" id="editSurname"/>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" id="editEmail"/>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Username</label>
                            <input type="text" class="form-control" id="editUsername"/>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Role</label>
                            <select class="form-select" id="editRole">
                                <option value="Вонреден професор">Вонреден професор</option>
                                <option value="Редовен професор">Редовен професор</option>
                                <option value="Вонреден студент">Вонреден студент</option>
                                <option value="Редовен студент">Редовен студент</option>
                                <option value="Админ">Админ</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="saveEditBtn">Save</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Register Modal -->
        <div class="modal fade" id="registerModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add New User</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-2">
                            <label class="form-label">Index</label>
                            <input type="text" class="form-control" id="registerIndex"/>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Name</label>
                            <input type="text" class="form-control" id="registerName"/>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Surname</label>
                            <input type="text" class="form-control" id="registerSurname"/>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" id="registerEmail"/>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Username</label>
                            <input type="text" class="form-control" id="registerUsername"/>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Password</label>
                            <input type="password" class="form-control" id="registerPassword"/>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Role</label>
                            <select class="form-select" id="registerRole">
                                <option value="Вонреден професор">Вонреден професор</option>
                                <option value="Редовен професор">Редовен професор</option>
                                <option value="Вонреден студент">Вонреден студент</option>
                                <option value="Редовен студент">Редовен студент</option>
                                <option value="Админ">Админ</option>
                            </select>
                        </div>
                        <p class="text-danger mt-2" id="registerError"></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-success" id="saveRegisterBtn">Create</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const editModalEl = document.getElementById('editModal');
    const editModal = new window.bootstrap.Modal(editModalEl);

    const registerModalEl = document.getElementById('registerModal');
    const registerModal = new window.bootstrap.Modal(registerModalEl);

    // Open register modal
    document.getElementById('addUserCard').addEventListener('click', () => {
        document.getElementById('registerIndex').value = '';
        document.getElementById('registerName').value = '';
        document.getElementById('registerSurname').value = '';
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerUsername').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('registerError').innerText = '';
        registerModal.show();
    });

    // Save new user
    document.getElementById('saveRegisterBtn').addEventListener('click', async () => {
        const index = document.getElementById('registerIndex').value;
        const name = document.getElementById('registerName').value;
        const surname = document.getElementById('registerSurname').value;
        const email = document.getElementById('registerEmail').value;
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const role = document.getElementById('registerRole').value;

        const result = await register(index, name, surname, email, username, password, role);
        if (result.status === 200) {
            registerModal.hide();
            await renderUserPanel();
        } else {
            document.getElementById('registerError').innerText =  result.error[0].message || "Failed to create user.";
        }
    });

    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const userID = btn.dataset.id;
            if (!confirm("Are you sure you want to delete this user?")) return;
            const result = await removeUser(userID);
            if (result.status === 200) {
                await renderUserPanel();
            } else {
                alert("Failed to delete user: " + result.msg);
            }
        });
    });

    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const userID = btn.dataset.id;
            const user = users.users.find(u => u._id === userID);
            document.getElementById('editUserId').value = user._id;
            document.getElementById('editIndex').value = user.index || '';
            document.getElementById('editName').value = user.name;
            document.getElementById('editSurname').value = user.surname;
            document.getElementById('editEmail').value = user.email;
            document.getElementById('editUsername').value = user.username;
            document.getElementById('editRole').value = user.role;
            editModal.show();
        });
    });

    // Save edit
    document.getElementById('saveEditBtn').addEventListener('click', async () => {
        const userID = document.getElementById('editUserId').value;
        const index = document.getElementById('editIndex').value;
        const name = document.getElementById('editName').value;
        const surname = document.getElementById('editSurname').value;
        const email = document.getElementById('editEmail').value;
        const username = document.getElementById('editUsername').value;
        const role = document.getElementById('editRole').value;

        const result = await editUser(userID, index, name, surname, email, username, role);
        if (result.status === 200) {
            editModal.hide();
            await renderUserPanel();
        } else {
            alert("Failed to update user: " + result.error[0].message);
        }
    });
};

const renderAttandances = async () =>{}

const renderClassrooms = async () => {
    const classrooms = await getClassroom();
    document.getElementsByClassName('rightChild')[0].innerHTML = `
        <div class="container mt-4">
            <div class="row g-3">
                <!-- Add New Classroom Card -->
                <div class="col-md-4">
                    <div class="card shadow-sm h-100" id="addClassroomCard" style="cursor:pointer; border: 2px dashed #adb5bd;">
                        <div class="card-body d-flex flex-column justify-content-center align-items-center text-muted">
                            <i class="bi bi-plus-circle" style="font-size: 3rem;"></i>
                            <h5 class="mt-2">Add New Classroom</h5>
                        </div>
                    </div>
                </div>

                ${classrooms.classrooms.map(classroom => `
                    <div class="col-md-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-body">
                                <h5 class="card-title">Room ${classroom.roomNumber}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">Floor ${classroom.floor}</h6>
                                <hr/>
                                <p class="card-text mb-1">
                                    <i class="bi bi-building"></i> ${classroom.campus}
                                </p>
                                <p class="card-text">
                                    <span class="badge bg-secondary">${classroom.type}</span>
                                </p>
                            </div>
                            <div class="card-footer d-flex justify-content-between align-items-center">
                                <span class="text-muted small">ID: ${classroom._id}</span>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-sm btn-outline-primary edit-classroom-btn" data-id="${classroom._id}">
                                        <i class="bi bi-pencil"></i> Edit
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger delete-classroom-btn" data-id="${classroom._id}">
                                        <i class="bi bi-trash"></i> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Edit Classroom Modal -->
        <div class="modal fade" id="editClassroomModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Classroom</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="editClassroomId"/>
                        <div class="mb-2">
                            <label class="form-label">Room Number</label>
                            <input type="number" class="form-control" id="editRoomNumber"/>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Floor</label>
                            <input type="number" class="form-control" id="editFloor"/>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Campus</label>
                            <input type="number" class="form-control" id="editCampus"/>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Faculty</label>
                            <input type="text" class="form-control" id="editFaculty"/>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Type</label>
                            <select class="form-select" id="editClassroomType">
                                <option value="Лабораторија">Лабораторија</option>
                                <option value="Предавална">Предавална</option>
                                <option value="Амфитеатар">Амфитеатар</option>
                            </select>
                        </div>
                        <p class="text-danger mt-2" id="editClassroomError"></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="saveEditClassroomBtn">Save</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create Classroom Modal -->
        <div class="modal fade" id="createClassroomModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Classroom</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-2">
                            <label class="form-label">Room Number</label>
                            <input type="number" class="form-control" id="createRoomNumber"/>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Floor</label>
                            <input type="number" class="form-control" id="createFloor"/>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Campus</label>
                            <input type="number" class="form-control" id="createCampus"/>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Type</label>
                            <select class="form-select" id="createClassroomType">
                                <option value="Лабораторија">Лабораторија</option>
                                <option value="Предавална">Предавална</option>
                                <option value="Амфитеатар">Амфитеатар</option>
                            </select>
                        </div>
                        <p class="text-danger mt-2" id="createClassroomError"></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-success" id="saveCreateClassroomBtn">Create</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const editClassroomModal = new window.bootstrap.Modal(document.getElementById('editClassroomModal'));
    const createClassroomModal = new window.bootstrap.Modal(document.getElementById('createClassroomModal'));

    // Open create modal
    document.getElementById('addClassroomCard').addEventListener('click', () => {
        document.getElementById('createRoomNumber').value = '';
        document.getElementById('createFloor').value = '';
        document.getElementById('createCampus').value = '';
        document.getElementById('createClassroomError').innerText = '';
        createClassroomModal.show();
    });

    // Save new classroom
    document.getElementById('saveCreateClassroomBtn').addEventListener('click', async () => {
        const roomNumber = Number(document.getElementById('createRoomNumber').value);
        const floor = Number(document.getElementById('createFloor').value);
        const campus = Number(document.getElementById('createCampus').value);
        const type = document.getElementById('createClassroomType').value;

        const result = await createClassroom(roomNumber, floor, campus, type);
        if (result.status === 200) {
            createClassroomModal.hide();
            await renderClassrooms();
        } else {
            document.getElementById('createClassroomError').innerText = result.error[0].message || "Failed to create classroom.";
        }
    });

    // Delete buttons
    document.querySelectorAll('.delete-classroom-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const classroomID = btn.dataset.id;
            if (!confirm("Are you sure you want to delete this classroom?")) return;
            const result = await removeClassroom(classroomID);
            if (result.status === 200) {
                await renderClassrooms();
            } else {
                alert("Failed to delete classroom: " + result.msg);
            }
        });
    });

    // Edit buttons
    document.querySelectorAll('.edit-classroom-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const classroomID = btn.dataset.id;
            const classroom = classrooms.classrooms.find(c => c._id === classroomID);
            document.getElementById('editClassroomId').value = classroom._id;
            document.getElementById('editRoomNumber').value = classroom.roomNumber;
            document.getElementById('editFloor').value = classroom.floor;
            document.getElementById('editCampus').value = classroom.campus;
            document.getElementById('editFaculty').value = classroom.faculty || '';
            document.getElementById('editClassroomType').value = classroom.type;
            document.getElementById('editClassroomError').innerText = '';
            editClassroomModal.show();
        });
    });

    // Save edit
    document.getElementById('saveEditClassroomBtn').addEventListener('click', async () => {
        const classroomID = document.getElementById('editClassroomId').value;
        const roomNumber = Number(document.getElementById('editRoomNumber').value);
        const floor = Number(document.getElementById('editFloor').value);
        const campus = Number(document.getElementById('editCampus').value);
        const faculty = document.getElementById('editFaculty').value;
        const type = document.getElementById('editClassroomType').value;

        const result = await editClassroom(classroomID, roomNumber, floor, campus, faculty, type);
        if (result.status === 200) {
            editClassroomModal.hide();
            await renderClassrooms();
        } else {
            document.getElementById('editClassroomError').innerText = result.error[0].message || "Failed to update classroom.";
        }
    });
};

const renderLogin = () => {
    document.getElementsByClassName('rightChild')[0].innerHTML = `
        <div id="loginError"></div>
            <form>
                <label>LOGIN:</label>
                <label>username</label>
                <input id="username" type="text">
                <label>password</label>
                <input id="password" type="password">
                <button type="button" id="loginButton">Login</button>
            </form>
    `;
}


const rednerRightChild = async (page)=>{
    if(page === "Dashboard"){
        document.getElementsByClassName('rightChild')[0].innerHTML = "Dashboard";
    }
    if(page === "User Panel"){
        await renderUserPanel();    
        
    }
    if(page === "Attendances"){
    document.getElementsByClassName('rightChild')[0].innerHTML = "Attandances";
        
    }
    if(page === "Classrooms"){
        await renderClassrooms();
    }
}

const renderContent = async () => {
    const token = getToken();
    if(token){
        await rednerLeftChild();
        await rednerRightChild("Dashboard");
    }
    else{
        renderLogin();
    }
}


export{
    renderContent
}