package App;

import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.util.Duration;
import javafx.animation.PauseTransition;

public class GoldenFuel extends Item {

	 final static int GOLDEN_FUEL_SIZE = 40;
	 final static Image GOLDEN_FUEL_IMAGE = new Image("images/g_fuel.png");

	GoldenFuel(int x, int y) {
		super(x, y);
		ImageView final_image = new ImageView(GOLDEN_FUEL_IMAGE);
		final_image.setFitHeight(GOLDEN_FUEL_SIZE);
		final_image.setFitWidth(GOLDEN_FUEL_SIZE);

		this.alive = true;
		this.loadImage(final_image);
	}

	// This method will check if there is a collision between Golden Fuel and Blobs
	@Override
	 void checkCollision(Blobs blob) {
		if(this.collidesWith(blob)){  // If there is collision then set a temporary height for boost
			blob.temp_height = blob.height/2;

			blob.setSpeedBoost(true);  // set the blob speed boost to true
			this.vanish();  // Make the Golden Fuel vanish after the collision
			System.out.println("Blob has collected a Golden Fuel!");

			PauseTransition effect = new PauseTransition(Duration.seconds(5)); // 5 second boost
			effect.play();

			effect.setOnFinished(event ->{
				blob.setSpeedBoost(false);  // After 5 seconds boost set blob's speed boost to false
				System.out.println("Golden Fuel has been emptied!");
			});

		}else{
				PauseTransition disappear  = new PauseTransition(Duration.seconds(5)); // If there is no collision after 5 seconds Golden Fuel will vanish
				disappear.play();

				disappear.setOnFinished(event ->{
					this.vanish();
				});
		}
	}
}
