package br.edu.brinquedos.util;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import jakarta.enterprise.context.RequestScoped;

@RequestScoped
public class ImageUploadService {
	
	public String uploadImage(InputStream imageInputStream, String originalFileName, String diretorioUpload) throws IOException {
		String nomeUnico = UUID.randomUUID().toString() + getFileExtension(originalFileName);
		
		String caminhoCompleto = diretorioUpload + nomeUnico;
		System.out.println(caminhoCompleto);

		try (InputStream inputStream = imageInputStream) {
			Files.copy(inputStream, Path.of(caminhoCompleto), StandardCopyOption.REPLACE_EXISTING);
		}

		return nomeUnico;
	}

	private String getFileExtension(String fileName) {
		int lastDotIndex = fileName.lastIndexOf(".");
		if (lastDotIndex != -1 && lastDotIndex < fileName.length() - 1) {
			return fileName.substring(lastDotIndex);
		}
		return "";
	}
}
