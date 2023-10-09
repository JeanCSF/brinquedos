package br.edu.toys.util;

import org.mindrot.jbcrypt.BCrypt;

import br.edu.toys.dao.UserDAO;
import br.edu.toys.model.User;
import jakarta.enterprise.context.RequestScoped;

@RequestScoped
public class AuthenticationService {
	
	private UserDAO daoUser = new UserDAO();

	public User authenticateUser(String username, String password) {
	    try {
	        if (checkPass(username, password)) {
	        	
	            User user = daoUser.getUserByUserName(username);
	            return user;
	        } else {
	        	
	            return null;
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        return null;
	    }
	}

	private boolean checkPass(String username, String password) throws Exception {
		String storedPasswordHash = daoUser.getPassword(username);

		if (storedPasswordHash == null) {
			return false;
		}

		return BCrypt.checkpw(password, storedPasswordHash);
	}
}
