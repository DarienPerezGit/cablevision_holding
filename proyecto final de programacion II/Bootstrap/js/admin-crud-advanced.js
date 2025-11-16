// ===== FUNCIONES CRUD AVANZADAS - ADMINISTRADORES =====
// admin-crud.js - VERSIÓN AVANZADA CON TODAS LAS FUNCIONALIDADES

// ===== SISTEMA DE GESTIÓN GLOBAL =====

class AdvancedCRUDManager {
    constructor() {
        this.currentEntity = 'paises';
        this.searchTerm = '';
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.sortField = '';
        this.sortDirection = 'asc';
    }

    // Cambiar entidad activa
    switchEntity(entityName) {
        this.currentEntity = entityName;
        this.currentPage = 1;
        this.searchTerm = '';
        this.loadCurrentEntity();
    }

    // Cargar entidad actual
    async loadCurrentEntity() {
        const loader = `cargarTabla${this.currentEntity.charAt(0).toUpperCase()}${this.currentEntity.slice(1)}`;
        if (typeof window[loader] === 'function') {
            await window[loader]();
        }
    }

    // Búsqueda avanzada
    async searchEntities(term) {
        this.searchTerm = term;
        this.currentPage = 1;
        await this.loadCurrentEntity();
    }

    // Paginación
    changePage(page) {
        this.currentPage = page;
        this.loadCurrentEntity();
    }

    // Ordenamiento
    sortBy(field) {
        if (this.sortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = 'asc';
        }
        this.loadCurrentEntity();
    }
}

// Instancia global del gestor CRUD
const crudManager = new AdvancedCRUDManager();

// ===== FUNCIONES DE NOTIFICACIÓN =====

function mostrarNotificacion(mensaje, tipo = 'success') {
    const alertClass = {
        'success': 'alert-success',
        'error': 'alert-danger',
        'warning': 'alert-warning',
        'info': 'alert-info'
    }[tipo] || 'alert-info';

    const alertHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;" role="alert">
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', alertHTML);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        const alerts = document.querySelectorAll('.alert');
        if (alerts.length > 0) {
            alerts[alerts.length - 1].remove();
        }
    }, 5000);
}

// ===== CRUD PAÍSES AVANZADO =====

