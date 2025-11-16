package com.holding.cablevision.repository;

import com.holding.cablevision.model.UsuarioAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioAuthRepository extends JpaRepository<UsuarioAuth, Long> {
    Optional<UsuarioAuth> findByUsername(String username);
    Optional<UsuarioAuth> findByUsernameAndPassword(String username, String password);
}