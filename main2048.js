var board = new Array();
var score = 0;
var hasConflicted=new Array();//解决游戏中重复叠加的效果  记录每一个小格子中是否已经发生过了游戏叠加的效果
//实现手指触摸的效果
var startx=0;
var starty=0;
var endx=0;
var endy=0;



$(document).ready(function(e){
	prepareForMobile();
    newgame();
});


function  prepareForMobile() {
	if(documentWidth>500){
		grilContentWidth=500;
		cellSidelength=100;
		cellSpace=20;
	}


	$('#grid-content').css({
		'width':grilContentWidth-2*cellSpace,
		'height':grilContentWidth-2*cellSpace,
		'padding':cellSpace,
		'border-radius':0.02*grilContentWidth
	})

	$('.grid-cell').css({
		'width':cellSidelength,
		'height':cellSidelength,
		'border-radius':0.02*cellSidelength
	})


}

function newgame(){
    //初始化棋盘格
    init();
    //在随机两个各自声称的数字
    generateOneNumber();
    generateOneNumber();

    score=0;
}

function init(){
    for(var i = 0;i<4;i++){
        for(var j = 0;j<4;j++){
            var gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css("top",getPosTop(i,j));
            gridCell.css("left",getPosLeft(i,j));
        }
    }
    
    for(var i = 0; i<4;i++){
        board[i] = new Array();
        hasConflicted[i]=new Array();
        for(var j = 0;j<4;j++){
            board[i][j] = 0;
        	hasConflicted[i][j]=false;//每一个格子都没有被叠加过
        }
    }
    
    updateBoardView();//通知前端对board二位数组进行设定。
}

function updateBoardView(){
    $(".number-cell").remove();
    for(var i = 0;i<4;i++){
        for ( var j = 0; j < 4; j++) {
            $("#grid-content").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $('#number-cell-'+i+'-'+j);
            if(board[i][j] == 0){

                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j)+cellSidelength/2);
                theNumberCell.css('left',getPosLeft(i,j)+cellSidelength/2);
            }else{
                theNumberCell.css('width',cellSidelength);
                theNumberCell.css('hegiht',cellSidelength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                //NumberCell覆盖
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));//返回背景色
                theNumberCell.css('color',getNumberColor(board[i][j]));//返回前景色
                theNumberCell.text(board[i][j]);
            }


            hasConflicted[i][j]=false;
        }

        $('.number-cell').css('line-height',cellSidelength+'px');
        $('.number-cell').css('font-size',0.6*cellSidelength+'px');
    }
} 

function generateOneNumber(){
    if (nospace(board)) 
        return false;
    
    //随机一个位置
    var randx = parseInt(Math.floor(Math.random()*4));
    var randy = parseInt(Math.floor(Math.random()*4));
    var times=0;
    while(times<50){
        if (board[randx][randy] == 0) 
            break;
        randx = parseInt(Math.floor(Math.random()*4));
        randy = parseInt(Math.floor(Math.random()*4));
   	times++;
    }
    if(times==50){
    	for(var i=0;i<4;i++)
    		for(var j=0;j<4;j++)
    			if(board[i][j]==0){
    				randx=i;
    				randy=j;
    			}
    }
    //随机一个数字
    var randNumber = Math.random()<0.5 ?2 : 4;
    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx,randy,randNumber);
    return true;
}

//事件响应循环
$(document).keydown(function(event){
    switch (event.keyCode) {
    case 37://left
        if(moveLeft()){
            setTimeout("generateOneNumber()",210);
           // generateOneNumber();//每次新增一个数字就可能出现游戏结束
            setTimeout("isgameover()",300);//300毫秒
        }
        break;
    case 38://up
        if(moveUp()){
            setTimeout("generateOneNumber()", 210);//每次新增一个数字就可能出现游戏结束
            setTimeout("isgameover()", 300);
        }
        break;
    case 39://right
        if(moveRight()){
            setTimeout("generateOneNumber()", 210);//每次新增一个数字就可能出现游戏结束
            setTimeout("isgameover()", 300);
        }
        break;
    case 40://down
        if(moveDown()){
             setTimeout("generateOneNumber()", 210);//每次新增一个数字就可能出现游戏结束
            setTimeout("isgameover()", 300);
        }
        break;

    }
});

