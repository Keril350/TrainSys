package com.example.trains.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;

@RestControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationExceptions(MethodArgumentNotValidException ex) {

        String errorMessage = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .findFirst()
                .orElse("Validation error");

        return new ErrorResponse(errorMessage, 400);
    }

    // RuntimeException (твои throw new RuntimeException)
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleRuntimeException(RuntimeException ex) {
        return new ErrorResponse(ex.getMessage(), 404);
    }

    // Любые другие ошибки
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleException(Exception ex) {
        return new ErrorResponse("Internal server error", 500);
    }
}