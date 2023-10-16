package br.edu.toys.util;

public class FormValidation {
	private static final String USERNAME_PATTERN = "^[a-zA-Z0-9_ ]*$";

    public boolean isValidUsername(String username) {
        return username.matches(USERNAME_PATTERN);
    }
}
