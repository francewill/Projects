package App;

import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.control.Button;
import javafx.stage.Stage;
import javafx.scene.image.ImageView;
import javafx.scene.image.Image;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.scene.layout.StackPane;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.event.EventHandler;
import javafx.event.ActionEvent;


public class GameStage {
	static final int WINDOW_HEIGHT = 800;
	static final int WINDOW_WIDTH = 800;

	static final int GAME_MAP_HEIGHT = 2400;
	static final int GAME_MAP_WIDTH = 2400;

	private Scene mainmenu_scene;
	private Stage stage;
	private Group root;
	private Canvas canvas;
	private GraphicsContext gc;
	private Scene gameScene;

	//the class constructor
	public GameStage() {
		this.root = new Group();
		this.canvas = new Canvas( GameStage.GAME_MAP_WIDTH, GameStage.GAME_MAP_HEIGHT); //creates the canvas for the game
		this.root.getChildren().add(this.canvas);
		this.gameScene = new Scene( root , GameStage.WINDOW_WIDTH,GameStage.WINDOW_HEIGHT, Color.BLACK); //creates the scene for the game
	}

	//method to add the stage elements
	void setStage(Stage stage) {
		this.stage = stage;
		this.stage.setTitle("Space Compact"); //sets the title of the stage to Space Compact
		this.stage.getIcons().add(new Image("images/star.jpg")); //adds an icon to the stage

		initMainMenu(); //initializes the mainmenu

		stage.setScene(this.mainmenu_scene); //sets the scene to the main menu scene
		stage.setResizable(false); //ensures that the window size does not change
		stage.show();
	}

	//initializes the mainmenu
	private void initMainMenu() {
		StackPane root = new StackPane(); //creates a stackpane
        root.getChildren().addAll(this.createBG(),this.createVBox()); //adds the bg and the vbox to the stackpane (children)
        this.mainmenu_scene = new Scene(root,GameStage.WINDOW_WIDTH,GameStage.WINDOW_HEIGHT); //creates the mainmenu scene
	}

	//Creates the background for the mainmenu scene
	private ImageView createBG() {
        Image bg = new Image("images/space.gif");	// We cannot directly add an Image in the Scene
        ImageView bg_image = new ImageView(bg);	// An ImageView can be used as leaf node in the Scene
        //sets the size of the ImageView
        bg_image.setFitHeight(GameStage.WINDOW_HEIGHT);
        bg_image.setFitWidth(GameStage.WINDOW_WIDTH);


        return bg_image;
    }

