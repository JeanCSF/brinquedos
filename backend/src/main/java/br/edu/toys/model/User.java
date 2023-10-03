package br.edu.toys.model;

public class User {
	private int userId;
	private String userImg;
	private String userName;
	private String password;
	private String isAdm;

	public User(int userId, String userImg, String user, String password, String isAdm) {
		super();
		this.userId = userId;
		this.userImg = userImg;
		this.userName = user;
		this.password = password;
		this.isAdm = isAdm;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getUserImg() {
		return userImg;
	}

	public void setUserImg(String userImg) {
		this.userImg = userImg;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String user) {
		this.userName = user;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getIsAdm() {
		return isAdm;
	}

	public void setIsAdm(String isAdm) {
		this.isAdm = isAdm;
	}

	public User() {
	}
}
