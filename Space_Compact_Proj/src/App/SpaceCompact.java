package App;

import javafx.application.Application;
import javafx.stage.Stage;


public class SpaceCompact extends Application {

	public static void main(String[] args) {
		launch(args);
	}

	public void start(Stage stage){
		GameStage game = new GameStage(); //creates the GameStage
	    game.setStage(stage); //sets the stage
	}



}
