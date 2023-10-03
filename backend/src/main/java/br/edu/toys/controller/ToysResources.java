package br.edu.brinquedos.controller;

import java.io.InputStream;
import java.util.List;
import java.util.Optional;

import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;

import br.edu.brinquedos.dao.BrinquedoDAO;
import br.edu.brinquedos.exception.ErrorResponse;
import br.edu.brinquedos.model.Brinquedo;
import br.edu.brinquedos.util.ImageUploadService;
import jakarta.inject.Inject;
import jakarta.servlet.ServletContext;
import jakarta.websocket.server.PathParam;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.ResponseBuilder;

@Path("/api")
public class ToysResources {
	@Context
    private ServletContext servletContext;
	
	@Inject
	private ImageUploadService imageUploadService;
	
	private BrinquedoDAO dao = new BrinquedoDAO();
	private Brinquedo brinquedo = new Brinquedo();
	
	@POST
	@Path("/novo")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	public Response criarBrinquedo(
			@Multipart("codigo") int codigo, 
			@Multipart("descricao") String descricao,
			@Multipart("categoria") String categoria, 
			@Multipart("detalhes") String detalhes,
			@Multipart("marca") String marca, 
			@Multipart("preco") float preco, 
			@Multipart("imagem") Attachment imagem) {
		
		try {
			
			String diretorioUpload = servletContext.getRealPath("/") + "imagens\\";

			brinquedo.setCodigo(codigo);
			boolean codigoExiste = dao.verificarCodigo(brinquedo.getCodigo());
			if (codigoExiste) {
				throw new WebApplicationException("Este código já está cadastrado!", Response.Status.BAD_REQUEST);
			}
			
			String nomeArquivo = imagem.getContentDisposition().getParameter("filename");
			InputStream conteudoArquivo = imagem.getDataHandler().getInputStream();
			String caminhoImagem = imageUploadService.uploadImage(conteudoArquivo, nomeArquivo, diretorioUpload);

			brinquedo.setImagem(caminhoImagem);
			brinquedo.setDescricao(descricao);
			brinquedo.setCategoria(categoria);
			brinquedo.setDetalhes(detalhes);
			brinquedo.setMarca(marca);
			brinquedo.setPreco(preco);

			dao.salvar(brinquedo);

			return Response.status(Response.Status.CREATED).entity(brinquedo).build();
		} catch (Exception e) {
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity("Erro ao criar o brinquedo: " + e.getMessage()).build();
		}
	}


	@GET
	@Path("{codigo}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserById(@PathParam("codigo") int codigo){
		try {
			brinquedo = dao.find(codigo);
			return Response.status(Response.Status.CREATED).entity(brinquedo).build();
		} catch (Exception e) {

			e.printStackTrace();
			ErrorResponse errorResponse = new ErrorResponse();
			errorResponse.setStatus(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode());
			errorResponse.setMessage("Erro ao buscar brinquedos. Detalhes: " + e.getMessage());
			errorResponse.setTimestamp(System.currentTimeMillis());

			throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity(errorResponse).type(MediaType.APPLICATION_JSON).build());
		}
	}

	@GET
	@Path("/todos")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Brinquedo> listarBrinquedos() {
		try {
			List<Brinquedo> brinquedos = dao.todosBrinquedos();
			return brinquedos;
		} catch (Exception e) {

			e.printStackTrace();
			ErrorResponse errorResponse = new ErrorResponse();
			errorResponse.setStatus(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode());
			errorResponse.setMessage("Erro ao buscar brinquedos. Detalhes: " + e.getMessage());
			errorResponse.setTimestamp(System.currentTimeMillis());

			throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity(errorResponse).type(MediaType.APPLICATION_JSON).build());
		}
	}
}