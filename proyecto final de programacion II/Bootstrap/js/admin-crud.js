// ===== FUNCIONES CRUD PARA ADMINISTRADORES =====
// admin-crud.js - INTEGRADO CON BACKEND SPRING BOOT

// ===== CRUD PAÍSES =====

async function cargarTablaPaises() {
    console.log('🌍 Cargando tabla de países...');
    
    try {
        // Usar el holdingAPI para obtener datos del backend
        const paises = await window.holdingAPI.getPaises();
        const empresas = await window.holdingAPI.getEmpresas();
        
        const tbody = document.getElementById('paisesTableBody');
        
        if (!tbody) {
            console.log('❌ No se encontró la tabla de países');
            return;
        }
        
        if (!paises || paises.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No hay países registrados</td></tr>`;
            return;
        }
        
        tbody.innerHTML = paises.map(pais => {
            const empresasEnPais = empresas.filter(emp => emp.paisSedeId === pais.id).length;
            
            return `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="item-icon empresa me-3">
                                <i class="fas fa-flag"></i>
                            </div>
                            <div>
                                <strong>${pais.nombre}</strong>
                                <br><small class="text-muted">Capital: ${pais.capital}</small>
                            </div>
                        </div>
                    </td>
                    <td>${pais.capital}</td>
                    <td>$${(pais.pib / 1000).toFixed(1)}B</td>
                    <td>${(pais.habitantes / 1000000).toFixed(1)}M</td>
                    <td>${empresasEnPais}</td>
                    <td>
                        <div class="d-flex gap-1">
                            <button class="btn btn-sm btn-outline-primary" onclick="editarPais(${pais.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="eliminarPais(${pais.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        
        console.log('✅ Tabla de países cargada:', paises.length, 'registros');
        
    } catch (error) {
        console.error('❌ Error al cargar países:', error);
        alert('Error al cargar países de la base de datos');
    }
}

function nuevoPais() {
    console.log('➕ Abriendo modal de nuevo país...');
    
    try {
        crearModalPaisEmergencia();
        
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
        alert('Error: ' + error.message);
    }
}

function editarPais(id) {
    console.log('✏️ Editando país ID:', id);
    
    try {
        const pais = storageService.obtenerPorId('paises', id);
        if (!pais) {
            alert('País no encontrado');
            return;
        }
        
        crearModalPaisEmergencia();
        
        document.getElementById('paisModalTitle').textContent = 'Editar País';
        document.getElementById('paisForm').reset();
        document.getElementById('paisId').value = pais.id;
        document.getElementById('paisNombre').value = pais.nombre;
        document.getElementById('paisCapital').value = pais.capital;
        document.getElementById('paisPIB').value = pais.pib;
        document.getElementById('paisHabitantes').value = pais.habitantes;
        
        const modalElement = document.getElementById('paisModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
        
    } catch (error) {
        console.error('❌ Error en editarPais:', error);
        alert('Error: ' + error.message);
    }
}

// Actualizar guardarPais() para usar /api/admin/paises
async function guardarPais() {
    console.log('💾 Guardando país...');
    
    try {
        const form = document.getElementById('paisForm');
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const paisData = {
            nombre: document.getElementById('paisNombre').value,
            capital: document.getElementById('paisCapital').value,
            pib: parseInt(document.getElementById('paisPIB').value),
            habitantes: parseInt(document.getElementById('paisHabitantes').value)
        };
        
        const paisId = document.getElementById('paisId').value;
        
        let resultado;
        if (paisId) {
            // Editar país existente
            resultado = await window.holdingAPI.updatePais(paisId, paisData);
        } else {
            // Nuevo país
            resultado = await window.holdingAPI.createPais(paisData);
        }
        
        if (!resultado) {
            throw new Error('Error al guardar país');
        }
        
        // Cerrar modal
        const modalElement = document.getElementById('paisModal');
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
        }
        
        // Recargar tabla
        await cargarTablaPaises();
        
        alert('✅ País guardado correctamente');
        
    } catch (error) {
        console.error('❌ Error en guardarPais:', error);
        alert('Error al guardar país: ' + error.message);
    }
}

function eliminarPais(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este país?\n\nEsta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        // Verificar si hay empresas en este país
        const empresas = storageService.obtenerEmpresasExtended();
        const empresasEnPais = empresas.filter(emp => emp.pais === id);
        
        if (empresasEnPais.length > 0) {
            alert(`❌ No se puede eliminar el país porque tiene ${empresasEnPais.length} empresa(s) asociada(s)`);
            return;
        }
        
        if (storageService.eliminar('paises', id)) {
            cargarTablaPaises();
            alert('✅ País eliminado correctamente');
        } else {
            alert('❌ Error al eliminar el país');
        }
    } catch (error) {
        console.error('❌ Error en eliminarPais:', error);
        alert('Error al eliminar país: ' + error.message);
    }
}

// ===== CRUD ASESORES =====
// Actualizar cargarTablaAsesores() para usar /api/admin/asesores
async function cargarTablaAsesores() {
    console.log('🎓 Cargando tabla de asesores...');
    
    try {
        const response = await fetch('http://localhost:8080/api/admin/asesores');
        if (!response.ok) {
            throw new Error('Error al cargar asesores');
        }
        const asesores = await response.json();
        
        const tbody = document.getElementById('asesoresTableBody');
        
        if (!tbody) {
            console.log('❌ No se encontró la tabla de asesores');
            return;
        }
        
        if (asesores.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No hay asesores registrados</td></tr>`;
            return;
        }
        
        tbody.innerHTML = asesores.map(asesor => {
            return `
                <tr>
                    <td><strong>${asesor.codigo || asesor.id}</strong></td>
                    <td>${asesor.nombre}</td>
                    <td>${asesor.titulacion}</td>
                    <td>${asesor.areasMercado ? asesor.areasMercado.length : 0}</td>
                    <td>0</td> <!-- Empresas asesoradas - necesitarías otro endpoint -->
                    <td>
                        <span class="badge bg-success">Activo</span>
                    </td>
                    <td>
                        <div class="d-flex gap-1">
                            <button class="btn btn-sm btn-outline-primary" onclick="editarAsesor('${asesor.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-info" onclick="verDetalleAsesor('${asesor.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="eliminarAsesor('${asesor.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        
        console.log('✅ Tabla de asesores cargada:', asesores.length, 'registros');
        
    } catch (error) {
        console.error('❌ Error al cargar asesores:', error);
        alert('Error al cargar asesores de la base de datos');
    }
}

function nuevoAsesor() {
    console.log('➕ Abriendo modal de nuevo asesor...');
    
    try {
        crearModalAsesorEmergencia();
        
        document.getElementById('asesorModalTitle').textContent = 'Nuevo Asesor';
        document.getElementById('asesorForm').reset();
        document.getElementById('asesorCodigo').value = '';
        
        // Cargar áreas de mercado
        const areas = storageService.obtenerAreasMercado();
        const container = document.getElementById('areasCheckboxContainer');
        if (container) {
            container.innerHTML = areas.map(area => `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${area.id}" id="area-${area.id}">
                    <label class="form-check-label" for="area-${area.id}">
                        ${area.nombre} - ${area.descripcion}
                    </label>
                </div>
            `).join('');
        }
        
        const modalElement = document.getElementById('asesorModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
        
    } catch (error) {
        console.error('❌ Error en nuevoAsesor:', error);
        alert('Error: ' + error.message);
    }
}

function editarAsesor(codigo) {
    console.log('✏️ Editando asesor:', codigo);
    
    try {
        const asesor = storageService.obtenerPorId('asesores', codigo);
        if (!asesor) {
            alert('Asesor no encontrado');
            return;
        }
        
        crearModalAsesorEmergencia();
        
        document.getElementById('asesorModalTitle').textContent = 'Editar Asesor';
        document.getElementById('asesorForm').reset();
        document.getElementById('asesorCodigo').value = asesor.codigo;
        document.getElementById('asesorNombre').value = asesor.nombre;
        document.getElementById('asesorDireccion').value = asesor.direccion || '';
        document.getElementById('asesorTitulacion').value = asesor.titulacion;
        
        // Marcar áreas seleccionadas
        if (asesor.areas && asesor.areas.length > 0) {
            asesor.areas.forEach(areaId => {
                const checkbox = document.getElementById(`area-${areaId}`);
                if (checkbox) checkbox.checked = true;
            });
        }
        
        const modalElement = document.getElementById('asesorModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
        
    } catch (error) {
        console.error('❌ Error en editarAsesor:', error);
        alert('Error: ' + error.message);
    }
}

function guardarAsesor() {
    console.log('💾 Guardando asesor...');
    
    try {
        const form = document.getElementById('asesorForm');
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // Obtener áreas seleccionadas
        const areasSeleccionadas = [];
        const checkboxes = document.querySelectorAll('#areasCheckboxContainer input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            areasSeleccionadas.push(parseInt(checkbox.value));
        });
        
        const asesorData = {
            nombre: document.getElementById('asesorNombre').value,
            direccion: document.getElementById('asesorDireccion').value,
            titulacion: document.getElementById('asesorTitulacion').value,
            areas: areasSeleccionadas
        };
        
        const asesorCodigo = document.getElementById('asesorCodigo').value;
        
        if (asesorCodigo) {
            // Editar asesor existente
            storageService.actualizar('asesores', asesorCodigo, asesorData);
            console.log('✅ Asesor editado:', asesorData.nombre);
        } else {
            // Nuevo asesor
            storageService.crearAsesor(asesorData);
            console.log('✅ Nuevo asesor creado:', asesorData.nombre);
        }
        
        // Cerrar modal
        const modalElement = document.getElementById('asesorModal');
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
        }
        
        // Recargar tabla
        cargarTablaAsesores();
        
        alert('✅ Asesor guardado correctamente');
        
    } catch (error) {
        console.error('❌ Error en guardarAsesor:', error);
        alert('Error al guardar asesor: ' + error.message);
    }
}

function verDetalleAsesor(codigo) {
    const asesor = storageService.obtenerPorId('asesores', codigo);
    if (!asesor) {
        alert('Asesor no encontrado');
        return;
    }
    
    const asesorias = obtenerAsesoriasPorAsesor(codigo);
    const empresas = storageService.obtenerEmpresasExtended();
    const areas = storageService.obtenerAreasMercado();
    
    let detalle = `
        <strong>Detalle del Asesor</strong>
        <hr>
        <p><strong>Código:</strong> ${asesor.codigo}</p>
        <p><strong>Nombre:</strong> ${asesor.nombre}</p>
        <p><strong>Titulación:</strong> ${asesor.titulacion}</p>
        <p><strong>Dirección:</strong> ${asesor.direccion || 'No especificada'}</p>
        <p><strong>Estado:</strong> ${asesor.estado}</p>
        <p><strong>Total Asesorías:</strong> ${asesorias.length}</p>
    `;
    
    if (asesor.areas && asesor.areas.length > 0) {
        const areasNombres = asesor.areas.map(areaId => {
            const area = areas.find(a => a.id === areaId);
            return area ? area.nombre : 'Área desconocida';
        });
        detalle += `<p><strong>Áreas de Expertise:</strong> ${areasNombres.join(', ')}</p>`;
    }
    
    alert(detalle);
}

function eliminarAsesor(codigo) {
    if (!confirm('¿Estás seguro de que quieres eliminar este asesor?\n\nEsta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        // Verificar si tiene asesorías activas
        const asesorias = obtenerAsesoriasPorAsesor(codigo);
        if (asesorias.length > 0) {
            alert(`❌ No se puede eliminar el asesor porque tiene ${asesorias.length} asesoría(s) activa(s)`);
            return;
        }
        
        if (storageService.eliminar('asesores', codigo)) {
            cargarTablaAsesores();
            alert('✅ Asesor eliminado correctamente');
        } else {
            alert('❌ Error al eliminar el asesor');
        }
    } catch (error) {
        console.error('❌ Error en eliminarAsesor:', error);
        alert('Error al eliminar asesor: ' + error.message);
    }
}

// ===== REPORTES Y ESTADÍSTICAS =====
function cargarReportes() {
    console.log('📊 Cargando reportes...');
    
    try {
        const stats = storageService.obtenerEstadisticas();
        
        // Actualizar estadísticas principales
        actualizarElementoReporte('reporte-empresas', stats.totalEmpresas);
        actualizarElementoReporte('reporte-vendedores', stats.totalVendedores);
        actualizarElementoReporte('reporte-asesores', stats.totalAsesores);
        actualizarElementoReporte('reporte-facturacion', `$${(stats.facturacionTotal / 1000000).toFixed(1)}M`);
        
        // Cargar gráficos
        cargarGraficoEmpresasPorPais(stats.empresasPorPais);
        cargarGraficoVendedoresPorEmpresa(stats.vendedoresPorEmpresa);
        cargarReporteDetallado(stats);
        
    } catch (error) {
        console.error('❌ Error en cargarReportes:', error);
    }
}

function cargarGraficoEmpresasPorPais(datos) {
    const container = document.getElementById('chartEmpresasPais');
    if (!container) return;
    
    if (datos.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay datos para mostrar</p>';
        return;
    }
    
    // Simular gráfico con HTML (podrías integrar Chart.js después)
    container.innerHTML = `
        <div class="list-group">
            ${datos.map(item => `
                <div class="list-item">
                    <div class="item-content">
                        <h6>${item.pais}</h6>
                        <p>${item.cantidad} empresa(s)</p>
                    </div>
                    <div class="progress" style="width: 100px; height: 10px;">
                        <div class="progress-bar" style="width: ${(item.cantidad / Math.max(...datos.map(d => d.cantidad))) * 100}%"></div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function cargarGraficoVendedoresPorEmpresa(datos) {
    const container = document.getElementById('chartVendedoresEmpresa');
    if (!container) return;
    
    if (datos.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay datos para mostrar</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="list-group">
            ${datos.map(item => `
                <div class="list-item">
                    <div class="item-content">
                        <h6>${item.empresa}</h6>
                        <p>${item.cantidad} vendedor(es)</p>
                    </div>
                    <span class="badge bg-primary">${item.cantidad}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function cargarReporteDetallado(stats) {
    const container = document.getElementById('reporteDetallado');
    if (!container) return;
    
    container.innerHTML = `
        <div class="col-md-6">
            <div class="content-card">
                <div class="card-header">
                    <h6><i class="fas fa-chart-pie me-2"></i>Resumen General</h6>
                </div>
                <div class="card-body">
                    <div class="info-item">
                        <label>Total Empresas:</label>
                        <span>${stats.totalEmpresas}</span>
                    </div>
                    <div class="info-item">
                        <label>Total Vendedores:</label>
                        <span>${stats.totalVendedores}</span>
                    </div>
                    <div class="info-item">
                        <label>Total Asesores:</label>
                        <span>${stats.totalAsesores}</span>
                    </div>
                    <div class="info-item">
                        <label>Facturación Total:</label>
                        <span>$${(stats.facturacionTotal / 1000000).toFixed(1)}M</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="content-card">
                <div class="card-header">
                    <h6><i class="fas fa-trending-up me-2"></i>Métricas Clave</h6>
                </div>
                <div class="card-body">
                    <div class="info-item">
                        <label>Promedio Vendedores/Empresa:</label>
                        <span>${stats.totalEmpresas > 0 ? (stats.totalVendedores / stats.totalEmpresas).toFixed(1) : 0}</span>
                    </div>
                    <div class="info-item">
                        <label>Facturación Promedio:</label>
                        <span>$${stats.totalEmpresas > 0 ? ((stats.facturacionTotal / stats.totalEmpresas) / 1000000).toFixed(1) : 0}M</span>
                    </div>
                    <div class="info-item">
                        <label>Países con Operaciones:</label>
                        <span>${stats.empresasPorPais.filter(p => p.cantidad > 0).length}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function exportarReporte() {
    console.log('📤 Exportando reporte...');
    alert('✅ Función de exportación de reportes - En desarrollo');
    // Aquí podrías implementar exportación a PDF/Excel
}

// ===== FUNCIONES AUXILIARES =====
function actualizarElementoReporte(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.textContent = valor;
    }
}

// ===== MODALES DE EMERGENCIA (PARA ADMIN) =====
function crearModalPaisEmergencia() {
    if (document.getElementById('paisModal')) {
        console.log('✅ Modal de país ya existe');
        return;
    }
    
    console.log('🔄 Creando modal de país de emergencia...');
    
    const modalHTML = `
    <div class="modal fade" id="paisModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content cyber-modal">
                <div class="modal-header">
                    <h5 class="modal-title" id="paisModalTitle">Nuevo País</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="paisForm">
                        <input type="hidden" id="paisId">
                        <div class="row g-3">
                            <div class="col-12">
                                <label for="paisNombre" class="form-label">Nombre del País *</label>
                                <input type="text" class="form-control" id="paisNombre" required>
                            </div>
                            <div class="col-12">
                                <label for="paisCapital" class="form-label">Capital *</label>
                                <input type="text" class="form-control" id="paisCapital" required>
                            </div>
                            <div class="col-md-6">
                                <label for="paisPIB" class="form-label">PIB (millones USD) *</label>
                                <input type="number" class="form-control" id="paisPIB" required>
                            </div>
                            <div class="col-md-6">
                                <label for="paisHabitantes" class="form-label">Habitantes *</label>
                                <input type="number" class="form-control" id="paisHabitantes" required>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" onclick="guardarPais()">Guardar País</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    console.log('✅ Modal de país creado (emergencia)');
}

function crearModalAsesorEmergencia() {
    if (document.getElementById('asesorModal')) {
        console.log('✅ Modal de asesor ya existe');
        return;
    }
    
    console.log('🔄 Creando modal de asesor de emergencia...');
    
    const modalHTML = `
    <div class="modal fade" id="asesorModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content cyber-modal">
                <div class="modal-header">
                    <h5 class="modal-title" id="asesorModalTitle">Nuevo Asesor</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="asesorForm">
                        <input type="hidden" id="asesorCodigo">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="asesorNombre" class="form-label">Nombre *</label>
                                <input type="text" class="form-control" id="asesorNombre" required>
                            </div>
                            <div class="col-md-6">
                                <label for="asesorDireccion" class="form-label">Dirección</label>
                                <input type="text" class="form-control" id="asesorDireccion">
                            </div>
                            <div class="col-12">
                                <label for="asesorTitulacion" class="form-label">Titulación *</label>
                                <input type="text" class="form-control" id="asesorTitulacion" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Áreas de Expertise</label>
                                <div id="areasCheckboxContainer">
                                    <!-- Las áreas se cargan dinámicamente -->
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" onclick="guardarAsesor()">Guardar Asesor</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    console.log('✅ Modal de asesor creado (emergencia)');
}

// ===== EXPORTAR FUNCIONES ADMIN =====
window.cargarTablaPaises = cargarTablaPaises;
window.nuevoPais = nuevoPais;
window.editarPais = editarPais;
window.guardarPais = guardarPais;
window.eliminarPais = eliminarPais;

window.cargarTablaAsesores = cargarTablaAsesores;
window.nuevoAsesor = nuevoAsesor;
window.guardarAsesor = guardarAsesor;
window.editarAsesor = editarAsesor;
window.verDetalleAsesor = verDetalleAsesor;
window.eliminarAsesor = eliminarAsesor;

window.cargarReportes = cargarReportes;
window.exportarReporte = exportarReporte;

window.crearModalPaisEmergencia = crearModalPaisEmergencia;
window.crearModalAsesorEmergencia = crearModalAsesorEmergencia;

console.log("🛠️ Funciones CRUD de Administrador cargadas correctamente");