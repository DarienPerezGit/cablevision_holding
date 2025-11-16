package com.holding.cablevision.repository;

import com.holding.cablevision.model.Pais;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaisRepository extends JpaRepository<Pais, Long> {
    Optional<Pais> findByNombre(String nombre);
    
    boolean existsByNombre(String nombre);
    
    // Búsqueda insensible a mayúsculas/minúsculas
    List<Pais> findByNombreContainingIgnoreCase(String nombre);
    
    // Verificar existencia ignorando mayúsculas
    boolean existsByNombreIgnoreCase(String nombre);
    
    // Verificar que no existe otro país con el mismo nombre (para updates)
    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);
    
    // Verificar si el país tiene empresas asociadas
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Empresa e WHERE e.paisSede.id = :paisId")
    boolean tieneEmpresasAsociadas(@Param("paisId") Long paisId);
}