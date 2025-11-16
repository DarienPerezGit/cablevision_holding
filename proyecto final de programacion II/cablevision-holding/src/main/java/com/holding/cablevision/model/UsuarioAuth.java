package com.holding.cablevision.model;

import jakarta.persistence.*;

@Entity
@Table(name = "USUARIO_AUTH")
public class UsuarioAuth {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String rol; // "ADMIN", "VENDEDOR", "ASESOR"
    
    // Para vendedores
    @OneToOne
    @JoinColumn(name = "vendedor_id")
    private Vendedor vendedor;
    
    // Para asesores
    @OneToOne
    @JoinColumn(name = "asesor_id")
    private Asesor asesor;
    
    // Constructores
    public UsuarioAuth() {}
    
    public UsuarioAuth(String username, String password, String rol) {
        this.username = username;
        this.password = password;
        this.rol = rol;
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    
    public Vendedor getVendedor() { return vendedor; }
    public void setVendedor(Vendedor vendedor) { this.vendedor = vendedor; }
    
    public Asesor getAsesor() { return asesor; }
    public void setAsesor(Asesor asesor) { this.asesor = asesor; }
}