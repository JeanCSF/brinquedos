package br.edu.brinquedos.model;

public class Brinquedo {

	private int codigo;
	private String descricao;
	private String categoria;
	private String marca;
	private String imagem;
	private float preco;
	private String detalhes;

	public Brinquedo(int codigo, String descricao, String categoria, String marca, String imagem, float preco, String detalhes) {
		this.codigo = codigo;
		this.descricao = descricao;
		this.categoria = categoria;
		this.marca = marca;
		this.imagem = imagem;
		this.preco = preco;
		this.detalhes = detalhes;
	}

	public Brinquedo() {
	}

	public int getCodigo() {
		return codigo;
	}

	public void setCodigo(int codigo) {
		this.codigo = codigo;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public String getCategoria() {
		return categoria;
	}

	public void setCategoria(String categoria) {
		this.categoria = categoria;
	}

	public String getMarca() {
		return marca;
	}

	public void setMarca(String marca) {
		this.marca = marca;
	}

	public String getImagem() {
		return imagem;
	}

	public void setImagem(String imagem) {
		this.imagem = imagem;
	}

	public float getPreco() {
		return preco;
	}

	public void setPreco(float preco) {
		this.preco = preco;
	}

	public String getDetalhes() {
		return detalhes;
	}

	public void setDetalhes(String detalhes) {
		this.detalhes = detalhes;
	}
}
