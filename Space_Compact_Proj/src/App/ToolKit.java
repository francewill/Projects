package App;

import javafx.animation.PauseTransition;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.util.Duration;

public class ToolKit extends Item{

	final static int TOOL_KIT_SIZE = 40;
	final static Image TOOL_KIT_IMAGE = new Image("images/tool_kit.png");

	ToolKit(int x, int y) {
		super(x, y);

		ImageView final_image = new ImageView(TOOL_KIT_IMAGE);
		final_image.setFitHeight(TOOL_KIT_SIZE);
		final_image.setFitWidth(TOOL_KIT_SIZE);
		this.loadImage(final_image);
	}

	// This method checks if there is a collision between the Blob and the ToolKit
	@Override
	 void checkCollision(Blobs blob) {
		if(this.collidesWith(blob)){  // If there is a collision then change the image of the blob and set its immunity to true
			blob.setImmunityImage();
			blob.setImmunityBoost(true);
			this.vanish();  // Make the tool kit vanish after the collision
			System.out.println("Blob has collected a Tool Kit!");

			PauseTransition effect = new PauseTransition(Duration.seconds(5)); // 5 seconds immunity boost
			effect.play();

			effect.setOnFinished(event ->{
				blob.setOriginalImage();  // After 5 seconds bring back the original image of the blob
				blob.setImmunityBoost(false);  // Set its immunity boost to false
				System.out.println("Immunity Removed!");
			});

		}else{
				PauseTransition disappear  = new PauseTransition(Duration.seconds(5)); // Toolkit disappears after 5 seconds if not collected
				disappear.play();

				disappear.setOnFinished(event ->{
					this.vanish();
				});
		}
	}
}
