package com.example.trains.service;

import com.example.trains.dto.TicketDTO;
import com.example.trains.model.Ticket;
import com.example.trains.model.Train;
import com.example.trains.model.User;
import com.example.trains.repository.TicketRepository;
import com.example.trains.repository.TrainRepository;
import com.example.trains.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final TrainRepository trainRepository;

    public TicketService(TicketRepository ticketRepository,
                         UserRepository userRepository,
                         TrainRepository trainRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.trainRepository = trainRepository;
    }

    // CREATE
    public TicketDTO createTicket(TicketDTO dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Train train = trainRepository.findById(dto.getTrainId())
                .orElseThrow(() -> new RuntimeException("Train not found"));

        Ticket ticket = new Ticket();
        ticket.setUser(user);
        ticket.setTrain(train);
        ticket.setPrice(dto.getPrice());
        ticket.setSeatNumber(dto.getSeatNumber());
        ticket.setPurchaseDate(LocalDateTime.now());

        Ticket saved = ticketRepository.save(ticket);
        return mapToDTO(saved);
    }

    // GET ALL
    public List<TicketDTO> getAllTickets() {
        return ticketRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public Optional<TicketDTO> getTicketById(Integer id) {
        return ticketRepository.findById(id)
                .map(this::mapToDTO);
    }

    public List<TicketDTO> getTicketsByUserId(Integer userId) {
        return ticketRepository.findByUserId(userId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // DELETE
    public void deleteTicket(Integer id) {
        ticketRepository.deleteById(id);
    }

    // MAPPER
    private TicketDTO mapToDTO(Ticket ticket) {
        TicketDTO dto = new TicketDTO();
        dto.setId(ticket.getId());
        dto.setUserId(ticket.getUser().getId());
        dto.setTrainId(ticket.getTrain().getId());
        dto.setPrice(ticket.getPrice());
        dto.setPurchaseDate(ticket.getPurchaseDate());
        dto.setSeatNumber(ticket.getSeatNumber());
        return dto;
    }
}