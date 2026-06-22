package com.sgrh.back.service;

import com.sgrh.back.dto.poste.PosteDto;
import com.sgrh.back.entity.Poste;
import com.sgrh.back.mapper.PosteMapper;
import com.sgrh.back.repository.PosteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PosteService {

    private final PosteRepository posteRepository;

    public List<PosteDto> getAllPostes() {
        return posteRepository.findAll()
                .stream()
                .map(PosteMapper::toDto)
                .toList();
    }

    public PosteDto getPosteById(Long id) {
        Poste poste = posteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Poste introuvable"));

        return PosteMapper.toDto(poste);
    }

    public Poste getPosteEntityById(Long id) {
        return posteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Poste introuvable"));
    }

    public Poste createPoste(Poste poste) {
        return posteRepository.save(poste);
    }

    public Poste updatePoste(Long id, Poste details) {
        Poste poste = posteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Poste introuvable"));

        poste.setLibelle(details.getLibelle());
        poste.setDescription(details.getDescription());
        poste.setDepartement(details.getDepartement());

        return posteRepository.save(poste);
    }

    public void deletePoste(Long id) {
        Poste poste = posteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Poste introuvable"));

        posteRepository.delete(poste);
    }
}