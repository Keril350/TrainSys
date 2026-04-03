package com.example.trains.repository;

import com.example.trains.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Integer> {

    List<Ticket> findByUserId(Integer userId);

}