package com.sgrh.back.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        Path oldCvPath = Paths.get("uploads/cv");
        Path newCvPath = Paths.get("cv");

        registry.addResourceHandler("/cv/**")
                .addResourceLocations(
                        "file:" + oldCvPath.toFile().getAbsolutePath() + "/",
                        "file:" + newCvPath.toFile().getAbsolutePath() + "/"
                );
    }
}