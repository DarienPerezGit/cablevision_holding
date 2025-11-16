package com.holding.cablevision.controller;

import com.holding.cablevision.dto.VendedorDTO;
import com.holding.cablevision.dto.EmpresaDTO;
import com.holding.cablevision.dto.AsesorDTO;
import com.holding.cablevision.model.*;
import com.holding.cablevision.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
@Tag(name = "Administrador", description = "Endpoints para funcionalidades de administrador")
// @PreAuthorize("hasRole('ADMIN')") // Temporalmente deshabilitado para testing
public class AdministradorController {

    private final VendedorService vendedorService;
    private final EmpresaService empresaService;
    private final AsesorService asesorService;
    private final AreaMercadoService areaMercadoService;
    private final PaisService paisService;

    public AdministradorController(VendedorService vendedorService,
                                   EmpresaService empresaService,
                                   AsesorService asesorService,
                                   AreaMercadoService areaMercadoService,
                                   PaisService paisService) {
        this.vendedorService = vendedorService;
        this.empresaService = empresaService;
        this.asesorService = asesorService;
        this.areaMercadoService = areaMercadoService;
        this.paisService = paisService;
    }

    // ============ GESTIÓN DE VENDEDORES ============
    @GetMapping("/vendedores")
    @Operation(summary = "Listar todos los vendedores")
    public ResponseEntity<List<VendedorDTO>> listarVendedores() {
        List<VendedorDTO> vendedores = vendedorService.obtenerTodos();
        return ResponseEntity.ok(vendedores);
    }

