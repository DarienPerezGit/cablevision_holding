// ===== CONFIGURACIÓN INICIAL =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Dashboard Admin inicializado');
    setupEventListeners();
});

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Toggle sidebar en móviles
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // Navegación del sidebar
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    console.log('✅ Event listeners configurados');
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// ===== NAVEGACIÓN =====
function handleNavigation(e) {
    e.preventDefault();
    
    const target = e.currentTarget.getAttribute('href');
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    
    // Remover clase active de todos los enlaces
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Agregar clase active al enlace clickeado
    e.currentTarget.classList.add('active');
    
    // Cargar contenido según la sección
    loadSectionContent(target);
}

function loadSectionContent(section) {
    const contentTitle = document.getElementById('contentTitle');
    const mainContent = document.getElementById('mainContent');
    
    if (!mainContent) {
        console.log('❌ No se encontró el contenedor principal');
        return;
    }
    
    switch(section) {
        case '#empresas':
            contentTitle.textContent = 'Gestión de Empresas';
            loadEmpresasContent(mainContent);
            break;
        case '#vendedores':
            contentTitle.textContent = 'Gestión de Vendedores';
            loadVendedoresContent(mainContent);
            break;
        case '#asesores':
            contentTitle.textContent = 'Gestión de Asesores';
            loadAsesoresContent(mainContent);
            break;
        case '#paises':
            contentTitle.textContent = 'Gestión de Países';
            loadPaisesContent(mainContent);
            break;
        case '#reportes':
            contentTitle.textContent = 'Reportes y Estadísticas';
            loadReportesContent(mainContent);
            break;
        case '#dashboard':
        default:
            contentTitle.textContent = 'Dashboard Principal';
            loadDashboardContent(mainContent);
    }
    
    console.log('✅ Sección cargada:', section);
}

