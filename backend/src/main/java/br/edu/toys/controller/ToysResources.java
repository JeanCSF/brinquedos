package br.edu.toys.controller;

import java.io.InputStream;
import java.util.List;

import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;

import br.edu.toys.dao.ToyDAO;
import br.edu.toys.exception.ErrorResponse;
import br.edu.toys.model.Toy;
import br.edu.toys.util.ImageUploadService;

import jakarta.inject.Inject;
import jakarta.servlet.ServletContext;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;

@Path("/api")
public class ToysResources {
	@Context
    private ServletContext servletContext;
	
	@Context
    private UriInfo uriInfo;
	
	@Inject
	private ImageUploadService imageUploadService;
	
	private ToyDAO dao = new ToyDAO();
	private Toy toy = new Toy();
	
	@POST
	@Path("/new")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createToy(
			@Multipart("toy_id") int toyId, 
			@Multipart("description") String description,
			@Multipart("category") String category, 
			@Multipart("details") String details, // OS CAMPOS DO FORMULARIOS DEVEM SER IGUAIS AOS DO @Multipart
			@Multipart("brand") String brand, 
			@Multipart("price") float price, 
			@Multipart("image") Attachment image) {
		
		try {
			toy.setToyId(toyId);
			boolean toyExists = dao.checkId(toy.getToyId());
			if (toyExists) {
				throw new WebApplicationException("Este código já está cadastrado!", Response.Status.BAD_REQUEST);
			}
			
			String uploadFolder = servletContext.getRealPath("/") + "images\\toys_imgs\\";
			String originalFileName = image.getContentDisposition().getParameter("filename");
			InputStream imageInputStream = image.getDataHandler().getInputStream();
			String imgFinalName = imageUploadService.uploadImage(imageInputStream, originalFileName, uploadFolder);

			toy.setImage(uriInfo.getBaseUri().toString() + "images/toys_imgs/" + imgFinalName);
			toy.setDescription(description);
			toy.setCategory(category);
			toy.setDetails(details);
			toy.setBrand(brand);
			toy.setPrice(price);

			dao.save(toy);

			return Response.status(Response.Status.CREATED).entity(toy).build();
		} catch (Exception e) {
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity("Erro ao criar o brinquedo: " + e.getMessage()).build();
		}
	}

	@GET
	@Path("/toy/{toyId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getToy(@PathParam("toyId") int toyId){
	    try {
	        toy = dao.find(toyId);
	        if (toy != null) {
	            return Response.status(Response.Status.OK).entity(toy).build();
	        } else {
	            return Response.status(Response.Status.NOT_FOUND).build();
	        }
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
	
	@PUT 
	@Path("/toy/{toyId}") 
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateToy(
			@Multipart("toy_id") int toyId, 
			@Multipart("description") String description,
			@Multipart("category") String category, 
			@Multipart("details") String details, // OS CAMPOS DO FORMULARIOS DEVEM SER IGUAIS AOS DO @Multipart
			@Multipart("brand") String brand, 
			@Multipart("price") float price, 
			@Multipart("image") Attachment image) {
		try {
			boolean toyExists = dao.checkId(toyId);
			if (!toyExists) {
				throw new WebApplicationException("Brinquedo não encontrado.", Response.Status.NOT_FOUND);
			}
			
			String uploadFolder = servletContext.getRealPath("/") + "images\\toys_imgs";
			String originalFileName = image.getContentDisposition().getParameter("filename");
			InputStream imageInputStream = image.getDataHandler().getInputStream();
			String imgFinalName = imageUploadService.uploadImage(imageInputStream, originalFileName, uploadFolder);

			toy.setImage(uriInfo.getBaseUri().toString() + "images/toys_imgs/" + imgFinalName);
			toy.setDescription(description);
			toy.setCategory(category);
			toy.setDetails(details);
			toy.setBrand(brand);
			toy.setPrice(price);
			toy.setToyId(toyId);
			
			dao.update(toy);

			return Response.status(Response.Status.OK).entity(toy).build();
		} catch (Exception e) {
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao atualizar o brinquedo: " + e.getMessage()).build();
		}
	}
	
	@DELETE
	@Path("/toy/{toyId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteToy(@PathParam("toyId") int toyId) {
	    try {
	        if (dao.checkId(toyId)) {
	            dao.delete(toyId);
	            return Response.status(Response.Status.NO_CONTENT).build();
	        } else {
	            return Response.status(Response.Status.NOT_FOUND).build();
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        ErrorResponse errorResponse = new ErrorResponse();
	        errorResponse.setStatus(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode());
	        errorResponse.setMessage("Erro ao excluir o brinquedo. Detalhes: " + e.getMessage());
	        errorResponse.setTimestamp(System.currentTimeMillis());

	        throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
	                .entity(errorResponse).type(MediaType.APPLICATION_JSON).build());
	    }
	}

	@GET
	@Path("/all")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Toy> listToys() {
		try {
			List<Toy> toys = dao.allToys();
			return toys;
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