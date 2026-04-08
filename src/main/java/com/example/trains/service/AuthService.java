package com.example.trains.service;

import com.example.trains.dto.AuthDTO;
import com.example.trains.model.User;
import com.example.trains.repository.UserRepository;
import com.example.trains.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // 🔑 LOGIN
    public AuthDTO login(String username, String password) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // 🔥 используем getAdmin()
        String token = jwtService.generateToken(username, user.getAdmin());

        AuthDTO dto = new AuthDTO();
        dto.setToken(token);
        dto.setRole(user.getAdmin() ? "ADMIN" : "USER");

        return dto;
    }

    // 🆕 REGISTER
    public AuthDTO register(String username, String password) {

        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setAdmin(false);

        userRepository.save(user);

        // 🔥 тоже исправили здесь
        String token = jwtService.generateToken(username, user.getAdmin());

        AuthDTO dto = new AuthDTO();
        dto.setToken(token);
        dto.setRole("USER");

        return dto;
    }
}