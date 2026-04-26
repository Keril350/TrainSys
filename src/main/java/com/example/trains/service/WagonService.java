package com.example.trains.service;

import com.example.trains.dto.WagonDTO;
import com.example.trains.model.Train;
import com.example.trains.model.Wagon;
import com.example.trains.repository.TrainRepository;
import com.example.trains.repository.WagonRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WagonService {

    private final WagonRepository wagonRepository;
    private final TrainRepository trainRepository;

    public WagonService(WagonRepository wagonRepository,
                        TrainRepository trainRepository) {
        this.wagonRepository = wagonRepository;
        this.trainRepository = trainRepository;
    }

    public WagonDTO create(WagonDTO dto) {

        Train train = trainRepository.findById(dto.getTrainId())
                .orElseThrow(() -> new RuntimeException("Train not found"));

        if (wagonRepository.existsByTrainIdAndNumber(dto.getTrainId(), dto.getNumber())) {
            throw new RuntimeException("Wagon number already exists for this train");
        }

        Wagon wagon = new Wagon();
        wagon.setTrain(train);
        wagon.setNumber(dto.getNumber());
        wagon.setPrice(dto.getPrice()); // 🔥

        return mapToDTO(wagonRepository.save(wagon));
    }

    public List<WagonDTO> getAll() {
        return wagonRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<WagonDTO> getByTrain(Integer trainId) {
        return wagonRepository.findByTrainId(trainId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public WagonDTO update(Integer id, WagonDTO dto) {

        Wagon wagon = wagonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wagon not found"));

        Train train = trainRepository.findById(dto.getTrainId())
                .orElseThrow(() -> new RuntimeException("Train not found"));

        wagon.setTrain(train);
        wagon.setNumber(dto.getNumber());
        wagon.setPrice(dto.getPrice()); // 🔥

        return mapToDTO(wagonRepository.save(wagon));
    }

    public void delete(Integer id) {
        wagonRepository.deleteById(id);
    }

    private WagonDTO mapToDTO(Wagon wagon) {
        WagonDTO dto = new WagonDTO();
        dto.setId(wagon.getId());
        dto.setTrainId(wagon.getTrain().getId());
        dto.setNumber(wagon.getNumber());
        dto.setPrice(wagon.getPrice()); // 🔥
        return dto;
    }
}