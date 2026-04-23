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

        String token = jwtService.generateToken(username, user.getAdmin());

        AuthDTO dto = new AuthDTO();
        dto.setToken(token);
        dto.setRole(user.getAdmin() ? "ADMIN" : "USER");

        return dto;
    }

    // 🆕 REGISTER
    public AuthDTO register(AuthDTO request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // 🔥 ФИО
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setMiddleName(request.getMiddleName());

        user.setAdmin(false);

        userRepository.save(user);

        String token = jwtService.generateToken(user.getUsername(), user.getAdmin());

        AuthDTO dto = new AuthDTO();
        dto.setToken(token);
        dto.setRole("USER");

        return dto;
    }
}