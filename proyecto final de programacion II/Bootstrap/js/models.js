// ===== MODELOS DE DATOS CYBERVISION HOLDING =====
// models.js - Solo Frontend - VERSIÓN CORREGIDA

// ===== MODELO PAÍS =====
class Pais {
    constructor(id, nombre, pib, habitantes, capital) {
        this.id = id;
        this.nombre = nombre;
        this.pib = pib;
        this.habitantes = habitantes;
        this.capital = capital;
        this.empresas = [];
        this.fechaRegistro = new Date().toISOString();
    }
}
// ===== MODELO ASESORÍA =====
class Asesoria {
    constructor(id, asesorId, empresaId, areaId, fechaInicio, descripcion, estado = 'En curso', horasAsesoradas = 0, proximaReunion = null) {
        this.id = id;
        this.asesorId = asesorId;
        this.empresaId = empresaId;
        this.areaId = areaId;
        this.fechaInicio = fechaInicio;
        this.descripcion = descripcion;
        this.estado = estado;
        this.horasAsesoradas = horasAsesoradas;
        this.proximaReunion = proximaReunion;
        this.fechaRegistro = new Date().toISOString();
    }
}

// ===== MODELO ÁREA DE MERCADO =====
class AreaMercado {
    constructor(id, nombre, descripcion) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.empresas = [];
        this.asesores = [];
        this.fechaRegistro = new Date().toISOString();
    }
}

// ===== MODELO VENDEDOR =====
class Vendedor {
    constructor(codigo, nombre, direccion, empresaId, captadorId = null, fechaCaptacion = null) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.direccion = direccion;
        this.empresaId = empresaId;
        this.captadorId = captadorId;
        this.fechaCaptacion = fechaCaptacion || new Date().toISOString();
        this.nivel = 1;
        this.estado = 'activo';
        this.captaciones = [];
        this.fechaRegistro = new Date().toISOString();
    }
}

// ===== MODELO ASESOR =====
class Asesor {
    constructor(codigo, nombre, direccion, titulacion) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.direccion = direccion;
        this.titulacion = titulacion;
        this.areas = [];
        this.empresas = [];
        this.estado = 'activo';
        this.fechaRegistro = new Date().toISOString();
    }
}

// ===== MODELO CAPTACIÓN =====
class Captacion {
    constructor(id, captadorId, captadoId, empresaId, fechaCaptacion) {
        this.id = id;
        this.captadorId = captadorId;
        this.captadoId = captadoId;
        this.empresaId = empresaId;
        this.fechaCaptacion = fechaCaptacion;
    }
}

// ===== MODELO EMPRESA =====
class Empresa {
    constructor(id, nombre, pais, ciudad, area, estado = 'Activa', facturacion = 0, vendedores = 0, fechaIngreso = null, descripcion = '') {
        this.id = id;
        this.nombre = nombre;
        this.pais = pais;
        this.ciudad = ciudad;
        this.area = area;
        this.estado = estado;
        this.facturacion = facturacion;
        this.vendedores = vendedores;
        this.fechaIngreso = fechaIngreso || new Date().toISOString().split('T')[0];
        this.descripcion = descripcion;
        this.paisesOperacion = [pais];
        this.asesores = [];
        this.areaId = 1;
    }
}

// ===== DATOS INICIALES COMPLETOS =====
const initialData = {
    paises: [
        new Pais(1, "España", 1394000, 47420000, "Madrid"),
        new Pais(2, "México", 1293000, 126700000, "Ciudad de México"),
        new Pais(3, "Argentina", 487200, 45380000, "Buenos Aires"),
        new Pais(4, "Colombia", 314500, 50880000, "Bogotá"),
        new Pais(5, "Chile", 317100, 19160000, "Santiago")
    ],

    areasMercado: [
        new AreaMercado(1, "Telecomunicaciones", "Servicios de comunicación y conectividad"),
        new AreaMercado(2, "Entretenimiento", "Contenido audiovisual y servicios de ocio"),
        new AreaMercado(3, "Streaming", "Plataformas de contenido en línea"),
        new AreaMercado(4, "Tecnología", "Desarrollo e innovación tecnológica"),
        new AreaMercado(5, "Medios", "Medios de comunicación tradicionales y digitales")
    ],

    empresas: [
        new Empresa(1, "CyberTel S.A.", "España", "Madrid", "Telecomunicaciones", "Activa", 12500000, 450, "2023-01-15", "Empresa líder en telecomunicaciones"),
        new Empresa(2, "Vision Media Group", "México", "Ciudad de México", "Entretenimiento", "Activa", 8900000, 320, "2023-03-22", "Grupo de entretenimiento y medios"),
        new Empresa(3, "NetStream Argentina", "Argentina", "Buenos Aires", "Streaming", "Pendiente", 0, 0, "2024-01-10", "Plataforma de streaming emergente")
    ],

    vendedores: [
        new Vendedor("V001", "María González", "Av. Principal 123, Madrid", 1),
        new Vendedor("V002", "Carlos Rodríguez", "Calle Secundaria 456, Barcelona", 1, "V001", "2024-01-15"),
        new Vendedor("V003", "Ana López", "Paseo Reforma 789, CDMX", 2, "V001", "2024-02-01"),
        new Vendedor("V004", "Pedro Martínez", "Av. Libertador 321, Buenos Aires", 3)
    ],

    asesores: [
        new Asesor("A001", "Dr. Roberto Silva", "Av. Tecnología 555, Madrid", "PhD en Telecomunicaciones"),
        new Asesor("A002", "Dra. Elena Torres", "Calle Innovación 777, Barcelona", "Máster en Gestión Empresarial"),
        new Asesor("A003", "Ing. Javier Morales", "Paseo Desarrollo 888, CDMX", "Ingeniería en Sistemas")
    ],

    captaciones: [
        new Captacion(1, "V001", "V002", 1, "2024-01-15"),
        new Captacion(2, "V001", "V003", 1, "2024-02-01")
    ]
};

