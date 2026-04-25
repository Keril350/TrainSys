package com.example.trains.repository;

import com.example.trains.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Integer> {

    List<Seat> findByWagonId(Integer wagonId);
}