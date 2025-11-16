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
        // Usuarios de prueba que coinciden con el backend
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
                nombre: 'Juan Pérez',
                email: 'juan.perez@cablevision.com'
            },
            {
                id: 3,
                username: 'asesor1',
                password: 'ases123', 
                role: 'asesor',
                nombre: 'María García',
                email: 'maria.garcia@cablevision.com'
            }
        ];

        // Simular autenticación (reemplazar con llamada real al backend)
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
                token: `demo-token-${user.id}`
            };
        }
        
        // Si no encuentra el usuario, retornar error
        return {
            success: false,
            message: 'Usuario o contraseña incorrectos'
        };
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
    if (window.location.pathname.includes('index.html') || 
        window.location.pathname.endsWith('/')) {
        configurarLogin();
    }
    
    // Verificar si estamos en una página que requiere autenticación
    if (window.location.pathname.includes('dashboard')) {
        verificarAutenticacion();
    }
    
    console.log('✅ Sistema de autenticación inicializado');
});

// ===== CONFIGURACIÓN DE LA PÁGINA DE LOGIN =====
function configurarLogin() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            realizarLogin();
        });
    }
    
    // Verificar si hay un usuario ya logueado
    if (window.authService.isAuthenticated()) {
        const role = window.authService.getCurrentUser().role;
        redirigirSegunRol(role);
    }
}

// ===== FUNCIONES DE AUTENTICACIÓN =====
async function realizarLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Validaciones básicas
    if (!username || !password) {
        mostrarError('Por favor, complete todos los campos');
        return;
    }
    
    try {
        // Mostrar loading
        mostrarLoading('Autenticando...');
        
        // Realizar login con el backend
        const result = await window.authService.login(username, password);
        
        if (result.success) {
            mostrarExito('¡Bienvenido! Redirigiendo...');
            
            // Guardar datos del usuario en sessionStorage también para compatibilidad
            sessionStorage.setItem('currentUser', JSON.stringify(result.user));
            
            setTimeout(() => {
                window.location.href = result.redirectUrl;
            }, 1000);
        }
        
    } catch (error) {
        console.error('Error en login:', error);
        mostrarError(error.message || 'Error al iniciar sesión');
    } finally {
        ocultarLoading();
    }
}

function cerrarSesion() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        window.authService.logout();
    }
}

function verificarAutenticacion() {
    if (!window.authService.isAuthenticated()) {
        alert('Debe iniciar sesión para acceder a esta página');
        window.location.href = 'index.html';
        return false;
    }
    
    // Verificar que el usuario tenga acceso a la página actual
    const currentUser = window.authService.getCurrentUser();
    const currentPage = window.location.pathname.split('/').pop();
    const requiredRole = currentPage.replace('dashboard-', '').replace('.html', '');
    
    if (currentUser.role !== requiredRole) {
        alert('No tiene permisos para acceder a esta página');
        window.location.href = window.authService.getRedirectUrl(currentUser.role);
        return false;
    }
    
    return true;
}

function redirigirSegunRol(role) {
    const redirectUrl = window.authService.getRedirectUrl(role);
    window.location.href = redirectUrl;
}

// ===== FUNCIONES DE UI =====
function mostrarError(mensaje) {
    const alertContainer = document.getElementById('alertContainer');
    if (alertContainer) {
        alertContainer.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
    } else {
        alert(mensaje);
    }
}

function mostrarExito(mensaje) {
    const alertContainer = document.getElementById('alertContainer');
    if (alertContainer) {
        alertContainer.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="fas fa-check-circle me-2"></i>
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
    } else {
        alert(mensaje);
    }
}

