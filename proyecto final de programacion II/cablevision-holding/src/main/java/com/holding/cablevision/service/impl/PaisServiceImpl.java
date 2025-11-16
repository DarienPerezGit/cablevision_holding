package com.holding.cablevision.service.impl;

import com.holding.cablevision.model.Pais;
import com.holding.cablevision.repository.PaisRepository;
import com.holding.cablevision.service.PaisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PaisServiceImpl implements PaisService {

    private final PaisRepository paisRepository;

    public PaisServiceImpl(PaisRepository paisRepository) {
        this.paisRepository = paisRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Pais> findAll() {
        return paisRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Pais> findById(Long id) {
        return paisRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Pais> findByNombre(String nombre) {
        return paisRepository.findByNombre(nombre);
    }

    @Override
    public Pais save(Pais pais) {
        return paisRepository.save(pais);
    }

    @Override
    public void deleteById(Long id) {
        paisRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByNombre(String nombre) {
        return paisRepository.existsByNombre(nombre);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Pais> buscarPorNombre(String nombre) {
        return paisRepository.findByNombreContainingIgnoreCase(nombre);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existePorNombre(String nombre) {
        return paisRepository.existsByNombreIgnoreCase(nombre);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existeOtroPaisConNombre(Long id, String nombre) {
        return paisRepository.existsByNombreIgnoreCaseAndIdNot(nombre, id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean tieneEmpresasAsociadas(Long id) {
        return paisRepository.tieneEmpresasAsociadas(id);
    }
}