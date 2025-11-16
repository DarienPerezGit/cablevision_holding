// ===== SISTEMA DE AUTENTICACIÓN CABLEVISIÓN HOLDING =====
// auth.js - INTEGRADO CON BACKEND SPRING BOOT

// ===== AUTENTICACIÓN CON BACKEND =====
class AuthService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api';
        this.token = localStorage.getItem('authToken');
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    }

    async login(username, password) {
        try {
            // Para el demo, usar autenticación básica simulada
            // hasta que el backend tenga endpoint de login
            const response = await this.authenticateWithBackend(username, password);
            
            if (response.success) {
                this.token = response.token || 'demo-token';
                this.currentUser = response.user;
                
                localStorage.setItem('authToken', this.token);
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                
                return {
                    success: true,
                    user: this.currentUser,
                    redirectUrl: this.getRedirectUrl(this.currentUser.role)
                };
            }
            
            throw new Error(response.message || 'Credenciales inválidas');
            
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    async authenticateWithBackend(username, password) {
        try {
            // Llamada real al backend
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error de autenticación');
            }
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error('Error al autenticar con backend:', error);
            
            // Fallback a usuarios de prueba si el backend no está disponible
            const demoUsers = [
                {
                    id: 1,
                    username: 'admin',
                    password: 'admin123',
                    role: 'admin',
                    nombre: 'Administrador Principal',
                    email: 'admin@cablevision.com'
                },
                {
                    id: 2,
                    username: 'vendedor1', 
                    password: 'vend123',
                    role: 'vendedor',
                    nombre: 'Carlos Rodríguez',
                    email: 'carlos.rodriguez@cablevision.com'
                },
                {
                    id: 3,
                    username: 'vendedor2',
                    password: 'vend123',
                    role: 'vendedor',
                    nombre: 'María González',
                    email: 'maria.gonzalez@cablevision.com'
                },
                {
                    id: 4,
                    username: 'asesor1',
                    password: 'ases123', 
                    role: 'asesor',
                    nombre: 'Dr. Roberto Silva',
                    email: 'roberto.silva@cablevision.com'
                },
                {
                    id: 5,
                    username: 'asesor2',
                    password: 'ases123', 
                    role: 'asesor',
                    nombre: 'Lic. Patricia López',
                    email: 'patricia.lopez@cablevision.com'
                }
            ];

            // Simular autenticación como fallback
            const user = demoUsers.find(u => u.username === username && u.password === password);
            
            if (user) {
                return {
                    success: true,
                    user: {
                        id: user.id,
                        username: user.username,
                        role: user.role,
                        nombre: user.nombre,
                        email: user.email
                    },
                    token: 'demo-token-' + user.id
                };
            } else {
                throw new Error('Credenciales inválidas');
            }
        }
    }
    
    getRedirectUrl(role) {
        switch (role) {
            case 'admin':
                return 'dashboard-admin.html';
            case 'vendedor':
                return 'dashboard-vendedor.html';
            case 'asesor':
                return 'dashboard-asesor.html';
            default:
                return 'index.html';
        }
    }
    
    logout() {
        this.token = null;
        this.currentUser = {};
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        sessionStorage.clear();
        window.location.href = 'index.html';
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return !!this.token && !!this.currentUser.id;
    }
}

// Crear instancia global del servicio de autenticación
window.AuthService = new AuthService();

// ===== INICIALIZACIÓN DEL SISTEMA DE AUTENTICACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Inicializando sistema de autenticación...');
    
    // Verificar si estamos en la página de login
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        inicializarLogin();
    } else {
        // Verificar autenticación en otras páginas
        verificarAutenticacion();
    }
});

// ===== FUNCIONES DE LOGIN =====
function inicializarLogin() {
    console.log('🔑 Inicializando página de login...');
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
        console.log('✅ Formulario de login configurado');
    }
}

async function handleLoginSubmit(event) {
    event.preventDefault();
    
    const username = document.getElementById('username')?.value;
    const password = document.getElementById('password')?.value;
    
    if (!username || !password) {
        mostrarError('Por favor, ingrese usuario y contraseña');
        return;
    }
    
    mostrarCargando(true);
    
    try {
        const resultado = await window.AuthService.login(username, password);
        
        if (resultado.success) {
            mostrarExito(`¡Bienvenido/a ${resultado.user.nombre}!`);
            setTimeout(() => {
                window.location.href = resultado.redirectUrl;
            }, 1500);
        }
    } catch (error) {
        console.error('Error en login:', error);
        mostrarError(error.message || 'Error de autenticación');
    } finally {
        mostrarCargando(false);
    }
}

// ===== FUNCIONES DE VERIFICACIÓN =====
function verificarAutenticacion() {
    const usuario = window.AuthService.getCurrentUser();
    
    if (!window.AuthService.isAuthenticated()) {
        console.log('❌ Usuario no autenticado, redirigiendo al login');
        window.location.href = 'index.html';
        return false;
    }
    
    console.log('✅ Usuario autenticado:', usuario.username, '- Rol:', usuario.role);
    return true;
}

// ===== FUNCIONES DE UI =====
function mostrarCargando(mostrar) {
    const loadingElement = document.getElementById('loadingIndicator');
    const submitButton = document.querySelector('#loginForm button[type="submit"]');
    
    if (loadingElement) {
        loadingElement.style.display = mostrar ? 'block' : 'none';
    }
    
    if (submitButton) {
        submitButton.disabled = mostrar;
        submitButton.textContent = mostrar ? 'Iniciando sesión...' : 'Iniciar Sesión';
    }
}

function mostrarError(mensaje) {
    mostrarMensaje(mensaje, 'error');
}

function mostrarExito(mensaje) {
    mostrarMensaje(mensaje, 'success');
}

function mostrarMensaje(mensaje, tipo) {
    const alertContainer = document.getElementById('alertContainer');
    
    if (alertContainer) {
        const alertClass = tipo === 'error' ? 'alert-danger' : 'alert-success';
        alertContainer.innerHTML = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 5000);
    } else {
        // Fallback a alert nativo
        alert(mensaje);
    }
}

// ===== FUNCIONES LEGACY DE COMPATIBILIDAD =====
function obtenerUsuarioActual() {
    return window.AuthService.getCurrentUser();
}

function esAdmin() {
    const usuario = obtenerUsuarioActual();
    return usuario && usuario.role === 'admin';
}

function esVendedor() {
    const usuario = obtenerUsuarioActual();
    return usuario && usuario.role === 'vendedor';
}

function esAsesor() {
    const usuario = obtenerUsuarioActual();
    return usuario && usuario.role === 'asesor';
}

// Funciones globales para compatibilidad
window.obtenerUsuarioActual = obtenerUsuarioActual;
window.esAdmin = esAdmin;
window.esVendedor = esVendedor;
window.esAsesor = esAsesor;

console.log('🔐 Sistema de autenticación Cablevisión Holding cargado correctamente');