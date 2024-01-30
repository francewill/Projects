package App;

abstract class Blobs extends Sprite{
	// Our ship and enemy extends the Blobs

	public Blobs(int xPos, int yPos) {
		super(xPos, yPos);

		// TODO Auto-generated constructor stub
	}

	abstract void setSpeedBoost(boolean bool);
	abstract void setImmunityBoost(boolean bool);
	abstract boolean getImmunityBoost();
	abstract void move(GameTimer gc);
	abstract void setOriginalImage();
	abstract void setImmunityImage();
	abstract int getBlobEaten();
	abstract void setBlobEaten(int blobEaten);

	// This method is responsible for checking if there is a collision between blobs
	 void checkCollisionBlobs(Blobs blob){
		if(this.collidesWith(blob)){  // If our ship collides with aliens let's check the conditions
			if(this.width>blob.width && blob.getImmunityBoost() == false){  // This blob size is greater than other blob and blob has no immunity
				this.width+=blob.width;  // Width and height increases
				this.height+=blob.height;

				blob.die(); // Blob dies
				if(this instanceof Ship){
					this.setBlobEaten(1);  // increment the blobEaten
				}
			}
		}
	}
}

