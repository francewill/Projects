package App;



import javafx.scene.image.Image;
import javafx.scene.image.ImageView;

public class Gear extends Item {

	final static int GEARS_SIZE = 20;
	final static Image GEARS_IMAGE = new Image("images/gear.png");


	Gear(int x, int y){
		super(x,y);
		ImageView final_image = new ImageView(GEARS_IMAGE);
		final_image.setFitHeight(GEARS_SIZE);
		final_image.setFitWidth(GEARS_SIZE);

		this.loadImage(final_image);
	}

	// This method will check if there is collision between the gears and a blob
	 void checkCollision(Blobs blob){
		if(this.collidesWith(blob)){  // Each collision will add 10 px to height and width
			blob.height+=10;
			blob.width+=10;
			if(blob instanceof Ship){
				((Ship) blob).setFoodEaten(1);  // Increment 1 for food eaten for game stats
			}
			this.vanish(); // make the gear vanish once its purpose is done
		}
	}
}
