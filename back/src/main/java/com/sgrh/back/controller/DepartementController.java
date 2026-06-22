package com.sgrh.back.controller;

import com.sgrh.back.dto.departement.DepartementDto;
import com.sgrh.back.service.DepartementService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departements")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DepartementController {

    private final DepartementService departementService;

    @GetMapping
    public List<DepartementDto> getAllDepartements() {
        return departementService.getAllDepartements();
    }

    @GetMapping("/{id}")
    public DepartementDto getDepartementById(@PathVariable Long id) {
        return departementService.getDepartementById(id);
    }

    @PostMapping
    public DepartementDto createDepartement(@RequestBody DepartementDto dto) {
        return departementService.createDepartement(dto);
    }

    @PutMapping("/{id}")
    public DepartementDto updateDepartement(
            @PathVariable Long id,
            @RequestBody DepartementDto dto
    ) {
        return departementService.updateDepartement(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteDepartement(@PathVariable Long id) {
        departementService.deleteDepartement(id);
    }
}