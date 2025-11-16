// ===== FUNCIONES CRUD PARA VENDEDORES =====
// vendedor-crud.js

// ===== CRUD VENDEDORES =====
function cargarTablaVendedores() {
    console.log('📊 Cargando tabla de vendedores...');
    
    const vendedores = storageService.obtenerVendedores();
    const empresas = storageService.obtenerEmpresasExtended();
    const tbody = document.getElementById('vendedoresTableBody');
    
    if (!tbody) {
        console.log('❌ No se encontró la tabla de vendedores');
        return;
    }
    
    if (vendedores.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">No hay vendedores registrados</td></tr>`;
        return;
    }
    
    tbody.innerHTML = vendedores.map(vendedor => {
        const empresa = empresas.find(e => e.id === vendedor.empresaId);
        const captador = vendedores.find(v => v.codigo === vendedor.captadorId);
        const nivel = storageService.calcularNivelVendedor(vendedor.codigo);
        
        return `
            <tr>
                <td><strong>${vendedor.codigo}</strong></td>
                <td>${vendedor.nombre}</td>
                <td>${empresa ? empresa.nombre : 'N/A'}</td>
                <td>${captador ? captador.nombre : 'Raíz'}</td>
                <td><span class="badge bg-info">Nivel ${nivel}</span></td>
                <td>${new Date(vendedor.fechaCaptacion).toLocaleDateString('es-ES')}</td>
                <td><span class="badge bg-success">${vendedor.estado}</span></td>
                <td>
                    <div class="d-flex gap-1">
                        <button class="btn btn-sm btn-outline-primary" onclick="editarVendedor('${vendedor.codigo}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="eliminarVendedor('${vendedor.codigo}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    console.log('✅ Tabla de vendedores cargada:', vendedores.length, 'registros');
}

function nuevoVendedor() {
    console.log('➕ Intentando abrir modal de nuevo vendedor...');
    
    try {
        if (typeof storageService === 'undefined') {
            throw new Error('storageService no disponible');
        }

        crearModalVendedorEmergencia();
        
        document.getElementById('vendedorModalTitle').textContent = 'Nuevo Vendedor';
        document.getElementById('vendedorForm').reset();
        document.getElementById('vendedorCodigo').value = '';
        
        // Cargar empresas en select
        const empresas = storageService.obtenerEmpresasExtended();
        const empresaSelect = document.getElementById('vendedorEmpresa');
        if (empresaSelect) {
            empresaSelect.innerHTML = '<option value="">Seleccionar empresa...</option>' +
                empresas.map(emp => `<option value="${emp.id}">${emp.nombre}</option>`).join('');
            empresaSelect.disabled = false;
        }
        
        // Cargar vendedores captadores
        const vendedores = storageService.obtenerVendedores();
        const captadorSelect = document.getElementById('vendedorCaptador');
        if (captadorSelect) {
            captadorSelect.innerHTML = '<option value="">Ninguno (Vendedor Raíz)</option>' +
                vendedores.map(v => `<option value="${v.codigo}">${v.codigo} - ${v.nombre}</option>`).join('');
            captadorSelect.disabled = false;
        }
        
        // Fecha actual por defecto
        const fechaInput = document.getElementById('vendedorFechaCaptacion');
        if (fechaInput) {
            fechaInput.value = new Date().toISOString().split('T')[0];
        }
        
        // Mostrar modal usando Bootstrap directamente
        const modalElement = document.getElementById('vendedorModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
            console.log('✅ Modal de vendedor mostrado correctamente');
        } else {
            throw new Error('No se pudo encontrar el modal de vendedor');
        }
        
    } catch (error) {
        console.error('❌ Error al abrir modal de vendedor:', error);
        alert('Error: ' + error.message + '\n\nRecarga la página e intenta nuevamente.');
    }
}

function captarVendedor(captadorId) {
    console.log('👥 Captando nuevo vendedor para:', captadorId);
    
    try {
        const captador = storageService.obtenerVendedores().find(v => v.codigo === captadorId);
        if (!captador) {
            alert('Vendedor captador no encontrado');
            return;
        }

        crearModalVendedorEmergencia();
        
        document.getElementById('vendedorModalTitle').textContent = 'Captar Nuevo Vendedor';
        document.getElementById('vendedorForm').reset();
        document.getElementById('vendedorCodigo').value = '';
        
        // Pre-configurar el captador y empresa
        const empresaSelect = document.getElementById('vendedorEmpresa');
        const captadorSelect = document.getElementById('vendedorCaptador');
        const fechaInput = document.getElementById('vendedorFechaCaptacion');
        
        if (empresaSelect) {
            const empresas = storageService.obtenerEmpresasExtended();
            empresaSelect.innerHTML = '<option value="">Seleccionar empresa...</option>' +
                empresas.map(emp => `<option value="${emp.id}">${emp.nombre}</option>`).join('');
            empresaSelect.value = captador.empresaId;
            empresaSelect.disabled = true;
        }
        
        if (captadorSelect) {
            const vendedores = storageService.obtenerVendedores();
            captadorSelect.innerHTML = '<option value="">Ninguno (Vendedor Raíz)</option>' +
                vendedores.map(v => `<option value="${v.codigo}">${v.codigo} - ${v.nombre}</option>`).join('');
            captadorSelect.value = captadorId;
            captadorSelect.disabled = true;
        }
        
        if (fechaInput) {
            fechaInput.value = new Date().toISOString().split('T')[0];
        }
        
        const modalElement = document.getElementById('vendedorModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
        
    } catch (error) {
        console.error('❌ Error en captarVendedor:', error);
        alert('Error: ' + error.message);
    }
}

function editarVendedor(codigo) {
    console.log('✏️ Editando vendedor:', codigo);
    
    try {
        const vendedor = storageService.obtenerVendedores().find(v => v.codigo === codigo);
        if (!vendedor) {
            alert('Vendedor no encontrado');
            return;
        }
        
        crearModalVendedorEmergencia();
        
        document.getElementById('vendedorModalTitle').textContent = 'Editar Vendedor';
        document.getElementById('vendedorForm').reset();
        document.getElementById('vendedorCodigo').value = vendedor.codigo;
        
        // Cargar datos existentes
        document.getElementById('vendedorNombre').value = vendedor.nombre;
        document.getElementById('vendedorDireccion').value = vendedor.direccion;
        
        // Cargar empresas
        const empresas = storageService.obtenerEmpresasExtended();
        const empresaSelect = document.getElementById('vendedorEmpresa');
        if (empresaSelect) {
            empresaSelect.innerHTML = '<option value="">Seleccionar empresa...</option>' +
                empresas.map(emp => `<option value="${emp.id}">${emp.nombre}</option>`).join('');
            empresaSelect.value = vendedor.empresaId;
            empresaSelect.disabled = false;
        }
        
        // Cargar captadores
        const vendedores = storageService.obtenerVendedores();
        const captadorSelect = document.getElementById('vendedorCaptador');
        if (captadorSelect) {
            captadorSelect.innerHTML = '<option value="">Ninguno (Vendedor Raíz)</option>' +
                vendedores.map(v => `<option value="${v.codigo}">${v.codigo} - ${v.nombre}</option>`).join('');
            captadorSelect.value = vendedor.captadorId || '';
            captadorSelect.disabled = false;
        }
        
        // Fecha
        const fechaInput = document.getElementById('vendedorFechaCaptacion');
        if (fechaInput) {
            fechaInput.value = vendedor.fechaCaptacion.split('T')[0];
        }
        
        const modalElement = document.getElementById('vendedorModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
        
    } catch (error) {
        console.error('❌ Error en editarVendedor:', error);
        alert('Error: ' + error.message);
    }
}

function guardarVendedor() {
    console.log('💾 Guardando vendedor...');
    
    try {
        const form = document.getElementById('vendedorForm');
        
        if (!form) {
            throw new Error('No se encontró el formulario');
        }
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const vendedorData = {
            nombre: document.getElementById('vendedorNombre').value,
            direccion: document.getElementById('vendedorDireccion').value,
            empresaId: parseInt(document.getElementById('vendedorEmpresa').value),
            captadorId: document.getElementById('vendedorCaptador').value || null,
            fechaCaptacion: document.getElementById('vendedorFechaCaptacion').value
        };
        
        // Validar que el captador sea de la misma empresa
        if (vendedorData.captadorId) {
            const captador = storageService.obtenerVendedores().find(v => v.codigo === vendedorData.captadorId);
            if (captador && captador.empresaId !== vendedorData.empresaId) {
                alert('❌ Error: El vendedor captador debe ser de la misma empresa');
                return;
            }
        }
        
        const vendedorCodigo = document.getElementById('vendedorCodigo').value;
        
        if (vendedorCodigo) {
            // Editar vendedor existente
            if (storageService.actualizar('vendedores', vendedorCodigo, vendedorData)) {
                console.log('✅ Vendedor editado:', vendedorData.nombre);
                
                // Actualizar captación si cambió el captador
                if (vendedorData.captadorId) {
                    const captaciones = storageService.obtenerCaptaciones();
                    const captacionExistente = captaciones.find(c => c.captadoId === vendedorCodigo);
                    
                    if (captacionExistente) {
                        captacionExistente.captadorId = vendedorData.captadorId;
                        captacionExistente.fechaCaptacion = vendedorData.fechaCaptacion;
                        storageService.guardarTodos('captaciones', captaciones);
                    } else {
                        const nuevaCaptacion = {
                            captadorId: vendedorData.captadorId,
                            captadoId: vendedorCodigo,
                            empresaId: vendedorData.empresaId,
                            fechaCaptacion: vendedorData.fechaCaptacion
                        };
                        storageService.crearCaptacion(nuevaCaptacion);
                    }
                }
            }
        } else {
            // Nuevo vendedor
            if (storageService.crearVendedor(vendedorData)) {
                console.log('✅ Nuevo vendedor creado:', vendedorData.nombre);
                
                // Si tiene captador, crear la relación de captación
                if (vendedorData.captadorId) {
                    const vendedores = storageService.obtenerVendedores();
                    const nuevoVendedor = vendedores[vendedores.length - 1];
                    
                    const captacionData = {
                        captadorId: vendedorData.captadorId,
                        captadoId: nuevoVendedor.codigo,
                        empresaId: vendedorData.empresaId,
                        fechaCaptacion: vendedorData.fechaCaptacion
                    };
                    storageService.crearCaptacion(captacionData);
                }
            }
        }
        
        // Cerrar modal
        const modalElement = document.getElementById('vendedorModal');
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
        }
        
        // Recargar datos
        cargarTablaVendedores();
        if (typeof cargarJerarquiaVendedores === 'function') {
            cargarJerarquiaVendedores();
        }
        
        alert('✅ Vendedor guardado correctamente');
        
    } catch (error) {
        console.error('❌ Error en guardarVendedor:', error);
        alert('Error al guardar vendedor: ' + error.message);
    }
}

function eliminarVendedor(codigo) {
    if (!confirm('¿Estás seguro de que quieres eliminar este vendedor?\n\nEsta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        // Verificar si tiene vendedores captados
        const captaciones = storageService.obtenerCaptaciones();
        const captacionesComoCaptador = captaciones.filter(c => c.captadorId === codigo);
        
        if (captacionesComoCaptador.length > 0) {
            alert(`❌ No se puede eliminar el vendedor porque tiene ${captacionesComoCaptador.length} vendedor(es) captado(s)`);
            return;
        }
        
        // Eliminar captaciones donde es captado
        const captacionesComoCaptado = captaciones.filter(c => c.captadoId === codigo);
        const nuevasCaptaciones = captaciones.filter(c => c.captadoId !== codigo);
        storageService.guardarTodos('captaciones', nuevasCaptaciones);
        
        // Eliminar vendedor
        if (storageService.eliminar('vendedores', codigo)) {
            cargarTablaVendedores();
            if (typeof cargarJerarquiaVendedores === 'function') {
                cargarJerarquiaVendedores();
            }
            alert('✅ Vendedor eliminado correctamente');
        } else {
            alert('❌ Error al eliminar el vendedor');
        }
    } catch (error) {
        console.error('❌ Error en eliminarVendedor:', error);
        alert('Error al eliminar vendedor: ' + error.message);
    }
}

// ===== JERARQUÍA PIRAMIDAL =====
function cargarJerarquiaVendedores() {
    console.log('🏗️ Cargando jerarquía piramidal...');
    
    const container = document.getElementById('jerarquiaContainer');
    if (!container) {
        console.log('❌ No se encontró el contenedor de jerarquía');
        return;
    }
    
    try {
        const vendedores = storageService.obtenerVendedores();
        const empresas = storageService.obtenerEmpresasExtended();
        const captaciones = storageService.obtenerCaptaciones();
        
        // Encontrar vendedores raíz (sin captador)
        const vendedoresRaiz = vendedores.filter(v => {
            const captacion = captaciones.find(c => c.captadoId === v.codigo);
            return !captacion;
        });
        
        if (vendedoresRaiz.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-sitemap"></i>
                    <p>No hay vendedores en la jerarquía</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="jerarquia-piramidal">
                ${vendedoresRaiz.map(vendedor => generarNodoJerarquia(vendedor, 0)).join('')}
            </div>
        `;
        
        console.log('✅ Jerarquía cargada con', vendedoresRaiz.length, 'vendedores raíz');
        
    } catch (error) {
        console.error('❌ Error en cargarJerarquiaVendedores:', error);
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error al cargar la jerarquía: ${error.message}</p>
            </div>
        `;
    }
}

function generarNodoJerarquia(vendedor, nivel) {
    const empresas = storageService.obtenerEmpresasExtended();
    const captaciones = storageService.obtenerCaptaciones();
    const todosVendedores = storageService.obtenerVendedores();
    
    const empresa = empresas.find(e => e.id === vendedor.empresaId);
    const subCaptaciones = captaciones.filter(c => c.captadorId === vendedor.codigo);
    const subVendedores = subCaptaciones.map(c => 
        todosVendedores.find(v => v.codigo === c.captadoId)
    ).filter(Boolean);
    
    const tieneSubordinados = subVendedores.length > 0;
    const claseNivel = `nivel-${Math.min(nivel, 3)}`;
    
    let html = `
        <div class="nodo-jerarquia ${claseNivel}">
            <div class="nodo-carta ${tieneSubordinados ? 'con-subordinados' : ''}">
                <div class="nodo-header">
                    <div class="nodo-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="nodo-info">
                        <h6>${vendedor.nombre}</h6>
                        <p class="nodo-codigo">${vendedor.codigo}</p>
                        <p class="nodo-empresa">${empresa ? empresa.nombre : 'Sin empresa'}</p>
                        <p class="nodo-nivel">Nivel ${nivel + 1}</p>
                    </div>
                </div>
                <div class="nodo-stats">
                    <small>${subVendedores.length} captado(s)</small>
                    <button class="btn btn-sm btn-outline-success" onclick="captarVendedor('${vendedor.codigo}')">
                        <i class="fas fa-user-plus me-1"></i>Captar
                    </button>
                </div>
            </div>
    `;
    
    if (tieneSubordinados) {
        html += `
            <div class="subordinados">
                ${subVendedores.map(subVendedor => generarNodoJerarquia(subVendedor, nivel + 1)).join('')}
            </div>
        `;
    }
    
    html += `</div>`;
    return html;
}

// ===== MODALES DE EMERGENCIA (PARA VENDEDORES) =====
function crearModalVendedorEmergencia() {
    if (document.getElementById('vendedorModal')) {
        console.log('✅ Modal de vendedor ya existe');
        return;
    }
    
    console.log('🔄 Creando modal de vendedor de emergencia...');
    
    const modalHTML = `
    <div class="modal fade" id="vendedorModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content cyber-modal">
                <div class="modal-header">
                    <h5 class="modal-title" id="vendedorModalTitle">Nuevo Vendedor</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="vendedorForm">
                        <input type="hidden" id="vendedorCodigo">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="vendedorNombre" class="form-label">Nombre *</label>
                                <input type="text" class="form-control" id="vendedorNombre" required>
                            </div>
                            <div class="col-md-6">
                                <label for="vendedorDireccion" class="form-label">Dirección *</label>
                                <input type="text" class="form-control" id="vendedorDireccion" required>
                            </div>
                            <div class="col-md-6">
                                <label for="vendedorEmpresa" class="form-label">Empresa *</label>
                                <select class="form-select" id="vendedorEmpresa" required>
                                    <option value="">Seleccionar empresa...</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label for="vendedorCaptador" class="form-label">Vendedor Captador</label>
                                <select class="form-select" id="vendedorCaptador">
                                    <option value="">Ninguno (Vendedor Raíz)</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label for="vendedorFechaCaptacion" class="form-label">Fecha Captación</label>
                                <input type="date" class="form-control" id="vendedorFechaCaptacion">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" onclick="guardarVendedor()">Guardar Vendedor</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    console.log('✅ Modal de vendedor creado (emergencia)');
}

// ===== EXPORTAR FUNCIONES VENDEDOR =====
window.cargarTablaVendedores = cargarTablaVendedores;
window.nuevoVendedor = nuevoVendedor;
window.captarVendedor = captarVendedor;
window.editarVendedor = editarVendedor;
window.guardarVendedor = guardarVendedor;
window.eliminarVendedor = eliminarVendedor;
window.cargarJerarquiaVendedores = cargarJerarquiaVendedores;
window.generarNodoJerarquia = generarNodoJerarquia;
window.crearModalVendedorEmergencia = crearModalVendedorEmergencia;

console.log("🛠️ Funciones CRUD de Vendedores cargadas correctamente");