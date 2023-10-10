package br.edu.toys.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;

import java.util.Date;

import br.edu.toys.model.User;

public class JwtUtil {
    private static final String SECRET_KEY = "$2a$12$/VVfDvNwmOKMOJdAcXP11uUE0t9/0rbWrTCV7K4msROAIzjeT7MrK";
    private static final long EXPIRATION_TIME_MS = 3600000;

    public static String generateToken(User user) {
        Date expirationDate = new Date(System.currentTimeMillis() + EXPIRATION_TIME_MS);

        Claims claims = Jwts.claims();
        claims.put("userId", user.getUserId());
        claims.put("userName", user.getUserName());
        claims.put("userImg", user.getUserImg());
        claims.put("isAdmin", user.getIsAdm());
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getUserName())
                .setExpiration(expirationDate)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public static String getUsernameFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject();
        } catch (Exception e) {
            // Trate a exceção de forma apropriada, você pode registrar ou lançar uma exceção personalizada
            return null;
        }
    }

    public static boolean isTokenValid(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            // Trate a exceção de forma apropriada, você pode registrar ou lançar uma exceção personalizada
            return false;
        }
    }
}
