package com.example.trains.service;

import com.example.trains.dto.TicketDTO;
import com.example.trains.model.Schedule;
import com.example.trains.model.Ticket;
import com.example.trains.model.User;
import com.example.trains.repository.ScheduleRepository;
import com.example.trains.repository.TicketRepository;
import com.example.trains.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;

    public TicketService(TicketRepository ticketRepository,
                         UserRepository userRepository,
                         ScheduleRepository scheduleRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.scheduleRepository = scheduleRepository;
    }

    // CREATE
    public TicketDTO createTicket(TicketDTO dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Schedule schedule = scheduleRepository.findById(dto.getScheduleId())
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        // 💥 проверка места
        boolean exists = ticketRepository
                .existsByScheduleIdAndSeatNumber(dto.getScheduleId(), dto.getSeatNumber());

        if (exists) {
            throw new RuntimeException("Seat already taken");
        }

        Ticket ticket = new Ticket();
        ticket.setUser(user);
        ticket.setSchedule(schedule);
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
                .toList();
    }

    // GET BY ID
    public Optional<TicketDTO> getTicketById(Integer id) {
        return ticketRepository.findById(id)
                .map(this::mapToDTO);
    }

    // GET BY USER
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
        dto.setScheduleId(ticket.getSchedule().getId());
        dto.setPrice(ticket.getPrice());
        dto.setPurchaseDate(ticket.getPurchaseDate());
        dto.setSeatNumber(ticket.getSeatNumber());
        return dto;
    }
}