    @GetMapping("/vendedores/{id}")
    @Operation(summary = "Obtener vendedor por ID")
    public ResponseEntity<VendedorDTO> obtenerVendedor(@PathVariable Long id) {
        return vendedorService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/vendedores")
    @Operation(summary = "Crear nuevo vendedor")
    public ResponseEntity<VendedorDTO> crearVendedor(@Valid @RequestBody Vendedor vendedor) {
        VendedorDTO vendedorCreado = vendedorService.guardar(vendedor);
        return ResponseEntity.ok(vendedorCreado);
    }

    @PutMapping("/vendedores/{id}")
    @Operation(summary = "Actualizar vendedor")
    public ResponseEntity<VendedorDTO> actualizarVendedor(@PathVariable Long id, 
                                                          @Valid @RequestBody Vendedor vendedor) {
        if (vendedorService.findById(id).isPresent()) {
            vendedor.setId(id);
            VendedorDTO vendedorActualizado = vendedorService.guardar(vendedor);
            return ResponseEntity.ok(vendedorActualizado);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/vendedores/{id}")
    @Operation(summary = "Eliminar vendedor")
    public ResponseEntity<?> eliminarVendedor(@PathVariable Long id) {
        if (vendedorService.findById(id).isPresent()) {
            vendedorService.eliminar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Vendedor eliminado exitosamente"));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/vendedores/captacion")
    @Operation(summary = "Realizar captación de vendedor")
    public ResponseEntity<?> realizarCaptacion(@RequestBody Map<String, Long> request) {
        Long vendedorCaptadorId = request.get("vendedorCaptadorId");
        Long vendedorCaptadoId = request.get("vendedorCaptadoId");
        
        boolean exito = vendedorService.realizarCaptacion(vendedorCaptadorId, vendedorCaptadoId);
        
        if (exito) {
            return ResponseEntity.ok(Map.of("mensaje", "Captación realizada exitosamente"));
        }
        return ResponseEntity.badRequest()
                .body(Map.of("mensaje", "No se pudo realizar la captación"));
    }

    // ============ GESTIÓN DE EMPRESAS ============
    @GetMapping("/empresas")
    @Operation(summary = "Listar todas las empresas")
    public ResponseEntity<List<Empresa>> listarEmpresas() {
        List<Empresa> empresas = empresaService.findAll();
        return ResponseEntity.ok(empresas);
    }

    @PostMapping("/empresas")
    @Operation(summary = "Crear nueva empresa")
    public ResponseEntity<Empresa> crearEmpresa(@Valid @RequestBody Empresa empresa) {
        Empresa empresaCreada = empresaService.save(empresa);
        return ResponseEntity.ok(empresaCreada);
    }

    @PutMapping("/empresas/{id}")
    @Operation(summary = "Actualizar empresa")
    public ResponseEntity<Empresa> actualizarEmpresa(@PathVariable Long id, 
                                                     @Valid @RequestBody Empresa empresa) {
        if (empresaService.findById(id).isPresent()) {
            empresa.setId(id);
            Empresa empresaActualizada = empresaService.save(empresa);
            return ResponseEntity.ok(empresaActualizada);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/empresas/{id}")
    @Operation(summary = "Eliminar empresa")
    public ResponseEntity<?> eliminarEmpresa(@PathVariable Long id) {
        if (empresaService.findById(id).isPresent()) {
            empresaService.deleteById(id);
            return ResponseEntity.ok(Map.of("mensaje", "Empresa eliminada exitosamente"));
        }
        return ResponseEntity.notFound().build();
    }

    // ============ GESTIÓN DE ASESORES ============
    @GetMapping("/asesores")
    @Operation(summary = "Listar todos los asesores")
    public ResponseEntity<List<Asesor>> listarAsesores() {
        List<Asesor> asesores = asesorService.findAll();
        return ResponseEntity.ok(asesores);
    }

    @PostMapping("/asesores")
    @Operation(summary = "Crear nuevo asesor")
    public ResponseEntity<Asesor> crearAsesor(@Valid @RequestBody Asesor asesor) {
        Asesor asesorCreado = asesorService.save(asesor);
        return ResponseEntity.ok(asesorCreado);
    }

    @PutMapping("/asesores/{id}")
    @Operation(summary = "Actualizar asesor")
    public ResponseEntity<Asesor> actualizarAsesor(@PathVariable Long id, 
                                                   @Valid @RequestBody Asesor asesor) {
        if (asesorService.findById(id).isPresent()) {
            asesor.setId(id);
            Asesor asesorActualizado = asesorService.save(asesor);
            return ResponseEntity.ok(asesorActualizado);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/asesores/{id}")
    @Operation(summary = "Eliminar asesor")
    public ResponseEntity<?> eliminarAsesor(@PathVariable Long id) {
        if (asesorService.findById(id).isPresent()) {
            asesorService.deleteById(id);
            return ResponseEntity.ok(Map.of("mensaje", "Asesor eliminado exitosamente"));
        }
        return ResponseEntity.notFound().build();
    }

    // ============ GESTIÓN DE PAÍSES ============
    @GetMapping("/paises")
    @Operation(summary = "Listar todos los países")
    public ResponseEntity<List<Pais>> listarPaises() {
        List<Pais> paises = paisService.findAll();
        return ResponseEntity.ok(paises);
    }

    @GetMapping("/paises/buscar")
    @Operation(summary = "Buscar países por nombre")
    public ResponseEntity<List<Pais>> buscarPaises(@RequestParam String nombre) {
        List<Pais> paises = paisService.buscarPorNombre(nombre);
        return ResponseEntity.ok(paises);
    }

    @GetMapping("/paises/{id}")
    @Operation(summary = "Obtener país por ID")
    public ResponseEntity<Pais> obtenerPais(@PathVariable Long id) {
        return paisService.findById(id)
            .map(pais -> ResponseEntity.ok(pais))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/paises")
    @Operation(summary = "Crear nuevo país")
    public ResponseEntity<?> crearPais(@Valid @RequestBody Pais pais) {
        try {
            // Validar que el país no exista ya
            if (paisService.existePorNombre(pais.getNombre())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Ya existe un país con ese nombre"));
            }
            
            Pais paisCreado = paisService.save(pais);
            return ResponseEntity.ok(Map.of(
                "mensaje", "País creado exitosamente",
                "pais", paisCreado
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Error al crear país: " + e.getMessage()));
        }
    }

    @PutMapping("/paises/{id}")
    @Operation(summary = "Actualizar país")
    public ResponseEntity<?> actualizarPais(@PathVariable Long id, 
                                           @Valid @RequestBody Pais pais) {
        try {
            if (!paisService.findById(id).isPresent()) {
                return ResponseEntity.notFound()
                    .build();
            }
            
            // Validar que no existe otro país con el mismo nombre
            if (paisService.existeOtroPaisConNombre(id, pais.getNombre())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Ya existe otro país con ese nombre"));
            }
            
            pais.setId(id);
            Pais paisActualizado = paisService.save(pais);
            return ResponseEntity.ok(Map.of(
                "mensaje", "País actualizado exitosamente",
                "pais", paisActualizado
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Error al actualizar país: " + e.getMessage()));
        }
    }

    @DeleteMapping("/paises/{id}")
    @Operation(summary = "Eliminar país")
    public ResponseEntity<?> eliminarPais(@PathVariable Long id) {
        try {
            if (!paisService.findById(id).isPresent()) {
                return ResponseEntity.notFound()
                    .build();
            }
            
            // Verificar si el país está siendo utilizado
            if (paisService.tieneEmpresasAsociadas(id)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "No se puede eliminar el país porque tiene empresas asociadas"));
            }
            
            paisService.deleteById(id);
            return ResponseEntity.ok(Map.of("mensaje", "País eliminado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Error al eliminar país: " + e.getMessage()));
        }
    }

    // ============ GESTIÓN DE ÁREAS DE MERCADO ============
    @GetMapping("/areas-mercado")
    @Operation(summary = "Listar todas las áreas de mercado")
    public ResponseEntity<List<AreaMercado>> listarAreasMercado() {
        List<AreaMercado> areas = areaMercadoService.findAll();
        return ResponseEntity.ok(areas);
    }

    @PostMapping("/areas-mercado")
    @Operation(summary = "Crear nueva área de mercado")
    public ResponseEntity<AreaMercado> crearAreaMercado(@Valid @RequestBody AreaMercado area) {
        AreaMercado areaCreada = areaMercadoService.save(area);
        return ResponseEntity.ok(areaCreada);
    }

    // ============ REPORTES ============
    @GetMapping("/reportes/resumen-holding")
    @Operation(summary = "Obtener resumen del holding")
    public ResponseEntity<Map<String, Object>> obtenerResumenHolding() {
        Map<String, Object> resumen = Map.of(
            "totalEmpresas", empresaService.findAll().size(),
            "totalVendedores", vendedorService.findAll().size(),
            "totalAsesores", asesorService.findAll().size(),
            "totalPaises", paisService.findAll().size(),
            "totalAreas", areaMercadoService.findAll().size()
        );
        return ResponseEntity.ok(resumen);
    }
}