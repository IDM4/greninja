( function() {
    "use strict";

    var Frogger;

    Frogger = function( oApp ){

         var game = this,
             ctx,
             i,
             j,
             dangerZone,
             safe,
             iObjective,
             aObjective = new Array,
             aCars = new Array,
             aLogs = new Array,
             lifes,
             gamePhase = 1;

         this.app = oApp;
         ctx = this.app.context;

        this.FRbackground = {
            "sizeX": this.app.width,
            "sizeY": this.app.height / 10,
            "posY": this.app.height / 10,
            

            "draw":function() {
                //final lane
                ctx.fillStyle = "green";
                ctx.fillRect( 0, 0, this.sizeX, this.sizeY );

                //water
                ctx.fillStyle = "blue";
                ctx.fillRect( 0, this.posY, this.sizeX, this.sizeY * 3 );

                 //road
                for ( i = 5 ; i < 9 ; i++) {
                        ctx.strokeStyle = "white";
                        ctx.strokeRect( 0, this.posY * i, this.sizeX, this.sizeY );
                        ctx.fillStyle = "grey";
                        ctx.fillRect( 0, this.posY * i, this.sizeX, this.sizeY );
                    }

                //second lane
                ctx.fillStyle = "green";
                ctx.fillRect( 0, this.posY * 4, this.sizeX, this.sizeY );

                 //first lane
                ctx.fillStyle = "green";
                ctx.fillRect( 0, this.posY * 9, this.sizeX, this.sizeY );           

               
            } //dessiner le décor
            
        };

        this.Frog = { //Frog's conditions
            "sizeX": 30,
            "sizeY": 30,
            "posX": this.app.width / 2,
            "posY": this.app.height - this.app.height / 20,
            "verticalSpeed" : this.app.height / 10,
            "horizontalSpeed": 20,

            "collide":function( rect ) { // collide with a car
                if ( this.posY === rect.posY && this.posX - this.sizeX / 2 < rect.posX + rect.sizeX / 2 && this.posX + this.sizeX / 2 > rect.posX - rect.sizeX / 2 ) {
                        return true;
                    }
                    
                
                    else {
                        return false;
                    }
            },
            "board":function( rect ) { // board a log
                if ( this.posY === rect.posY && this.posX < rect.posX + rect.sizeX / 2 && this.posX > rect.posX - rect.sizeX / 2 ) {
                        return true;
                        safe = true;
                        this.posX += rect.speed;
                    }
                    
                
                    else {
                        return false;
                    }
            },
            "enter":function( rect ) { // enter objectives
                if ( this.posY === rect.posY && this.posX + this.sizeX / 2 < rect.posX + rect.sizeX / 2 && this.posX - this.sizeX / 2 > rect.posX - rect.sizeX / 2 ) {
                        safe = true;
                        return true;
                    }
                    
                
                    else {
                        return false;
                    }
            },
            "draw":function() {
                
                ctx.fillStyle = "lightblue";
                ctx.fillRect( this.posX - this.sizeX / 2, this.posY - this.sizeY / 2, this.sizeX, this.sizeY );
            },
            "update":function( oEvent ) {
                if ( oEvent ) {
                    if( oEvent.type === "keyup" ) { // moving with keyboard
                        if ( !game.ended && gamePhase !== 0 ){
                            if ( oEvent.keyCode === 37 ) { //left
                                this.posX -= this.horizontalSpeed;
                            }

                            else if ( oEvent.keyCode === 38 ) { //up
                                this.posY -= this.verticalSpeed;
                            }
                            else if ( oEvent.keyCode === 39 ) { //right
                                this.posX += this.horizontalSpeed;
                                
                            }
                            else if ( oEvent.keyCode === 40 ) { //down
                                this.posY += this.verticalSpeed;
                            }
                            else {
                                return;
                            }
                        }
                        else if ( !game.ended && gamePhase === 0 && oEvent.keyCode === 32 ) {
                            gamePhase = 1;
                        }
                        else if ( game.ended && oEvent.keyCode === 32 ) {
                            game.init();
                        }
                     }
                    else {
                        return;
                    }
                }
                // prevent frog to get out of the map
                ( this.posX < this.sizeX / 2 ) && ( this.posX = this.sizeX / 2 );
                ( this.posX > oApp.width - this.sizeX / 2 ) && ( this.posX = oApp.width - this.sizeX / 2 );
                ( this.posY < this.sizeY / 2 ) && ( this.posY = oApp.height / 20 );
                ( this.posY > oApp.height - this.sizeY / 2 ) && ( this.posY = oApp.height - oApp.height / 20 );

                if ( this.posY < oApp.height * 4 / 10 ){ //check if frog is passed the river
                    dangerZone = true;
                    // console.log( dangerZone);
                }
                if ( !game.ended ) {
                    this.draw();
                }
                
            }

        };

        this.objectives = { //victory objectives 
            "sizeX": this.app.width / 10,
            "sizeY": this.app.height / 20,
            "posY" : this.app.height / 20,
            "posX" : 0,
            "ecart": this.app.width / 10,
            "number":5,
            "draw":function() {
                ctx.fillStyle = "white";
                ctx.fillRect( this.posX - this.sizeX / 2, this.posY, this.sizeX, this.sizeY );
                
                
            },
            "table":function(){ // first table before game
                for ( i = 0; i < this.number; i++ ) {
                    aObjective[ i ] = true;
                    this.posX = this.ecart / 2 + this.sizeX / 2 +  i * ( this.ecart + this.sizeX );
                    this.draw();
                    
                };

            },
            "update":function() {
                iObjective = 0;
                for ( i = 0; i < this.number; i++ ) {
                    this.posX = this.ecart / 2 + this.sizeX / 2 +  i * ( this.ecart + this.sizeX );
                    if ( aObjective[ i ] ){
                        this.draw();
                        iObjective++;
                        if ( game.Frog.enter( this ) ) { // objective vanishes if it is reached
                            aObjective[ i ] = false;
                            game.position();
                        }
                    }   
                };
                if ( iObjective === 0 ) {
                    game.victoire();
                }

            }

        };
        this.cars = { // obstacles on the road
            "sizeX": this.app.width / 8,
            "sizeY": this.app.height / 15,
            "posY" : 0,
            "posX" : 0,
            "ecart": this.app.width / 4,
            "speed" : 0,
            "number":3, // cars in a lane
            "roads": 4, //current number of lanes in the road
            "draw":function() {
                ctx.fillStyle = "darkred";
                ctx.fillRect( this.posX - this.sizeX / 2, this.posY + this.sizeY / 4, this.sizeX, this.sizeY );
                
                
            },
            "table":function(){ // first table before game
                for ( i = 0; i < this.roads; i++ ) {
                    for ( j = 0; j < this.number; j++ )
                    {
                        aCars[ i ] = new Array;
                        this.posY = oApp.height - ( i + 2 ) * oApp.height / 10;
                        this.posX = this.ecart / 2 + this.sizeX / 2 +  j * ( this.ecart + this.sizeX );
                        this.draw();
                    }
                    
                };

            },
            "update":function(){ 
                for ( i = 0; i < this.roads; i++ ) {
                    for ( j = 0; j < this.number; j++ )
                    {
                        this.posY = oApp.height - ( i + 2 ) * oApp.height / 10;
                        this.posX = this.ecart / 2 + this.sizeX / 2 +  j * ( this.ecart + this.sizeX );
                        switch ( i ) {
                            case 0:
                                this.speed = 8;
                                break;
                            case 1:
                                this.speed = 16;
                                break;
                            case 2:
                                this.speed = -16;
                                break;
                            case 3:
                                this.speed = -8;
                                break; 


                        }

                        this.posX += this.speed; 
                        this.draw();
                        if ( game.Frog.collide( this) ){
                            game.Life();
                        }
                    }
                    
                }   
            }        
        };

        this.logs = { // obstacles on the road
            "sizeX": this.app.width / 8,
            "sizeY": this.app.height / 15,
            "posY" : 0,
            "posX" : 0,
            "ecart": this.app.width / 4,
            "speed" : 0,
            "number":3, // logs in a lane
            "river": 3, //current number of lanes in the river
            "draw":function() {
                ctx.fillStyle = "brown";
                ctx.fillRect( this.posX - this.sizeX / 2, this.posY + this.sizeY / 4, this.sizeX, this.sizeY );
                
                
            },
            "table":function(){ // first table before game
                for ( i = 0; i < this.river; i++ ) {
                    for ( j = 0; j < this.number; j++ )
                    {
                        aCars[ i ] = new Array;
                        this.posY = oApp.height / 4 - i * oApp.height / 10;
                        this.posX = this.ecart / 2 + this.sizeX / 2 +  j * ( this.ecart + this.sizeX );
                        this.draw();
                    }
                    
                };

            },
            "update":function(){ 
                for ( i = 0; i < this.river; i++ ) {
                    for ( j = 0; j < this.number; j++ )
                    {
                        this.posY = oApp.height / 4 - i * oApp.height / 10;
                        this.posX = this.ecart / 2 + this.sizeX / 2 +  j * ( this.ecart + this.sizeX );
                        switch ( i ) {
                            case 0:
                                this.speed = -8;
                                break;
                            case 1:
                                this.speed = 16;
                                break;
                            case 2:
                                this.speed = -8;
                                break;

                        }
                        
                        this.posX += this.speed; 
                        this.draw();
                    }
                    
                }   
            }        
        };
        this.position = function() {
            game.Frog.posX = oApp.width / 2;
            game.Frog.posY  = this.app.height - this.app.height / 20;
            safe = false;
            dangerZone = false;
        }
        this.Life = function() {
            if ( lifes === 0 ) {
                game.over();
            }
            else {
                lifes--
            }
        }
        this.start = function() {
            ctx.textAlign = "center";
            ctx.font = "25px Helvetica";
            ctx.fillStyle = "white";
            ctx.fillText( "Bienvenue dans Frogger", this.app.width / 2, this.app.height / 4 );
            ctx.fillText( "Appuyez sur Espace", this.app.width / 2, this.app.height / 2.25 );
            ctx.fillText( " pour commencer", this.app.width / 2, this.app.height / 2 );
            ctx.fillText( "Utilisez les flèches directionnelles", this.app.width / 2, this.app.height / 1.5 );
            ctx.fillText( "pour vous déplacer", this.app.width / 2, this.app.height / 1.35 );
        }
        this.victoire = function() {
            this.ended = true;
            window.cancelAnimationFrame( this.animationRequestID );
            ctx.clearRect( 0, 0, this.app.width, this.app.height );
            ctx.textAlign = "left";
            ctx.fillStyle = "white";
            ctx.font = "20px Helvetica";
            ctx.fillText( "Vies : " + lifes, 10 , this.app.height - 20 );
            ctx.textAlign = "center";
            ctx.font = "25px Helvetica";
            ctx.fillText( "Bravo ! Vous avez gagné !", this.app.width / 2, this.app.height / 2.5 );
            ctx.fillText( "Appuyez sur Espace", this.app.width / 2, this.app.height / 2 );
            ctx.fillText( " pour recommencer", this.app.width / 2, this.app.height / 1.75 );
        };
        this.over = function() {
            this.ended = true;
            window.cancelAnimationFrame( this.animationRequestID );
            ctx.clearRect( 0, 0, this.app.width, this.app.height );
            ctx.textAlign = "left";
            ctx.fillStyle = "white";
            ctx.font = "20px Helvetica";
            ctx.fillText( "Vies : " + lifes, 10 , this.app.height - 20 );
            ctx.textAlign = "center";
            ctx.font = "25px Helvetica";
            ctx.fillText( "Dommage ! Vous avez perdu !", this.app.width / 2, this.app.height / 3.2 );
            ctx.fillText( "Appuyez sur Espace", this.app.width / 2, this.app.height / 1.75 );
            ctx.fillText( " pour recommencer", this.app.width / 2, this.app.height / 1.6 );
            };

        this.animate = function() {

           
            this.animationRequestID = window.requestAnimationFrame( this.animate.bind( this ) );
            
            //clear rect
            ctx.clearRect( 0, 0, this.app.width, this.app.height );
            if( gamePhase === 0 ) { //check phase
                this.start();
            }
            if( gamePhase !== 0 && !this.ended ) {
            //draw background
            this.FRbackground.draw();
            //lifes counter
            ctx.textAlign = "left";
                ctx.fillStyle = "white";
                ctx.font = "20px Helvetica";
                ctx.fillText( "Vies : " + lifes, 10 , this.app.height - 20 );
            //draw frog
            this.Frog.update();
            //draw objectives
            this.objectives.update();
            //
            this.cars.update();
            //
            this.logs.update();
           }
        };

        this.init = function() {
             if ( !this.eventsSetted ) {
                    window.addEventListener( "keyup", this.Frog.update.bind( this.Frog ) )  

                this.eventsSetted = true;
            }

            this.ended = false;
            gamePhase = 0;
            lifes = 3;
            dangerZone = false;
            safe = false;
            this.position();
            this.objectives.table();
            this.cars.table();
            this.animate();
            
        }
        this.init();

    }

    window.Frogger = Frogger;
})();