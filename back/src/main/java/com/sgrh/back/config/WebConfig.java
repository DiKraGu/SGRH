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
        Path cvUploadDir = Paths.get("cv");
        String cvUploadPath = cvUploadDir.toFile().getAbsolutePath();

        registry.addResourceHandler("/cv/**")
                .addResourceLocations("file:" + cvUploadPath + "/");
    }
}