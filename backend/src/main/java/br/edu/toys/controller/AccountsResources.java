package br.edu.toys.controller;

import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import br.edu.toys.model.UserLogin;
import br.edu.toys.util.AuthenticationService;
import br.edu.toys.model.User;

@Path("/")
public class AccountsResources {
	
	@Inject
	private AuthenticationService authService;

	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response login(UserLogin userLogin, @Context HttpServletRequest request) {
	    User authenticatedUser = authService.authenticateUser(userLogin.getUser(), userLogin.getPassword());
	    
	    if (authenticatedUser != null) {
	        HttpSession session = request.getSession();
	        session.setAttribute("user", authenticatedUser);
	        return Response.status(Response.Status.OK).entity(authenticatedUser).build();
	        
	    } else {
	        return Response.status(Response.Status.UNAUTHORIZED).entity("Credenciais inválidas").build();
	    }
	}
}

