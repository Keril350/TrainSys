package com.example.trains.repository;

import com.example.trains.model.TrainType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TrainTypeRepository extends JpaRepository<TrainType, Integer> {

    Optional<TrainType> findByName(String name);
}