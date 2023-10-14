package br.edu.toys.controller;

import br.edu.toys.model.User;
import br.edu.toys.util.AuthenticationService;
import br.edu.toys.util.LoginDTO;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import javax.crypto.SecretKey;
import com.google.gson.JsonObject;

@Path("/")
@SuppressWarnings("deprecation") 
public class LoginResource {
	
	private final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(
	"$2a$12$/VVfDvNwmOKMOJdAcXP11uUE0t9/0rbWrTCV7K4msROAIzjeT7MrK"
	.getBytes(StandardCharsets.UTF_8));

    @Inject
	private AuthenticationService authService;

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(LoginDTO loginDTO)
    {
    	User authenticatedUser = authService.authenticateUser(loginDTO.getUserName(), loginDTO.getPassword());
        try{
            if(authenticatedUser != null)
            {
            	JsonObject jsonResponse = new JsonObject();
            	jsonResponse.addProperty("isAdm", authenticatedUser.getIsAdm());
                jsonResponse.addProperty("userId", authenticatedUser.getUserId());
                jsonResponse.addProperty("userName", authenticatedUser.getUserName());
                jsonResponse.addProperty("userImg", authenticatedUser.getUserImg());
                jsonResponse.addProperty("token", createJwtToken(authenticatedUser));

                return Response.status(Response.Status.OK).entity(jsonResponse.toString()).build();
            }
            else
                return Response.status(Response.Status.UNAUTHORIZED)
						.entity("Usuário e/ou senha inválidos").build();
        }
        catch(Exception ex)
        {
            return Response.status(
						Response.Status.INTERNAL_SERVER_ERROR
					).entity(ex.getMessage())
					.build();
        } 
    }
    private String createJwtToken(User authenticatedUser) {
        return Jwts.builder()
                .claim("sub", authenticatedUser.getUserName())
                .claim("iss", "localhost:8080")
                .claim("iat", new Date())
                .claim("exp", Date.from(LocalDateTime.now().plusMinutes(15L).atZone(ZoneId.systemDefault()).toInstant()))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }
    
    @RequestScoped
    private void processToken(String jwtToken) throws Exception {
        try {
            Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(jwtToken)
                .getBody();


            Date expirationDate = claims.getExpiration();
            if (expirationDate.before(new Date())) {
                throw new Exception("Token expirado");
            }

            if (!claims.getIssuer().equals("localhost:8080")) {
                throw new Exception("Emissor inválido");
            }

        } catch (Exception e) {
            throw new Exception("Falha na verificação do token: " + e.getMessage());
        }
    }

}


