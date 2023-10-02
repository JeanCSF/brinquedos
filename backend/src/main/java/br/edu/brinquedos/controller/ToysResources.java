package br.edu.brinquedos.controller;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

import br.edu.brinquedos.dao.BrinquedoDAO;
import br.edu.brinquedos.exception.ErrorResponse;
import br.edu.brinquedos.model.Brinquedo;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.websocket.server.PathParam;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api")
public class ToysResources {
	private BrinquedoDAO dao = new BrinquedoDAO();

	@POST
	@Path("/novo")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	public Response criarBrinquedo(HttpServletRequest request) {
		try {
			Brinquedo brinquedo = new Brinquedo();
			brinquedo.setCodigo(Integer.parseInt(request.getParameter("codigo")));
			boolean codigoExiste = dao.verificarCodigo(brinquedo.getCodigo());
			if (codigoExiste) {
				throw new WebApplicationException("Este código já está cadastrado!", Response.Status.BAD_REQUEST);
			}
			String servletUrl = "http://localhost:8080/brinquedos/upload/novo";
			URL url = new URL(servletUrl);
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			connection.setRequestMethod("POST");
			connection.setDoOutput(true);
			brinquedo.setDescricao(request.getParameter("descricao"));
			brinquedo.setCategoria(request.getParameter("categoria"));
			brinquedo.setDetalhes(request.getParameter("detalhes"));
			brinquedo.setMarca(request.getParameter("marca"));
			brinquedo.setPreco(Float.parseFloat(request.getParameter("preco")));
			brinquedo.setImagem(request.getParameter("imagem"));

			return Response.status(Response.Status.CREATED).entity(brinquedo).build();
		} catch (Exception e) {

			return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity("Erro ao criar o brinquedo: " + e.getMessage()).build();
		}
	}

	@PUT
	@Path("/brinquedo/{codigo}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response atualizarBrinquedo(@PathParam("codigo") int codigo, Brinquedo brinquedo) {
		try {

			boolean codigoExiste = dao.verificarCodigo(codigo);
			if (!codigoExiste) {
				throw new WebApplicationException("Brinquedo não encontrado.", Response.Status.NOT_FOUND);
			}

			brinquedo.setCodigo(codigo);
			dao.atualizar(brinquedo);

			return Response.status(Response.Status.OK).entity(brinquedo).build();
		} catch (Exception e) {
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity("Erro ao atualizar o brinquedo: " + e.getMessage()).build();
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