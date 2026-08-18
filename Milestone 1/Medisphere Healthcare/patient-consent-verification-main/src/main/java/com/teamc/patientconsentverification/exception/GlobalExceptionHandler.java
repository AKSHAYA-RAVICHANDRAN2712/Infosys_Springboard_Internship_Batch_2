package com.teamc.patientconsentverification.exception;

import com.teamc.patientconsentverification.dto.PatientConsentResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handles validation errors (@NotBlank, @NotNull, etc.)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public PatientConsentResponse handleValidationException(
            MethodArgumentNotValidException ex) {

        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.toList());

        return new PatientConsentResponse(
                "FAILED",
                "Validation failed.",
                errors
        );
    }

    // Handles custom business exceptions
    @ExceptionHandler(PatientConsentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public PatientConsentResponse handlePatientConsentException(
            PatientConsentException ex) {

        return new PatientConsentResponse(
                "FAILED",
                ex.getMessage(),
                List.of(ex.getMessage())
        );
    }

    // Handles unexpected exceptions
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public PatientConsentResponse handleGenericException(
            Exception ex) {

        return new PatientConsentResponse(
                "FAILED",
                "Something went wrong.",
                List.of(ex.getMessage())
        );
    }
}