package com.sgrh.back.service;

import com.sgrh.back.dto.recrutement.CandidatureDto;
import com.sgrh.back.entity.Candidature;
import com.sgrh.back.entity.OffreEmploi;
import com.sgrh.back.enums.StatutCandidature;
import com.sgrh.back.enums.StatutOffre;
import com.sgrh.back.mapper.CandidatureMapper;
import com.sgrh.back.repository.CandidatureRepository;
import com.sgrh.back.repository.OffreEmploiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CandidatureService {

    private final CandidatureRepository candidatureRepository;
    private final OffreEmploiRepository offreEmploiRepository;

    private static final String CV_UPLOAD_DIR = "cv";

    public CandidatureDto postuler(
            Long offreId,
            String nom,
            String prenom,
            String email,
            String telephone,
            String lettreMotivation,
            MultipartFile cv
    ) {
        OffreEmploi offre = offreEmploiRepository.findById(offreId)
                .orElseThrow(() -> new RuntimeException("Offre introuvable"));

        if (offre.getStatut() == StatutOffre.FERMEE) {
            throw new RuntimeException("Cette offre est fermée");
        }

        if (offre.getDateLimite() != null && offre.getDateLimite().isBefore(LocalDate.now())) {
            throw new RuntimeException("La date limite de candidature est dépassée");
        }

        if (candidatureRepository.existsByEmailAndOffreId(email, offreId)) {
            throw new RuntimeException("Vous avez déjà postulé à cette offre");
        }

        String cheminCV = sauvegarderCV(cv);

        Candidature candidature = Candidature.builder()
                .nom(nom)
                .prenom(prenom)
                .email(email)
                .telephone(telephone)
                .lettreMotivation(lettreMotivation)
                .cheminCV(cheminCV)
                .dateSoumission(LocalDate.now())
                .statut(StatutCandidature.RECUE)
                .offre(offre)
                .build();

        return CandidatureMapper.toDto(candidatureRepository.save(candidature));
    }

    public List<CandidatureDto> getAllCandidatures() {
        return candidatureRepository.findAll()
                .stream()
                .map(CandidatureMapper::toDto)
                .toList();
    }

    public List<CandidatureDto> getCandidaturesByOffre(Long offreId) {
        return candidatureRepository.findByOffreId(offreId)
                .stream()
                .map(CandidatureMapper::toDto)
                .toList();
    }

    public CandidatureDto updateStatut(Long id, StatutCandidature statut) {
        Candidature candidature = candidatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidature introuvable"));

        candidature.setStatut(statut);

        return CandidatureMapper.toDto(candidatureRepository.save(candidature));
    }

    public List<CandidatureDto> getCandidaturesByEmail(String email) {
        return candidatureRepository.findByEmailOrderByDateSoumissionDesc(email)
                .stream()
                .map(CandidatureMapper::toDto)
                .toList();
    }

    private String sauvegarderCV(MultipartFile cv) {
        try {
            if (cv == null || cv.isEmpty()) {
                throw new RuntimeException("Le CV est obligatoire.");
            }

            String originalFilename = cv.getOriginalFilename();

            if (originalFilename == null || originalFilename.isBlank()) {
                throw new RuntimeException("Nom du fichier CV invalide.");
            }

            String extension = "";

            int dotIndex = originalFilename.lastIndexOf(".");
            if (dotIndex >= 0) {
                extension = originalFilename.substring(dotIndex);
            }

            String fileName = "cv_" + UUID.randomUUID() + extension;

            Path uploadPath = Paths.get(CV_UPLOAD_DIR);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);

            Files.copy(cv.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return CV_UPLOAD_DIR + "/" + fileName;

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'enregistrement du CV.");
        }
    }
}