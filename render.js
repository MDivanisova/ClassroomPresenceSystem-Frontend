import { getAllUsers, editUser, removeUser, register } from "./auth.api.js";
import { getClassroom, editClassroom, removeClassroom, createClassroom } from "./classroom.api.js";
import { getAttendance, endAttendance, removeAttendance, createAttendance } from "./attendance.api.js";
import { getToken } from "./utils.js";

const rednerLeftChild = async ()=>{
    document.getElementsByClassName('leftChild')[0].innerHTML = `
        <div class="picture"></div>
        <label class ="welcome">Welcome</label>
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

const renderDashboard = async () => {
    // Show skeleton immediately
    document.getElementsByClassName('rightChild')[0].innerHTML = `
        <div class="container-fluid p-4" style="min-height:100vh;">

            <!-- Stat Cards -->
            <div class="row g-3 mb-4">
                <div class="col-md-4">
                    <div class="p-4 rounded-3 text-center shadow-sm" style="background:#fff; border:1px solid #e0e0e0;">
                        <div id="todayCount" style="font-size:2.5rem; font-weight:700; color:rgb(70, 119, 160)">...</div>
                        <div style="color:rgb(70, 119, 160); margin-top:6px;">📅 Attendances Today</div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="p-4 rounded-3 text-center shadow-sm" style="background:#fff; border:1px solid #e0e0e0;">
                        <div id="weekCount" style="font-size:2.5rem; font-weight:700; color:#43b89c;">...</div>
                        <div style="color:#888; margin-top:6px;">📆 Attendances This Week</div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="p-4 rounded-3 text-center shadow-sm" style="background:#fff; border:1px solid #e0e0e0;">
                        <div id="monthCount" style="font-size:2.5rem; font-weight:700; color:#ff6b6b;">...</div>
                        <div style="color:#888; margin-top:6px;">🗓️ Attendances This Month</div>
                    </div>
                </div>
            </div>

            <!-- Charts -->
            <div class="row g-3">
                <div class="col-md-4">
                    <div class="p-3 rounded-3 shadow-sm" style="background:#fff; border:1px solid #e0e0e0;">
                        <h6 class="mb-3 text-center text-muted">Top 5 Professors by Attendances</h6>
                        <div id="barChartWrapper" class="d-flex justify-content-center align-items-center" style="min-height:200px;">
                            <div class="spinner-border text-secondary" role="status"></div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="p-3 rounded-3 shadow-sm" style="background:#fff; border:1px solid #e0e0e0;">
                        <h6 class="mb-3 text-center text-muted">Participants by Classroom Type</h6>
                        <div id="pieChartWrapper" class="d-flex justify-content-center align-items-center" style="min-height:200px;">
                            <div class="spinner-border text-secondary" role="status"></div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="p-3 rounded-3 shadow-sm" style="background:#fff; border:1px solid #e0e0e0;">
                        <h6 class="mb-3 text-center text-muted">Arrival vs Start Time (minutes late)</h6>
                        <div id="scatterChartWrapper" class="d-flex justify-content-center align-items-center" style="min-height:200px;">
                            <div class="spinner-border text-secondary" role="status"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row g-3">
            
        </div>
    `;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const weekAgo = new Date(); weekAgo.setDate(today.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    const monthAgo = new Date(); monthAgo.setMonth(today.getMonth() - 1);
    const monthAgoStr = monthAgo.toISOString().split('T')[0];

    // Load stat cards independently
    getAttendance(1, 1, { date: todayStr }).then(data => {
        document.getElementById('todayCount').innerText = data.pagination?.numAttendance ?? 0;
    });
    getAttendance(1, 1, { date: weekAgoStr }).then(data => {
        document.getElementById('weekCount').innerText = data.pagination?.numAttendance ?? 0;
    });
    getAttendance(1, 1, { date: monthAgoStr }).then(data => {
        document.getElementById('monthCount').innerText = data.pagination?.numAttendance ?? 0;
    });

    // Load charts independently one by one
    getAttendance(1, 500, {}).then(allData => {
        const allAttendances = allData.attendances ?? [];

        // Pie chart
        const typeMap = { 'Предавална': 0, 'Амфитеатар': 0, 'Лабараторија': 0 };
        allAttendances.forEach(a => {
            const type = a.classroom?.type;
            if (type && typeMap[type] !== undefined) {
                typeMap[type] += a.participants?.length ?? 0;
            }
        });
        document.getElementById('pieChartWrapper').innerHTML = `<canvas id="pieChart"></canvas>`;
        new Chart(document.getElementById('pieChart'), {
            type: 'pie',
            data: {
                labels: Object.keys(typeMap),
                datasets: [{
                    data: Object.values(typeMap),
                    backgroundColor: ['rgb(70, 119, 160)', '#43b89c', '#ff6b6b'],
                    borderWidth: 2,
                }]
            },
            options: {
                plugins: { legend: { labels: { color: '#555' } } }
            }
        });

        // Bar chart
        const profMap = {};
        allAttendances.forEach(a => {
            if (a.organizer) {
                const key = `${a.organizer.name} ${a.organizer.surname}`;
                profMap[key] = (profMap[key] || 0) + 1;
            }
        });
        const top5Profs = Object.entries(profMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
        document.getElementById('barChartWrapper').innerHTML = `<canvas id="barChart"></canvas>`;
        new Chart(document.getElementById('barChart'), {
            type: 'bar',
            data: {
                labels: top5Profs.map(p => p[0]),
                datasets: [{
                    label: 'Attendances Created',
                    data: top5Profs.map(p => p[1]),
                    backgroundColor: 'rgb(70, 119, 160)',
                    borderRadius: 6,
                }]
            },
            options: {
                plugins: { legend: { labels: { color: '#555' } } },
                scales: {
                    x: { ticks: { color: '#555' }, grid: { color: '#eee' } },
                    y: { ticks: { color: '#555', stepSize: 1 }, grid: { color: '#eee' } }
                }
            }
        });

        // Scatter chart
        const scatterPoints = [];
        allAttendances.forEach(a => {
            if (!a.startOn) return;
            const startOn = new Date(a.startOn);
            (a.participants ?? []).forEach(p => {
                if (p.enterIn) {
                    const diffMinutes = Math.round((new Date(p.enterIn) - startOn) / 60000);
                    const name = p.attendee ? `${p.attendee.name} ${p.attendee.surname}` : 'N/A';
                    scatterPoints.push({ x: diffMinutes, label: name });
                }
            });
        });
        document.getElementById('scatterChartWrapper').innerHTML = `<canvas id="scatterChart"></canvas>`;
        new Chart(document.getElementById('scatterChart'), {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Minutes late',
                    data: scatterPoints.map((p, i) => ({ x: i, y: p.x })),
                    backgroundColor: scatterPoints.map(p => p.x > 0 ? '#ff6b6b' : '#43b89c'),
                    pointRadius: 5,
                }]
            },
            options: {
                plugins: {
                    legend: { labels: { color: '#555' } },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => {
                                const p = scatterPoints[ctx.dataIndex];
                                return `${p.label}: ${p.x > 0 ? '+' : ''}${p.x} min`;
                            }
                        }
                    }
                },
                scales: {
                    x: { display: false },
                    y: {
                        ticks: { color: '#555', callback: v => `${v} min` },
                        grid: { color: '#eee' },
                        title: { display: true, text: 'Minutes late', color: '#888' }
                    }
                }
            }
        });
    });
};

const renderUserPanel = async () => {

    document.getElementsByClassName('rightChild')[0].innerHTML = `
        <div class="d-flex justify-content-center align-items-center" style="min-height:100vh;">
            <div class="spinner-border text-primary" role="status" style="width:3rem; height:3rem;"></div>
        </div>
    `;

    const users = await getAllUsers();

    document.getElementsByClassName('rightChild')[0].innerHTML = `
        <div class="container-fluid p-4" style="min-height:100vh;">
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

const renderAttendances = async (page = 1, filters = {}) => {
    // Show spinner immediately
    document.getElementsByClassName('rightChild')[0].innerHTML = `
        <div class="d-flex justify-content-center align-items-center" style="min-height:100vh;">
            <div class="spinner-border text-primary" role="status" style="width:3rem; height:3rem;"></div>
        </div>
    `;

    const response = await getAttendance(page, 6, filters);
    const attendances = response.attendances;
    const { totalPages, pageNumber, numAttendance, pageSize } = response.pagination;

    document.getElementsByClassName('rightChild')[0].innerHTML = `
        <div class="container-fluid p-4" style="min-height:100vh;">

            <!-- Filters -->
            <div class="card mb-4 shadow-sm">
                <div class="card-body">
                    <div class="row g-3 align-items-end">
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">Teacher Name</label>
                            <input type="text" class="form-control" id="filterTeacher" placeholder="Search by teacher..." value="${filters.teacher || ''}"/>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">Classroom Type</label>
                            <div class="d-flex gap-3 flex-wrap mt-1">
                                ${['Лабараторија', 'Амфитеатар', 'Предавална'].map(type => `
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="classroomType" 
                                            id="type_${type}" value="${type}"
                                            ${filters.classroomType === type ? 'checked' : ''}/>
                                        <label class="form-check-label" for="type_${type}">${type}</label>
                                    </div>
                                `).join('')}
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="classroomType" 
                                        id="type_all" value=""
                                        ${!filters.classroomType ? 'checked' : ''}/>
                                    <label class="form-check-label" for="type_all">All</label>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label fw-semibold">Date</label>
                            <input type="date" class="form-control" id="filterDate" value="${filters.date || ''}"/>
                        </div>
                        <div class="col-md-1 d-flex gap-2">
                            <button class="btn btn-primary w-100" id="applyFiltersBtn">
                                <i class="bi bi-search"></i>
                            </button>
                            <button class="btn btn-outline-secondary w-100" id="clearFiltersBtn">
                                <i class="bi bi-x-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-3">
                ${attendances.map(attendance => `
                    <div class="col-md-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-body">
                                <h5 class="card-title">${attendance.title}</h5>
                                <hr/>
                                <p class="card-text mb-1">
                                    <i class="bi bi-calendar-check"></i>
                                    <strong>Start:</strong> ${attendance.startOn ? new Date(attendance.startOn).toLocaleString() : 'N/A'}
                                </p>
                                <p class="card-text mb-1">
                                    <i class="bi bi-calendar-x"></i>
                                    <strong>End:</strong> ${attendance.endOn ? new Date(attendance.endOn).toLocaleString() : 'Ongoing'}
                                </p>
                                <p class="card-text mb-1">
                                    <i class="bi bi-person"></i>
                                    <strong>Organizer:</strong> ${attendance.organizer ? `${attendance.organizer.name} ${attendance.organizer.surname} (${attendance.organizer.email})` : 'N/A'}
                                </p>
                                <p class="card-text mb-1">
                                    <i class="bi bi-door-open"></i>
                                    <strong>Classroom:</strong> ${attendance.classroom ? `${attendance.classroom.type} - ${attendance.classroom.roomNumber}` : 'N/A'}
                                </p>
                                <p class="card-text">
                                    <span class="badge ${attendance.endOn ? 'bg-secondary' : 'bg-success'}">
                                        ${attendance.endOn ? 'Ended' : 'Active'}
                                    </span>
                                    <span class="badge bg-info text-dark">
                                        ${attendance.participants ? attendance.participants.length : 0} participants
                                    </span>
                                </p>
                            </div>
                            <div class="card-footer d-flex justify-content-between align-items-center">
                                <span class="text-muted small">ID: ${attendance._id}</span>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-sm btn-outline-info view-attendance-btn" data-id="${attendance._id}">
                                        <i class="bi bi-eye"></i> View
                                    </button>
                                    ${!attendance.endOn ? `
                                    <button class="btn btn-sm btn-outline-warning end-attendance-btn" data-id="${attendance._id}">
                                        <i class="bi bi-stop-circle"></i> End
                                    </button>` : ''}
                                    <button class="btn btn-sm btn-outline-danger delete-attendance-btn" data-id="${attendance._id}">
                                        <i class="bi bi-trash"></i> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Pagination -->
            <div class="d-flex justify-content-between align-items-center mt-4 mb-4">
                <span class="text-muted small">
                    Showing page ${pageNumber} of ${totalPages} (${numAttendance} total)
                </span>
                <nav>
                    <ul class="pagination mb-0">
                        <li class="page-item ${pageNumber <= 1 ? 'disabled' : ''}">
                            <button class="page-link" id="prevPageBtn">
                                <i class="bi bi-chevron-left"></i> Prev
                            </button>
                        </li>
                        ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `
                            <li class="page-item ${p === pageNumber ? 'active' : ''}">
                                <button class="page-link page-num-btn" data-page="${p}">${p}</button>
                            </li>
                        `).join('')}
                        <li class="page-item ${pageNumber >= totalPages ? 'disabled' : ''}">
                            <button class="page-link" id="nextPageBtn">
                                Next <i class="bi bi-chevron-right"></i>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <!-- View Participants Modal -->
        <div class="modal fade" id="viewParticipantsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Participants</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div id="participantsList"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const viewParticipantsModal = new window.bootstrap.Modal(document.getElementById('viewParticipantsModal'));

    // Filters
    document.getElementById('applyFiltersBtn').addEventListener('click', () => {
        const teacher = document.getElementById('filterTeacher').value.trim();
        const classroomType = document.querySelector('input[name="classroomType"]:checked')?.value || '';
        const date = document.getElementById('filterDate').value;
        renderAttendances(1, { teacher, classroomType, date });
    });

    // Clear filters
    document.getElementById('clearFiltersBtn').addEventListener('click', () => {
        renderAttendances(1, {});
    });

    // Pagination
    if (pageNumber > 1) {
        document.getElementById('prevPageBtn').addEventListener('click', () => renderAttendances(pageNumber - 1, filters));
    }
    if (pageNumber < totalPages) {
        document.getElementById('nextPageBtn').addEventListener('click', () => renderAttendances(pageNumber + 1, filters));
    }
    document.querySelectorAll('.page-num-btn').forEach(btn => {
        btn.addEventListener('click', () => renderAttendances(Number(btn.dataset.page), filters));
    });

    // View participants
    document.querySelectorAll('.view-attendance-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const attendanceID = btn.dataset.id;
            const attendance = attendances.find(a => a._id === attendanceID);
            const participants = attendance.participants || [];
            document.getElementById('participantsList').innerHTML = participants.length === 0
                ? `<p class="text-muted">No participants yet.</p>`
                : `<table class="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Index</th>
                                <th>Entered At</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${participants.map((p, i) => `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td>${p.attendee ? `${p.attendee.name} ${p.attendee.surname}` : 'N/A'}</td>
                                    <td>${p.attendee ? p.attendee.email : 'N/A'}</td>
                                    <td>${p.attendee ? p.attendee.index : 'N/A'}</td>
                                    <td>${p.enterIn ? new Date(p.enterIn).toLocaleString() : 'N/A'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>`;
            viewParticipantsModal.show();
        });
    });

    // End attendance
    document.querySelectorAll('.end-attendance-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const attendanceID = btn.dataset.id;
            if (!confirm("Are you sure you want to end this attendance?")) return;
            const result = await endAttendance(attendanceID);
            if (result.status === 200) {
                await renderAttendances(pageNumber, filters);
            } else {
                alert("Failed to end attendance: " + result.msg);
            }
        });
    });

    // Delete attendance
    document.querySelectorAll('.delete-attendance-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const attendanceID = btn.dataset.id;
            if (!confirm("Are you sure you want to delete this attendance?")) return;
            const result = await removeAttendance(attendanceID);
            if (result.status === 200) {
                await renderAttendances(pageNumber, filters);
            } else {
                alert("Failed to delete attendance: " + result.msg);
            }
        });
    });
};

const renderClassrooms = async () => {

    document.getElementsByClassName('rightChild')[0].innerHTML = `
        <div class="d-flex justify-content-center align-items-center" style="min-height:100vh;">
            <div class="spinner-border text-primary" role="status" style="width:3rem; height:3rem;"></div>
        </div>
    `;

    const classrooms = await getClassroom();
    document.getElementsByClassName('rightChild')[0].innerHTML = `
        <div class="container-fluid p-4" style="min-height:100vh;">
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
                                <h5 class="card-title">Room number: ${classroom.roomNumber}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">Floor ${classroom.floor}</h6>
                                <hr/>
                                <p class="card-text mb-1">
                                    <i class="bi bi-building"></i>Campus ${classroom.campus}
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
        <form>
            <label>LOGIN:</label>
            <label>username</label>
            <input id="username" type="text">
            <label>password</label>
            <input id="password" type="password">
            <button type="button" id="loginButton">Login</button>
            <div id="loginError"></div>
    </form>
    `;
}

const rednerRightChild = async (page)=>{
    if(page === "Dashboard"){
        await renderDashboard();
    }
    if(page === "User Panel"){
        await renderUserPanel();    
        
    }
    if(page === "Attendances"){
        await renderAttendances();
        
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