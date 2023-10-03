package br.edu.toys.model;

public class Toy {

	private int toyId;
	private String description;
	private String category;
	private String brand;
	private String image;
	private float price;
	private String details;

	public Toy(int toyId, String description, String category, String brand, String image, float price, String details) {
		super();
		this.toyId = toyId;
		this.description = description;
		this.category = category;
		this.brand = brand;
		this.image = image;
		this.price = price;
		this.details = details;
	}

	public int getToyId() {
		return toyId;
	}

	public void setToyId(int toyId) {
		this.toyId = toyId;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public float getPrice() {
		return price;
	}

	public void setPrice(float price) {
		this.price = price;
	}

	public String getDetails() {
		return details;
	}

	public void setDetails(String details) {
		this.details = details;
	}

	public Toy() {
	}


}
