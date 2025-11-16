package com.holding.cablevision.controller;

import com.holding.cablevision.model.UsuarioAuth;
import com.holding.cablevision.repository.UsuarioAuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioAuthRepository usuarioAuthRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        
        try {
            // Buscar usuario por username y password
            var usuario = usuarioAuthRepository.findByUsernameAndPassword(username, password);
            
            if (usuario.isPresent()) {
                UsuarioAuth user = usuario.get();
                
                // Preparar respuesta con datos del usuario
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("token", "demo-token-" + user.getId()); // Token simple para demo
                
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", user.getId());
                userInfo.put("username", user.getUsername());
                userInfo.put("role", user.getRol().toLowerCase());
                
                // Agregar información específica según el rol
                if ("VENDEDOR".equals(user.getRol()) && user.getVendedor() != null) {
                    userInfo.put("nombre", user.getVendedor().getNombre());
                    userInfo.put("codigo", user.getVendedor().getCodigoVendedor());
                    userInfo.put("empresa", user.getVendedor().getEmpresa().getNombre());
                } else if ("ASESOR".equals(user.getRol()) && user.getAsesor() != null) {
                    userInfo.put("nombre", user.getAsesor().getNombre());
                    userInfo.put("codigo", user.getAsesor().getCodigoAsesor());
                    userInfo.put("titulacion", user.getAsesor().getTitulacion());
                } else {
                    userInfo.put("nombre", "Administrador Principal");
                }
                
                userInfo.put("email", userInfo.get("nombre") + "@cablevision.com");
                
                response.put("user", userInfo);
                
                return ResponseEntity.ok(response);
            }
            
            // Credenciales inválidas
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Usuario o contraseña incorrectos");
            
            return ResponseEntity.status(401).body(errorResponse);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error interno del servidor");
            
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Sesión cerrada correctamente");
        
        return ResponseEntity.ok(response);
    }
}