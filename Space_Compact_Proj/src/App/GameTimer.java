package App;

import javafx.animation.AnimationTimer;

import javafx.animation.PauseTransition;
import javafx.event.EventHandler;
import javafx.scene.Scene;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.input.KeyCode;
import javafx.scene.input.KeyEvent;
import javafx.scene.paint.Color;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.util.Duration;

import javafx.scene.ParallelCamera;

import java.util.Random;

import App.GameStage;

import java.util.ArrayList;

public class GameTimer extends AnimationTimer{

	private GraphicsContext gc;
	private Scene theScene;
	private Ship myShip;



	ParallelCamera camera;
	private ArrayList<Item> collectibles;
	private ArrayList<Blobs> blobs;
	static int MAX_GEARS = 50;
	static int MAX_FUEL = 1;
	static int MAX_TOOLKIT = 1;
	static int MAX_ENEMIES = 10;
	private double final_time;
	private long start = System.currentTimeMillis();
	private final Image game_bg = new Image("images/game_bg.gif",GameStage.GAME_MAP_HEIGHT,GameStage.GAME_MAP_HEIGHT,false,false);
	private GameStage gs;

	GameTimer(GraphicsContext gc, Scene theScene, GameStage gs){
		this.gs = gs;
		this.gc = gc;
		this.theScene = theScene;
		this.myShip = new Ship("UFO",300,300);  // Spawn our ship
		this.collectibles = new ArrayList<Item>();  // Arraylist for our collectibles (gears, powerups)
		this.blobs = new ArrayList<Blobs>();  // Arraylist for our blobs
		this.camera = new ParallelCamera();
		this.theScene.setCamera(this.camera);
		this.spawnFuel();  // Spawn the golden fuel powerup
		this.spawnToolKit();  // Spawn the Tool Kit powerup
		this.spawnGears();  // Spawn the gears
		this.spawnEnemy();  // Spawn the enemies
		this.blobs.add(myShip);  // Add our ship to the blob

		//call method to handle mouse click event
		this.handleKeyPressEvent();
	}

	@Override
	public void handle(long currentNanoTime) {
		this.gc.clearRect(0, 0, GameStage.GAME_MAP_WIDTH,GameStage.GAME_MAP_HEIGHT);

		redrawBackgroundImage();  // redraw our background to create a moving effect of map
		this.renderTimer();  // Call our game status method
		this.moveAllBlobs(); // Call the method responsible for moving
		this.renderBlobs();  // Call the function that will draw our blobs
		this.renderCollectibles();  // Call the function that will draw our collectibles
		this.moveCollectibles();  // Call the function that will handle the respawn of our collectibles

		for(Blobs b : this.blobs){  // Check collision for each blob throughout the game
			this.blobCollisions(b);
		}
		gameResult(); //presents the game result
	}

