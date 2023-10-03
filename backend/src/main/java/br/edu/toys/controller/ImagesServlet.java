package br.edu.toys.controller;

import java.io.File;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.ResponseBuilder;

@Path("/images")
public class ImagesServlet {
    
	private static final String IMAGES_FOLDER = "images/";

    @GET
    @Path("/{imgName}")
    @Produces("image/*")
    public Response getImage(@PathParam("imgName") String imgName) {
        File imgFile = new File(IMAGES_FOLDER + imgName);

        if (imgFile.exists()) {
            ResponseBuilder response = Response.ok((Object) imgFile);
            return response.build();
        } else {
            return Response.status(404).build();
        }
    }
}