// ===== AGREGAR USERNAMES A VENDEDORES Y ASESORES =====
function agregarUsernames() {
    console.log("👤 Agregando usernames...");
    
    // Agregar usernames a vendedores
    initialData.vendedores.forEach((vendedor) => {
        if (vendedor.codigo === "V001") vendedor.username = "vendedor1";
        if (vendedor.codigo === "V003") vendedor.username = "vendedor2";
    });

    // Agregar usernames a asesores
    initialData.asesores.forEach((asesor) => {
        if (asesor.codigo === "A001") asesor.username = "asesor1";
    });
    
    console.log("✅ Usernames agregados correctamente");
}

// Ejecutar la función para agregar usernames
agregarUsernames();

// ===== INICIALIZACIÓN MEJORADA =====
function inicializarModelos() {
    console.log("🔄 Inicializando modelos de datos...");

    // Inicializar cada modelo si no existe
    const modelos = ['paises', 'areasMercado', 'empresas', 'vendedores', 'asesores', 'captaciones'];
    
    modelos.forEach(modelo => {
        if (!localStorage.getItem(modelo)) {
            localStorage.setItem(modelo, JSON.stringify(initialData[modelo]));
            console.log(`✅ ${modelo} inicializado con ${initialData[modelo].length} registros`);
        } else {
            console.log(`📁 ${modelo} ya existe en localStorage`);
        }
    });

    // Inicializar empresasExtended si no existe
    if (!localStorage.getItem('empresasExtended')) {
        console.log("🔄 Creando empresasExtended...");
        const empresasExistentes = JSON.parse(localStorage.getItem('empresas') || '[]');
        
        const empresasExtended = empresasExistentes.map((emp, index) => {
            // Encontrar el área correspondiente
            const area = initialData.areasMercado.find(a => a.nombre === emp.area);
            const areaId = area ? area.id : (index % 5) + 1;
            
            // Obtener vendedores de esta empresa
            const vendedoresEmpresa = JSON.parse(localStorage.getItem('vendedores') || '[]')
                .filter(v => v.empresaId === emp.id)
                .map(v => v.codigo);
            
            return {
                ...emp,
                id: emp.id,
                nombre: emp.nombre,
                paisSede: emp.pais,
                ciudadSede: emp.ciudad,
                area: emp.area,
                areaId: areaId,
                estado: emp.estado,
                facturacion: emp.facturacion || 0,
                vendedores: vendedoresEmpresa,
                fechaIngreso: emp.fechaIngreso,
                descripcion: emp.descripcion,
                paisesOperacion: [emp.pais],
                asesores: []
            };
        });
        
        localStorage.setItem('empresasExtended', JSON.stringify(empresasExtended));
        console.log(`✅ empresasExtended inicializado con ${empresasExtended.length} empresas`);
    } else {
        console.log("📁 empresasExtended ya existe en localStorage");
    }

    console.log("🎯 Modelos de datos listos");
    
    // Mostrar resumen de datos
    mostrarResumenDatos();
}

// ===== MOSTRAR RESUMEN DE DATOS =====
function mostrarResumenDatos() {
    console.log("📊 RESUMEN DE DATOS INICIALIZADOS:");
    console.log("=================================");
    
    const modelos = ['paises', 'areasMercado', 'empresas', 'vendedores', 'asesores', 'captaciones', 'empresasExtended'];
    
    modelos.forEach(modelo => {
        const datos = localStorage.getItem(modelo);
        if (datos) {
            const parsed = JSON.parse(datos);
            console.log(`- ${modelo}: ${parsed.length} registros`);
        } else {
            console.log(`- ${modelo}: No existe`);
        }
    });
    
    console.log("👤 Vendedores con usernames:");
    const vendedores = JSON.parse(localStorage.getItem('vendedores') || '[]');
    vendedores.forEach(v => {
        if (v.username) {
            console.log(`  - ${v.username} -> ${v.nombre} (${v.codigo})`);
        }
    });
}

