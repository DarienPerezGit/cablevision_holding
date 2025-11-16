// ===== MODALES AVANZADOS PARA CRUD =====
// admin-modals.js - Generación dinámica de modales con validaciones

async function crearModalPaisAvanzado() {
    // Verificar si ya existe el modal
    let modalElement = document.getElementById('paisModal');
    
    if (!modalElement) {
        const modalHTML = `
            <div class="modal fade" id="paisModal" tabindex="-1" aria-labelledby="paisModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="paisModalTitle">País</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="paisForm" novalidate>
                                <input type="hidden" id="paisId" name="paisId">
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="paisNombre" class="form-label">
                                                <i class="fas fa-flag me-2"></i>Nombre del País *
                                            </label>
                                            <input type="text" class="form-control" id="paisNombre" name="paisNombre" 
                                                   placeholder="Ej: Argentina" maxlength="100" required>
                                            <div class="invalid-feedback">
                                                El nombre del país es obligatorio (mínimo 2 caracteres)
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="paisCapital" class="form-label">
                                                <i class="fas fa-city me-2"></i>Capital *
                                            </label>
                                            <input type="text" class="form-control" id="paisCapital" name="paisCapital" 
                                                   placeholder="Ej: Buenos Aires" maxlength="100" required>
                                            <div class="invalid-feedback">
                                                El nombre de la capital es obligatorio
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="paisPib" class="form-label">
                                                <i class="fas fa-chart-line me-2"></i>PIB (USD) *
                                            </label>
                                            <div class="input-group">
                                                <span class="input-group-text">$</span>
                                                <input type="number" class="form-control" id="paisPib" name="paisPib" 
                                                       placeholder="637485000000" min="1" step="1000000" required>
                                                <div class="invalid-feedback">
                                                    El PIB debe ser un número mayor a cero
                                                </div>
                                            </div>
                                            <div class="form-text">PIB en dólares estadounidenses</div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="paisHabitantes" class="form-label">
                                                <i class="fas fa-users me-2"></i>Número de Habitantes *
                                            </label>
                                            <input type="number" class="form-control" id="paisHabitantes" name="paisHabitantes" 
                                                   placeholder="45195777" min="1" step="1" required>
                                            <div class="invalid-feedback">
                                                El número de habitantes debe ser mayor a cero
                                            </div>
                                            <div class="form-text">Población total del país</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-12">
                                        <div class="alert alert-info">
                                            <i class="fas fa-info-circle me-2"></i>
                                            <strong>Información:</strong> Los campos marcados con (*) son obligatorios.
                                            El país se podrá eliminar solo si no tiene empresas asociadas.
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Vista previa de cálculos -->
                                <div id="paisPreview" class="row mt-3" style="display: none;">
                                    <div class="col-12">
                                        <div class="card bg-light">
                                            <div class="card-body">
                                                <h6 class="card-title">Vista Previa</h6>
                                                <div class="row text-center">
                                                    <div class="col-md-4">
                                                        <div class="text-muted small">PIB per cápita</div>
                                                        <div class="fw-bold" id="pibPerCapita">-</div>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <div class="text-muted small">PIB (Billones USD)</div>
                                                        <div class="fw-bold" id="pibBillones">-</div>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <div class="text-muted small">Población (Millones)</div>
                                                        <div class="fw-bold" id="pobMillones">-</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="fas fa-times me-2"></i>Cancelar
                            </button>
                            <button type="button" class="btn btn-primary" onclick="guardarPais()">
                                <i class="fas fa-save me-2"></i>Guardar País
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modalElement = document.getElementById('paisModal');
        
        // Agregar validaciones en tiempo real
        agregarValidacionesPais();
    }
    
    return modalElement;
}

function agregarValidacionesPais() {
    const form = document.getElementById('paisForm');
    const pibInput = document.getElementById('paisPib');
    const habitantesInput = document.getElementById('paisHabitantes');
    
    // Validación en tiempo real
    function validarCampo(input) {
        const value = input.value.trim();
        const isValid = input.checkValidity() && value.length > 0;
        
        input.classList.toggle('is-valid', isValid);
        input.classList.toggle('is-invalid', !isValid);
        
        return isValid;
    }
    
    // Eventos de validación
    form.querySelectorAll('input[required]').forEach(input => {
        input.addEventListener('blur', () => validarCampo(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('is-invalid')) {
                validarCampo(input);
            }
            actualizarVistaPreviaPais();
        });
    });
    
    // Validaciones específicas para números
    [pibInput, habitantesInput].forEach(input => {
        input.addEventListener('input', function() {
            // Remover caracteres no numéricos excepto puntos
            this.value = this.value.replace(/[^0-9.]/g, '');
            
            // Solo permitir un punto decimal
            const parts = this.value.split('.');
            if (parts.length > 2) {
                this.value = parts[0] + '.' + parts.slice(1).join('');
            }
        });
    });
}

function actualizarVistaPreviaPais() {
    const pib = parseFloat(document.getElementById('paisPib').value) || 0;
    const habitantes = parseInt(document.getElementById('paisHabitantes').value) || 0;
    
    if (pib > 0 && habitantes > 0) {
        const pibPerCapita = pib / habitantes;
        const pibBillones = pib / 1000000000;
        const pobMillones = habitantes / 1000000;
        
        document.getElementById('pibPerCapita').textContent = `$${formatearNumero(pibPerCapita)}`;
        document.getElementById('pibBillones').textContent = `$${formatearNumero(pibBillones)}B`;
        document.getElementById('pobMillones').textContent = `${formatearNumero(pobMillones)}M`;
        
        document.getElementById('paisPreview').style.display = 'block';
    } else {
        document.getElementById('paisPreview').style.display = 'none';
    }
}

// ===== MODAL PARA VER DETALLES DE PAÍS =====

async function verDetallesPais(id) {
    try {
        const paises = await window.holdingAPI.getPaises();
        const empresas = await window.holdingAPI.getEmpresas();
        const pais = paises.find(p => p.id === id);
        
        if (!pais) {
            mostrarNotificacion('País no encontrado', 'error');
            return;
        }
        
        const empresasEnPais = empresas.filter(emp => emp.paisSedeId === id);
        
        const modalHTML = `
            <div class="modal fade" id="paisDetalleModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-info text-white">
                            <h5 class="modal-title">
                                <i class="fas fa-flag me-2"></i>${pais.nombre}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="card h-100">
                                        <div class="card-header">
                                            <h6 class="mb-0"><i class="fas fa-info-circle me-2"></i>Información General</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <strong>País:</strong> ${pais.nombre}
                                            </div>
                                            <div class="mb-3">
                                                <strong>Capital:</strong> ${pais.capital}
                                            </div>
                                            <div class="mb-3">
                                                <strong>PIB:</strong> $${formatearNumero(pais.pib / 1000000000)}B USD
                                            </div>
                                            <div class="mb-3">
                                                <strong>Habitantes:</strong> ${formatearNumero(pais.habitantes / 1000000)}M
                                            </div>
                                            <div class="mb-3">
                                                <strong>PIB per cápita:</strong> $${formatearNumero(pais.pib / pais.habitantes)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="card h-100">
                                        <div class="card-header">
                                            <h6 class="mb-0"><i class="fas fa-building me-2"></i>Empresas (${empresasEnPais.length})</h6>
                                        </div>
                                        <div class="card-body">
                                            ${empresasEnPais.length > 0 ? 
                                                empresasEnPais.map(emp => `
                                                    <div class="mb-2 p-2 border rounded">
                                                        <strong>${emp.nombre}</strong>
                                                        <br><small class="text-muted">${emp.ciudadSede}</small>
                                                    </div>
                                                `).join('') :
                                                '<div class="text-center text-muted py-3">No hay empresas registradas en este país</div>'
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-primary" onclick="editarPais(${pais.id}); bootstrap.Modal.getInstance(document.getElementById('paisDetalleModal')).hide();">
                                <i class="fas fa-edit me-2"></i>Editar País
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remover modal anterior si existe
        const modalAnterior = document.getElementById('paisDetalleModal');
        if (modalAnterior) modalAnterior.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = new bootstrap.Modal(document.getElementById('paisDetalleModal'));
        modal.show();
        
    } catch (error) {
        console.error('Error al mostrar detalles:', error);
        mostrarNotificacion('Error al cargar detalles del país', 'error');
    }
}

// ===== FUNCIÓN DE PAGINACIÓN =====

function actualizarPaginacion(totalItems, entityType) {
    const totalPages = Math.ceil(totalItems / crudManager.itemsPerPage);
    const currentPage = crudManager.currentPage;
    
    let paginationContainer = document.getElementById(`${entityType}Pagination`);
    
    if (!paginationContainer) {
        // Crear contenedor de paginación si no existe
        const tableContainer = document.getElementById(`${entityType}TableBody`)?.closest('.table-responsive');
        if (tableContainer) {
            paginationContainer = document.createElement('nav');
            paginationContainer.id = `${entityType}Pagination`;
            paginationContainer.className = 'mt-3';
            tableContainer.parentNode.insertBefore(paginationContainer, tableContainer.nextSibling);
        }
    }
    
    if (!paginationContainer || totalPages <= 1) {
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <div class="text-muted small">
                Mostrando ${Math.min((currentPage - 1) * crudManager.itemsPerPage + 1, totalItems)} - 
                ${Math.min(currentPage * crudManager.itemsPerPage, totalItems)} de ${totalItems} registros
            </div>
            <ul class="pagination pagination-sm mb-0">
    `;
    
    // Botón anterior
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="crudManager.changePage(${currentPage - 1}); return false;">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `;
    
    // Números de página
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="crudManager.changePage(${i}); return false;">${i}</a>
            </li>
        `;
    }
    
    // Botón siguiente
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="crudManager.changePage(${currentPage + 1}); return false;">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;
    
    paginationHTML += `</ul></div>`;
    
    paginationContainer.innerHTML = paginationHTML;
}

console.log('✅ Modales avanzados para CRUD cargados correctamente');