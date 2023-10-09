package br.edu.toys.util;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.apache.commons.io.IOUtils;
import org.apache.tika.Tika;

import jakarta.enterprise.context.RequestScoped;

@RequestScoped
public class ImageUploadService {
	private static final long MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

	public String uploadImage(InputStream imageInputStream, String originalFileName, String uploadFolder, String imgEdit) throws IOException {
		String finalImgName = UUID.randomUUID().toString() + getFileExtension(originalFileName);
		String fullPath = uploadFolder + finalImgName;
		byte[] imageData = IOUtils.toByteArray(imageInputStream);

		if (imageData.length > MAX_IMAGE_SIZE_BYTES) {
			throw new IllegalArgumentException("Tamanho da imagem excede o limite permitido.");
		}

		if (!isAllowedContentType(new ByteArrayInputStream(imageData))) {
			throw new IllegalArgumentException("Arquivo enviado não é uma imagem válida.");
		}

		try (InputStream inputStream = imageInputStream) {
			String previousImagePath = uploadFolder + imgEdit;
			if (!imgEdit.isEmpty() && Files.exists(Paths.get(previousImagePath))) {
				Files.deleteIfExists(Paths.get(previousImagePath));
			}

			if (!Files.exists(Paths.get(uploadFolder))) {
				try {
					Files.createDirectories(Paths.get(uploadFolder));
				} catch (IOException e) {
					e.printStackTrace();
					throw new RuntimeException("Erro ao criar o diretório de upload.");
				}
			}
			Files.write(Path.of(fullPath), imageData);
		}
		return finalImgName;
	}

	private boolean isAllowedContentType(InputStream imageInputStream) throws IOException {
		Tika tika = new Tika();
		String detectedContentType = tika.detect(imageInputStream);
		
		return "image/jpeg".equals(detectedContentType) || "image/png".equals(detectedContentType) || "image/webp".equals(detectedContentType) || "image/gif".equals(detectedContentType);
	}

	private String getFileExtension(String fileName) {
		if (fileName == null || fileName.isEmpty()) {
			return "";
		}
		int lastDotIndex = fileName.lastIndexOf(".");
		if (lastDotIndex > 0 && lastDotIndex < fileName.length() - 1) {
			return fileName.substring(lastDotIndex);
		}
		return "";
	}
}
