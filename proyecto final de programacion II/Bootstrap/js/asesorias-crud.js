// ===== SISTEMA CRUD PARA ASESORÍAS =====
// asesorias-crud.js

// ===== DATOS INICIALES DE ASESORÍAS =====
const initialAsesorias = [
    new Asesoria(
        1, 
        "A001", 
        1, 
        1, 
        "2023-02-15", 
        "Asesoría en estrategia de telecomunicaciones 5G y expansión de red",
        "En curso",
        45,
        "2024-02-20"
    ),
    new Asesoria(
        2, 
        "A001", 
        3, 
        3, 
        "2023-03-10", 
        "Implementación de plataforma de streaming y optimización de contenido",
        "Completada",
        120,
        null
    ),
    new Asesoria(
        3, 
        "A001", 
        2, 
        2, 
        "2023-05-01", 
        "Planificación de estrategia de entretenimiento digital",
        "En curso",
        30,
        "2024-02-25"
    )
];

// ===== INICIALIZACIÓN =====
function inicializarAsesorias() {
    console.log("🔄 Inicializando datos de asesorías...");
    
    if (!localStorage.getItem('asesorias')) {
        localStorage.setItem('asesorias', JSON.stringify(initialAsesorias));
        console.log("✅ Asesorías inicializadas con", initialAsesorias.length, "registros");
    } else {
        console.log("📁 Asesorías ya existen en localStorage");
    }
}

// ===== FUNCIONES CRUD =====
function obtenerAsesorias() {
    return JSON.parse(localStorage.getItem('asesorias') || '[]');
}

function guardarAsesorias(asesorias) {
    localStorage.setItem('asesorias', JSON.stringify(asesorias));
    return true;
}

function obtenerAsesoriaPorId(id) {
    const asesorias = obtenerAsesorias();
    return asesorias.find(a => a.id === id);
}

function crearAsesoria(asesoriaData) {
    const asesorias = obtenerAsesorias();
    const nuevoId = Math.max(...asesorias.map(a => a.id), 0) + 1;
    
    const nuevaAsesoria = new Asesoria(
        nuevoId,
        asesoriaData.asesorId,
        asesoriaData.empresaId,
        asesoriaData.areaId,
        asesoriaData.fechaInicio,
        asesoriaData.descripcion,
        asesoriaData.estado,
        asesoriaData.horasAsesoradas,
        asesoriaData.proximaReunion
    );
    
    asesorias.push(nuevaAsesoria);
    guardarAsesorias(asesorias);
    
    console.log("✅ Nueva asesoría creada:", nuevaAsesoria);
    return nuevaAsesoria;
}

function actualizarAsesoria(id, datosActualizados) {
    const asesorias = obtenerAsesorias();
    const index = asesorias.findIndex(a => a.id === id);
    
    if (index !== -1) {
        asesorias[index] = { ...asesorias[index], ...datosActualizados };
        guardarAsesorias(asesorias);
        console.log("✅ Asesoría actualizada:", asesorias[index]);
        return true;
    }
    
    return false;
}

function eliminarAsesoria(id) {
    const asesorias = obtenerAsesorias();
    const asesoriasFiltradas = asesorias.filter(a => a.id !== id);
    
    if (asesorias.length !== asesoriasFiltradas.length) {
        guardarAsesorias(asesoriasFiltradas);
        console.log("✅ Asesoría eliminada ID:", id);
        return true;
    }
    
    return false;
}

// ===== FUNCIONES ESPECÍFICAS DEL ASESOR =====
function obtenerAsesoriasPorAsesor(asesorId) {
    const asesorias = obtenerAsesorias();
    return asesorias.filter(a => a.asesorId === asesorId);
}

function obtenerEstadisticasAsesor(asesorId) {
    const asesorias = obtenerAsesoriasPorAsesor(asesorId);
    
    return {
        totalAsesorias: asesorias.length,
        asesoriasActivas: asesorias.filter(a => a.estado === 'En curso').length,
        asesoriasCompletadas: asesorias.filter(a => a.estado === 'Completada').length,
        horasTotales: asesorias.reduce((sum, a) => sum + (a.horasAsesoradas || 0), 0),
        empresasUnicas: [...new Set(asesorias.map(a => a.empresaId))].length,
        areasUnicas: [...new Set(asesorias.map(a => a.areaId))].length
    };
}

// ===== EXPORTAR FUNCIONES =====
window.inicializarAsesorias = inicializarAsesorias;
window.obtenerAsesorias = obtenerAsesorias;
window.obtenerAsesoriaPorId = obtenerAsesoriaPorId;
window.crearAsesoria = crearAsesoria;
window.actualizarAsesoria = actualizarAsesoria;
window.eliminarAsesoria = eliminarAsesoria;
window.obtenerAsesoriasPorAsesor = obtenerAsesoriasPorAsesor;
window.obtenerEstadisticasAsesor = obtenerEstadisticasAsesor;

console.log("🛠️ Sistema CRUD de asesorías cargado correctamente");