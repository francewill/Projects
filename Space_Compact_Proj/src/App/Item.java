package App;

// Gears, Golden Fuel, and Tool Kit extends Item
abstract class Item extends Sprite {
	Item(int x, int y){
		super(x,y);
	}
	abstract void checkCollision(Blobs blob);
}
