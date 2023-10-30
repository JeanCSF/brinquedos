package br.edu.toys.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import br.edu.toys.model.Toy;
import br.edu.toys.util.ConnectionFactory;

public class ToyDAO {

	private Connection conn;
	private PreparedStatement ps;
	private ResultSet rs;
	
	public ToyDAO() {
		try {
			this.conn = ConnectionFactory.getConnection();
		} catch (Exception e) {

			e.printStackTrace();
		}
	}

	public boolean checkId(int toy_id) throws Exception {
		boolean toyIdExists = false;
		try {
			String SQL = "SELECT COUNT(*) FROM tb_toys WHERE toy_id = ?";
			ps = conn.prepareStatement(SQL);
			ps.setInt(1, toy_id);
			rs = ps.executeQuery();
			if (rs.next()) {
				int rowCount = rs.getInt(1);
				toyIdExists = rowCount > 0;
			}
		} catch (SQLException sqle) {
			throw new Exception("Erro ao verificar se o Código já existe: " + sqle);
		} finally {
			ConnectionFactory.closeConnection(null, ps, rs);
		}
		return toyIdExists;
	}

	public void save(Toy toy) throws Exception {
		if (toy == null)
			throw new Exception("O valor passado nao pode ser nulo");
		int toyId = toy.getToyId();

		if (checkId(toyId)) {
			throw new Exception("Este código já está cadastrado!");
		}
		try {
			String SQL = "INSERT INTO tb_toys (toy_id, description, category, brand, image, price, details) values (?, ?, ?, ?, ?, ?, ?)";
			ps = conn.prepareStatement(SQL);
			
			ps.setInt(1, toy.getToyId());
			ps.setString(2, toy.getDescription());
			ps.setString(3, toy.getCategory());
			ps.setString(4, toy.getBrand());
			ps.setString(5, toy.getImage());
			ps.setFloat(6, toy.getPrice());
			ps.setString(7, toy.getDetails());
			
			ps.executeUpdate();
		} catch (SQLException sqle) {
			throw new Exception("Erro ao inserir dados " + sqle);
		} finally {
			ConnectionFactory.closeConnection(conn, ps);
		}
	}

	public void update(Toy toy) throws Exception {
		if (toy == null)
			throw new Exception("O valor passado nao pode ser nulo");
		try {
			String SQL = "UPDATE tb_toys SET description=?, category=?, brand=?, image=?, price=?, details=?  WHERE toy_id=?";
			ps = conn.prepareStatement(SQL);
			ps.setString(1, toy.getDescription());
			ps.setString(2, toy.getCategory());
			ps.setString(3, toy.getBrand());
			ps.setString(4, toy.getImage());
			ps.setFloat(5, toy.getPrice());
			ps.setString(6, toy.getDetails());
			ps.setInt(7, toy.getToyId());
			ps.executeUpdate();
		} catch (SQLException sqle) {
			throw new Exception("Erro ao alterar dados " + sqle);
		} finally {
			ConnectionFactory.closeConnection(conn, ps);
		}
	}

	public List<Toy> allToys() throws Exception {
		try {
			ps = conn.prepareStatement("SELECT * FROM tb_toys");
			rs = ps.executeQuery();
			List<Toy> list = new ArrayList<Toy>();

			while (rs.next()) {
				int toy_id = rs.getInt("toy_id");
				String description = rs.getString("description");
				String category = rs.getString("category");
				String brand = rs.getString("brand");
				String image = rs.getString("image");
				float price = rs.getFloat("price");
				String details = rs.getString("details");
				list.add(new Toy(toy_id, description, category, brand, image, price, details));
			}
			return list;
		} catch (SQLException sqle) {
			throw new Exception(sqle);
		} finally {
			ConnectionFactory.closeConnection(conn, ps, rs);
		}
	}

	public Toy find(int toyId) throws Exception {
		try (Connection conn = ConnectionFactory.getConnection();
				PreparedStatement ps = conn.prepareStatement("SELECT * FROM tb_toys WHERE toy_id=?")) {

			ps.setInt(1, toyId);
			try (ResultSet rs = ps.executeQuery()) {
				if (rs.next()) {
					int toy_id = rs.getInt("toy_id");
					String description = rs.getString("description");
					String category = rs.getString("category");
					String brand = rs.getString("brand");
					String image = rs.getString("image");
					float price = rs.getFloat("price");
					String details = rs.getString("details");

					return new Toy(toy_id, description, category, brand, image, price, details);
				}
			}
		} catch (SQLException sqle) {
			throw new Exception(sqle);
		}
		return null;
	}
	
	public void delete(int toyId) throws Exception {
		if (toyId == 0)
			throw new Exception("O valor passado nao pode ser 0");
		try {
			String SQL = "DELETE FROM tb_toys WHERE toy_id = ?";
			ps = conn.prepareStatement(SQL);
			ps.setInt(1, toyId);
			ps.executeUpdate();
		} catch (SQLException sqle) {
			throw new Exception("Erro ao excluir dados " + sqle);
		} finally {
			ConnectionFactory.closeConnection(conn, ps);
		}
	}
	
	public List<String> categories() throws Exception {
	    try {
	        ps = conn.prepareStatement("SELECT DISTINCT category FROM tb_toys");
	        rs = ps.executeQuery();
	        List<String> categories = new ArrayList<>();

	        while (rs.next()) {
	            String category = rs.getString("category");
	            categories.add(category);
	        }
	        return categories;
	    } catch (SQLException sqle) {
	        throw new Exception(sqle);
	    } finally {
	        ConnectionFactory.closeConnection(conn, ps, rs);
	    }
	}
}
