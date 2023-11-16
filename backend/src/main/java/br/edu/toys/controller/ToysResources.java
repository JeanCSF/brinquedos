package br.edu.toys.controller;

import java.io.InputStream;
import java.util.List;

import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;

import com.google.gson.Gson;

import br.edu.toys.dao.ToyDAO;
import br.edu.toys.exception.MessageResponse;
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
	private Gson gson = new Gson();
	
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
				
				MessageResponse errorResponse = new MessageResponse();
				errorResponse.setStatus(Response.Status.BAD_REQUEST.getStatusCode());
				errorResponse.setMessage("Este código já está cadastrado!");
				errorResponse.setTimestamp(System.currentTimeMillis());
				return Response.status(Response.Status.BAD_REQUEST).entity(errorResponse).type(MediaType.APPLICATION_JSON).build();
				
			}
			
			InputStream imageInputStream = image.getDataHandler().getInputStream();
			String originalFileName = image.getContentDisposition().getParameter("filename");
			String uploadFolder = servletContext.getRealPath("/") + "images\\toys_imgs\\toy_" + toy.getToyId() + "\\";
			String imgFinalName = imageUploadService.uploadImage(imageInputStream, originalFileName, uploadFolder, "");

			toy.setImage(uriInfo.getBaseUri().toString() + "images/toys_imgs/toy_" + toy.getToyId() + "/" + imgFinalName);
			toy.setDescription(description);
			toy.setCategory(category);
			toy.setDetails(details);
			toy.setBrand(brand);
			toy.setPrice(price);

			dao.save(toy);

			MessageResponse successMessage = new MessageResponse();
			successMessage.setStatus(Response.Status.CREATED.getStatusCode());
			successMessage.setMessage("Brinquedo criado com sucesso!");
			successMessage.setTimestamp(System.currentTimeMillis());
			
			
			String jsonSuccessMessage = gson.toJson(successMessage);
			String jsonToy = gson.toJson(toy); 
			String jsonResponse = "{\"logs\":" + jsonSuccessMessage + ", \"toy\":" + jsonToy + "}";

			return Response.status(Response.Status.CREATED).entity(jsonResponse).type(MediaType.APPLICATION_JSON).build();
			
		} catch (Exception e) {
			e.printStackTrace();
			MessageResponse errorResponse = new MessageResponse();
			errorResponse.setStatus(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode());
			errorResponse.setMessage("Erro ao criar brinquedo. Detalhes: " + e.getMessage());
			errorResponse.setTimestamp(System.currentTimeMillis());
			throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorResponse).type(MediaType.APPLICATION_JSON).build());
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
	        	MessageResponse errorResponse = new MessageResponse();
				errorResponse.setStatus(Response.Status.NOT_FOUND.getStatusCode());
				errorResponse.setMessage("Brinquedo não encontrado!");
				errorResponse.setTimestamp(System.currentTimeMillis());
				return Response.status(Response.Status.NOT_FOUND).entity(errorResponse).type(MediaType.APPLICATION_JSON).build();
	        }
	    } catch (Exception e) {
	    	e.printStackTrace();
			MessageResponse errorResponse = new MessageResponse();
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
			Toy toyToEdit = dao.find(toyId);
			if (!toyExists) {
				MessageResponse errorResponse = new MessageResponse();
				errorResponse.setStatus(Response.Status.NOT_FOUND.getStatusCode());
				errorResponse.setMessage("Brinquedo não encontrado!");
				errorResponse.setTimestamp(System.currentTimeMillis());
				return Response.status(Response.Status.NOT_FOUND).entity(errorResponse).type(MediaType.APPLICATION_JSON).build();
			}
			
			String uploadFolder = servletContext.getRealPath("/") + "images\\toys_imgs\\toy_" + toyToEdit.getToyId() + "\\";
			String originalFileName = image.getContentDisposition().getParameter("filename");
			InputStream imageInputStream = image.getDataHandler().getInputStream();
				
			String dbImgName = toyToEdit.getImage();
			String imgEdit = dbImgName.substring(dbImgName.lastIndexOf("/")+1);
			
			String imgFinalName = imageUploadService.uploadImage(imageInputStream, originalFileName, uploadFolder, imgEdit);

			toy.setImage(uriInfo.getBaseUri().toString() + "images/toys_imgs/toy_" + toyToEdit.getToyId() + "/" + imgFinalName);
			toy.setDescription(description);
			toy.setCategory(category);
			toy.setDetails(details);
			toy.setBrand(brand);
			toy.setPrice(price);
			toy.setToyId(toyId);
			
			dao.update(toy);

			MessageResponse successMessage = new MessageResponse();
			successMessage.setStatus(Response.Status.OK.getStatusCode());
			successMessage.setMessage("Brinquedo atualizado com sucesso!");
			successMessage.setTimestamp(System.currentTimeMillis());
			
			String jsonSuccessMessage = gson.toJson(successMessage);
			String jsonToy = gson.toJson(toy); 
			String jsonResponse = "{\"logs\":" + jsonSuccessMessage + ", \"toy\":" + jsonToy + "}";
			
			return Response.status(Response.Status.OK).entity(jsonResponse).type(MediaType.APPLICATION_JSON).build();
			
		} catch (Exception e) {
			e.printStackTrace();
			MessageResponse errorResponse = new MessageResponse();
			errorResponse.setStatus(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode());
			errorResponse.setMessage("Erro ao atualizar o brinquedo: " + e.getMessage());
			errorResponse.setTimestamp(System.currentTimeMillis());
			throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorResponse).type(MediaType.APPLICATION_JSON).build());
		}
	}
	
	@DELETE
	@Path("/toy/{toyId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteToy(@PathParam("toyId") int toyId) {
	    try {
	        if (dao.checkId(toyId)) {
	            dao.delete(toyId);
	            
	            MessageResponse successMessage = new MessageResponse();
				successMessage.setStatus(Response.Status.OK.getStatusCode());
				successMessage.setMessage("Brinquedo deletado com sucesso!");
				successMessage.setTimestamp(System.currentTimeMillis());
				return Response.status(Response.Status.OK).entity(successMessage).type(MediaType.APPLICATION_JSON).build();
				
	        } else {
	        	
	        	MessageResponse errorResponse = new MessageResponse();
				errorResponse.setStatus(Response.Status.NOT_FOUND.getStatusCode());
				errorResponse.setMessage("Brinquedo não encontrado!");
				errorResponse.setTimestamp(System.currentTimeMillis());
				return Response.status(Response.Status.NOT_FOUND).entity(errorResponse).type(MediaType.APPLICATION_JSON).build();
				
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        MessageResponse errorResponse = new MessageResponse();
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
			MessageResponse errorResponse = new MessageResponse();
			errorResponse.setStatus(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode());
			errorResponse.setMessage("Erro ao buscar brinquedos. Detalhes: " + e.getMessage());
			errorResponse.setTimestamp(System.currentTimeMillis());

			throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity(errorResponse).type(MediaType.APPLICATION_JSON).build());
		}
	}
	
	@GET
	@Path("/categories")
	@Produces(MediaType.APPLICATION_JSON)
	public List<String> listCategories() {
		try {
			List<String> categories = dao.categories();
			return categories;
		} catch (Exception e) {

			e.printStackTrace();
			MessageResponse errorResponse = new MessageResponse();
			errorResponse.setStatus(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode());
			errorResponse.setMessage("Erro ao buscar categorias. Detalhes: " + e.getMessage());
			errorResponse.setTimestamp(System.currentTimeMillis());

			throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity(errorResponse).type(MediaType.APPLICATION_JSON).build());
		}
	}
	
	@GET
	@Path("/category/{categoryName}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Toy> listToysByCategory(@PathParam("categoryName") String categoryName) {
		try {
			List<Toy> toys = dao.toysByCategory(categoryName);
			return toys;
		} catch (Exception e) {

			e.printStackTrace();
			MessageResponse errorResponse = new MessageResponse();
			errorResponse.setStatus(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode());
			errorResponse.setMessage("Erro ao buscar categorias. Detalhes: " + e.getMessage());
			errorResponse.setTimestamp(System.currentTimeMillis());

			throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
					.entity(errorResponse).type(MediaType.APPLICATION_JSON).build());
		}
	}
}