package com.example.trains.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Constraint(validatedBy = ScheduleTimeValidator.class)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidScheduleTime {

    String message() default "Departure time must be after arrival time";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}