package com.sgrh.back.controller;

import com.sgrh.back.dto.employe.EmployeDto;
import com.sgrh.back.service.EmployeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeController {

    private final EmployeService employeService;

    @GetMapping
    public List<EmployeDto> getAllEmployes() {
        return employeService.getAllEmployes();
    }

    @GetMapping("/{id}")
    public EmployeDto getEmployeById(@PathVariable Long id) {
        return employeService.getEmployeById(id);
    }

    @PostMapping
    public EmployeDto createEmploye(@RequestBody EmployeDto employeDto) {
        return employeService.createEmploye(employeDto);
    }

    @PutMapping("/{id}")
    public EmployeDto updateEmploye(@PathVariable Long id, @RequestBody EmployeDto employeDto) {
        return employeService.updateEmploye(id, employeDto);
    }

    @DeleteMapping("/{id}")
    public void deleteEmploye(@PathVariable Long id) {
        employeService.deleteEmploye(id);
    }
}