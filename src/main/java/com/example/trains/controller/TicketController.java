package com.example.trains.controller;

import com.example.trains.dto.TicketDTO;
import com.example.trains.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // POST
    @PostMapping
    public TicketDTO createTicket(@RequestBody @Valid TicketDTO dto) {
        return ticketService.createTicket(dto);
    }

    // GET
    @GetMapping
    public List<TicketDTO> getAllTickets() {
        return ticketService.getAllTickets();
    }

    // GET by ID
    @GetMapping("/{id}")
    public TicketDTO getTicketById(@PathVariable Integer id) {
        return ticketService.getTicketById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    // GET by USER
    @GetMapping("/user/{userId}")
    public List<TicketDTO> getTicketsByUser(@PathVariable Integer userId) {
        return ticketService.getTicketsByUserId(userId);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteTicket(@PathVariable Integer id) {
        ticketService.deleteTicket(id);
    }
}