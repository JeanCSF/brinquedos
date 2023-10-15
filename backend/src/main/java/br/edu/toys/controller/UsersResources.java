package br.edu.toys.controller;

import java.io.InputStream;
import java.util.List;

import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;
import org.mindrot.jbcrypt.BCrypt;

import br.edu.toys.exception.MessageResponse;
import br.edu.toys.util.ImageUploadService;
import br.edu.toys.dao.UserDAO;
import br.edu.toys.model.User;

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
public class UsersResources {
	@Context
	private ServletContext servletContext;

	@Context
	private UriInfo uriInfo;

	@Inject
	private ImageUploadService imageUploadService;

	private UserDAO dao = new UserDAO();
	private User user = new User();

	@POST 
	@Path("/user-new") 
	@Consumes(MediaType.MULTIPART_FORM_DATA) 
	@Produces(MediaType.APPLICATION_JSON)
	public Response createUser(@Multipart("user") String userName, @Multipart("password") String password, @Multipart("adm") String adm, // OS CAMPOS DO FORMULARIOS DEVEM SER IGUAIS AOS DO @Multipart
	@Multipart("user_img") Attachment userImg) {

		try {
			boolean userExists = dao.checkUserName(userName);
			if (userExists) {
				MessageResponse errorResponse = new MessageResponse();
				errorResponse.setStatus(Response.Status.BAD_REQUEST.getStatusCode());
				errorResponse.setMessage("Este usuário já está cadastrado!");
				errorResponse.setTimestamp(System.currentTimeMillis());

				return Response.status(Response.Status.BAD_REQUEST).entity(errorResponse).type(MediaType.APPLICATION_JSON).build();
		    }

			String uploadFolder = servletContext.getRealPath("/") + "images\\users_imgs\\" + userName + "\\";
			String originalFileName = userImg.getContentDisposition().getParameter("filename");
			InputStream imageInputStream = userImg.getDataHandler().getInputStream();
			String imgFinalName = imageUploadService.uploadImage(imageInputStream, originalFileName, uploadFolder, "");

			String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt(12));

			user.setUserImg(uriInfo.getBaseUri().toString() + "images/users_imgs/" + userName + "/" + imgFinalName);
			user.setUserName(userName);
			user.setPassword(hashedPassword);
			user.setIsAdm(adm);

			dao.save(user);
			
			MessageResponse successMessage = new MessageResponse();
			successMessage.setStatus(Response.Status.CREATED.getStatusCode());
			successMessage.setMessage("Usuário criado com sucesso!");
			successMessage.setTimestamp(System.currentTimeMillis());
			return Response.status(Response.Status.CREATED).entity(successMessage).type(MediaType.APPLICATION_JSON).build();
			
		} catch (Exception e) {

			e.printStackTrace();
			MessageResponse errorResponse = new MessageResponse();
			errorResponse.setStatus(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode());
			errorResponse.setMessage("Erro ao criar usuario. Detalhes: " + e.getMessage());
			errorResponse.setTimestamp(System.currentTimeMillis());
			throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorResponse).type(MediaType.APPLICATION_JSON).build());
		}
	}

	@GET 
	@Path("/user-all") 
	@Produces(MediaType.APPLICATION_JSON)
	public List<User> listUsers() {
		try {
			List<User> userss = dao.allUsers();
			return userss;
		} catch (Exception e) {

			e.printStackTrace();
			MessageResponse errorResponse = new MessageResponse();
			errorResponse.setStatus(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode());
			errorResponse.setMessage("Erro ao buscar usuarios. Detalhes: " + e.getMessage());
			errorResponse.setTimestamp(System.currentTimeMillis());

			throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorResponse).type(MediaType.APPLICATION_JSON).build());
		}
	}

	@GET 
	@Path("/user/{userId}") 
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUser(@PathParam("userId") int userId) {
		try {
			user = dao.find(userId);
			if (user != null) {
				return Response.status(Response.Status.OK).entity(user).build();
			} else {
				MessageResponse errorResponse = new MessageResponse();
				errorResponse.setStatus(Response.Status.NOT_FOUND.getStatusCode());
				errorResponse.setMessage("Usuário não encontrado!");
				errorResponse.setTimestamp(System.currentTimeMillis());
				return Response.status(Response.Status.NOT_FOUND).entity(errorResponse).type(MediaType.APPLICATION_JSON).build();
			}
		} catch (Exception e) {
			e.printStackTrace();
			MessageResponse errorResponse = new MessageResponse();
			errorResponse.setStatus(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode());
			errorResponse.setMessage("Erro ao buscar usuario. Detalhes: " + e.getMessage());
			errorResponse.setTimestamp(System.currentTimeMillis());

			throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorResponse).type(MediaType.APPLICATION_JSON).build());
		}
	}

	@PUT 
	@Path("/user/{userId}") 
	@Consumes(MediaType.MULTIPART_FORM_DATA) 
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateUser(@PathParam("userId") int userId, @Multipart("user") String userName, @Multipart("password") String password, @Multipart("adm") String adm, // OS CAMPOS DO FORMULARIOS DEVEM SER IGUAIS AOS DO @Multipart
	@Multipart("user_img") Attachment userImg) {
		try {
			user = dao.find(userId);
			boolean userExists = dao.checkUserId(userId);
			if (!userExists) {
				MessageResponse errorResponse = new MessageResponse();
				errorResponse.setStatus(Response.Status.NOT_FOUND.getStatusCode());
				errorResponse.setMessage("Usuário não encontrado!");
				errorResponse.setTimestamp(System.currentTimeMillis());
				return Response.status(Response.Status.NOT_FOUND).entity(errorResponse).type(MediaType.APPLICATION_JSON).build();
			}

			String uploadFolder = servletContext.getRealPath("/") + "images\\users_imgs\\" + user.getUserName() + "\\";
			String originalFileName = userImg.getContentDisposition().getParameter("filename");
			InputStream imageInputStream = userImg.getDataHandler().getInputStream();

			String dbImgName = user.getUserImg();
			String imgEdit = dbImgName.substring(dbImgName.lastIndexOf("/") + 1);

			String imgFinalName = imageUploadService.uploadImage(imageInputStream, originalFileName, uploadFolder, imgEdit);

			String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt(12));

			user.setUserImg(uriInfo.getBaseUri().toString() + "images/users_imgs/" + user.getUserName() + "/" + imgFinalName);
			user.setUserName(userName);
			user.setPassword(hashedPassword);
			user.setIsAdm(adm);

			dao.update(user);

			MessageResponse successMessage = new MessageResponse();
			successMessage.setStatus(Response.Status.OK.getStatusCode());
			successMessage.setMessage("Usuário atualizado com sucesso!");
			successMessage.setTimestamp(System.currentTimeMillis());
			return Response.status(Response.Status.OK).entity(successMessage).type(MediaType.APPLICATION_JSON).build();
			
		} catch (Exception e) {
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Erro ao atualizar o usuário: " + e.getMessage()).build();
		}
	}

	@DELETE 
	@Path("/user/{userId}") 
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteUser(@PathParam("userId") int userId) {
		try {
			if (dao.checkUserId(userId)) {
				dao.delete(userId);
				
				MessageResponse successMessage = new MessageResponse();
				successMessage.setStatus(Response.Status.OK.getStatusCode());
				successMessage.setMessage("Usuário deletado com sucesso!");
				successMessage.setTimestamp(System.currentTimeMillis());
				return Response.status(Response.Status.OK).entity(successMessage).type(MediaType.APPLICATION_JSON).build();
				
			} else {
				
				MessageResponse errorResponse = new MessageResponse();
				errorResponse.setStatus(Response.Status.NOT_FOUND.getStatusCode());
				errorResponse.setMessage("Usuário não encontrado!");
				errorResponse.setTimestamp(System.currentTimeMillis());
				return Response.status(Response.Status.NOT_FOUND).entity(errorResponse).type(MediaType.APPLICATION_JSON).build();
				
			}
		} catch (Exception e) {
			e.printStackTrace();
			MessageResponse errorResponse = new MessageResponse();
			errorResponse.setStatus(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode());
			errorResponse.setMessage("Erro ao excluir usuário. Detalhes: " + e.getMessage());
			errorResponse.setTimestamp(System.currentTimeMillis());

			throw new WebApplicationException(Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorResponse).type(MediaType.APPLICATION_JSON).build());
		}
	}
}