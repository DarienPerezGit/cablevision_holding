/**
 * API Service para integración con backend Spring Boot
 * Sistema de Gestión de Holding - Cablevisión
 */

class HoldingAPIService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api';
        this.token = localStorage.getItem('authToken');
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    }

    // ===== AUTENTICACIÓN =====
    
    async login(credentials) {
        try {
            const response = await this.makeRequest('POST', '/auth/login', credentials);
            
            if (response.success) {
                this.token = response.token;
                this.currentUser = response.user;
                localStorage.setItem('authToken', this.token);
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                return response;
            }
            throw new Error(response.message || 'Error de autenticación');
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    logout() {
        this.token = null;
        this.currentUser = {};
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return !!this.token && !!this.currentUser.id;
    }

    // ===== ADMINISTRADOR ENDPOINTS =====
    
    // Vendedores
    async getVendedores() {
        return this.makeRequest('GET', '/admin/vendedores');
    }

    async getVendedor(id) {
        return this.makeRequest('GET', `/admin/vendedores/${id}`);
    }

    async createVendedor(vendedorData) {
        return this.makeRequest('POST', '/admin/vendedores', vendedorData);
    }

    async updateVendedor(id, vendedorData) {
        return this.makeRequest('PUT', `/admin/vendedores/${id}`, vendedorData);
    }

    async deleteVendedor(id) {
        return this.makeRequest('DELETE', `/admin/vendedores/${id}`);
    }

    // Empresas
    async getEmpresas() {
        return this.makeRequest('GET', '/admin/empresas');
    }

    async getEmpresa(id) {
        return this.makeRequest('GET', `/admin/empresas/${id}`);
    }

    async createEmpresa(empresaData) {
        return this.makeRequest('POST', '/admin/empresas', empresaData);
    }

    async updateEmpresa(id, empresaData) {
        return this.makeRequest('PUT', `/admin/empresas/${id}`, empresaData);
    }

    async deleteEmpresa(id) {
        return this.makeRequest('DELETE', `/admin/empresas/${id}`);
    }

    // Asesores
    async getAsesores() {
        return this.makeRequest('GET', '/admin/asesores');
    }

    async getAsesor(id) {
        return this.makeRequest('GET', `/admin/asesores/${id}`);
    }

    async createAsesor(asesorData) {
        return this.makeRequest('POST', '/admin/asesores', asesorData);
    }

    async updateAsesor(id, asesorData) {
        return this.makeRequest('PUT', `/admin/asesores/${id}`, asesorData);
    }

    async deleteAsesor(id) {
        return this.makeRequest('DELETE', `/admin/asesores/${id}`);
    }

    // Países - CRUD Completo
    async getPaises() {
        return this.makeRequest('GET', '/admin/paises');
    }

    async getPais(id) {
        return this.makeRequest('GET', `/admin/paises/${id}`);
    }

    async createPais(paisData) {
        return this.makeRequest('POST', '/admin/paises', paisData);
    }

    async updatePais(id, paisData) {
        return this.makeRequest('PUT', `/admin/paises/${id}`, paisData);
    }

    async deletePais(id) {
        return this.makeRequest('DELETE', `/admin/paises/${id}`);
    }

    async buscarPaises(nombre) {
        return this.makeRequest('GET', `/admin/paises/buscar?nombre=${encodeURIComponent(nombre)}`);
    }

    // Áreas de Mercado
    async getAreasMercado() {
        return this.makeRequest('GET', '/admin/areas-mercado');
    }

    async createAreaMercado(areaData) {
        return this.makeRequest('POST', '/admin/areas-mercado', areaData);
    }

    // Captaciones
    async getCaptaciones() {
        return this.makeRequest('GET', '/admin/captaciones');
    }

    async realizarCaptacion(captacionData) {
        return this.makeRequest('POST', '/admin/captaciones', captacionData);
    }

    // Resumen del holding
    async getResumenHolding() {
        return this.makeRequest('GET', '/admin/resumen');
    }

    // ===== VENDEDOR ENDPOINTS =====
    
    async getVendedorPerfil() {
        return this.makeRequest('GET', '/vendedor/perfil');
    }

    async getVendedorJerarquia() {
        return this.makeRequest('GET', '/vendedor/jerarquia');
    }

    async getVendedorEstadisticas() {
        return this.makeRequest('GET', '/vendedor/estadisticas');
    }

    async vendedorRealizarCaptacion(captacionData) {
        return this.makeRequest('POST', '/vendedor/captaciones', captacionData);
    }

    // ===== ASESOR ENDPOINTS =====
    
    async getAsesorPerfil() {
        return this.makeRequest('GET', '/asesor/perfil');
    }

    async getAsesorEmpresas() {
        return this.makeRequest('GET', '/asesor/empresas');
    }

    async getAsesorEmpresaDetalle(empresaId) {
        return this.makeRequest('GET', `/asesor/empresas/${empresaId}`);
    }

    async getAsesorAreas() {
        return this.makeRequest('GET', '/asesor/areas');
    }

    async getAsesorEstadisticas() {
        return this.makeRequest('GET', '/asesor/estadisticas');
    }

    // ===== MÉTODOS AUXILIARES =====
    
    async makeRequest(method, endpoint, data = null) {
        const url = `${this.baseURL}${endpoint}`;
        
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        };

        // Agregar token de autorización si está disponible
        if (this.token) {
            options.headers['Authorization'] = `Bearer ${this.token}`;
        }

        // Agregar datos del body para POST/PUT
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        try {
            console.log(`${method} ${url}`, data || '');
            
            const response = await fetch(url, options);
            
            if (!response.ok) {
                if (response.status === 401) {
                    this.logout();
                    throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
                }
                
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('Response:', result);
            
            return result;
            
        } catch (error) {
            console.error(`Error en ${method} ${endpoint}:`, error);
            throw error;
        }
    }

    // ===== UTILIDADES =====
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('es-AR');
    }

    formatDateTime(dateString) {
        return new Date(dateString).toLocaleString('es-AR');
    }

    // ===== VALIDACIONES =====
    
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validateRequired(value, fieldName) {
        if (!value || value.toString().trim() === '') {
            throw new Error(`${fieldName} es requerido`);
        }
        return true;
    }

    validateNumber(value, fieldName, min = null, max = null) {
        const num = parseFloat(value);
        if (isNaN(num)) {
            throw new Error(`${fieldName} debe ser un número válido`);
        }
        if (min !== null && num < min) {
            throw new Error(`${fieldName} debe ser mayor o igual a ${min}`);
        }
        if (max !== null && num > max) {
            throw new Error(`${fieldName} debe ser menor o igual a ${max}`);
        }
        return true;
    }
}

// Crear instancia global del servicio API
window.holdingAPI = new HoldingAPIService();

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    const publicPages = ['index.html', 'index-home.html', ''];
    
    if (!publicPages.includes(currentPage)) {
        if (!window.holdingAPI.isAuthenticated()) {
            window.location.href = 'index.html';
            return;
        }
        
        // Verificar que el usuario tenga acceso a la página actual
        const userRole = window.holdingAPI.getCurrentUser().role;
        const pageRole = currentPage.split('-')[1]?.split('.')[0]; // Extraer rol de dashboard-admin.html
        
        if (pageRole && userRole && userRole.toLowerCase() !== pageRole) {
            alert('No tiene permisos para acceder a esta página');
            window.location.href = 'index.html';
        }
    }
});