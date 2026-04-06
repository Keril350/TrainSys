package com.example.trains.repository;

import com.example.trains.model.Train;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainRepository extends JpaRepository<Train, Integer> {
    boolean existsByNumber(String number);
}