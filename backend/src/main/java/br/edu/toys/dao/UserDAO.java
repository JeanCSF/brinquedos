package br.edu.toys.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import br.edu.toys.model.User;
import br.edu.toys.util.ConnectionFactory;

public class UserDAO {
	private Connection conn;
	private PreparedStatement ps;
	private ResultSet rs;

	public UserDAO() {
		try {
			this.conn = ConnectionFactory.getConnection();
		} catch (Exception e) {

			e.printStackTrace();
		}
	}
	
	public boolean checkUserId(int userId) throws Exception {
		boolean toyIdExists = false;
		try {
			String SQL = "SELECT COUNT(*) FROM tb_users WHERE user_id = ?";
			ps = conn.prepareStatement(SQL);
			ps.setInt(1, userId);
			rs = ps.executeQuery();
			if (rs.next()) {
				int rowCount = rs.getInt(1);
				toyIdExists = rowCount > 0;
			}
		} catch (SQLException sqle) {
			throw new Exception("Erro ao verificar se o Usuário já existe: " + sqle);
		} finally {
			ConnectionFactory.closeConnection(null, ps, rs);
		}
		return toyIdExists;
	}

	public boolean checkUserName(String user) throws Exception {
		boolean userExists = false;
		try {
			String SQL = "SELECT COUNT(*) FROM tb_users WHERE user = ?";
			ps = conn.prepareStatement(SQL);
			ps.setString(1, user);
			rs = ps.executeQuery();
			if (rs.next()) {
				int rowCount = rs.getInt(1);
				userExists = rowCount > 0;
			}
		} catch (SQLException sqle) {
			throw new Exception("Erro ao verificar se o Usuário já existe: " + sqle);
		} finally {
			ConnectionFactory.closeConnection(null, ps, rs);
		}
		return userExists;
	}

	public void save(User user) throws Exception {
		if (user == null)
			throw new Exception("O valor passado nao pode ser nulo");
		String userName = user.getUserName();

		if (checkUserName(userName)) {
			throw new Exception("Este usuário já está cadastrado!");
		}
		try {
			String SQL = "INSERT INTO tb_users (user_img, user, password, adm) values (?, ?, ?, ?)";
			ps = conn.prepareStatement(SQL);

			ps.setString(1, user.getUserImg());
			ps.setString(2, user.getUserName());
			ps.setString(3, user.getPassword());
			ps.setString(4, user.getIsAdm());

			ps.executeUpdate();
		} catch (SQLException sqle) {
			throw new Exception("Erro ao inserir dados " + sqle);
		} finally {
			ConnectionFactory.closeConnection(conn, ps);
		}
	}

	public void update(User user) throws Exception {
		if (user == null)
			throw new Exception("O valor passado nao pode ser nulo");
		try {
			String SQL = "UPDATE tb_users SET user_img=?, user=?, password=?, adm=? WHERE user_id=?";
			ps = conn.prepareStatement(SQL);

			ps.setString(1, user.getUserImg());
			ps.setString(2, user.getUserName());
			ps.setString(3, user.getPassword());
			ps.setString(4, user.getIsAdm());
			ps.setInt(5, user.getUserId());

			ps.executeUpdate();
		} catch (SQLException sqle) {
			throw new Exception("Erro ao alterar dados " + sqle);
		} finally {
			ConnectionFactory.closeConnection(conn, ps);
		}
	}

	public List<User> allUsers() throws Exception {
		try {
			ps = conn.prepareStatement("SELECT * FROM tb_users");
			rs = ps.executeQuery();
			List<User> list = new ArrayList<User>();

			while (rs.next()) {
				int user_id = rs.getInt("user_id");
				String user_img = rs.getString("user_img");
				String user = rs.getString("user");
				String password = rs.getString("password");
				String adm = rs.getString("adm");

				list.add(new User(user_id, user_img, user, password, adm));
			}
			return list;
		} catch (SQLException sqle) {
			throw new Exception(sqle);
		} finally {
			ConnectionFactory.closeConnection(conn, ps, rs);
		}
	}

	public User find(int userId) throws Exception {
		try (Connection conn = ConnectionFactory.getConnection();
				PreparedStatement ps = conn.prepareStatement("SELECT * FROM tb_users WHERE user_id=?")) {

			ps.setInt(1, userId);
			try (ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					int user_id = rs.getInt("user_id");
					String user_img = rs.getString("user_img");
					String user = rs.getString("user");
					String password = rs.getString("password");
					String adm = rs.getString("adm");

					return new User(user_id, user_img, user, password, adm);
				}
			}
		} catch (SQLException sqle) {
			throw new Exception(sqle);
		}
		return null;
	}
	
	public void delete(int userId) throws Exception {
		if (userId == 0)
			throw new Exception("O valor passado nao pode ser 0");
		try {
			String SQL = "DELETE FROM tb_users WHERE user_id = ?";
			ps = conn.prepareStatement(SQL);
			ps.setInt(1, userId);
			ps.executeUpdate();
		} catch (SQLException sqle) {
			throw new Exception("Erro ao excluir dados " + sqle);
		} finally {
			ConnectionFactory.closeConnection(conn, ps);
		}
	}
}
