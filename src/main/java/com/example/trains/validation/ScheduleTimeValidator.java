package com.example.trains.validation;

import com.example.trains.dto.ScheduleDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ScheduleTimeValidator implements ConstraintValidator<ValidScheduleTime, ScheduleDTO> {

    @Override
    public boolean isValid(ScheduleDTO dto, ConstraintValidatorContext context) {

        // если null — пусть @NotNull отработает
        if (dto.getArrivalTime() == null || dto.getDepartureTime() == null) {
            return true;
        }

        return dto.getDepartureTime().isAfter(dto.getArrivalTime());
    }
}