function mostrarLoading(mensaje = 'Cargando...') {
    const loadingElement = document.getElementById('loadingIndicator');
    if (loadingElement) {
        loadingElement.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="spinner-border spinner-border-sm me-2" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                ${mensaje}
            </div>
        `;
        loadingElement.style.display = 'block';
    }
}

function ocultarLoading() {
    const loadingElement = document.getElementById('loadingIndicator');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

// ===== UTILIDADES =====
function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
    });
}

function formatearMoneda(cantidad) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'USD'
    }).format(cantidad);
}

// ===== CONFIGURACIÓN GLOBAL =====
window.AUTH_CONFIG = {
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
    MAX_LOGIN_ATTEMPTS: 3,
    BACKEND_URL: 'http://localhost:8080/api'
};

console.log('✅ Archivo auth.js cargado correctamente');
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    // Validaciones básicas
    if (!username || !password || !role) {
        mostrarMensaje('Por favor, complete todos los campos', 'error');
        return;
    }
    
    // Buscar usuario en el sistema
    const usuario = systemUsers.find(user => 
        user.username === username && 
        user.password === password && 
        user.role === role &&
        user.estado === 'activo'
    );
    
    if (usuario) {
        // Crear objeto de usuario sin la contraseña
        const userSession = {
            id: usuario.id,
            username: usuario.username,
            role: usuario.role,
            nombre: usuario.nombre,
            email: usuario.email,
            empresaId: usuario.empresaId,
            loginTime: new Date().toISOString()
        };
        
        // Guardar en sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify(userSession));
        
        // Registrar en logs
        console.log('✅ Login exitoso:', usuario.username, '- Rol:', usuario.role);
        
        // Redirigir según el rol
        mostrarMensaje(`¡Bienvenido/a ${usuario.nombre}!`, 'success');
        setTimeout(() => {
            redirigirSegunRol(usuario.role);
        }, 1000);
        
    } else {
        console.log('❌ Login fallido:', username);
        mostrarMensaje('Usuario, contraseña o rol incorrectos', 'error');
    }


function realizarLogout() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (currentUser) {
        console.log('🚪 Logout:', currentUser.username);
    }
    
    // Limpiar sessionStorage
    sessionStorage.removeItem('currentUser');
    
    // Redirigir al login
    window.location.href = 'index.html';
}

// ===== VERIFICACIÓN DE AUTENTICACIÓN =====
function verificarAutenticacion() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const currentPage = window.location.pathname;
    
    if (!currentUser) {
        // No hay usuario logueado, redirigir al login
        window.location.href = 'index.html';
        return;
    }
    
    // Verificar permisos según la página y el rol
    if (currentPage.includes('dashboard-admin.html') && currentUser.role !== 'admin') {
        mostrarMensaje('No tiene permisos para acceder a esta página', 'error');
        realizarLogout();
        return;
    }
    
    if (currentPage.includes('dashboard-vendedor.html') && currentUser.role !== 'vendedor') {
        mostrarMensaje('No tiene permisos para acceder a esta página', 'error');
        realizarLogout();
        return;
    }
    
    if (currentPage.includes('dashboard-asesor.html') && currentUser.role !== 'asesor') {
        mostrarMensaje('No tiene permisos para acceder a esta página', 'error');
        realizarLogout();
        return;
    }
    
    console.log('✅ Usuario autenticado:', currentUser.nombre, '- Rol:', currentUser.role);
}

// ===== FUNCIONES DE REDIRECCIÓN =====
function redirigirSegunRol(rol) {
    switch(rol) {
        case 'admin':
            window.location.href = 'dashboard-admin.html';
            break;
        case 'vendedor':
            window.location.href = 'dashboard-vendedor.html';
            break;
        case 'asesor':
            window.location.href = 'dashboard-asesor.html';
            break;
        default:
            window.location.href = 'index.html';
    }
}

// ===== FUNCIONES DE INTERFAZ =====
function mostrarMensaje(mensaje, tipo) {
    // Eliminar mensajes anteriores
    const mensajesAnteriores = document.querySelectorAll('.alert-message');
    mensajesAnteriores.forEach(msg => msg.remove());
    
    // Crear nuevo mensaje
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert-message alert-${tipo}`;
    alertDiv.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${mensaje}</span>
            <button class="alert-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Agregar estilos si no existen
    if (!document.querySelector('#alert-styles')) {
        const styles = document.createElement('style');
        styles.id = 'alert-styles';
        styles.textContent = `
            .alert-message {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                min-width: 300px;
                max-width: 500px;
                animation: slideInRight 0.3s ease-out;
            }
            .alert-content {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 15px 20px;
                border-radius: 10px;
                color: white;
                font-weight: 500;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            }
            .alert-success { background: linear-gradient(135deg, #00cc66, #00b359); }
            .alert-error { background: linear-gradient(135deg, #ff3333, #cc0000); }
            .alert-warning { background: linear-gradient(135deg, #ff9900, #e68a00); }
            .alert-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                margin-left: auto;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(alertDiv);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}

// ===== FUNCIONES PÚBLICAS =====
window.realizarLogin = realizarLogin;
window.realizarLogout = realizarLogout;
window.obtenerUsuarioActual = function() {
    return JSON.parse(sessionStorage.getItem('currentUser'));
};
window.esAdministrador = function() {
    const usuario = obtenerUsuarioActual();
    return usuario && usuario.role === 'admin';
};
window.esVendedor = function() {
    const usuario = obtenerUsuarioActual();
    return usuario && usuario.role === 'vendedor';
};
window.esAsesor = function() {
    const usuario = obtenerUsuarioActual();
    return usuario && usuario.role === 'asesor';
};

console.log('🔐 Sistema de autenticación CyberVision cargado correctamente');