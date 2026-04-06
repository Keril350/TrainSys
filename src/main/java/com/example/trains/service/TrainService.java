package com.example.trains.service;

import com.example.trains.dto.TrainDTO;
import com.example.trains.model.Train;
import com.example.trains.repository.TrainRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrainService {

    private final TrainRepository trainRepository;

    public TrainService(TrainRepository trainRepository) {
        this.trainRepository = trainRepository;
    }

    // CREATE
    public TrainDTO createTrain(TrainDTO dto) {
        Train train = new Train();

        train.setNumber(dto.getNumber());
        train.setType(dto.getType());

        Train saved = trainRepository.save(train);

        return mapToDTO(saved);
    }

    // GET ALL
    public List<TrainDTO> getAllTrains() {
        return trainRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public TrainDTO getTrainById(Integer id) {
        Train train = trainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Train not found"));

        return mapToDTO(train);
    }

    // UPDATE
    public TrainDTO updateTrain(Integer id, TrainDTO dto) {

        Train train = trainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Train not found"));

        // обновляем поля
        train.setNumber(dto.getNumber());
        train.setType(dto.getType());

        Train updated = trainRepository.save(train);

        if (!train.getNumber().equals(dto.getNumber()) &&
                trainRepository.existsByNumber(dto.getNumber())) {
            throw new RuntimeException("Train number already exists");
        }

        return mapToDTO(updated);
    }

    // DELETE
    public void deleteTrain(Integer id) {
        trainRepository.deleteById(id);
    }

    // 🔁 Маппер
    private TrainDTO mapToDTO(Train train) {
        TrainDTO dto = new TrainDTO();

        dto.setId(train.getId());
        dto.setNumber(train.getNumber());
        dto.setType(train.getType());

        return dto;
    }
}