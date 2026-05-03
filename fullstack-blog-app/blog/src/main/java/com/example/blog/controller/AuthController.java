package com.example.blog.controller;

import com.example.blog.dto.UserDto;
import com.example.blog.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${frontend.url}")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String register(@Valid @RequestBody UserDto dto) {
        authService.register(dto.getUsername(), dto.getPassword());
        return "Registered Successfully";
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody UserDto dto) {

        String token = authService.login(dto.getUsername(), dto.getPassword());

        return Map.of("token", token);
    }

}