//手指滑动时间
document.addEventListener('touchstart', function(event){
	startx=event.touches[0].pageX;
	starty=event.touches[0].pageY;
})
document.addEventListener('touchend', function(event){
	endx=event.changedTouches[0].pageX;
	endy=event.changedTouches[0].pageY;


	var deltax=endx-starty;
	var deltay=endy-starty;
    //判断是否在x轴滑动   反之则在y轴滑动
	if(Math.abs(deltax)>+Math.abs(deltay)){
		if(deltax>0){
			//moveright
			if(moveRight()){
            generateOneNumber();
            isgameover();
        }
		}else{
		//left
		if(moveLeft()){
            generateOneNumber();
            isgameover();
        }
		}
	}else{
		if(deltay>0){
			//down
			if(moveDown()){
             generateOneNumber();
            isgameover();
        }
		}else{
			//up
			if(moveUp()){
           generateOneNumber();
            isgameover();
        }
		}
	}
})


function isgameover(){
    if(nospace(board)&&nomove(board))
        gameover();
}

function gameover(){
    alert("gameover");
}

function moveLeft(){//更多地细节信息
    //判断格子是否能够向左移动
    if( !canMoveLeft(board))
        return false;
    
    //真正的moveLeft函数//标准
    for(var i = 0;i<4;i++)
        for(var j = 1;j<4;j++){//第一列的数字不可能向左移动
            if(board[i][j] !=0){
                //(i,j)左侧的元素
                for(var k = 0;k<j;k++){
                    //落脚位置的是否为空 && 中间没有障碍物
                    if(board[i][k] == 0 && noBlockHorizontal(i , k, j, board)){
                        //move
                        showMoveAnimation(i, j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    }
                    //落脚位置的数字和本来的数字相等 && 中间没有障碍物
                    else if(board[i][k] == board[i][j] && noBlockHorizontal(i , k, j, board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i, j,i,k);
                        //add
                       board[i][k] += board[i][j];
                       board[i][j] = 0;
                        score+=board[i][k]
                        updateScore(score);
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200);
    return true;
}
function moveUp(){//更多地细节信息
    //判断格子是否能够向上移动
    if( !canMoveUp(board))
        return false;

    for(var j=0;j<4;j++)
        for(var i=1;i<4;i++){
            if(board[i][j] !=0){
                //(i,j)上侧的元素
                for(var k = 0;k<i;k++){
                    //落脚位置的是否为空 && 中间没有障碍物
                    if(board[k][j] == 0 && noBlockVertical(j , i, k, board)){
                        //move
                        showMoveAnimation(i, j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //落脚位置的数字和本来的数字相等 && 中间没有障碍物
                    else if(board[k][j] == board[i][j] && noBlockVertical(j ,i, k, board) && !hasConflicted[i][k]){
                       //move
                       showMoveAnimation(i, j,k,j);
                       //add
                       board[k][j] += board[i][j];
                       board[i][j] = 0;
                        score+= board[k][j]
                        updateScore(score);
                        continue;
                    }
                }
            }
        }
   

    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight(){
 if( !canMoveRight(board))
        return false;
    
    for(var i = 0;i<4;i++)
        for(var j = 2;j>=0;j--){
            if(board[i][j] !=0){
               //(i,j)左侧的元素
               for(var k = 3;k>j;k--){
                   //落脚位置的是否为空 && 中间没有障碍物
                   if(board[i][k] == 0 && noBlockHorizontal(i , k, j, board)){
                       //move
                        showMoveAnimation(i, j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //落脚位置的数字和本来的数字相等 && 中间没有障碍物
                    else if(board[i][k] == board[i][j] && noBlockHorizontal(i , k, j, board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i, j,i,k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score+=board[i][k];
                        updateScore(score);
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200);
    return true;
}


function moveDown(){
	if(!canMoveDown(board))
		return false;

	for(var j=0;j<4;j++)
        for(var i=2;i>=0;i--){
            if(board[i][j] !=0){
                //(i,j)上侧的元素
                for(var k=3;k>i;k--){
                    //落脚位置的是否为空 && 中间没有障碍物
                    if(board[k][j] == 0 && noBlockVertical(j , i, k, board)){
                        //move
                        showMoveAnimation(i, j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //落脚位置的数字和本来的数字相等 && 中间没有障碍物
                    else if(board[k][j] == board[i][j] && noBlockVertical(j , i, k, board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i, j,k,j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score+=board[k][j];
                        updateScore(score);
                        continue;
                    }
                }
           }
       }

	setTimeout("updateBoardView()",200);
    return true;
}
