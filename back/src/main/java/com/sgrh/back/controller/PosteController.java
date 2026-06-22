package com.sgrh.back.controller;

import com.sgrh.back.dto.poste.PosteDto;
import com.sgrh.back.service.PosteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/postes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PosteController {

    private final PosteService posteService;

    @GetMapping
    public List<PosteDto> getAllPostes() {
        return posteService.getAllPostes();
    }

    @GetMapping("/{id}")
    public PosteDto getPosteById(@PathVariable Long id) {
        return posteService.getPosteById(id);
    }

    @GetMapping("/departement/{departementId}")
    public List<PosteDto> getPostesByDepartement(@PathVariable Long departementId) {
        return posteService.getPostesByDepartement(departementId);
    }

    @PostMapping
    public PosteDto createPoste(@RequestBody PosteDto dto) {
        return posteService.createPoste(dto);
    }

    @PutMapping("/{id}")
    public PosteDto updatePoste(
            @PathVariable Long id,
            @RequestBody PosteDto dto
    ) {
        return posteService.updatePoste(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deletePoste(@PathVariable Long id) {
        posteService.deletePoste(id);
    }
}