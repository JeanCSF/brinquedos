package br.edu.toys.util;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.logging.ConsoleHandler;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.apache.tika.Tika;

import jakarta.enterprise.context.RequestScoped;

@RequestScoped
public class ImageUploadService {
	public static void main(String[] args) {
        // Configurar o logger raiz
        Logger rootLogger = Logger.getLogger("");
        rootLogger.setLevel(Level.INFO); // Defina o nível de log aqui

        // Configurar o manipulador de console para saída
        ConsoleHandler consoleHandler = new ConsoleHandler();
        consoleHandler.setLevel(Level.INFO); // Defina o nível de log aqui
        rootLogger.addHandler(consoleHandler);
    }
	private static final Logger logger = Logger.getLogger(ImageUploadService.class.getName());
	private static final long MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

	private boolean isAllowedContentType(InputStream imageInputStream) throws IOException {
		Tika tika = new Tika();
		String detectedContentType = tika.detect(imageInputStream);

		return "image/jpeg".equals(detectedContentType) || "image/png".equals(detectedContentType) || "image/webp".equals(detectedContentType) || "image/gif".equals(detectedContentType);
	}

	public String uploadImage(InputStream imageInputStream, String originalFileName, String uploadFolder, String imgEdit) throws IOException {
		if (!isAllowedContentType(imageInputStream)) {
			logger.severe("Arquivo enviado não é uma imagem válida.");
			throw new IllegalArgumentException("Arquivo enviado não é uma imagem válida.");
		}

		String finalImgName = UUID.randomUUID().toString() + getFileExtension(originalFileName);
		String fullPath = uploadFolder + finalImgName;

		try (InputStream inputStream = imageInputStream) {
			String previousImagePath = uploadFolder + imgEdit;			
			if (!imgEdit.isEmpty() && Files.exists(Paths.get(previousImagePath))) {
				Files.deleteIfExists(Paths.get(previousImagePath));
				logger.severe("Arquivo antigo deletado.");
			}
			if (imageInputStream.available() > MAX_IMAGE_SIZE_BYTES) {
				logger.severe("Arquivo muito grande");
				throw new IllegalArgumentException("Tamanho da imagem excede o limite permitido." + imageInputStream.available() / 1024 / 1024 + "MB/5MB");
			}
			if (!Files.exists(Paths.get(uploadFolder))) {
				try {
					Files.createDirectories(Paths.get(uploadFolder));
					logger.severe("criado novo diretório");
				} catch (IOException e) {
					e.printStackTrace();
					throw new RuntimeException("Erro ao criar o diretório de upload.");
				}
			}
			Files.copy(inputStream, Path.of(fullPath), StandardCopyOption.REPLACE_EXISTING);
			logger.severe("Arquivo upado com sucesso");
		}
		logger.severe("fim");
		return finalImgName;
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
