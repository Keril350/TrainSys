package com.example.trains.service;

import com.example.trains.dto.TrainDTO;
import com.example.trains.model.Train;
import com.example.trains.model.TrainType;
import com.example.trains.repository.TrainRepository;
import com.example.trains.repository.TrainTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainService {

    private final TrainRepository trainRepository;
    private final TrainTypeRepository trainTypeRepository;

    public TrainService(TrainRepository trainRepository,
                        TrainTypeRepository trainTypeRepository) {
        this.trainRepository = trainRepository;
        this.trainTypeRepository = trainTypeRepository;
    }

    // CREATE
    public TrainDTO createTrain(TrainDTO dto) {

        TrainType type = trainTypeRepository.findByName(dto.getType())
                .orElseThrow(() -> new RuntimeException("Train type not found"));

        Train train = new Train();
        train.setNumber(dto.getNumber());
        train.setType(type);

        Train saved = trainRepository.save(train);

        return mapToDTO(saved);
    }

    // GET ALL
    public List<TrainDTO> getAllTrains() {
        return trainRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
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

        TrainType type = trainTypeRepository.findByName(dto.getType())
                .orElseThrow(() -> new RuntimeException("Train type not found"));

        // проверка уникальности номера
        if (!train.getNumber().equals(dto.getNumber()) &&
                trainRepository.existsByNumber(dto.getNumber())) {
            throw new RuntimeException("Train number already exists");
        }

        train.setNumber(dto.getNumber());
        train.setType(type);

        Train updated = trainRepository.save(train);

        return mapToDTO(updated);
    }

    // DELETE
    public void deleteTrain(Integer id) {
        trainRepository.deleteById(id);
    }

    // MAPPER
    private TrainDTO mapToDTO(Train train) {
        TrainDTO dto = new TrainDTO();

        dto.setId(train.getId());
        dto.setNumber(train.getNumber());
        dto.setType(train.getType().getName()); // 👈 ОБРАТНО В СТРОКУ

        return dto;
    }
}