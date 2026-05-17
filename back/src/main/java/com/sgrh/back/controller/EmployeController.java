package com.sgrh.back.controller;

import com.sgrh.back.dto.employe.EmployeDto;
import com.sgrh.back.service.EmployeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeController {

    private final EmployeService employeService;

    @PostMapping
    public EmployeDto createEmploye(@RequestBody EmployeDto dto) {
        return employeService.createEmploye(dto);
    }

    @GetMapping
    public List<EmployeDto> getAllEmployes() {
        return employeService.getAllEmployes();
    }

    @GetMapping("/{id}")
    public EmployeDto getEmployeById(@PathVariable Long id) {
        return employeService.getEmployeById(id);
    }

    @PutMapping("/{id}")
    public EmployeDto updateEmploye(
            @PathVariable Long id,
            @RequestBody EmployeDto dto
    ) {
        return employeService.updateEmploye(id, dto);
    }

    @PutMapping("/{id}/desactiver")
    public EmployeDto desactiverEmploye(@PathVariable Long id) {
        return employeService.desactiverEmploye(id);
    }

    @DeleteMapping("/{id}")
    public void deleteEmploye(@PathVariable Long id) {
        employeService.deleteEmploye(id);
    }
}