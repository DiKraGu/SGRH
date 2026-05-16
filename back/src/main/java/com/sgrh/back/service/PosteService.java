package com.sgrh.back.service;

import com.sgrh.back.entity.Poste;
import com.sgrh.back.repository.PosteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PosteService {

    private final PosteRepository posteRepository;

    public List<Poste> getAllPostes() {
        return posteRepository.findAll();
    }

    public Poste getPosteById(Long id) {
        return posteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Poste introuvable"));
    }

    public Poste createPoste(Poste poste) {
        return posteRepository.save(poste);
    }

    public Poste updatePoste(Long id, Poste details) {
        Poste poste = getPosteById(id);

        poste.setLibelle(details.getLibelle());
        poste.setDescription(details.getDescription());

        return posteRepository.save(poste);
    }

    public void deletePoste(Long id) {
        Poste poste = getPosteById(id);
        posteRepository.delete(poste);
    }
}