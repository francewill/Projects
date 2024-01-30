package App;



import javafx.scene.image.ImageView;


import java.util.Random;


import javafx.scene.image.Image;


public class EnemyBlob extends Blobs {
	private String name;
	private int ship_width = 40;
	private boolean speed_boost;
	private boolean immunity_boost;
	private Image monstersImg;
	Random r = new Random();
	int direction = 0;  // This will hold the value for which direction to use
	int val;  // This will hold the info for what type of alien
	int foodEaten = 0;
	int blobEaten = 0;

	public EnemyBlob(String name, int x, int y,int val){  // Use the val for identifying which type of alien to create
		super(x,y);
		this.name = name;
		this.speed_boost = false;
		this.immunity_boost = false;
		this.val = val;
		this.monstersImg = new Image("images/monster"+val+".png");
		ImageView final_imageMons = new ImageView(monstersImg);  // Set the image for our alien
		final_imageMons.setFitHeight(ship_width);
		final_imageMons.setFitWidth(ship_width);

		this.loadImage(final_imageMons);
	}

	// Create our getters

	 boolean isAlive(){
		if(this.alive) return true;
		return false;
	}
	 String getName(){
		return this.name;
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

	 double getShip_width(){
		return this.ship_width;
	}

	 double golden(){
		return this.ship_width;
	}

	// Create Setters

	 void setSpeedBoost(boolean bool){
		this.speed_boost = bool;

	}

	 void setImmunityBoost(boolean bool){
		this.immunity_boost = bool;

	}

	 void setBlobEaten(int blobEaten) {
		this.blobEaten += blobEaten;
	}

	// This method will be the responsible for making our aliens move
	 void move(GameTimer gc) {
		double speed;
		if(this.speed_boost){
			speed = 120/this.getTempHeight();
		} else {
			speed = 120/this.getHeigth();
		}

		this.x += this.dx;
		this.y += this.dy;

		direction = r.nextInt(200);  // Since we don't control our enemies, we randomize their movements
		if(direction == 0){
			this.dy =  -1*speed;

		}
		if(direction == 1){
			this.dx =  -1*speed;
		}
		if(direction == 2){
			this.dy = speed;
		}
		if(direction == 3){
			this.dx = speed;
		}

		gc.borderBlob();  // Call the method for the border to prevent them getting out the game map

	}

	// This method will bring back the original image of alien
	 void setOriginalImage(){
		ImageView final_image = new ImageView("images/monster"+val+".png");
		final_image.setFitHeight(this.getHeigth());
		final_image.setFitWidth(this.getHeigth());
		this.loadImage(final_image);
	}

	// This method will change the image of the alien when have immunity
	 void setImmunityImage(){
		ImageView final_image = new ImageView("images/immunityMons"+this.val+".gif");
		System.out.println("images/immunityMons"+this.val+".gif");
		final_image.setFitHeight(this.getHeigth());
		final_image.setFitWidth(this.getHeigth());
		this.loadImage(final_image);
	}
}
