package br.edu.brinquedos.controller;

import java.io.File;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.ResponseBuilder;

@Path("/imagens")
public class ImagesServlet {
    
	private static final String PASTA_IMAGENS = "imagens/";

    @GET
    @Path("/{nomeImagem}")
    @Produces("image/*")
    public Response obterImagem(@PathParam("nomeImagem") String nomeImagem) {
        File arquivoImagem = new File(PASTA_IMAGENS + nomeImagem);

        if (arquivoImagem.exists()) {
            ResponseBuilder response = Response.ok((Object) arquivoImagem);
            return response.build();
        } else {
            return Response.status(404).build();
        }
    }
}
