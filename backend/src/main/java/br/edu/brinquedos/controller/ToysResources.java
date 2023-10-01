package br.edu.brinquedos.controller;

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

import java.util.List;

import br.edu.brinquedos.dao.BrinquedoDAO;
import br.edu.brinquedos.model.Brinquedo;
import br.edu.brinquedos.exception.ErrorResponse;

@Path("/api")
public class ToysResources {
	private BrinquedoDAO dao = new BrinquedoDAO();

	@POST 
	@Path("/novo") 
	@Consumes(MediaType.APPLICATION_JSON) 
	@Produces(MediaType.APPLICATION_JSON)
	public Response criarBrinquedo(Brinquedo brinquedo) {
		try {
			boolean codigoExiste = dao.verificarCodigo(brinquedo.getCodigo());
			if (codigoExiste) {
				throw new WebApplicationException("Este código já está cadastrado!", Response.Status.BAD_REQUEST);
			}

			dao.salvar(brinquedo);

			return Response.status(Response.Status.CREATED).entity(brinquedo).build();
		} catch (Exception e) {

			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao criar o brinquedo: " + e.getMessage()).build();
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
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao atualizar o brinquedo: " + e.getMessage()).build();
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

			throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorResponse).type(MediaType.APPLICATION_JSON).build());
		}
	}
}