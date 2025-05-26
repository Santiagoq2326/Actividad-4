// Variables globales
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUserId = null;

// Elementos del DOM
const userForm = document.getElementById('userForm');
const usersTableBody = document.getElementById('usersTableBody');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('form-title');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderUsers();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    userForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);
}

// Manejar envío del formulario
function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;

    if (currentUserId) {
        updateUser(currentUserId, name, email, role);
    } else {
        createUser(name, email, role);
    }

    renderUsers();
    resetForm();
}

// Crear nuevo usuario
function createUser(name, email, role) {
    const newUser = {
        id: Date.now(),
        name,
        email,
        role
    };
    users.push(newUser);
    saveUsers();
}

// Actualizar usuario existente
function updateUser(id, name, email, role) {
    const index = users.findIndex(user => user.id == id);
    if (index !== -1) {
        users[index] = { id, name, email, role };
        saveUsers();
    }
}

// Eliminar usuario
function deleteUser(id) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
        users = users.filter(user => user.id != id);
        saveUsers();
        renderUsers();

        if (currentUserId == id) {
            resetForm();
        }
    }
}

// Mostrar usuarios en la tabla
function renderUsers() {
    usersTableBody.innerHTML = '';

    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        usersTableBody.appendChild(tr);
    });
}

// Editar usuario
function editUser(id) {
    const user = users.find(user => user.id == id);
    if (!user) return;

    currentUserId = user.id;

    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('role').value = user.role;
    document.getElementById('userId').value = user.id;

    formTitle.textContent = 'EDITAR USUARIO';
    submitBtn.textContent = 'Actualizar';
    cancelBtn.style.display = 'block';
}

// Resetear formulario
function resetForm() {
    userForm.reset();
    currentUserId = null;
    document.getElementById('userId').value = '';
    formTitle.textContent = 'REGISTRAR USUARIO';
    submitBtn.textContent = 'Guardar';
    cancelBtn.style.display = 'none';
}

// Guardar usuarios en localStorage
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Hacer funciones disponibles globalmente para los eventos onclick en la tabla
window.editUser = editUser;
window.deleteUser = deleteUser;