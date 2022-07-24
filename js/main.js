//--------------------------------------------------------------------------------------------
//Global object
    const g_state = {
        canvas: null, 
        context: null,
        disks:null,
        counter : 0,
        isRunning: true,
        canvas_interval_id: 0,
        timer_interval_id:0,
        txt_time: null
    }
//--------------------------------------------------------------------------------------------
//Disk object will save the disk on the canvas
const Disk = function(x,y,radius, color, speed)
{
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color; 
    this.speed = speed;
    this.distance_y = 1* this.speed
    this.distance_x = 1* this.speed
    this.enabled = true;
}
//--------------------------------------------------------------------------------------------
//draw a disk on the canvas

Disk.prototype.draw = function(context){
    context.fillStyle = this.color;
    context.beginPath();
    context.lineWidth = 2;
    context.arc(this.x ,this.y ,this.radius, 0 ,Math.PI*2 ,false);
    context.fill();
    context.stroke();
    context.closePath();
}
//--------------------------------------------------------------------------------------------
//move a disk on the canvas
Disk.prototype.update_position = function(context){

    this.draw(context);
    this.wall_collision_detection();
    this.x += this.distance_x;
    this.y += this.distance_y;
}
//--------------------------------------------------------------------------------------------
//detect wall collision 
Disk.prototype.wall_collision_detection = function(){

    if((this.x + this.radius) > g_state.canvas.width){
        this.distance_x = -this.distance_x;
    }
    if((this.x - this.radius) < 0){
        this.distance_x = -this.distance_x;
    }
    if((this.y + this.radius) > g_state.canvas.height){
        this.distance_y = -this.distance_y;
    }
    if((this.y - this.radius) < 0){
        this.distance_y = -this.distance_y;
    }
}
//--------------------------------------------------------------------------------------------
// detect if 2 disks colide
function disks_collision_detection(disk1_index){
    for(let i=0; i<g_state.disks.length ; i++){
        if(i != disk1_index  && g_state.disks[i] != null) {
            if(getDistance(g_state.disks[disk1_index], g_state.disks[i])<= g_state.disks[disk1_index].radius + g_state.disks[i].radius){
                g_state.disks[disk1_index].distance_x = -g_state.disks[disk1_index].distance_x;
                g_state.disks[disk1_index].distance_y = -g_state.disks[disk1_index].distance_y;
                g_state.disks[i] = null;
                g_state.context.globalCompositeOperation = 'source-over';
                g_state.context.clearRect(0,0,g_state.canvas.width, g_state.canvas.height); 
            }
        }
    }  
}
//--------------------------------------------------------------------------------------------
//calc the distance of 2 disks
function getDistance(disk1, disk2){
    let reasult = Math.sqrt(Math.pow(disk2.x - disk1.x, 2) + Math.pow(disk2.y - disk1.y, 2));
    return reasult;
}
//--------------------------------------------------------------------------------------------
//Will run when the user press the start button
function handle_start()
{
    g_state.isRunning = true;
    if(g_state.txt_time.value >= 1){
        g_state.counter = g_state.txt_time.value;
        if(g_state.canvas_interval_id == 0)
        {
            g_state.canvas_interval_id = window.setInterval(handle_tick, 35);
            g_state.timer_interval_id = window.setInterval(decrease_timer, 1000);
        }
    }
}
//--------------------------------------------------------------------------------------------
//Will run on any tick of the canvas interval
function handle_tick()
{
    let num_of_nulls = 0;
    for(let i=0; i<4; i++){
        if(g_state.disks[i] == null){
            num_of_nulls++;
        }
    }
    if(g_state.isRunning && num_of_nulls < 3) {
        g_state.context.clearRect(0,0,g_state.canvas.width, g_state.canvas.height); 
        for(let i = 0; i < g_state.disks.length; ++i){
            if(g_state.disks[i] != null){
                disks_collision_detection(i);
                g_state.disks[i].update_position(g_state.context); 
            }          
        }
    }
    else if (num_of_nulls == 3){
        end_game();
    }
    else{
        g_state.isRunning = false;
    }
}
//--------------------------------------------------------------------------------------------
//Will run when the user press the pause button

function handle_pause()
{
    g_state.isRunning = false;
}
//--------------------------------------------------------------------------------------------
//Will run when the user press the reset button

