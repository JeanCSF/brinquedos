package br.edu.toys.util;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import jakarta.enterprise.context.RequestScoped;

@RequestScoped
public class ImageUploadService {

	public String uploadImage(InputStream imageInputStream, String originalFileName, String uploadFolder)
			throws IOException {
		String randomFileName = UUID.randomUUID().toString() + getFileExtension(originalFileName);

		String fullPath = uploadFolder + randomFileName;

		try (InputStream inputStream = imageInputStream) {
			Files.copy(inputStream, Path.of(fullPath), StandardCopyOption.REPLACE_EXISTING);
		}

		return randomFileName;
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
