package com.example.trains.controller;

import com.example.trains.dto.AuthDTO;
import com.example.trains.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // 🔑 LOGIN
    @PostMapping("/login")
    public AuthDTO login(@RequestBody AuthDTO request) {
        return authService.login(
                request.getUsername(),
                request.getPassword()
        );
    }

    // 🆕 REGISTER
    @PostMapping("/register")
    public AuthDTO register(@RequestBody AuthDTO request) {
        return authService.register(request);
    }
}