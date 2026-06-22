package com.sgrh.back.controller;

import com.sgrh.back.dto.poste.PosteDto;
import com.sgrh.back.entity.Poste;
import com.sgrh.back.service.PosteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/postes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PosteController {

    private final PosteService posteService;

    @GetMapping("/{id}")
    public Poste getPosteById(@PathVariable Long id) {
        return posteService.getPosteEntityById(id);
    }

    @PostMapping
    public Poste createPoste(@RequestBody Poste poste) {
        return posteService.createPoste(poste);
    }

    @PutMapping("/{id}")
    public Poste updatePoste(@PathVariable Long id, @RequestBody Poste poste) {
        return posteService.updatePoste(id, poste);
    }

    @DeleteMapping("/{id}")
    public void deletePoste(@PathVariable Long id) {
        posteService.deletePoste(id);
    }

    @GetMapping
    public List<PosteDto> getAllPostes() {
        return posteService.getAllPostes();
    }
}