	private void gameResult(){
		// If blob is not alive anymore then the game is over
		if(!this.myShip.isAlive()){
			System.out.println("Gameover!");
			this.stop();

			this.gc.clearRect(0, 0, GameStage.GAME_MAP_WIDTH, GameStage.GAME_MAP_HEIGHT);
			Image gameOver = new Image("images/youLoseScene.png",GameStage.WINDOW_WIDTH,GameStage.WINDOW_HEIGHT,false,false);
			ImageView gameover_Imageview = new ImageView(gameOver);
			gameover_Imageview.setFitHeight(GameStage.WINDOW_HEIGHT);
			gameover_Imageview.setFitWidth(GameStage.WINDOW_WIDTH);
			this.gc.drawImage(gameover_Imageview.getImage(), 0, 0);
			this.theScene.getCamera().setTranslateX(0);
			this.theScene.getCamera().setTranslateY(0);
			Font score = Font.font("Comic Sans MS", FontWeight.BOLD, 30);  // Set font style, type, and size
			this.gc.setFont(score);
			this.gc.setFill(Color.FLORALWHITE);	 // Set font color of text

			this.gc.fillText(String.valueOf(this.final_time),380,260); // Writes the text
			this.gc.fillText(String.valueOf(this.myShip.getFoodEaten()), 400, 420);
			this.gc.fillText(String.valueOf(this.myShip.getBlobEaten()), 405, 580);
			this.gc.fillText(String.valueOf(this.myShip.width), 370, 735);
			Font ins = Font.font("Comic Sans MS", FontWeight.BOLD, 15);
			this.gc.setFont(ins);
			this.gc.fillText("Click anywhere to go back to Main Menu", 25, 780);

			this.gc.getCanvas().setOnMouseClicked(event -> { //if the canvas is clicked, returns to the main menu
				this.gc.getCanvas().setOnMouseClicked(null);  // makes the canvas not clickable again
				this.gs.getMainMenu();
	        });


		}

		// If blob size is 1 (only your ship remaining) then you win since you already defeated all of the aliens or all the aliens has died
		if(blobs.size()==1){
			System.out.println("You Win!");
			this.stop();
			this.gc.clearRect(0, 0, GameStage.GAME_MAP_WIDTH, GameStage.GAME_MAP_HEIGHT);
			Image win = new Image("images/youWinScene.png",GameStage.WINDOW_WIDTH,GameStage.WINDOW_HEIGHT,false,false);
			ImageView win_Imageview = new ImageView(win);
			win_Imageview.setFitWidth(GameStage.WINDOW_WIDTH);
			win_Imageview.setFitHeight(GameStage.WINDOW_HEIGHT);
			this.theScene.getCamera().setTranslateX(0);
			this.theScene.getCamera().setTranslateY(0);
			Font score = Font.font("Comic Sans MS", FontWeight.BOLD, 30);  // Set font style, type, and size
			this.gc.setFont(score);
			this.gc.setFill(Color.FLORALWHITE);	 // Set font color of text
			this.gc.drawImage(win_Imageview.getImage(), 0, 0);
			this.gc.fillText(String.valueOf(this.final_time),380,260); // Writes the text
			this.gc.fillText(String.valueOf(this.myShip.getFoodEaten()), 385, 420);
			this.gc.fillText(String.valueOf(this.myShip.getBlobEaten()), 400, 580);
			this.gc.fillText(String.valueOf(this.myShip.width), 365, 735);
			Font ins = Font.font("Comic Sans MS", FontWeight.BOLD, 15);
			this.gc.setFont(ins);
			this.gc.fillText("Click anywhere to go back to Main Menu", 25, 780);

			this.gc.getCanvas().setOnMouseClicked(event -> { //if the canvas is clicked, returns to the main menu
				this.gc.getCanvas().setOnMouseClicked(null);  // makes the canvas not clickable again
				this.gs.getMainMenu();
	        });
		}
	}

	// This method will be responsible for our game status (Timer, food eaten, blob eaten and, ship size)
	private void renderTimer(){
		long end = System.currentTimeMillis();
		double timer = (end-start)/1000;  // set our timer
		Font score = Font.font("Comic Sans MS", FontWeight.BOLD, 15);  // Set font style, type, and size
		this.gc.setFont(score);
		this.gc.setFill(Color.FLORALWHITE);	 // Set font color of text
		double x = this.myShip.getX() - 370 + (this.myShip.width/2);  // Use these x and y coordinates so that our game status will follow our ship
		double y = this.myShip.getY() - 350 + (this.myShip.width/2);

		// These conditions will prevent the game status to pass through our border
		if(x < 0)
		{
			x = x-(x-20);
		}

		if(y < 0)
		{
			y = y-(y-50);
		}


		while(x > 1658){
			x = x - 20;
		}

		this.gc.fillText("Time: " + timer, x , y); // Writes the text
		this.gc.fillText("Gears Collected: " + this.myShip.getFoodEaten(), x+150, y);
		this.gc.fillText("Aliens Defeated: " + this.myShip.getBlobEaten(), x+400, y);
		this.gc.fillText("Ship size: " + this.myShip.width, x+620, y);
		this.final_time = timer;
	}

	// This method will be responsible for drawing our background
	private void redrawBackgroundImage(){
		ImageView game_bg_image = new ImageView(game_bg);
		game_bg_image.setFitHeight(GameStage.GAME_MAP_HEIGHT);
		game_bg_image.setFitHeight(GameStage.GAME_MAP_HEIGHT);
		this.gc.drawImage(game_bg_image.getImage(), 0, 0);
    }

