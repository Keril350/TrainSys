package com.example.trains;

import com.example.trains.model.User;
import com.example.trains.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class TrainsApplication {

	public static void main(String[] args) {
		SpringApplication.run(TrainsApplication.class, args);
	}

	@Bean
	CommandLineRunner initAdmin(UserRepository userRepository,
								PasswordEncoder passwordEncoder) {
		return args -> {

			if (userRepository.findByUsername("admin").isEmpty()) {

				User admin = new User();
				admin.setUsername("admin");
				admin.setPassword(passwordEncoder.encode("123"));

				admin.setFirstName("Admin");
				admin.setLastName("Admin");
				admin.setMiddleName("System");

				admin.setAdmin(true);

				userRepository.save(admin);

				System.out.println("Admin user created: admin / 123");
			}
		};
	}
}