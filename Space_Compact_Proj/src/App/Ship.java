package App;

import javafx.scene.image.Image;
import javafx.scene.image.ImageView;

public class Ship extends Blobs{
	private String name;
	private boolean speed_boost;  // We will base here to check if we have speed boost (Golden Fuel powerup)
	private boolean immunity_boost;  // We will base here to check if we have immunity boost (Tool Kit powerup)
	private int foodEaten = 0;  // We must track the number of gears we collect
    private int blobEaten = 0;  // We must track the number of aliens we defeat
	private int ship_width = 40;
	static Image SPACESHIP_IMAGE = new Image("images/SpaceShip.png");  // This will be our image for our ship
	static Image IMMUNITY_IMAGE = new Image("images/immunity.gif");  // This will be the image of our ship if there is immunity boost


	public Ship(String name, int x, int y){
		super(x,y);
		this.name = name;
		this.speed_boost = false;
		this.immunity_boost = false;

		ImageView final_image = new ImageView(SPACESHIP_IMAGE);  // Make SPACESHIP_IMAGE as our ship image
		final_image.setFitHeight(ship_width);
		final_image.setFitWidth(ship_width);
		this.loadImage(final_image);
	}

	// Create our getters

	 boolean isAlive(){
		if(this.alive) return true;
		return false;
	}

	 String getName(){
		return this.name;
	}

	 int getFoodEaten() {
		return foodEaten;
	}

	 int getBlobEaten() {
		return blobEaten;
	}

	 boolean getImmunityBoost(){
		return this.immunity_boost;

	}

	 boolean getSpeedBoost(){
		return this.speed_boost;

	}

	 double golden(){
		return this.ship_width;
	}

	// Create our setters

	// This setter will set our alive status to false
	 void die(){
    	this.alive = false;
    }

	// This setter will update the value of our foodEaten
	 void setFoodEaten(int foodEaten) {
		this.foodEaten += foodEaten;
	}

	// This setter will update the value of our blobEaten
	 void setBlobEaten(int blobEaten) {
		this.blobEaten += blobEaten;
	}

	// This setter will update the speed_boost to enable the speed boost
	 void setSpeedBoost(boolean bool){
		this.speed_boost = bool;
	}

	// This setter will update the immunity_boost to enable the immunity
	 void setImmunityBoost(boolean bool){
		this.immunity_boost = bool;
	}

	// This will make our ship move
	 void move(GameTimer gc) {
    	this.x += this.dx;
    	this.y += this.dy;
    	gc.cameraX();  // Set our camera here so that our camera will follow our ship
    	gc.cameraY();
	}

	// This method are needed for the immunity effect since we need to change in original state our ship when immunity is gone
	 void setOriginalImage(){
		ImageView final_image = new ImageView(SPACESHIP_IMAGE);
		final_image.setFitHeight(this.getHeigth());
		final_image.setFitWidth(this.getHeigth());
		this.loadImage(final_image);  // Set the original picture for our ship
	}

	// This method will change our ship image when we have immunity
	 void setImmunityImage(){
		ImageView final_image = new ImageView("images/immunity.gif");
		final_image.setFitHeight(this.getHeigth());
		final_image.setFitWidth(this.getHeigth());
		this.loadImage(final_image);
	}
}
