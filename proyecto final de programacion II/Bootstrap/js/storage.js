// ===== SERVICIOS DE ALMACENAMIENTO =====
// storage.js - Solo Frontend

class StorageService {
    // ===== OPERACIONES BÁSICAS =====
    obtenerTodos(modelo) {
        try {
            return JSON.parse(localStorage.getItem(modelo) || '[]');
        } catch (error) {
            console.error(`Error obteniendo ${modelo}:`, error);
            return [];
        }
    }

    guardarTodos(modelo, datos) {
        try {
            localStorage.setItem(modelo, JSON.stringify(datos));
            return true;
        } catch (error) {
            console.error(`Error guardando ${modelo}:`, error);
            return false;
        }
    }

    obtenerPorId(modelo, id) {
        const datos = this.obtenerTodos(modelo);
        return datos.find(item => item.id === id || item.codigo === id);
    }

    crear(modelo, nuevoItem) {
        const datos = this.obtenerTodos(modelo);
        datos.push(nuevoItem);
        return this.guardarTodos(modelo, datos);
    }

    actualizar(modelo, id, datosActualizados) {
        const datos = this.obtenerTodos(modelo);
        const index = datos.findIndex(item => item.id === id || item.codigo === id);
        if (index !== -1) {
            datos[index] = { ...datos[index], ...datosActualizados };
            return this.guardarTodos(modelo, datos);
        }
        return false;
    }

    eliminar(modelo, id) {
        const datos = this.obtenerTodos(modelo);
        const datosFiltrados = datos.filter(item => item.id !== id && item.codigo !== id);
        return this.guardarTodos(modelo, datosFiltrados);
    }

    // ===== PAÍSES =====
    obtenerPaises() {
        return this.obtenerTodos('paises');
    }

    crearPais(paisData) {
        const paises = this.obtenerPaises();
        const nuevoId = Math.max(...paises.map(p => p.id), 0) + 1;
        const nuevoPais = new Pais(nuevoId, paisData.nombre, paisData.pib, paisData.habitantes, paisData.capital);
        return this.crear('paises', nuevoPais);
    }

    // ===== VENDEDORES =====
    obtenerVendedores() {
        return this.obtenerTodos('vendedores');
    }

    obtenerVendedoresPorEmpresa(empresaId) {
        return this.obtenerTodos('vendedores').filter(v => v.empresaId == empresaId);
    }

    crearVendedor(vendedorData) {
        const nuevoVendedor = new Vendedor(
            generarCodigoVendedor(),
            vendedorData.nombre,
            vendedorData.direccion,
            vendedorData.empresaId,
            vendedorData.captadorId,
            vendedorData.fechaCaptacion
        );
        return this.crear('vendedores', nuevoVendedor);
    }

    // ===== ASESORES =====
    obtenerAsesores() {
        return this.obtenerTodos('asesores');
    }

    crearAsesor(asesorData) {
        const nuevoAsesor = new Asesor(
            generarCodigoAsesor(),
            asesorData.nombre,
            asesorData.direccion,
            asesorData.titulacion
        );
        return this.crear('asesores', nuevoAsesor);
    }

    // ===== CAPTACIONES =====
    obtenerCaptaciones() {
        return this.obtenerTodos('captaciones');
    }

    crearCaptacion(captacionData) {
        const nuevaCaptacion = new Captacion(
            Date.now(),
            captacionData.captadorId,
            captacionData.captadoId,
            captacionData.empresaId,
            captacionData.fechaCaptacion
        );
        return this.crear('captaciones', nuevaCaptacion);
    }

    // ===== ÁREAS =====
    obtenerAreasMercado() {
        return this.obtenerTodos('areasMercado');
    }

    // ===== EMPRESAS =====
    obtenerEmpresasExtended() {
        return this.obtenerTodos('empresasExtended');
    }

    // ===== JERARQUÍA VENDEDORES =====
    obtenerJerarquiaVendedor(vendedorId) {
        const vendedores = this.obtenerVendedores();
        const captaciones = this.obtenerCaptaciones();
        
        const vendedor = vendedores.find(v => v.codigo === vendedorId);
        if (!vendedor) return null;

        const captacionesDirectas = captaciones.filter(c => c.captadorId === vendedorId);
        const captados = captacionesDirectas.map(c => 
            vendedores.find(v => v.codigo === c.captadoId)
        ).filter(Boolean);

        return { vendedor, captados, nivel: this.calcularNivelVendedor(vendedorId) };
    }

    calcularNivelVendedor(vendedorId) {
        const captaciones = this.obtenerCaptaciones();
        let nivel = 1;
        let captadorId = vendedorId;

        while (true) {
            const captacion = captaciones.find(c => c.captadoId === captadorId);
            if (!captacion) break;
            nivel++;
            captadorId = captacion.captadorId;
        }
        return nivel;
    }

    // ===== ESTADÍSTICAS =====
    obtenerEstadisticas() {
        const paises = this.obtenerPaises();
        const empresas = this.obtenerEmpresasExtended();
        const vendedores = this.obtenerVendedores();
        const asesores = this.obtenerAsesores();

        return {
            totalPaises: paises.length,
            totalEmpresas: empresas.length,
            totalVendedores: vendedores.length,
            totalAsesores: asesores.length,
            facturacionTotal: empresas.reduce((sum, emp) => sum + (emp.facturacion || 0), 0),
            empresasPorPais: this._calcularEmpresasPorPais(),
            vendedoresPorEmpresa: this._calcularVendedoresPorEmpresa()
        };
    }

    _calcularEmpresasPorPais() {
        const empresas = this.obtenerEmpresasExtended();
        const paises = this.obtenerPaises();
        return paises.map(pais => ({
            pais: pais.nombre,
            cantidad: empresas.filter(emp => emp.pais === pais.nombre).length
        }));
    }

    _calcularVendedoresPorEmpresa() {
        const empresas = this.obtenerEmpresasExtended();
        const vendedores = this.obtenerVendedores();
        return empresas.map(empresa => ({
            empresa: empresa.nombre,
            cantidad: vendedores.filter(v => v.empresaId === empresa.id).length
        }));
    }
}

// ===== INICIALIZAR =====
const storageService = new StorageService();
window.storageService = storageService;