	//creates the vbox for the mainmenu scene
	 private VBox createVBox() {
		 //creates the vbox and sets its properties
		 VBox vbox = new VBox();
		 vbox.setAlignment(Pos.TOP_CENTER);
		 vbox.setPadding(new Insets(30));
		 vbox.setSpacing(10);
	     vbox.setMaxSize(GameStage.WINDOW_WIDTH, GameStage.WINDOW_HEIGHT );

	     //creates the imageview for the title
	     Image title = new Image("images/Title.png");
	     ImageView title_image = new ImageView(title);

	     //creates the imageview for the start button
	     Image start = new Image("images/Start.png");
	     ImageView start_image = new ImageView(start);

	     //creates the imageview for the instructions button
	     Image instructions = new Image("images/instructions.png");
	     ImageView instructions_image = new ImageView(instructions);

	     //creates the imageview for the about us button
	     Image about_us = new Image("images/about_us.png");
	     ImageView about_us_image = new ImageView(about_us);

	     //creates the imageview for the hovered start button
	     Image start_hover = new Image("images/Start (2).png");
	     ImageView start_hoverimage = new ImageView(start_hover);

	     //creates the imageview for the hovered instructions button
	     Image inst_hover = new Image("images/inst (2).png");
	     ImageView inst_hoverimage = new ImageView(inst_hover);

	     //creates the imageview for the hovered about us button
	     Image about_us_hover = new Image("images/about_us (2).png");
	     ImageView about_us_hoverimage = new ImageView(about_us_hover);

	     //creates the buttons
	     Button b1 = new Button();
	     Button b2 = new Button();
	     Button b3 = new Button();

	     //sets the graphics of the buttons to their respective images
	     b1.setGraphic(start_image);
	     b2.setGraphic(instructions_image);
	     b3.setGraphic(about_us_image);

	     //set the background of the buttons to null
	     b1.setBackground(null);
	     b2.setBackground(null);
	     b3.setBackground(null);

	     //add the title and the buttons to the vbox
	     vbox.getChildren().addAll(title_image,b1,b2,b3);

	     //set the margin of the buttons
	     VBox.setMargin(b1, new Insets(30));
	     VBox.setMargin(b2, new Insets(30));
	     VBox.setMargin(b3, new Insets(30));

	     //when mouse is hovered over the button
	     b1.setOnMouseEntered(event -> {
	    	    b1.setStyle("-fx-cursor: hand;"); //sets the cursor to a pointing hand cursor
	    	    b1.setGraphic(start_hoverimage);  //changes the graphic of the start button to the hovered image
	    	});
	     //when the mouse is not hovered over the button
	     b1.setOnMouseExited(event -> {
	    	 	b1.setGraphic(start_image); //changes the graphic of the start button to its original image
	    	});
	     //when mouse is hovered over the button
	     b2.setOnMouseEntered(event -> {
	    	    b2.setStyle("-fx-cursor: hand;"); //sets the cursor to a pointing hand cursor
	    	    b2.setGraphic(inst_hoverimage); //changes the graphic of the instructions button to the hovered image
	    	});
	     //when the mouse is not hovered over the button
	     b2.setOnMouseExited(event -> {
	    	 	b2.setGraphic(instructions_image); //changes the graphic of the instructions button to its original image
	    	});
	     //when mouse is hovered over the button
	     b3.setOnMouseEntered(event -> {
	    	 	b3.setStyle("-fx-cursor: hand;");  //sets the cursor to a pointing hand cursor
	    	    b3.setGraphic(about_us_hoverimage); //changes the graphic of the about us button to the hovered image
	    	});
	   //when the mouse is not hovered over the button
	     b3.setOnMouseExited(event -> {
	    	 	b3.setGraphic(about_us_image); //changes the graphic of the about us  button to its original image
	    	});
	     //when the start button is clicked
	     b1.setOnAction(new EventHandler<ActionEvent>() {
	            @Override
	            public void handle(ActionEvent e) {
	            	setGame(stage); //we start the game
	            }
	        });
	     //when the instructions button is clicked
	     b2.setOnAction(new EventHandler<ActionEvent>() {
	            @Override
	            public void handle(ActionEvent e) {
	            	//creates the image view for the instructions
	            	Image insti = new Image("images/inst.png");
	        	    ImageView inst_image = new ImageView(insti);

	        	    //creates the image view for the exit button
	        	    Image close = new Image("images/close.png");
	       	     	ImageView close_image = new ImageView(close);

	       	     	//creates the image view for the hovered exit button
	       	     	Image close_hover = new Image("images/close_hover.png");
	       	     	ImageView close_hover_image = new ImageView(close_hover);


	        	    Button exit = new Button(); //creates the exit button
	        	    exit.setGraphic(close_image); //sets the graphic of the button
	        	    exit.setBackground(null); //sets the bg of the button to null


	        	    vbox.getChildren().removeAll(title_image,b1,b2,b3); //removes the title and the buttons from the vbox
	        	    vbox.getChildren().addAll(inst_image,exit); //adds the instructions image and the exit button to the vbox

	        	    //when mouse is hovered over the exit button
	        	    exit.setOnMouseEntered(event -> {
		        	    exit.setStyle("-fx-cursor: hand;"); //sets the cursor to a pointing hand cursor
		        	    exit.setGraphic(close_hover_image); //changes the graphic of the exit button to the hovered image
	    	    	});
	        	   //when mouse is not hovered over the exit button
	        	    exit.setOnMouseExited(event -> {
	        	    	exit.setGraphic(close_image);  //changes the graphic of the exit button to its original image
	    	    	});

	        	    //when the exit button is clicked
	        	    exit.setOnAction(new EventHandler<ActionEvent>() {
	     	            @Override
	     	            public void handle(ActionEvent e) {
	     	            	vbox.getChildren().removeAll(inst_image,exit); //removes the instructions image and the exit button from the vbox
	     	            	vbox.getChildren().addAll(title_image,b1,b2,b3); //add the title image and the buttons(start, instructions, about us) to the vbox
	     	            }
	     	        });
	            }
	        });

	     //when the about us button is clicked
	     b3.setOnAction(new EventHandler<ActionEvent>() {
	            @Override
	            public void handle(ActionEvent e) {
	            	//creates the about us imageview
	            	Image about1 = new Image("images/about1.png");
	            	ImageView about1_image = new ImageView(about1);

	            	//create the imageview for the next button
	            	Image next = new Image("images/next.png");
	       	     	ImageView next_image = new ImageView(next);

	       	     	//creates the imageview for the hovered next button
	       	     	Image next_hover = new Image("images/next_hover.png");
	       	     	ImageView next_hover_image = new ImageView(next_hover);

	            	Button next_button = new Button(); //creates the next button
	            	next_button.setGraphic(next_image); //sets the graphic of the next button
	            	next_button.setBackground(null); //sets the bg of the button to null

	            	//when the next button is hovered
	            	next_button.setOnMouseEntered(event -> {
	            		next_button.setStyle("-fx-cursor: hand;"); //changes the cursor to a pointing hand cursor
	            		next_button.setGraphic(next_hover_image); //changes the graphic of the button to hovered image
		    	    	});
	            	//when the next button is not hovered
	            	next_button.setOnMouseExited(event -> {
	            		next_button.setGraphic(next_image); //changes the graphic of the button to its original image
		    	    	});

	            	vbox.getChildren().removeAll(title_image,b1,b2,b3); //the title image and the buttons are removed from the vbox
	            	vbox.getChildren().addAll(about1_image,next_button); //the about us image and the next button is added to the vbox

	            	//when the next button is pressed
	            	next_button.setOnAction(new EventHandler<ActionEvent>() {
	     	            @Override
	     	            public void handle(ActionEvent e) {
	     	            	//creates the imageview for the close button
	     	            	Image close = new Image("images/close.png");
	    	       	     	ImageView close_image = new ImageView(close);
	    	       	     	//creates the imageview for the hovered close button
	    	       	     	Image close_hover = new Image("images/close_hover.png");
	    	       	     	ImageView close_hover_image = new ImageView(close_hover);

		    	       	    Button exit = new Button(); //creates the exit button
		 	        	    exit.setGraphic(close_image); //sets the graphic of the exit button
		 	        	    exit.setBackground(null); //seth the bg of the button to null

		 	        	   //when the exit button is hovered
		 	        	   exit.setOnMouseEntered(event -> {
				        	    exit.setStyle("-fx-cursor: hand;"); //changes the cursor to a pointing hand cursor
				        	    exit.setGraphic(close_hover_image); //changes the graphic of the button to the hovered image
			    	    	});
		 	        	   //when the exit button is not hovered
			        	    exit.setOnMouseExited(event -> {
			        	    	exit.setGraphic(close_image); //changes the graphic of the button to its original image
			    	    	});

			        	    //creates the references imageview
			        	    Image references = new Image("images/references_2.png");
	    	       	     	ImageView references_image = new ImageView(references);

	     	            	vbox.getChildren().removeAll(about1_image,next_button); //removes the about us image and the next button from the vbox
	     	            	vbox.getChildren().addAll(references_image,exit); //add the references image and the exit button to the vbox

	     	            	//when the exit button is clicked
			        	    exit.setOnAction(new EventHandler<ActionEvent>() {
			     	            @Override
			     	            public void handle(ActionEvent e) {
			     	            	vbox.getChildren().removeAll(references_image,exit); //removes the references image and the exit button
			     	            	vbox.getChildren().addAll(title_image,b1,b2,b3); //add the title and the buttons to the vbox
			     	            }
			     	        });


	     	            }
	     	        });
	            }
	        });




	     return vbox; //returns the vbox
	 }


	 void setGame(Stage stage) {
		 	this.stage.setScene(this.gameScene); //sets the scene to the game scence

		 	this.gc = this.canvas.getGraphicsContext2D();	// we will pass this gc to be able to draw on this Game's canvas

	        GameTimer gameTimer = new GameTimer(gc, gameScene, this); //creates the gametimer
	        gameTimer.start();			// this internally calls the handle() method of our GameTimer
		}

	 Stage getMainMenu(){
		 this.stage.setScene(this.mainmenu_scene); //sets the scene of the stage to the main menu scene
		 return this.stage; //returns the stage
	 }


}