// ===== FUNCIONES UTILIDAD MEJORADAS =====
function generarCodigoVendedor() {
    const vendedores = JSON.parse(localStorage.getItem('vendedores') || '[]');
    const ultimoCodigo = vendedores.length > 0 ? 
        Math.max(...vendedores.map(v => parseInt(v.codigo.substring(1)))) : 0;
    const nuevoNumero = ultimoCodigo + 1;
    return `V${nuevoNumero.toString().padStart(3, '0')}`;
}

function generarCodigoAsesor() {
    const asesores = JSON.parse(localStorage.getItem('asesores') || '[]');
    const ultimoCodigo = asesores.length > 0 ? 
        Math.max(...asesores.map(a => parseInt(a.codigo.substring(1)))) : 0;
    const nuevoNumero = ultimoCodigo + 1;
    return `A${nuevoNumero.toString().padStart(3, '0')}`;
}

function calcularNivelVendedor(vendedorId) {
    const captaciones = JSON.parse(localStorage.getItem('captaciones') || '[]');
    let nivel = 1;
    let captadorId = vendedorId;

    // Subir por la jerarquía hasta encontrar el vendedor raíz
    while (true) {
        const captacion = captaciones.find(c => c.captadoId === captadorId);
        if (!captacion) break;
        nivel++;
        captadorId = captacion.captadorId;
    }

    return nivel;
}

// ===== FUNCIONES DE BÚSQUEDA MEJORADAS =====
function buscarVendedorPorUsername(username) {
    const vendedores = JSON.parse(localStorage.getItem('vendedores') || '[]');
    const vendedor = vendedores.find(v => v.username === username);
    console.log(`🔍 Buscando vendedor por username '${username}':`, vendedor ? 'Encontrado' : 'No encontrado');
    return vendedor;
}

function buscarVendedorPorCodigo(codigo) {
    const vendedores = JSON.parse(localStorage.getItem('vendedores') || '[]');
    const vendedor = vendedores.find(v => v.codigo === codigo);
    console.log(`🔍 Buscando vendedor por código '${codigo}':`, vendedor ? 'Encontrado' : 'No encontrado');
    return vendedor;
}

function buscarAsesorPorUsername(username) {
    const asesores = JSON.parse(localStorage.getItem('asesores') || '[]');
    const asesor = asesores.find(a => a.username === username);
    console.log(`🔍 Buscando asesor por username '${username}':`, asesor ? 'Encontrado' : 'No encontrado');
    return asesor;
}

// ===== FUNCIONES DE VALIDACIÓN =====
function validarEmpresaId(empresaId) {
    const empresas = JSON.parse(localStorage.getItem('empresas') || '[]');
    return empresas.some(emp => emp.id === empresaId);
}

function obtenerEmpresaPorId(empresaId) {
    const empresas = JSON.parse(localStorage.getItem('empresas') || '[]');
    return empresas.find(emp => emp.id === empresaId);
}

function obtenerAreasMercado() {
    return JSON.parse(localStorage.getItem('areasMercado') || '[]');
}

// ===== LIMPIAR Y RESETEAR DATOS (PARA DESARROLLO) =====
function resetearDatos() {
    console.log("🔄 Restableciendo todos los datos...");
    
    const modelos = ['paises', 'areasMercado', 'empresas', 'vendedores', 'asesores', 'captaciones', 'empresasExtended'];
    
    modelos.forEach(modelo => {
        localStorage.removeItem(modelo);
        console.log(`🗑️  ${modelo} eliminado`);
    });
    
    // Volver a inicializar
    inicializarModelos();
    console.log("✅ Datos restablecidos correctamente");
}

// ===== EXPORTAR =====
window.Pais = Pais;
window.AreaMercado = AreaMercado;
window.Vendedor = Vendedor;
window.Asesor = Asesor;
window.Captacion = Captacion;
window.Empresa = Empresa;
window.inicializarModelos = inicializarModelos;
window.generarCodigoVendedor = generarCodigoVendedor;
window.generarCodigoAsesor = generarCodigoAsesor;
window.calcularNivelVendedor = calcularNivelVendedor;
window.buscarVendedorPorUsername = buscarVendedorPorUsername;
window.buscarVendedorPorCodigo = buscarVendedorPorCodigo;
window.buscarAsesorPorUsername = buscarAsesorPorUsername;
window.validarEmpresaId = validarEmpresaId;
window.obtenerEmpresaPorId = obtenerEmpresaPorId;
window.obtenerAreasMercado = obtenerAreasMercado;
window.resetearDatos = resetearDatos;
window.mostrarResumenDatos = mostrarResumenDatos;
window.Asesoria = Asesoria;

console.log("📦 Modelos de datos CyberVision cargados correctamente");
console.log("👤 Vendedores disponibles:");
console.log("- vendedor1 -> María González (V001)");
console.log("- vendedor2 -> Ana López (V003)");
console.log("🎓 Asesores disponibles:");
console.log("- asesor1 -> Dr. Roberto Silva (A001)");
console.log("💡 Usa resetearDatos() para reiniciar todos los datos");