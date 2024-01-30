package App;

import javafx.geometry.Rectangle2D;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.image.ImageView;

 public abstract class Sprite {
	protected ImageView img;
	protected double x, y;
	protected double dx, dy;
	protected boolean visible;
	protected double width;
	protected double height;
	protected double temp_height;
	protected boolean alive;

	public Sprite(int xPos, int yPos){
		this.x = xPos;
		this.y = yPos;
		this.visible = true;
		this.alive = true;
	}

	//method to set the object's image
	protected void loadImage(ImageView img){
		try{
			this.img = img;
	        this.setSize();
		} catch(Exception e){}
	}

	//method to set the image to the image view node
	void render(GraphicsContext gc){
		gc.drawImage(this.img.getImage(), this.x, this.y, width,height);

    }

	//method to set the object's width and height properties
	private void setSize(){
		this.width = this.img.getFitWidth();
	    this.height = this.img.getFitHeight();
	}

	//method that will check for collision of two sprites
	 boolean collidesWith(Sprite rect2)	{
		Rectangle2D rectangle1 = this.getBounds();
		Rectangle2D rectangle2 = rect2.getBounds();

		return rectangle1.intersects(rectangle2);
	}

	//method that will return the bounds of an image
	private Rectangle2D getBounds(){
		return new Rectangle2D(this.x, this.y, this.width, this.height);
	}

	// Create our getters

	//method to return the image
	ImageView getImage(){
		return this.img;
	}

	 boolean isAlive(){
		return this.alive;
	}

	 double getX() {
    	return this.x;
	}

	 double getY() {
    	return this.y;
	}

	 double getDX(){
		return this.dx;
	}
	 double getDY(){
		return this.dy;
	}

	 double getHeigth(){
		return this.height;
	}

	 double getTempHeight(){
		return this.temp_height;
	}

	 boolean getVisible(){
		return visible;
	}
	 boolean isVisible(){
		if(visible) return true;
		return false;
	}

	// Create out setters
	 void setDX(double dx){
		this.dx = dx;
	}

	 void setDY(double dy){
		this.dy = dy;
	}
	 void setX(int x){
		this.x = x;
	}
	 void setY(int y){
		this.y = y;
	}

	 void setWidth(double val){
		this.width = val;
	}

	 void setHeight(double val){
		this.height = val;
	}

	 void setVisible(boolean value){
		this.visible = value;
	}

	 void vanish(){
		this.visible = false;
	}

	 void appear(){
		this.visible = true;
	}
	 void die(){
		this.alive = false;
	}
}
