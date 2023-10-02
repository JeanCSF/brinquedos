package br.edu.brinquedos.controller;

import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.Part;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

import br.edu.brinquedos.dao.BrinquedoDAO;
import br.edu.brinquedos.model.Brinquedo;

@WebServlet("/upload")
@MultipartConfig
public class UploadServlet extends HttpServlet {
	private BrinquedoDAO dao = new BrinquedoDAO();

	private static final long serialVersionUID = 1L;

	@POST
	@Path("/novo")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	public Response criarBrinquedo(HttpServletRequest request) {
		try {

			Collection<Part> parts = request.getParts();
			List<String> nomesArquivos = new ArrayList<>();

			for (Part part : parts) {
				if (part.getContentType() != null) {
					String nomeArquivo = getNomeArquivo(part);
					String diretorioDestino = "imagens/";
					String extensao = nomeArquivo.substring(nomeArquivo.lastIndexOf("."));
					String nomeArquivoSalvo = UUID.randomUUID().toString() + extensao;
					java.nio.file.Path destino = java.nio.file.Path.of(diretorioDestino, nomeArquivoSalvo);

					try (InputStream imagemInputStream = part.getInputStream()) {
						Files.copy(imagemInputStream, destino, StandardCopyOption.REPLACE_EXISTING);
					}

					nomesArquivos.add(nomeArquivoSalvo);
				}
			}
			Brinquedo brinquedo = new Brinquedo();
			brinquedo.setDescricao(request.getParameter("descricao"));
			brinquedo.setCategoria(request.getParameter("categoria"));
			brinquedo.setDetalhes(request.getParameter("detalhes"));
			brinquedo.setMarca(request.getParameter("marca"));
			brinquedo.setPreco(Float.parseFloat(request.getParameter("preco")));
			brinquedo.setImagem(request.getParameter("imagem"));

			dao.salvar(brinquedo);
			return Response.status(Response.Status.CREATED).entity("Arquivos recebidos com sucesso").build();
		} catch (Exception e) {
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity("Erro ao criar o brinquedo: " + e.getMessage()).build();
		}
	}

	private String getNomeArquivo(Part part) {
		for (String contentDisposition : part.getHeader("content-disposition").split(";")) {
			if (contentDisposition.trim().startsWith("imagem")) {
				String[] keyValue = contentDisposition.split("=");
				return keyValue[1].trim().replace("\"", "");
			}
		}
		return "arquivo_desconhecido";
	}
}