// ===== DASHBOARD PRINCIPAL =====
function loadDashboardContent(container = null) {
    const targetContainer = container || document.getElementById('mainContent');
    
    targetContainer.innerHTML = `
        <!-- Stats Cards -->
        <section class="stats-section">
            <div class="row g-4">
                <div class="col-xl-3 col-md-6">
                    <div class="stat-card">
                        <div class="stat-icon empresa">
                            <i class="fas fa-building"></i>
                        </div>
                        <div class="stat-info">
                            <h3 id="empresas-count">24</h3>
                            <p>Empresas Activas</p>
                            <span class="stat-trend positive">
                                <i class="fas fa-arrow-up"></i> 12%
                            </span>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6">
                    <div class="stat-card">
                        <div class="stat-icon vendedor">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-info">
                            <h3 id="vendedores-count">1,847</h3>
                            <p>Total Vendedores</p>
                            <span class="stat-trend positive">
                                <i class="fas fa-arrow-up"></i> 8%
                            </span>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6">
                    <div class="stat-card">
                        <div class="stat-icon asesor">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <div class="stat-info">
                            <h3 id="asesores-count">156</h3>
                            <p>Asesores Activos</p>
                            <span class="stat-trend positive">
                                <i class="fas fa-arrow-up"></i> 5%
                            </span>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6">
                    <div class="stat-card">
                        <div class="stat-icon facturacion">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="stat-info">
                            <h3 id="facturacion-total">$45.2M</h3>
                            <p>Facturación Anual</p>
                            <span class="stat-trend positive">
                                <i class="fas fa-arrow-up"></i> 15%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Main Content Grid -->
        <section class="content-grid">
            <div class="row g-4">
                <div class="col-lg-6">
                    <div class="content-card">
                        <div class="card-header">
                            <h4><i class="fas fa-building me-2"></i>Empresas Recientes</h4>
                            <a href="#empresas" class="btn-link">Ver Todas</a>
                        </div>
                        <div class="card-body">
                            <div class="list-group">
                                <div class="list-item">
                                    <div class="item-icon empresa">
                                        <i class="fas fa-satellite"></i>
                                    </div>
                                    <div class="item-content">
                                        <h6>CyberTel S.A.</h6>
                                        <p>España · Telecomunicaciones</p>
                                    </div>
                                    <div class="item-badge success">Activa</div>
                                </div>
                                <div class="list-item">
                                    <div class="item-icon empresa">
                                        <i class="fas fa-tv"></i>
                                    </div>
                                    <div class="item-content">
                                        <h6>Vision Media Group</h6>
                                        <p>México · Entretenimiento</p>
                                    </div>
                                    <div class="item-badge success">Activa</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="content-card">
                        <div class="card-header">
                            <h4><i class="fas fa-trophy me-2"></i>Vendedores Destacados</h4>
                            <a href="#vendedores" class="btn-link">Ver Ranking</a>
                        </div>
                        <div class="card-body">
                            <div class="list-group">
                                <div class="list-item">
                                    <div class="item-icon vendedor">
                                        <i class="fas fa-user"></i>
                                    </div>
                                    <div class="item-content">
                                        <h6>María González</h6>
                                        <p>15 captaciones · $245K</p>
                                    </div>
                                </div>
                                <div class="list-item">
                                    <div class="item-icon vendedor">
                                        <i class="fas fa-user"></i>
                                    </div>
                                    <div class="item-content">
                                        <h6>Carlos Rodríguez</h6>
                                        <p>12 captaciones · $198K</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

// ===== GESTIÓN DE EMPRESAS =====
function loadEmpresasContent(container = null) {
    const targetContainer = container || document.getElementById('mainContent');
    
    targetContainer.innerHTML = `
        <div class="row">
            <div class="col-12">
                <div class="content-card">
                    <div class="card-header">
                        <h4><i class="fas fa-building me-2"></i>Gestión de Empresas</h4>
                        <button class="btn btn-success btn-sm" onclick="nuevaEmpresa()">
                            <i class="fas fa-plus me-2"></i>Nueva Empresa
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-dark table-hover">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>País</th>
                                        <th>Área</th>
                                        <th>Facturación</th>
                                        <th>Vendedores</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="empresasTableBody">
                                    <!-- Las empresas se cargan aquí dinámicamente -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Cargar datos después de que se renderice el HTML
    setTimeout(() => {
        if (typeof cargarTablaEmpresas === 'function') {
            cargarTablaEmpresas();
        }
    }, 100);
}

// ===== GESTIÓN DE VENDEDORES =====
function loadVendedoresContent(container = null) {
    const targetContainer = container || document.getElementById('mainContent');
    
    targetContainer.innerHTML = `
        <div class="row">
            <div class="col-12">
                <div class="content-card">
                    <div class="card-header">
                        <h4><i class="fas fa-users me-2"></i>Gestión de Vendedores</h4>
                        <button class="btn btn-success btn-sm" onclick="nuevoVendedor()">
                            <i class="fas fa-plus me-2"></i>Nuevo Vendedor
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-dark table-hover">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Nombre</th>
                                        <th>Empresa</th>
                                        <th>Captador</th>
                                        <th>Nivel</th>
                                        <th>Fecha Captación</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="vendedoresTableBody">
                                    <!-- Los vendedores se cargan aquí dinámicamente -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Jerarquía de Vendedores -->
        <div class="row mt-4">
            <div class="col-12">
                <div class="content-card">
                    <div class="card-header">
                        <h4><i class="fas fa-sitemap me-2"></i>Jerarquía Piramidal</h4>
                    </div>
                    <div class="card-body">
                        <div id="jerarquiaContainer">
                            <!-- La jerarquía se carga aquí -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Cargar datos después de que se renderice el HTML
    setTimeout(() => {
        if (typeof cargarTablaVendedores === 'function') {
            cargarTablaVendedores();
        }
        if (typeof cargarJerarquiaVendedores === 'function') {
            cargarJerarquiaVendedores();
        }
    }, 100);
}

// ===== GESTIÓN DE ASESORES =====
function loadAsesoresContent(container = null) {
    const targetContainer = container || document.getElementById('mainContent');
    
    targetContainer.innerHTML = `
        <div class="row">
            <div class="col-12">
                <div class="content-card">
                    <div class="card-header">
                        <h4><i class="fas fa-user-tie me-2"></i>Gestión de Asesores</h4>
                        <button class="btn btn-success btn-sm" onclick="nuevoAsesor()">
                            <i class="fas fa-plus me-2"></i>Nuevo Asesor
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-dark table-hover">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Nombre</th>
                                        <th>Titulación</th>
                                        <th>Áreas</th>
                                        <th>Empresas</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="asesoresTableBody">
                                    <!-- Los asesores se cargan aquí dinámicamente -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        if (typeof cargarTablaAsesores === 'function') {
            cargarTablaAsesores();
        }
    }, 100);
}