	// method that will listen and handle the key press events
	private void handleKeyPressEvent() {
		theScene.setOnKeyPressed(new EventHandler<KeyEvent>(){
			public void handle(KeyEvent e){
            	KeyCode code = e.getCode();
                moveMyShip(code);
			}

		});

		theScene.setOnKeyReleased(new EventHandler<KeyEvent>(){
		            public void handle(KeyEvent e){
		            	KeyCode code = e.getCode();
		                stopMyShip(code);
		            }
		        });
    }

	// This method will move the ship depending on the key pressed
	private void moveMyShip(KeyCode ke) {
		double speed = 120/this.myShip.getHeigth();
		if(this.myShip.getSpeedBoost()){  // Our speed will be different if we have a golden fuel (speed boost)
			double temp_speed = 120/this.myShip.getTempHeight();
			if(ke==KeyCode.W) this.myShip.setDY(-1*temp_speed);

			if(ke==KeyCode.A) this.myShip.setDX(-1*temp_speed);

			if(ke==KeyCode.S) this.myShip.setDY(temp_speed);

			if(ke==KeyCode.D) this.myShip.setDX(temp_speed);
			borderBlob();  // Call the border method to prevent blobs getting out the map
		}else{  // Our normal speed (without speed boost)
			if(ke==KeyCode.W) this.myShip.setDY(-1*speed);

			if(ke==KeyCode.A) this.myShip.setDX(-1*speed);

			if(ke==KeyCode.S) this.myShip.setDY(speed);

			if(ke==KeyCode.D) this.myShip.setDX(speed);
			borderBlob();  // Call the border method
		}
   }

	// This method will move all of our blobs
	private void moveAllBlobs(){
		for(int i = 0; i < this.blobs.size(); i++){
			Blobs ourBlob = this.blobs.get(i);
			if(ourBlob.isAlive()){  // check blob if it is alive, if yes then make it move
				ourBlob.move(this);
			}else{  // if blob dies
				this.blobs.remove(ourBlob);  // remove the blob
				// Uncomment this if you want to have the respawn option of the aliens
//				Random r = new Random();
//				int x = r.nextInt(GameStage.GAME_MAP_WIDTH-50);
//				int y = r.nextInt(GameStage.GAME_MAP_HEIGHT-50);
//				double randomEnemy = Math.random()*4;
//				randomEnemy+=1;
//				int shipEnemy = (int) randomEnemy;
//				this.blobs.add(new EnemyBlob("Alien",x,y,shipEnemy));  // respawn the removed blob
			}
		}
	}

	// This method will be the border of our game to prevent the blobs getting out the map
	void borderBlob(){
		for(Blobs e:this.blobs){
			int left = 0;
			int right = (int) (GameStage.GAME_MAP_WIDTH - e.width);
			int bottom = (int) (GameStage.GAME_MAP_HEIGHT - e.height);
			int top = 0;

			if(e.getX()<=left){  // this condition will prevent the blob to pass through the left border
				e.setX(left+10);
			}
			if(e.getX()>=right){  // this condition will prevent the blob to pass through the right border
				e.setX((int) (right-10));
			}
			if(e.getY()<=top){  // this condition will prevent the blob to pass through the top border
				e.setY(top+10);
			}
			if(e.getY()>=bottom){  // this condition will prevent the blob to pass through the bottom boder
				e.setY(bottom-10);
			}
		}
	}


	// method that will stop the ship's movement; set the ship's DX and DY to 0
	private void stopMyShip(KeyCode ke){
		this.myShip.setDX(0);
		this.myShip.setDY(0);
	}

	// This method is responsible for our camera (panning movement on the map) [x-axis]
	 void cameraX(){
		double camXLoc = this.myShip.x-400;
		this.theScene.getCamera().setTranslateX(this.myShip.dx+camXLoc+(this.myShip.height-(this.myShip.height/2))); // position the camera in our ship (x-axis)
		// take note the you must adjust the camera if the ship get larger so use (this.myShip.height-(this.myShip.height/2)) in order to automatically adjust the camera when our ship eats a gear
	}

	// This method is responsible for our camera [y-axis]
	 void cameraY(){
		double camYLoc = this.myShip.y-400;
		this.theScene.getCamera().setTranslateY(this.myShip.dy+camYLoc+(this.myShip.height-(this.myShip.height/2)));
	}


	// This method will spawn the gears by adding it to our collectibles
	private void spawnGears(){
		Random r = new Random();
		for(int i = 0; i<GameTimer.MAX_GEARS;i++){
			int x = r.nextInt(GameStage.GAME_MAP_WIDTH-50);
			int y = r.nextInt(GameStage.GAME_MAP_HEIGHT-50);  // use random for random location
			this.collectibles.add(new Gear(x,y));
		}
	}

