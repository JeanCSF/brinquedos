package br.edu.brinquedos.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import br.edu.brinquedos.model.Brinquedo;
import br.edu.brinquedos.util.ConnectionFactory;

public class BrinquedoDAO {

	private Connection conn;
	private PreparedStatement ps;
	private ResultSet rs;
	private Brinquedo brinquedo;

	public BrinquedoDAO() {
		try {
			this.conn = ConnectionFactory.getConnection();
		} catch (Exception e) {

			e.printStackTrace();
		}
	}

	public boolean verificarCodigo(int codigo) throws Exception {
		boolean codigoExiste = false;
		try {
			String SQL = "SELECT COUNT(*) FROM brinquedos WHERE codigo = ?";
			ps = conn.prepareStatement(SQL);
			ps.setInt(1, codigo);
			rs = ps.executeQuery();
			if (rs.next()) {
				int rowCount = rs.getInt(1);
				codigoExiste = rowCount > 0;
			}
		} catch (SQLException sqle) {
			throw new Exception("Erro ao verificar se o Código já existe: " + sqle);
		} finally {
			ConnectionFactory.closeConnection(null, ps, rs);
		}
		return codigoExiste;
	}

	public void salvar(Brinquedo brinquedo) throws Exception {
		if (brinquedo == null)
			throw new Exception("O valor passado nao pode ser nulo");
		int codigo = brinquedo.getCodigo();

		if (verificarCodigo(codigo)) {
			throw new Exception("Este código já está cadastrado!");
		}
		try {
			String SQL = "INSERT INTO brinquedos (codigo, descricao, categoria, marca, imagem, preco, detalhes) values (?, ?, ?, ?, ?, ?, ?)";
			ps = conn.prepareStatement(SQL);
			ps.setInt(1, brinquedo.getCodigo());
			ps.setString(2, brinquedo.getDescricao());
			ps.setString(3, brinquedo.getCategoria());
			ps.setString(4, brinquedo.getMarca());
			ps.setString(5, brinquedo.getImagem());
			ps.setFloat(6, brinquedo.getPreco());
			ps.setString(7, brinquedo.getDetalhes());
			ps.executeUpdate();
		} catch (SQLException sqle) {
			throw new Exception("Erro ao inserir dados " + sqle);
		} finally {
			ConnectionFactory.closeConnection(conn, ps);
		}
	}

	public void atualizar(Brinquedo brinquedo) throws Exception {
		if (brinquedo == null)
			throw new Exception("O valor passado nao pode ser nulo");
		try {
			String SQL = "UPDATE brinquedos SET descricao=?, categoria=?, marca=?, imagem=?, preco=?, detalhes=?  WHERE codigo=?";
			ps = conn.prepareStatement(SQL);
			ps.setString(1, brinquedo.getDescricao());
			ps.setString(2, brinquedo.getCategoria());
			ps.setString(3, brinquedo.getMarca());
			ps.setString(4, brinquedo.getImagem());
			ps.setFloat(5, brinquedo.getPreco());
			ps.setString(6, brinquedo.getDetalhes());
			ps.setInt(7, brinquedo.getCodigo());
			ps.executeUpdate();
		} catch (SQLException sqle) {
			throw new Exception("Erro ao alterar dados " + sqle);
		} finally {
			ConnectionFactory.closeConnection(conn, ps);
		}
	}

	public List<Brinquedo> todosBrinquedos() throws Exception {
		try {
			ps = conn.prepareStatement("SELECT * FROM brinquedos");
			rs = ps.executeQuery();
			List<Brinquedo> list = new ArrayList<Brinquedo>();

			while (rs.next()) {
				int codigo = rs.getInt("codigo");
				String descricao = rs.getString("descricao");
				String categoria = rs.getString("categoria");
				String marca = rs.getString("marca");
				String imagem = rs.getString("imagem");
				float preco = rs.getFloat("preco");
				String detalhes = rs.getString("detalhes");
				list.add(new Brinquedo(codigo, descricao, categoria, marca, imagem, preco, detalhes));
			}
			return list;
		} catch (SQLException sqle) {
			throw new Exception(sqle);
		} finally {
			ConnectionFactory.closeConnection(conn, ps, rs);
		}
	}
	
	public Brinquedo find(int codigoBrinquedo) throws Exception {

		try {
			String SQL = "SELECT * FROM brinquedos WHERE codigo=?";
			ps = conn.prepareStatement(SQL);
			ps.setInt(1, codigoBrinquedo);
			rs = ps.executeQuery();
			if (rs.next()) {
				int codigo = rs.getInt("codigo");
				String descricao = rs.getString("descricao");
				String categoria = rs.getString("categoria");
				String marca = rs.getString("marca");
				String imagem = rs.getString("imagem");
				float preco = rs.getFloat("preco");
				String detalhes = rs.getString("detalhes");

				brinquedo = new Brinquedo(codigo, descricao, categoria, marca, imagem, preco, detalhes);
			}
			return brinquedo;
		} catch (SQLException sqle) {
			throw new Exception(sqle);
		} finally {
			ConnectionFactory.closeConnection(conn, ps, rs);
		}
	}

}