// ===== GESTIÓN DE PAÍSES =====
function loadPaisesContent(container = null) {
    const targetContainer = container || document.getElementById('mainContent');
    
    targetContainer.innerHTML = `
        <div class="row">
            <div class="col-12">
                <div class="content-card">
                    <div class="card-header">
                        <h4><i class="fas fa-globe-americas me-2"></i>Gestión de Países</h4>
                        <button class="btn btn-success btn-sm" onclick="nuevoPais()">
                            <i class="fas fa-plus me-2"></i>Nuevo País
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-dark table-hover">
                                <thead>
                                    <tr>
                                        <th>País</th>
                                        <th>Capital</th>
                                        <th>PIB (Millones USD)</th>
                                        <th>Habitantes</th>
                                        <th>Empresas</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="paisesTableBody">
                                    <!-- Los países se cargan aquí dinámicamente -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        if (typeof cargarTablaPaises === 'function') {
            cargarTablaPaises();
        }
    }, 100);
}

// ===== REPORTES Y ESTADÍSTICAS =====
function loadReportesContent(container = null) {
    const targetContainer = container || document.getElementById('mainContent');
    
    targetContainer.innerHTML = `
        <div class="row">
            <!-- Estadísticas Principales -->
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="stat-card">
                    <div class="stat-icon empresa">
                        <i class="fas fa-building"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="reporte-empresas">0</h3>
                        <p>Total Empresas</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="stat-card">
                    <div class="stat-icon vendedor">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="reporte-vendedores">0</h3>
                        <p>Total Vendedores</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="stat-card">
                    <div class="stat-icon asesor">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="reporte-asesores">0</h3>
                        <p>Total Asesores</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="stat-card">
                    <div class="stat-icon facturacion">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-info">
                        <h3 id="reporte-facturacion">$0</h3>
                        <p>Facturación Total</p>
                    </div>
                </div>
            </div>

            <!-- Empresas por País -->
            <div class="col-lg-6 mb-4">
                <div class="content-card">
                    <div class="card-header">
                        <h4><i class="fas fa-chart-pie me-2"></i>Empresas por País</h4>
                    </div>
                    <div class="card-body">
                        <div id="chartEmpresasPais">
                            <!-- Gráfico se carga aquí -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Vendedores por Empresa -->
            <div class="col-lg-6 mb-4">
                <div class="content-card">
                    <div class="card-header">
                        <h4><i class="fas fa-chart-bar me-2"></i>Vendedores por Empresa</h4>
                    </div>
                    <div class="card-body">
                        <div id="chartVendedoresEmpresa">
                            <!-- Gráfico se carga aquí -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Reporte Detallado -->
            <div class="col-12">
                <div class="content-card">
                    <div class="card-header">
                        <h4><i class="fas fa-list me-2"></i>Reporte Detallado</h4>
                        <button class="btn btn-primary btn-sm" onclick="exportarReporte()">
                            <i class="fas fa-download me-2"></i>Exportar PDF
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="row" id="reporteDetallado">
                            <!-- Reporte detallado se carga aquí -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        if (typeof cargarReportes === 'function') {
            cargarReportes();
        }
    }, 100);
}