	// This method is responsible for drawing our collectibles (gears, golden fuel, and tool kit) in our game
	private void renderCollectibles(){
		for(Item f : this.collectibles){
				f.render(this.gc);
		}
	}

	// This method is responsible for adding enemies (Aliens) in our game
	private void spawnEnemy(){
		Random r = new Random();
		for(int i = 0; i<GameTimer.MAX_ENEMIES;i++){
			int x = r.nextInt(GameStage.GAME_MAP_WIDTH-50);
			int y = r.nextInt(GameStage.GAME_MAP_HEIGHT-50);
			double randomEnemy = Math.random()*4;  // Select a random type of alien
			randomEnemy+=1;
			int shipEnemy = (int) randomEnemy;
			this.blobs.add(new EnemyBlob("Alien",x,y,shipEnemy));  // pass the location (x and y) and the type of alien (shipEnemy) in our parameter
		}

	}

	// This method is responsible for drawing our blobs
	private void renderBlobs(){
		for(Blobs b : this.blobs){  // for each blob in blobs arraylist we must render it (draw it)
			b.render(this.gc);
		}
	}

	// This method is responsible for adding golden fuel power up to our collectibles
	private void spawnFuel(){
		Random r = new Random();
		for(int i = 0; i<GameTimer.MAX_FUEL;i++){
			int x = r.nextInt(GameStage.GAME_MAP_WIDTH-50);  // use random for random location
			int y = r.nextInt(GameStage.GAME_MAP_HEIGHT-50);
			this.collectibles.add(new GoldenFuel(x,y));
		}

	}

	// This method is responsible for adding toolkit power up to our collectibles
	private void spawnToolKit(){
		Random r = new Random();
		for(int i = 0; i<GameTimer.MAX_TOOLKIT;i++){
			int x = r.nextInt(GameStage.GAME_MAP_WIDTH-50);  // use random for random location
			int y = r.nextInt(GameStage.GAME_MAP_HEIGHT-50);
			this.collectibles.add(new ToolKit(x,y));
		}

	}

	// This method is responsible for checking if there is a collisions between the blobs
	private void blobCollisions(Blobs b){
		for(int i = 0; i < this.blobs.size();i++){
			Blobs bumped = this.blobs.get(i);
			b.checkCollisionBlobs(bumped);
		}
	}

	// This method is responsible for the respawn of our collectibles
	private void moveCollectibles(){
		Random r = new Random();
		for(int i = 0; i < this.collectibles.size() ; i++){
			Item c = this.collectibles.get(i);
			if(c.isVisible()){  // check if visible
				for(Blobs blob : blobs){
					c.checkCollision(blob);  // check if there is collision between the blob and collectibles
				}
			}else if(!c.isVisible() && c instanceof Gear){  // for gear that is not visible
				collectibles.remove(i);  // remove if not visible
				int x = r.nextInt(GameStage.GAME_MAP_WIDTH-50);
				int y = r.nextInt(GameStage.GAME_MAP_HEIGHT-50);
				this.collectibles.add(new Gear(x,y));  // reallocate the gear
			}else if(!c.isVisible() && c instanceof GoldenFuel){  // for golden fuel that is not visible
				collectibles.remove(i);
				int x = r.nextInt(GameStage.GAME_MAP_WIDTH-50);
				int y = r.nextInt(GameStage.GAME_MAP_HEIGHT-50);
				PauseTransition appear  = new PauseTransition(Duration.seconds(10)); // 10 seconds interval
				appear.play();

				appear.setOnFinished(event ->{
					this.collectibles.add(new GoldenFuel(x,y));  // reallocate
				});
			}else{  // for tool kit
				collectibles.remove(i);
				int x = r.nextInt(GameStage.GAME_MAP_WIDTH-50);
				int y = r.nextInt(GameStage.GAME_MAP_HEIGHT-50);
				PauseTransition appear  = new PauseTransition(Duration.seconds(10)); // 10 seconds interval
				appear.play();

				appear.setOnFinished(event ->{
					this.collectibles.add(new ToolKit(x,y));  //reallocate
				});
			}
		}
	}
}