async function cargarTablaPaises() {
    console.log('🌍 Cargando tabla de países...');
    
    try {
        // Mostrar spinner de carga
        mostrarSpinner('paisesTableBody');
        
        // Obtener datos del backend
        let paises = await window.holdingAPI.getPaises();
        const empresas = await window.holdingAPI.getEmpresas();
        
        // Aplicar filtro de búsqueda si existe
        if (crudManager.searchTerm) {
            paises = paises.filter(pais => 
                pais.nombre.toLowerCase().includes(crudManager.searchTerm.toLowerCase()) ||
                pais.capital.toLowerCase().includes(crudManager.searchTerm.toLowerCase())
            );
        }
        
        // Aplicar ordenamiento
        if (crudManager.sortField) {
            paises.sort((a, b) => {
                let aVal = a[crudManager.sortField];
                let bVal = b[crudManager.sortField];
                
                if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = bVal.toLowerCase();
                }
                
                if (crudManager.sortDirection === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });
        }
        
        const tbody = document.getElementById('paisesTableBody');
        
        if (!tbody) {
            console.log('❌ No se encontró la tabla de países');
            return;
        }
        
        if (!paises || paises.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted py-4">
                        <i class="fas fa-search fa-3x mb-3 d-block text-muted"></i>
                        ${crudManager.searchTerm ? 'No se encontraron países que coincidan con la búsqueda' : 'No hay países registrados'}
                        ${!crudManager.searchTerm ? '<br><button class="btn btn-primary btn-sm mt-2" onclick="nuevoPais()">Agregar Primer País</button>' : ''}
                    </td>
                </tr>
            `;
            return;
        }
        
        // Aplicar paginación
        const startIndex = (crudManager.currentPage - 1) * crudManager.itemsPerPage;
        const endIndex = startIndex + crudManager.itemsPerPage;
        const paisesPaginados = paises.slice(startIndex, endIndex);
        
        tbody.innerHTML = paisesPaginados.map(pais => {
            // Manejar diferentes formatos de empresa.paisSede y asegurar array válido
            let empresasEnPais = 0;
            if (Array.isArray(empresas)) {
                empresasEnPais = empresas.filter(emp => {
                    if (emp.paisSedeId) return emp.paisSedeId === pais.id;
                    if (emp.paisSede && emp.paisSede.id) return emp.paisSede.id === pais.id;
                    if (emp.paisSede === pais.id) return true;
                    return false;
                }).length;
            }
            // Asegurar que numeroHabitantes es un número válido
            const habitantes = (typeof pais.numeroHabitantes === 'number' && !isNaN(pais.numeroHabitantes)) ? pais.numeroHabitantes : 0;
            return `
                <tr class="table-row-hover" data-id="${pais.id}">
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="item-icon pais me-3">
                                <i class="fas fa-flag"></i>
                            </div>
                            <div>
                                <strong>${pais.nombre}</strong>
                                <br><small class="text-muted">Capital: ${pais.capital}</small>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="badge bg-secondary">${pais.capital}</span>
                    </td>
                    <td>
                        <strong>$${formatearNumero((pais.pib || 0) / 1000000000)}B</strong>
                        <br><small class="text-muted">PIB</small>
                    </td>
                    <td>
                        <strong>${formatearNumero(habitantes / 1000000)}M</strong>
                        <br><small class="text-muted">habitantes</small>
                    </td>
                    <td>
                        <span class="badge ${empresasEnPais > 0 ? 'bg-success' : 'bg-light text-dark'}">${empresasEnPais}</span>
                    </td>
                    <td>
                        <div class="btn-group" role="group">
                            <button class="btn btn-sm btn-outline-info" onclick="verDetallesPais(${pais.id})" 
                                    data-bs-toggle="tooltip" title="Ver Detalles">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-primary" onclick="editarPais(${pais.id})"
                                    data-bs-toggle="tooltip" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="eliminarPais(${pais.id})"
                                    data-bs-toggle="tooltip" title="Eliminar"
                                    ${empresasEnPais > 0 ? 'disabled' : ''}>
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        
        // Actualizar información de paginación
        actualizarPaginacion(paises.length, 'paises');
        
        // Inicializar tooltips
        inicializarTooltips();
        
        console.log('✅ Tabla de países cargada:', paisesPaginados.length, 'registros mostrados de', paises.length, 'totales');
        
    } catch (error) {
        console.error('❌ Error al cargar países:', error);
        mostrarNotificacion('Error al cargar países de la base de datos', 'error');
        document.getElementById('paisesTableBody').innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-danger py-4">
                    <i class="fas fa-exclamation-triangle fa-2x mb-2"></i><br>
                    Error al cargar datos. Intenta recargar la página.
                </td>
            </tr>
        `;
    }
}

async function nuevoPais() {
    console.log('➕ Abriendo modal de nuevo país...');
    
    try {
        await crearModalPaisAvanzado();
        
        document.getElementById('paisModalTitle').textContent = 'Nuevo País';
        document.getElementById('paisForm').reset();
        document.getElementById('paisId').value = '';
        
        const modalElement = document.getElementById('paisModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
        
    } catch (error) {
        console.error('❌ Error en nuevoPais:', error);
        mostrarNotificacion('Error al abrir modal de nuevo país', 'error');
    }
}

async function editarPais(id) {
    console.log('✏️ Editando país ID:', id);
    
    try {
        // Obtener datos del país del backend
        const paises = await window.holdingAPI.getPaises();
        const pais = paises.find(p => p.id === id);
        
        if (!pais) {
            mostrarNotificacion('País no encontrado', 'error');
            return;
        }
        
        await crearModalPaisAvanzado();
        
        document.getElementById('paisModalTitle').textContent = 'Editar País';
        document.getElementById('paisId').value = pais.id;
        document.getElementById('paisNombre').value = pais.nombre;
        document.getElementById('paisCapital').value = pais.capital;
        document.getElementById('paisPib').value = pais.pib;
        document.getElementById('paisHabitantes').value = pais.numeroHabitantes;
        
        const modalElement = document.getElementById('paisModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
        
    } catch (error) {
        console.error('❌ Error en editarPais:', error);
        mostrarNotificacion('Error al cargar datos del país', 'error');
    }
}

async function guardarPais() {
    console.log('💾 Guardando país...');
    
    try {
        const formData = {
            nombre: document.getElementById('paisNombre').value.trim(),
            capital: document.getElementById('paisCapital').value.trim(),
            pib: parseFloat(document.getElementById('paisPib').value),
            numeroHabitantes: parseInt(document.getElementById('paisHabitantes').value)
        };
        
        // Validaciones avanzadas
        const validacion = validarDatosPais(formData);
        if (!validacion.valido) {
            mostrarNotificacion(validacion.mensaje, 'error');
            return;
        }
        
        const paisId = document.getElementById('paisId').value;
        let resultado;
        
        if (paisId) {
            // Actualizar país existente
            resultado = await window.holdingAPI.updatePais(paisId, formData);
        } else {
            // Crear nuevo país
            resultado = await window.holdingAPI.createPais(formData);
        }
        
        if (resultado) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('paisModal'));
            modal.hide();
            
            await cargarTablaPaises();
            
            mostrarNotificacion(
                paisId ? 'País actualizado exitosamente' : 'País creado exitosamente',
                'success'
            );
        }
        
    } catch (error) {
        console.error('❌ Error al guardar país:', error);
        
        if (error.message.includes('Ya existe')) {
            mostrarNotificacion('Ya existe un país con ese nombre', 'warning');
        } else {
            mostrarNotificacion('Error al guardar el país. Intenta nuevamente.', 'error');
        }
    }
}

async function eliminarPais(id) {
    console.log('🗑️ Eliminando país ID:', id);
    
    try {
        // Obtener datos del país
        const paises = await window.holdingAPI.getPaises();
        const pais = paises.find(p => p.id === id);
        
        if (!pais) {
            mostrarNotificacion('País no encontrado', 'error');
            return;
        }
        
        // Verificar empresas asociadas
        const empresas = await window.holdingAPI.getEmpresas();
        const empresasEnPais = empresas.filter(emp => emp.paisSedeId === id);
        
        if (empresasEnPais.length > 0) {
            mostrarNotificacion(
                `No se puede eliminar el país "${pais.nombre}" porque tiene ${empresasEnPais.length} empresa(s) asociada(s)`,
                'warning'
            );
            return;
        }
        
        // Confirmar eliminación
        const confirmacion = await mostrarConfirmacion(
            'Eliminar País',
            `¿Estás seguro de que deseas eliminar el país "${pais.nombre}"?`,
            'Esta acción no se puede deshacer.'
        );
        
        if (confirmacion) {
            await window.holdingAPI.deletePais(id);
            await cargarTablaPaises();
            mostrarNotificacion('País eliminado exitosamente', 'success');
        }
        
    } catch (error) {
        console.error('❌ Error al eliminar país:', error);
        mostrarNotificacion('Error al eliminar el país', 'error');
    }
}

// ===== FUNCIONES DE UTILIDAD =====

function formatearNumero(numero) {
    return new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }).format(numero);
}

function mostrarSpinner(elementId) {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <div class="mt-2">Cargando datos...</div>
                </td>
            </tr>
        `;
    }
}

function inicializarTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Función para validar datos de país
function validarDatosPais(datos) {
    if (!datos.nombre || datos.nombre.length < 2) {
        return { valido: false, mensaje: 'El nombre del país debe tener al menos 2 caracteres' };
    }
    
    if (!datos.capital || datos.capital.length < 2) {
        return { valido: false, mensaje: 'El nombre de la capital debe tener al menos 2 caracteres' };
    }
    
    if (isNaN(datos.pib) || datos.pib <= 0) {
        return { valido: false, mensaje: 'El PIB debe ser un número mayor a cero' };
    }
    
    if (isNaN(datos.numeroHabitantes) || datos.numeroHabitantes <= 0) {
        return { valido: false, mensaje: 'El número de habitantes debe ser mayor a cero' };
    }
    
    return { valido: true };
}

// Función para mostrar confirmaciones
async function mostrarConfirmacion(titulo, mensaje, detalle = '') {
    return new Promise((resolve) => {
        const modalHTML = `
            <div class="modal fade" id="confirmModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${titulo}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>${mensaje}</p>
                            ${detalle ? `<small class="text-muted">${detalle}</small>` : ''}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="resolveConfirm(false)">Cancelar</button>
                            <button type="button" class="btn btn-danger" onclick="resolveConfirm(true)">Confirmar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        window.resolveConfirm = (result) => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
            modal.hide();
            document.getElementById('confirmModal').remove();
            delete window.resolveConfirm;
            resolve(result);
        };
        
        const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
        modal.show();
    });
}

// ===== INICIO AUTOMÁTICO =====

// Cargar países cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('paisesTableBody')) {
        cargarTablaPaises();
    }
});

console.log('✅ CRUD Avanzado de Países cargado correctamente');