function handle_reset()
{
    g_state.counter = 0;
    g_state.txt_time.value = g_state.counter;
    g_state.isRunning = false;
    init_position();
    clearInterval(g_state.canvas_interval_id);
    clearInterval(g_state.timer_interval_id);
    g_state.canvas_interval_id = 0;
    g_state.timer_interval_id = 0;
}
//--------------------------------------------------------------------------------------------
//Init the position of the disks on the canvas
function init_position(){
    g_state.counter = 0;
    g_state.txt_time.value = g_state.counter;
    g_state.context.clearRect(0,0,g_state.canvas.width, g_state.canvas.height); 
    g_state.disks= [];
    disk1 = new Disk(get_random_number(2*g_state.radius,g_state.canvas.width-2*g_state.radius), g_state.radius, g_state.radius, "red" , get_random_number(10, 20));
    g_state.disks.push(disk1);
    disk2 = new Disk(g_state.radius, get_random_number(2*g_state.radius,g_state.canvas.height - 2*g_state.radius), g_state.radius, "blue" , get_random_number(10, 20));
    g_state.disks.push(disk2);
    disk3 = new Disk(get_random_number(2*g_state.radius,g_state.canvas.width-2*g_state.radius), g_state.canvas.height-g_state.radius, g_state.radius, "green" , get_random_number(10, 20));
    g_state.disks.push(disk3);
    disk4 = new Disk(g_state.canvas.width-g_state.radius, get_random_number(2*g_state.radius,g_state.canvas.height - 2*g_state.radius), g_state.radius, "purple" , get_random_number(10, 20));
    g_state.disks.push(disk4);
    draw_disks();
}
//--------------------------------------------------------------------------------------------
//draw all the disks on the canvas
function draw_disks(){
    for(i=0; i<4 ; i++){
        if(g_state.disks[i] != null){
            g_state.disks[i].draw(g_state.context);
        }
    }
}
//--------------------------------------------------------------------------------------------
//get random number between min and max
function get_random_number(min, max){
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
//--------------------------------------------------------------------------------------------
//will run at the end of the game
function end_game(){
    let message;
    modal_txt = document.getElementById("modal_txt");
    if(g_state.counter == 0){
        message = "Time is over!! <br>The remaining disks are: ";
        for(let i=0; i<g_state.disks.length ; i++){
            if(g_state.disks[i] != null){
                message += g_state.disks[i].color;
                message += " ";
            }
        }
    }
    else{
        message = "The winner is: ";
        for(let i=0; i<g_state.disks.length ; i++){
            if(g_state.disks[i] != null){
                message += g_state.disks[i].color;
                message += " disk!! <br>"
            }
        }
        message += "The remaining time is: " + g_state.counter + " seconds";   
    }
    modal_txt.innerHTML = message;
    g_state.modal.style.display = "block";
    clearInterval(g_state.canvas_interval_id);
    clearInterval(g_state.timer_interval_id);
    g_state.canvas_interval_id = 0;
    g_state.timer_interval_id = 0;
}
//--------------------------------------------------------------------------------------------
//Will run on any tick of timer interval
function decrease_timer(){
    if(g_state.counter != 0 && g_state.isRunning){
        g_state.counter--;
        g_state.txt_time.value = g_state.counter;
    }
    if(g_state.counter == 0){
        end_game();
    }
}
//--------------------------------------------------------------------------------------------
// When the user clicks on <span> (x), close the modal
 function on_click_x_button() {
    g_state.modal.style.display = "none";
    init_position();
 }
  //--------------------------------------------------------------------------------------------
  // When the user clicks anywhere outside of the modal, close it
function close_modal(event) {
    if (event.target == g_state.modal) {
        g_state.modal.style.display = "none";
        init_position();
    }
}
//--------------------------------------------------------------------------------------------
//main function
function main(){
    g_state.canvas = document.getElementById("rectangle");
    g_state.canvas.width = window.innerWidth;
    g_state.canvas.height = window.innerHeight;
    g_state.radius = 30;
    g_state.context = g_state.canvas.getContext("2d");
    g_state.disks = []
    g_state.txt_time = document.getElementById("txt_time");
    g_state.modal = document.getElementById("myModal"); 
    let x_button = document.getElementsByClassName("close")[0];
    x_button.onclick = on_click_x_button;
    const start_button = document.getElementById("start_button");
    start_button.addEventListener('click', handle_start);
    const pause_button = document.getElementById("pause_button");
    pause_button.addEventListener('click', handle_pause);
    const reset_button = document.getElementById("reset_button");
    reset_button.addEventListener('click', handle_reset);
    window.onclick = close_modal;
    init_position();
}
//--------------------------------------------------------------------------------------------

main()