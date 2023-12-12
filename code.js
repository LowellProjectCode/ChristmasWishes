//The HTML and CSS webpage code was not written by me. It was written by Akinola Abdulakeem. Source: https://akinolaakeem.com/chess-board-game-using-html-and-css/
//The App Lab API and some CSS from App Lab was also used for obvious reasons.
//pawn only promotes to queen since I don't want to make a gui for that
//Also, I realized that the lineofpin stuff is kind of redundant since the check revert covers that stuff, but I'm still leaving it in
//Right now I still need to add en croissant, stalemate and checkmate, and promotions
var pieces = [];
//positions of the pieces
var positions = [];
//whose turn it is, obv it starts with white
var turn = "w";
//the internal text for the pieces
var piecesint = [];
//draw states
var whitedraw = false;
var blackdraw = false;
//drawrule is for determining if a draw rule is in place like repetition (not insta draw)
var drawrule = false;
//board history
var boardhistory = [];
//legalmoves not counting check
var legalmovesw = [];
var legalmovesb = [];

getInfo("w");


function getInfo() {
  console.log("running bruh info");
  pieces = [];
  positions = [];
  piecesint = [];
  legalmovesw = [];
  legalmovesb = [];
  for (var i = 1; i <= 5; i++) {
    for (var k = 1; k <= 4; k++) {
      //yandere dev code
      if (getText(i.toString()+k.toString())=="&#9823"||getText(i.toString()+k.toString())=="♟") {
        appendItem(pieces, "pb");
        appendItem(positions, i.toString()+k.toString());
        appendItem(piecesint, "♟");
      } else if (getText(i.toString()+k.toString())=="&#9820"||getText(i.toString()+k.toString())=="♜") {
        appendItem(pieces, "rb");
        appendItem(positions, i.toString()+k.toString());
        appendItem(piecesint, "♜");
      } else if (getText(i.toString()+k.toString())=="&#9819"||getText(i.toString()+k.toString())=="♛") {
        appendItem(pieces, "qb");
        appendItem(positions, i.toString()+k.toString());
        appendItem(piecesint, "♛");
      } else if (getText(i.toString()+k.toString())=="&#9818"||getText(i.toString()+k.toString())=="♚") {
        appendItem(pieces, "kb");
        appendItem(positions, i.toString()+k.toString());
        appendItem(piecesint, "♚");
        bkpos = i.toString()+k.toString();
      } else if (getText(i.toString()+k.toString())=="&#9817"||getText(i.toString()+k.toString())=="♙") {
        appendItem(pieces, "pw");
        appendItem(positions, i.toString()+k.toString());
        appendItem(piecesint, "♙");
      } else if (getText(i.toString()+k.toString())=="&#9814"||getText(i.toString()+k.toString())=="♖") {
        appendItem(pieces, "rw");
        appendItem(positions, i.toString()+k.toString());
        appendItem(piecesint, "♖");
      } else if (getText(i.toString()+k.toString())=="&#9813"||getText(i.toString()+k.toString())=="♕") {
        appendItem(pieces, "qw");
        appendItem(positions, i.toString()+k.toString());
        appendItem(piecesint, "♕");
      } else if (getText(i.toString()+k.toString())=="&#9812"||getText(i.toString()+k.toString())=="♔") {
        appendItem(pieces, "kw");
        appendItem(positions, i.toString()+k.toString());
        appendItem(piecesint, "♔");
        wkpos = i.toString()+k.toString();
      }
    }
  }
  //check for repetition (add legal moves once finished)
  var repeats = 0;
  appendItem(boardhistory, turn+pieces.join("")+positions.join(""));
  for (var j = 0; j < boardhistory.length; j++) {
    repeats=0;
    for (var l = 0; l < boardhistory.length; l++) {
      if (boardhistory[j]==boardhistory[l]) {
        repeats++;
      }
    }
    if (repeats>=3) {
      drawrule=true;
    }
  }
  //insert the check for legal moves here, it will take much more time to complete
//since chess is pretty complex when it comes to checking for legal moves
//you have to account for pins, legal squares for the king, and making sure that
//a check is properly escaped (obv a piece also has to have the moveset to go to that square)


whitevision1 = visioncheck1white();
blackvision1 = visioncheck1black();


var whitepinarray = whitepin1();

var blackpinarray = blackpin1();

//line of pin nested arrays
var linesofpinw = [];
var linesofpinb = [];

//pinnersq, pinnedsq
for (var j3 = 0; j3<whitepinarray.length; j3++) {
  appendItem(linesofpinw, lineofpin(whitepinarray[j3][1].substring(0,2), whitepinarray[j3][0].substring(0,2), bkpos));
}


for (var j2 = 0; j2<blackpinarray.length; j2++) {
  appendItem(linesofpinb, lineofpin(blackpinarray[j2][1].substring(0,2), blackpinarray[j2][0].substring(0,2), wkpos));
}


//legal moves for white
//like whitevision1 but for legal moves

for (var z = 0; z < whitevision1.length; z++) {
  var pinned = false;
  for (var y = 0; y < linesofpinb.length; y++) {
    //the case that the piece is pinned
  if (whitevision1[z][0]==linesofpinb[y][0]) {
    var temparray = [];
    var piecemoves = movecalcpiece(whitevision1[z][0].substring(2,4),whitevision1[z][0].substring(0,2));
    var pinmoves = [];
    for (var w = 1; w < linesofpinb[y].length; w++) {
      appendItem(pinmoves, linesofpinb[y][w]);
    }
    //only append to temparray the ones that are in both
    for (var x = 0; x < piecemoves.length; x++) {
      for (var v = 0; v < pinmoves.length; v++) {
        if (piecemoves[x]==pinmoves[v]) {
         appendItem(temparray, piecemoves[x]);
        }
      }
    }
    appendItem(legalmovesw, [whitevision1[z][0]].concat(temparray));
  }
  }
  //not pinned
  if (pinned==false) {
  appendItem(legalmovesw, [whitevision1[z][0]].concat(movecalcpiece(whitevision1[z][0].substring(2,4),whitevision1[z][0].substring(0,2))));
  }
}

//legal moves for black
for (var z2 = 0; z2 < blackvision1.length; z2++) {
  var pinned2 = false;
  for (var y2 = 0; y2 < linesofpinw.length; y2++) {
    //the case that the piece is pinned
  if (blackvision1[z2][0]==linesofpinw[y2][0]) {
    pinned2 = true;
    var temparray2 = [];
    var piecemoves2 = movecalcpiece(blackvision1[z2][0].substring(2,4),blackvision1[z2][0].substring(0,2));
    var pinmoves2 = [];
    for (var w2 = 1; w2 < linesofpinw[y2].length; w2++) {
      appendItem(pinmoves2, linesofpinw[y2][w2]);
    }
    //only append to temparray the ones that are in both
    for (var x2 = 0; x2 < piecemoves2.length; x2++) {
      for (var v2 = 0; v2 < pinmoves2.length; v2++) {
        if (piecemoves2[x2]==pinmoves2[v2]) {
         appendItem(temparray2, piecemoves2[x2]);
        }
      }
    }
    appendItem(legalmovesb, [blackvision1[z2][0]].concat(temparray2));
  }
  }
  //not pinned
  if (pinned2==false) {
  appendItem(legalmovesb, [blackvision1[z2][0]].concat(movecalcpiece(blackvision1[z2][0].substring(2,4),blackvision1[z2][0].substring(0,2))));
  }
}
console.log("legal moves w,b");
console.log(legalmovesw);
console.log(legalmovesb);
}

//vision is not the same as possible moves, see the pawn (it is what squares are attacked/defended, not what squares you can move to)
//for just one piece, I'd need to concat arrays for black and white vision (and possibly remove dupes, and also account for pins on certain pieces)
function vision1(p, sq) {
  var visible=[];
  if (p.substring(0,1)=="p") {
    if (p.substring(1,2)=="b") {
      if ((Number(sq.substring(0,1))+1)>0&&(Number(sq.substring(0,1))+1)<6&&(Number(sq.substring(1,2))+1)>0&&(Number(sq.substring(1,2))+1)<5) {
      appendItem(visible, (Number(sq.substring(0,1))+1).toString()+(Number(sq.substring(1,2))+1).toString());
    }
    if ((Number(sq.substring(0,1))+1)>0&&(Number(sq.substring(0,1))+1)<6&&(Number(sq.substring(1,2))-1)>0&&(Number(sq.substring(1,2))-1)<5) {
      appendItem(visible, (Number(sq.substring(0,1))+1).toString()+(Number(sq.substring(1,2))-1).toString());
    }
    }
    if (p.substring(1,2)=="w") {
      if ((Number(sq.substring(0,1))-1)>0&&(Number(sq.substring(0,1))-1)<6&&(Number(sq.substring(1,2))+1)>0&&(Number(sq.substring(1,2))+1)<5) {
      appendItem(visible, (Number(sq.substring(0,1))-1).toString()+(Number(sq.substring(1,2))+1).toString());
    }
    if ((Number(sq.substring(0,1))-1)>0&&(Number(sq.substring(0,1))-1)<6&&(Number(sq.substring(1,2))-1)>0&&(Number(sq.substring(1,2))-1)<5) {
      appendItem(visible, (Number(sq.substring(0,1))-1).toString()+(Number(sq.substring(1,2))-1).toString());
    }
    }
    }
  if (p.substring(0,1)=="r") {
    //cannot jump over pieces
    //changing rank
    var i=(Number(sq.substring(0,1))+1).toString();
      while (getText(i+sq.substring(1,2))==""&&Number(i)<6) {
      appendItem(visible, i+sq.substring(1,2));
      i=(Number(i)+1).toString();
      }
    //a piece cannot go off the board and it cannot have vision of itself
    if (Number(i)<6&&Number(i)!=Number(sq.substring(0,1))) {
    appendItem(visible, i+sq.substring(1,2));
    }
    i=(Number(sq.substring(0,1))-1).toString();
      while (getText(i+sq.substring(1,2))==""&&Number(i)>0) {
      appendItem(visible, i+sq.substring(1,2));
      i=(Number(i)-1).toString();
      }
    //a piece cannot go off the board and it cannot have vision of itself
    if (Number(i)>0&&Number(i)!=Number(sq.substring(0,1))) {
    appendItem(visible, i+sq.substring(1,2));
    }
    //changing file
    var k=(Number(sq.substring(1,2))+1).toString();
    while (getText(sq.substring(0,1)+k)==""&&Number(k)<5) {
      appendItem(visible, sq.substring(0,1)+k);
      k=(Number(k)+1).toString();
    }
    if (Number(k)<5&&Number(k)!=Number(sq.substring(1,2))) {
    appendItem(visible, sq.substring(0,1)+k);
    }
    k=(Number(sq.substring(1,2))-1).toString();
    while (getText(sq.substring(0,1)+k)==""&&Number(k)>0) {
      appendItem(visible, sq.substring(0,1)+k);
      k=(Number(k)-1).toString();
    }
    if (Number(k)>0&&Number(k)!=Number(sq.substring(1,2))) {
    appendItem(visible, sq.substring(0,1)+k);
    }
  }
  if (p.substring(0,1)=="q") {
    //copied from rook
    //cannot jump over pieces
    //changing rank
    var a=(Number(sq.substring(0,1))+1).toString();
      while (getText(a+sq.substring(1,2))==""&&Number(a)<6) {
      appendItem(visible, a+sq.substring(1,2));
      a=(Number(a)+1).toString();
      }
    //a piece cannot go off the board and it cannot have vision of itself
    if (Number(a)<6&&Number(a)!=Number(sq.substring(0,1))) {
    appendItem(visible, a+sq.substring(1,2));
    }
    a=(Number(sq.substring(0,1))-1).toString();
      while (getText(a+sq.substring(1,2))==""&&Number(a)>0) {
      appendItem(visible, a+sq.substring(1,2));
      a=(Number(a)-1).toString();
      }
    //a piece cannot go off the board and it cannot have vision of itself
    if (Number(a)>0&&Number(a)!=Number(sq.substring(0,1))) {
    appendItem(visible, a+sq.substring(1,2));
    }
    //changing file
    var b=(Number(sq.substring(1,2))+1).toString();
    while (getText(sq.substring(0,1)+b)==""&&Number(b)<5) {
      appendItem(visible, sq.substring(0,1)+b);
      b=(Number(b)+1).toString();
    }
    if (Number(b)<5&&Number(b)!=Number(sq.substring(1,2))) {
    appendItem(visible, sq.substring(0,1)+b);
    }
    b=(Number(sq.substring(1,2))-1).toString();
    while (getText(sq.substring(0,1)+b)==""&&Number(b)>0) {
      appendItem(visible, sq.substring(0,1)+b);
      b=(Number(b)-1).toString();
    }
    if (Number(b)>0&&Number(b)!=Number(sq.substring(1,2))) {
    appendItem(visible, sq.substring(0,1)+b);
    }
  //decided to just make a function for bishop's movement
  visible=visible.concat(bshp(sq));
  }
  
  if (p.substring(0,1)=="k") {
    //the king is special, since it can't walk into the vision of an enemy piece, I'll get back to it later
    if ((Number(sq.substring(0,1))+1)<6&&Number(sq.substring(1,2))>0) {
    appendItem(visible, (Number(sq.substring(0,1))+1).toString()+sq.substring(1,2));
  }
    if ((Number(sq.substring(0,1))+1)<6&&(Number(sq.substring(1,2))+1)<5) {
    appendItem(visible, (Number(sq.substring(0,1))+1).toString()+(Number(sq.substring(1,2))+1).toString());
  }
    if ((Number(sq.substring(0,1)))<6&&(Number(sq.substring(1,2))+1)<5) {
    appendItem(visible, (Number(sq.substring(0,1))).toString()+(Number(sq.substring(1,2))+1).toString());
  }
    if ((Number(sq.substring(0,1))-1)>0&&(Number(sq.substring(1,2))+1)<5) {
    appendItem(visible, (Number(sq.substring(0,1))-1).toString()+(Number(sq.substring(1,2))+1).toString());
  }
    if ((Number(sq.substring(0,1))-1)>0&&(Number(sq.substring(1,2)))<5) {
    appendItem(visible, (Number(sq.substring(0,1))-1).toString()+(Number(sq.substring(1,2))).toString());
  }
    if ((Number(sq.substring(0,1))-1)>0&&(Number(sq.substring(1,2))-1)>0) {
    appendItem(visible, (Number(sq.substring(0,1))-1).toString()+(Number(sq.substring(1,2))-1).toString());
  }
    if ((Number(sq.substring(0,1)))>0&&(Number(sq.substring(1,2))-1)>0) {
    appendItem(visible, (Number(sq.substring(0,1))).toString()+(Number(sq.substring(1,2))-1).toString());
  }
    if ((Number(sq.substring(0,1))+1)<6&&(Number(sq.substring(1,2))-1)>0) {
    appendItem(visible, (Number(sq.substring(0,1))+1).toString()+(Number(sq.substring(1,2))-1).toString());
  }
}
  return visible;
}

function bshp(sq) {
  var temparray=[];
  //+45 degree diagonal, sub rank, add file
  var r1=(Number(sq.substring(0,1))-1).toString();
  var f1=(Number(sq.substring(1,2))+1).toString();
  while (getText(r1+f1)==""&&Number(r1)>0&&Number(f1)<5) {
      appendItem(temparray, r1+f1);
      r1=(Number(r1)-1).toString();
      f1=(Number(f1)+1).toString();
      }
      if (typeof(getText(r1+f1))=="string") {
        appendItem(temparray, r1+f1);
      }
  //135 degree diagonal, sub rank, sub file
  r1=(Number(sq.substring(0,1))-1).toString();
  f1=(Number(sq.substring(1,2))-1).toString();
  while (getText(r1+f1)==""&&Number(r1)>0&&Number(f1)>0) {
      appendItem(temparray, r1+f1);
      r1=(Number(r1)-1).toString();
      f1=(Number(f1)-1).toString();
      }
      if (typeof(getText(r1+f1))=="string") {
        appendItem(temparray, r1+f1);
      }
  //225 degree diagonal, add rank, sub file
  r1=(Number(sq.substring(0,1))+1).toString();
  f1=(Number(sq.substring(1,2))-1).toString();
  while (getText(r1+f1)==""&&Number(r1)<6&&Number(f1)>0) {
      appendItem(temparray, r1+f1);
      r1=(Number(r1)+1).toString();
      f1=(Number(f1)-1).toString();
      }
      if (typeof(getText(r1+f1))=="string") {
        appendItem(temparray, r1+f1);
      }
  //315 degree diagonal, add rank, add file
  r1=(Number(sq.substring(0,1))+1).toString();
  f1=(Number(sq.substring(1,2))+1).toString();
  while (getText(r1+f1)==""&&Number(r1)<6&&Number(f1)<5) {
      appendItem(temparray, r1+f1);
      r1=(Number(r1)+1).toString();
      f1=(Number(f1)+1).toString();
      }
      if (typeof(getText(r1+f1))=="string") {
        appendItem(temparray, r1+f1);
      }
  return temparray;
}

//the first vision check for white
//the outputted array has multiple arrays nested within
//each nested array contains the piece with said vision as element 0, while the
//rest of the elements are the vision of the piece
function visioncheck1white() {
  var whitevis = [];
  for (var i = 0; i < pieces.length; i++) {
    if (pieces[i].substring(1,2)=="w") {
    appendItem(whitevis,[positions[i]+pieces[i]].concat(vision1(pieces[i],positions[i])));
    }
  }
  return whitevis;
}
//same thing for white
function visioncheck1black() {
  var blackvis = [];
  for (var i = 0; i < pieces.length; i++) {
    if (pieces[i].substring(1,2)=="b") {
    appendItem(blackvis,[positions[i]+pieces[i]].concat(vision1(pieces[i],positions[i])));
    }
  }
  return blackvis;
}

//temporarily, if you capture the king, you win(even though you can't actually capture the king in game)
function capturemate() {
  var tempcount=0;
  var anothertemp=0;
  for (var i = 0; i < pieces.length; i++) {
      if (pieces[i]!="kw") {
        tempcount++;
      }
  }
  if (tempcount==pieces.length) {
    win("Black","capture of the king??");
  }
  for (var k = 0; k < pieces.length; k++) {
      if (pieces[k]!="kb") {
        anothertemp++;
      }
  }
  if (anothertemp==pieces.length) {
    win("White","capture of the king??");
  }
}

//displays an element stating which side won and how they won (using debugger to stop the program)
function win(side, message) {
  setText("winscreen", side + " wins by " + message);
  showElement("winscreen");
  //very legitimate way to stop the program
  thisfunctionnoexist();
}

//displays an element stating the game ended in a draw and how it ended in a draw
function draw(message) {
  setText("winscreen", "Draw by "+message);
  showElement("winscreen");
  hideElement("drawvote");
  thisfunctionnoexist();
}

//onEvents for resignation buttons
onEvent("resignblack", "click", function( ) {
  win("White","resignation");
});
onEvent("resignwhite", "click", function( ) {
  win("Black","resignation");
});
//onEvents for draw buttons
onEvent("drawwhite", "click", function( ) {
  if (drawrule==false) {
  showElement("drawvote");
  }
  whitedraw=true;
  if (blackdraw) {
    draw("mutual agreement");
  }
  //the only draw rule i'm puttng is repetition since I doubt many people
  //care about a 50 move rule in minichess
  if (drawrule) {
    draw("repetition");
  }
});
onEvent("drawblack", "click", function( ) {
  if (drawrule==false) {
  showElement("drawvote");
  }
  blackdraw=true;
  if (whitedraw) {
    draw("mutual agreement");
  }
  //the only draw rule i'm puttng is repitition since I doubt many people
  //care about a 50 move rule in minichess
  if (drawrule) {
    draw("repitition");
  }
});
//lines 363-1337 are mostly copy and pasted lines of code just for each individual square that
//you could click on. This is what happens when you try to use JS independent from html



























//for moving pieces
//first select a piece to move
//I can't find a way to get the id of a clicked element without going
//into the html itself, so you'll have to deal with 20 onEvents
var selectedpos;
var selectedp;
var selectedpint;
var selectedStat = false;
//onEvents for clicking on the squares to go through the movement sequence
onEvent("11", "click", function( ) {
  var ied = "11";
  //truthy jargon to make sure that the selection cancellation works properly
  var truthything;
  if (truthything!=false) {
    truthything=false;
  }
      console.log(ied);
      //if a square is being clicked to move onto (a piece/pawn is already selected)
  if (selectedStat&&selectedpos!=ied) {
    movee(selectedpos, ied, selectedpint);
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
    //change turns
    if (turn=="w") {
      turn="b";
    } else {
      turn="w";
    }
  }
      //traverse the positions list to see if the selected square is a piece/pawn of the correct color
  else { for (var i = 0; i < positions.length; i++) {
    if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)==turn) {
      console.log("This is a pawn/piece");
      //if it is a piece/pawn, select it for movement
      selectedStat = true;
      selectedpos = ied;
      selectedp = pieces[i];
      selectedpint = piecesint[i];
      truthything=true;
      setProperty(ied, "text-color", "yellow");
      
    } else if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)!=turn) {
      console.log("its"+turn+"'s turn");
    }
  }}
  if (selectedpos==ied&&truthything==false){
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
  }
});

onEvent("12", "click", function( ) {
  var ied = "12";
  //truthy jargon to make sure that the selection cancellation works properly
  var truthything;
  if (truthything!=false) {
    truthything=false;
  }
      console.log(ied);
      //if a square is being clicked to move onto (a piece/pawn is already selected)
  if (selectedStat&&selectedpos!=ied) {
    movee(selectedpos, ied, selectedpint);
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
    //change turns
    if (turn=="w") {
      turn="b";
    } else {
      turn="w";
    }
  }
      //traverse the positions list to see if the selected square is a piece/pawn of the correct color
  else { for (var i = 0; i < positions.length; i++) {
    if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)==turn) {
      console.log("This is a pawn/piece");
      //if it is a piece/pawn, select it for movement
      selectedStat = true;
      selectedpos = ied;
      selectedp = pieces[i];
      selectedpint = piecesint[i];
      truthything=true;
      setProperty(ied, "text-color", "yellow");
      
    } else if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)!=turn) {
      console.log("its"+turn+"'s turn");
    }
  }}
  if (selectedpos==ied&&truthything==false){
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
  }
});

onEvent("13", "click", function( ) {
  var ied = "13";
  //truthy jargon to make sure that the selection cancellation works properly
  var truthything;
  if (truthything!=false) {
    truthything=false;
  }
      console.log(ied);
      //if a square is being clicked to move onto (a piece/pawn is already selected)
  if (selectedStat&&selectedpos!=ied) {
    movee(selectedpos, ied, selectedpint);
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
    //change turns
    if (turn=="w") {
      turn="b";
    } else {
      turn="w";
    }
  }
      //traverse the positions list to see if the selected square is a piece/pawn of the correct color
  else { for (var i = 0; i < positions.length; i++) {
    if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)==turn) {
      console.log("This is a pawn/piece");
      //if it is a piece/pawn, select it for movement
      selectedStat = true;
      selectedpos = ied;
      selectedp = pieces[i];
      selectedpint = piecesint[i];
      truthything=true;
      setProperty(ied, "text-color", "yellow");
      
    } else if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)!=turn) {
      console.log("its"+turn+"'s turn");
    }
  }}
  if (selectedpos==ied&&truthything==false){
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
  }
});
onEvent("14", "click", function( ) {
  var ied = "14";
  //truthy jargon to make sure that the selection cancellation works properly
  var truthything;
  if (truthything!=false) {
    truthything=false;
  }
      console.log(ied);
      //if a square is being clicked to move onto (a piece/pawn is already selected)
  if (selectedStat&&selectedpos!=ied) {
    movee(selectedpos, ied, selectedpint);
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
    //change turns
    if (turn=="w") {
      turn="b";
    } else {
      turn="w";
    }
  }
      //traverse the positions list to see if the selected square is a piece/pawn of the correct color
  else { for (var i = 0; i < positions.length; i++) {
    if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)==turn) {
      console.log("This is a pawn/piece");
      //if it is a piece/pawn, select it for movement
      selectedStat = true;
      selectedpos = ied;
      selectedp = pieces[i];
      selectedpint = piecesint[i];
      truthything=true;
      setProperty(ied, "text-color", "yellow");
      
    } else if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)!=turn) {
      console.log("its"+turn+"'s turn");
    }
  }}
  if (selectedpos==ied&&truthything==false){
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
  }
});


onEvent("21", "click", function( ) {
  var ied = "21";
  //truthy jargon to make sure that the selection cancellation works properly
  var truthything;
  if (truthything!=false) {
    truthything=false;
  }
      console.log(ied);
      //if a square is being clicked to move onto (a piece/pawn is already selected)
  if (selectedStat&&selectedpos!=ied) {
    movee(selectedpos, ied, selectedpint);
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
    //change turns
    if (turn=="w") {
      turn="b";
    } else {
      turn="w";
    }
  }
      //traverse the positions list to see if the selected square is a piece/pawn of the correct color
  else { for (var i = 0; i < positions.length; i++) {
    if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)==turn) {
      console.log("This is a pawn/piece");
      //if it is a piece/pawn, select it for movement
      selectedStat = true;
      selectedpos = ied;
      selectedp = pieces[i];
      selectedpint = piecesint[i];
      truthything=true;
      setProperty(ied, "text-color", "yellow");
      
    } else if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)!=turn) {
      console.log("its"+turn+"'s turn");
    }
  }}
  if (selectedpos==ied&&truthything==false){
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
  }
});


onEvent("22", "click", function( ) {
  var ied = "22";
  //truthy jargon to make sure that the selection cancellation works properly
  var truthything;
  if (truthything!=false) {
    truthything=false;
  }
      console.log(ied);
      //if a square is being clicked to move onto (a piece/pawn is already selected)
  if (selectedStat&&selectedpos!=ied) {
    movee(selectedpos, ied, selectedpint);
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
    //change turns
    if (turn=="w") {
      turn="b";
    } else {
      turn="w";
    }
  }
      //traverse the positions list to see if the selected square is a piece/pawn of the correct color
  else { for (var i = 0; i < positions.length; i++) {
    if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)==turn) {
      console.log("This is a pawn/piece");
      //if it is a piece/pawn, select it for movement
      selectedStat = true;
      selectedpos = ied;
      selectedp = pieces[i];
      selectedpint = piecesint[i];
      truthything=true;
      setProperty(ied, "text-color", "yellow");
      
    } else if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)!=turn) {
      console.log("its"+turn+"'s turn");
    }
  }}
  if (selectedpos==ied&&truthything==false){
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
  }
});


onEvent("23", "click", function( ) {
  var ied = "23";
  //truthy jargon to make sure that the selection cancellation works properly
  var truthything;
  if (truthything!=false) {
    truthything=false;
  }
      console.log(ied);
      //if a square is being clicked to move onto (a piece/pawn is already selected)
  if (selectedStat&&selectedpos!=ied) {
    movee(selectedpos, ied, selectedpint);
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
    //change turns
    if (turn=="w") {
      turn="b";
    } else {
      turn="w";
    }
  }
      //traverse the positions list to see if the selected square is a piece/pawn of the correct color
  else { for (var i = 0; i < positions.length; i++) {
    if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)==turn) {
      console.log("This is a pawn/piece");
      //if it is a piece/pawn, select it for movement
      selectedStat = true;
      selectedpos = ied;
      selectedp = pieces[i];
      selectedpint = piecesint[i];
      truthything=true;
      setProperty(ied, "text-color", "yellow");
      
    } else if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)!=turn) {
      console.log("its"+turn+"'s turn");
    }
  }}
  if (selectedpos==ied&&truthything==false){
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
  }
});


onEvent("24", "click", function( ) {
  var ied = "24";
  //truthy jargon to make sure that the selection cancellation works properly
  var truthything;
  if (truthything!=false) {
    truthything=false;
  }
      console.log(ied);
      //if a square is being clicked to move onto (a piece/pawn is already selected)
  if (selectedStat&&selectedpos!=ied) {
    movee(selectedpos, ied, selectedpint);
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
    //change turns
    if (turn=="w") {
      turn="b";
    } else {
      turn="w";
    }
  }
      //traverse the positions list to see if the selected square is a piece/pawn of the correct color
  else { for (var i = 0; i < positions.length; i++) {
    if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)==turn) {
      console.log("This is a pawn/piece");
      //if it is a piece/pawn, select it for movement
      selectedStat = true;
      selectedpos = ied;
      selectedp = pieces[i];
      selectedpint = piecesint[i];
      truthything=true;
      setProperty(ied, "text-color", "yellow");
      
    } else if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)!=turn) {
      console.log("its"+turn+"'s turn");
    }
  }}
  if (selectedpos==ied&&truthything==false){
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
  }
});


onEvent("31", "click", function( ) {
  var ied = "31";
  //truthy jargon to make sure that the selection cancellation works properly
  var truthything;
  if (truthything!=false) {
    truthything=false;
  }
      console.log(ied);
      //if a square is being clicked to move onto (a piece/pawn is already selected)
  if (selectedStat&&selectedpos!=ied) {
    movee(selectedpos, ied, selectedpint);
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
    //change turns
    if (turn=="w") {
      turn="b";
    } else {
      turn="w";
    }
  }
      //traverse the positions list to see if the selected square is a piece/pawn of the correct color
  else { for (var i = 0; i < positions.length; i++) {
    if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)==turn) {
      console.log("This is a pawn/piece");
      //if it is a piece/pawn, select it for movement
      selectedStat = true;
      selectedpos = ied;
      selectedp = pieces[i];
      selectedpint = piecesint[i];
      truthything=true;
      setProperty(ied, "text-color", "yellow");
      
    } else if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)!=turn) {
      console.log("its"+turn+"'s turn");
    }
  }}
  if (selectedpos==ied&&truthything==false){
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
  }
});


onEvent("32", "click", function( ) {
  var ied = "32";
  //truthy jargon to make sure that the selection cancellation works properly
  var truthything;
  if (truthything!=false) {
    truthything=false;
  }
      console.log(ied);
      //if a square is being clicked to move onto (a piece/pawn is already selected)
  if (selectedStat&&selectedpos!=ied) {
    movee(selectedpos, ied, selectedpint);
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
    //change turns
    if (turn=="w") {
      turn="b";
    } else {
      turn="w";
    }
  }
      //traverse the positions list to see if the selected square is a piece/pawn of the correct color
  else { for (var i = 0; i < positions.length; i++) {
    if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)==turn) {
      console.log("This is a pawn/piece");
      //if it is a piece/pawn, select it for movement
      selectedStat = true;
      selectedpos = ied;
      selectedp = pieces[i];
      selectedpint = piecesint[i];
      truthything=true;
      setProperty(ied, "text-color", "yellow");
      
    } else if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)!=turn) {
      console.log("its"+turn+"'s turn");
    }
  }}
  if (selectedpos==ied&&truthything==false){
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
  }
});


onEvent("33", "click", function( ) {
  var ied = "33";
  //truthy jargon to make sure that the selection cancellation works properly
  var truthything;
  if (truthything!=false) {
    truthything=false;
  }
      console.log(ied);
      //if a square is being clicked to move onto (a piece/pawn is already selected)
  if (selectedStat&&selectedpos!=ied) {
    movee(selectedpos, ied, selectedpint);
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
    //change turns
    if (turn=="w") {
      turn="b";
    } else {
      turn="w";
    }
  }
      //traverse the positions list to see if the selected square is a piece/pawn of the correct color
  else { for (var i = 0; i < positions.length; i++) {
    if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)==turn) {
      console.log("This is a pawn/piece");
      //if it is a piece/pawn, select it for movement
      selectedStat = true;
      selectedpos = ied;
      selectedp = pieces[i];
      selectedpint = piecesint[i];
      truthything=true;
      setProperty(ied, "text-color", "yellow");
      
    } else if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)!=turn) {
      console.log("its"+turn+"'s turn");
    }
  }}
  if (selectedpos==ied&&truthything==false){
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
  }
});


onEvent("34", "click", function( ) {
  var ied = "34";
  //truthy jargon to make sure that the selection cancellation works properly
  var truthything;
  if (truthything!=false) {
    truthything=false;
  }
      console.log(ied);
      //if a square is being clicked to move onto (a piece/pawn is already selected)
  if (selectedStat&&selectedpos!=ied) {
    movee(selectedpos, ied, selectedpint);
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
    //change turns
    if (turn=="w") {
      turn="b";
    } else {
      turn="w";
    }
  }
      //traverse the positions list to see if the selected square is a piece/pawn of the correct color
  else { for (var i = 0; i < positions.length; i++) {
    if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)==turn) {
      console.log("This is a pawn/piece");
      //if it is a piece/pawn, select it for movement
      selectedStat = true;
      selectedpos = ied;
      selectedp = pieces[i];
      selectedpint = piecesint[i];
      truthything=true;
      setProperty(ied, "text-color", "yellow");
      
    } else if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)!=turn) {
      console.log("its"+turn+"'s turn");
    }
  }}
  if (selectedpos==ied&&truthything==false){
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
  }
});


onEvent("41", "click", function( ) {
  var ied = "41";
  //truthy jargon to make sure that the selection cancellation works properly
  var truthything;
  if (truthything!=false) {
    truthything=false;
  }
      console.log(ied);
      //if a square is being clicked to move onto (a piece/pawn is already selected)
  if (selectedStat&&selectedpos!=ied) {
    movee(selectedpos, ied, selectedpint);
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
    //change turns
    if (turn=="w") {
      turn="b";
    } else {
      turn="w";
    }
  }
      //traverse the positions list to see if the selected square is a piece/pawn of the correct color
  else { for (var i = 0; i < positions.length; i++) {
    if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)==turn) {
      console.log("This is a pawn/piece");
      //if it is a piece/pawn, select it for movement
      selectedStat = true;
      selectedpos = ied;
      selectedp = pieces[i];
      selectedpint = piecesint[i];
      truthything=true;
      setProperty(ied, "text-color", "yellow");
      
    } else if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)!=turn) {
      console.log("its"+turn+"'s turn");
    }
  }}
  if (selectedpos==ied&&truthything==false){
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
  }
});


onEvent("42", "click", function( ) {
  var ied = "42";
  //truthy jargon to make sure that the selection cancellation works properly
  var truthything;
  if (truthything!=false) {
    truthything=false;
  }
      console.log(ied);
      //if a square is being clicked to move onto (a piece/pawn is already selected)
  if (selectedStat&&selectedpos!=ied) {
    movee(selectedpos, ied, selectedpint);
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
    //change turns
    if (turn=="w") {
      turn="b";
    } else {
      turn="w";
    }
  }
      //traverse the positions list to see if the selected square is a piece/pawn of the correct color
  else { for (var i = 0; i < positions.length; i++) {
    if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)==turn) {
      console.log("This is a pawn/piece");
      //if it is a piece/pawn, select it for movement
      selectedStat = true;
      selectedpos = ied;
      selectedp = pieces[i];
      selectedpint = piecesint[i];
      truthything=true;
      setProperty(ied, "text-color", "yellow");
      
    } else if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)!=turn) {
      console.log("its"+turn+"'s turn");
    }
  }}
  if (selectedpos==ied&&truthything==false){
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
  }
});


onEvent("43", "click", function( ) {
  var ied = "43";
  //truthy jargon to make sure that the selection cancellation works properly
  var truthything;
  if (truthything!=false) {
    truthything=false;
  }
      console.log(ied);
      //if a square is being clicked to move onto (a piece/pawn is already selected)
  if (selectedStat&&selectedpos!=ied) {
    movee(selectedpos, ied, selectedpint);
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
    //change turns
    if (turn=="w") {
      turn="b";
    } else {
      turn="w";
    }
  }
      //traverse the positions list to see if the selected square is a piece/pawn of the correct color
  else { for (var i = 0; i < positions.length; i++) {
    if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)==turn) {
      console.log("This is a pawn/piece");
      //if it is a piece/pawn, select it for movement
      selectedStat = true;
      selectedpos = ied;
      selectedp = pieces[i];
      selectedpint = piecesint[i];
      truthything=true;
      setProperty(ied, "text-color", "yellow");
      
    } else if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)!=turn) {
      console.log("its"+turn+"'s turn");
    }
  }}
  if (selectedpos==ied&&truthything==false){
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
  }
});


onEvent("44", "click", function( ) {
  var ied = "44";
  //truthy jargon to make sure that the selection cancellation works properly
  var truthything;
  if (truthything!=false) {
    truthything=false;
  }
      console.log(ied);
      //if a square is being clicked to move onto (a piece/pawn is already selected)
  if (selectedStat&&selectedpos!=ied) {
    movee(selectedpos, ied, selectedpint);
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
    //change turns
    if (turn=="w") {
      turn="b";
    } else {
      turn="w";
    }
  }
      //traverse the positions list to see if the selected square is a piece/pawn of the correct color
  else { for (var i = 0; i < positions.length; i++) {
    if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)==turn) {
      console.log("This is a pawn/piece");
      //if it is a piece/pawn, select it for movement
      selectedStat = true;
      selectedpos = ied;
      selectedp = pieces[i];
      selectedpint = piecesint[i];
      truthything=true;
      setProperty(ied, "text-color", "yellow");
      
    } else if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)!=turn) {
      console.log("its"+turn+"'s turn");
    }
  }}
  if (selectedpos==ied&&truthything==false){
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
  }
});
onEvent("51", "click", function( ) {
  var ied = "51";
  //truthy jargon to make sure that the selection cancellation works properly
  var truthything;
  if (truthything!=false) {
    truthything=false;
  }
      console.log(ied);
      //if a square is being clicked to move onto (a piece/pawn is already selected)
  if (selectedStat&&selectedpos!=ied) {
    movee(selectedpos, ied, selectedpint);
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
    //change turns
    if (turn=="w") {
      turn="b";
    } else {
      turn="w";
    }
  }
      //traverse the positions list to see if the selected square is a piece/pawn of the correct color
  else { for (var i = 0; i < positions.length; i++) {
    if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)==turn) {
      console.log("This is a pawn/piece");
      //if it is a piece/pawn, select it for movement
      selectedStat = true;
      selectedpos = ied;
      selectedp = pieces[i];
      selectedpint = piecesint[i];
      truthything=true;
      setProperty(ied, "text-color", "yellow");
      
    } else if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)!=turn) {
      console.log("its"+turn+"'s turn");
    }
  }}
  if (selectedpos==ied&&truthything==false){
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
  }
});
onEvent("52", "click", function( ) {
  var ied = "52";
  //truthy jargon to make sure that the selection cancellation works properly
  var truthything;
  if (truthything!=false) {
    truthything=false;
  }
      console.log(ied);
      //if a square is being clicked to move onto (a piece/pawn is already selected)
  if (selectedStat&&selectedpos!=ied) {
    movee(selectedpos, ied, selectedpint);
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
    //change turns
    if (turn=="w") {
      turn="b";
    } else {
      turn="w";
    }
  }
      //traverse the positions list to see if the selected square is a piece/pawn of the correct color
  else { for (var i = 0; i < positions.length; i++) {
    if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)==turn) {
      console.log("This is a pawn/piece");
      //if it is a piece/pawn, select it for movement
      selectedStat = true;
      selectedpos = ied;
      selectedp = pieces[i];
      selectedpint = piecesint[i];
      truthything=true;
      setProperty(ied, "text-color", "yellow");
      
    } else if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)!=turn) {
      console.log("its"+turn+"'s turn");
    }
  }}
  if (selectedpos==ied&&truthything==false){
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
  }
});
onEvent("53", "click", function( ) {
  var ied = "53";
  //truthy jargon to make sure that the selection cancellation works properly
  var truthything;
  if (truthything!=false) {
    truthything=false;
  }
      console.log(ied);
      //if a square is being clicked to move onto (a piece/pawn is already selected)
  if (selectedStat&&selectedpos!=ied) {
    movee(selectedpos, ied, selectedpint);
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
    //change turns
    if (turn=="w") {
      turn="b";
    } else {
      turn="w";
    }
  }
      //traverse the positions list to see if the selected square is a piece/pawn of the correct color
  else { for (var i = 0; i < positions.length; i++) {
    if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)==turn) {
      console.log("This is a pawn/piece");
      //if it is a piece/pawn, select it for movement
      selectedStat = true;
      selectedpos = ied;
      selectedp = pieces[i];
      selectedpint = piecesint[i];
      truthything=true;
      setProperty(ied, "text-color", "yellow");
      
    } else if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)!=turn) {
      console.log("its"+turn+"'s turn");
    }
  }}
  if (selectedpos==ied&&truthything==false){
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
  }
});
onEvent("54", "click", function( ) {
  var ied = "54";
  //truthy jargon to make sure that the selection cancellation works properly
  var truthything;
  if (truthything!=false) {
    truthything=false;
  }
      console.log(ied);
      //if a square is being clicked to move onto (a piece/pawn is already selected)
  if (selectedStat&&selectedpos!=ied) {
    movee(selectedpos, ied, selectedpint);
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
    //change turns
    if (turn=="w") {
      turn="b";
    } else {
      turn="w";
    }
  }
      //traverse the positions list to see if the selected square is a piece/pawn of the correct color
  else { for (var i = 0; i < positions.length; i++) {
    if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)==turn) {
      console.log("This is a pawn/piece");
      //if it is a piece/pawn, select it for movement
      selectedStat = true;
      selectedpos = ied;
      selectedp = pieces[i];
      selectedpint = piecesint[i];
      truthything=true;
      setProperty(ied, "text-color", "yellow");
      
    } else if (ied==positions[i]&&selectedStat==false&&pieces[i].substring(1,2)!=turn) {
      console.log("it's"+turn+"'s turn");
    }
  }}
  if (selectedpos==ied&&truthything==false){
    selectedStat=false;
    selectedpos = null;
    selectedp = null;
    selectedpint = null;
    setProperty(ied, "text-color", "black");
  }
});























//function for moving the selected
var whitevision1 = [];
var blackvision1 = [];
var wkpos;
var bkpos;
whitevision1 = visioncheck1white();
blackvision1 = visioncheck1black();
//all string parameters
function movee(pos1, pos2, p, test) {
  //finding the piece corresponding to pos2 in case a revert is needed
  var p2index;
  var p2;
  for (var o = 0; o < positions.length; o++) {
    if (pos2 == positions[o]) {
      p2index = o;
      break;
    }
  }
  if (typeof(p2index)=="number") {
    p2 = piecesint[p2index];
  } else {
    p2 = "";
  }
  
  //hide the draw vote and reset it
  hideElement("drawvote");
  whitedraw=false;
  blackdraw=false;

//legality test (ignoring checks)
var islegal = false;
//white
if (turn=="w" || (test==true && turn=="b")) {
for (var bruh = 0; bruh < legalmovesw.length; bruh++) {
  if (legalmovesw[bruh][0].substring(0,2)==pos1) {
    for (var bru = 1; bru < legalmovesw[bruh].length; bru++) {
      if (legalmovesw[bruh][bru]==pos2) {
        islegal = true;
      }
    }
  }
}
}

//black
if (turn=="b" || (test==true && turn=="w")) {
for (var bruh2 = 0; bruh2 < legalmovesb.length; bruh2++) {
  if (legalmovesb[bruh2][0].substring(0,2)==pos1) {
    for (var bru2 = 1; bru2 < legalmovesb[bruh2].length; bru2++) {
      if (legalmovesb[bruh2][bru2]==pos2) {
        islegal = true;
      }
    }
  }
}
}

if (islegal) {
  setText(pos1, "");
  setText(pos2, p);
  getInfo();
  //if in this position white is in check and white has just moved, revert to the previous position
//vice versa for black
if (turn=="w"&&checkforchecks("w")) {
  setText(pos2, p2);
  setText(pos1, p);
  setProperty(pos1, "text-color", "black");
  getInfo();
  //need to remove the last two items of boardhistory to avoid repitition
  removeItem(boardhistory, boardhistory.length-1);
  removeItem(boardhistory, boardhistory.length-2);

  //the onEvent will reverse it back
  turn = "b";
} else if (turn=="b"&&checkforchecks("b")) {
  setText(pos2, p2);
  setText(pos1, p);
  setProperty(pos1, "text-color", "black");
  getInfo();
  //remove last two items of boardhistory
  removeItem(boardhistory, boardhistory.length-1);
  removeItem(boardhistory, boardhistory.length-2);

  turn = "w";
} else if (test!=true) {
  //completely legal move with no revert
  //var for updated turn (since the onevent reverses it)
  var upturn;
  if (turn=="w") {
    upturn = "b";
  } else {
    upturn = "w";
  }
  console.log("upturn  "+upturn);
  console.log(checkforchecks(upturn));
  if (calculatemate(upturn)&&checkforchecks(upturn)) {
    //apparently this part is bricked and never runs for some reason
    if (turn=="w") {
      win("White","checkmate");
    } else {
      win("Black","checkmate");
    }
  } else if (calculatemate(upturn)) {
    if (checkforchecks(upturn) && upturn=="b") {
      win("White","checkmate");
    } else if (checkforchecks(upturn)) {
      win("Black","checkmate");
    } else {
    draw("stalemate");
    }
  }
  
}
//the onEvent will reverse it back
} else {
  //move was completely not legal
if (turn=="b") {
  turn = "w";
  setProperty(pos1, "text-color", "black");
} else {
  turn = "b";
  setProperty(pos1, "text-color", "black");
}
}
capturemate();

}


function checkforchecks(c) {
  //c for color of king being checked for check
  var ischecked = false;
  //if the king is in the enemy vision array, it is in check
  if (c=="w") {
    for (var i = 0; i < blackvision1.length; i++) {
        for (var i2 = 1; i2 < blackvision1[i].length; i2++) {
          if (blackvision1[i][i2]==wkpos) {
            ischecked = true;
            break;
          }
        }
      }
  }
  if (c=="b") {
    for (var j = 0; j < whitevision1.length; j++) {
        for (var j2 = 1; j2 < whitevision1[j].length; j2++) {
          if (whitevision1[j][j2]==bkpos) {
            ischecked = true;
            break;
          }
        }
      }
  }
  return ischecked;
}

function calculatemate(c) {
  //c for color of the player being mated, black or white
  //inserted at the end of movee
  //if check it's checkmate, if no check it's stalemate
  //kind of tedious, but this function carries out every single possible legal move
  //and if the board remains exactly the same, it's checkmate
  //the moment that a legal move is able to be made without a revert
  //(so board history updates), revert and return false, else return true
  //if true, win by checkmate for enemy
  var legalmoves = eval("legalmoves"+c);
  var bhlength = boardhistory.length;
  for (var i = 0; i < legalmoves.length; i++) {
    for (var j = 1; j < legalmoves[i].length; j++) {
      //copied from movee in case of a revert being needed, but modified b/c i realized getpint is way better
      //in this case pos2 is legalmoves[i][j] while pos1 and p are found in legalmoves[i][0]
      //finding the piece corresponding to pos2 in case a revert is needed
  var p2 = getpint(legalmoves[i][j]);
  var p = getpint(legalmoves[i][0].substring(0,2));
    movee(legalmoves[i][0].substring(0,2), legalmoves[i][j], getpint(legalmoves[i][0].substring(0,2)), true);
    
  //copied to simulate onEvent

    //change turns
    if (turn=="w") {
      turn="b";
    } else {
      turn="w";
    }
    console.log("bhlength, boardhistory.length");
    console.log(bhlength);
    console.log(boardhistory.length);
    if (bhlength != boardhistory.length) {
      //revert (copied)
      var pos2 = legalmoves[i][j];
      var pos1 = legalmoves[i][0].substring(0,2);
console.log(pos2 + "    "+ p2);
console.log(pos1 + "    "+ p);
  setText(pos2, p2);
  setText(pos1, p);

  setProperty(pos1, "text-color", "black");
  getInfo();
  //need to remove the last two items of boardhistory to avoid repitition
  removeItem(boardhistory, boardhistory.length-1);
  removeItem(boardhistory, boardhistory.length-2);
return false;
    }
    }
  }
  return true;
}



//to keep things consistent, p is letter for the piece and then letter for color
var encroissant;
function movecalcpiece(p, sq) {
  var moves = [];
  if (p.substring(0,1)=="r"||p.substring(0,1)=="q") {
    var movestemp=vision1(p, sq);
    for (var a = 0; a < movestemp.length; a++) {
      if (getp(movestemp[a])==undefined) {
        appendItem(moves, movestemp[a]);
      } else if (getp(movestemp[a]).substring(1,2)!=p.substring(1,2)) {
        appendItem(moves, movestemp[a]);
      }
    }
  }
  //white goes in the negative rank direction and black in the positive direction
  if (p.substring(0,1)=="p") {
    if (p.substring(1,2)=="w") {
      //straight forward
      if (getp((Number(sq.substring(0,1))-1).toString()+sq.substring(1,2))==undefined && sq.substring(0,1)!=1) {
        appendItem(moves, (Number(sq.substring(0,1))-1).toString()+sq.substring(1,2));
        //two squares forward
        if (sq.substring(0,1)=="4" && getp((Number(sq.substring(0,1))-2).toString()+sq.substring(1,2))==undefined) {
          appendItem(moves, (Number(sq.substring(0,1))-2).toString()+sq.substring(1,2));
        }
      }
    }
    if (p.substring(1,2)=="b") {
      //straight forward
      if (getp((Number(sq.substring(0,1))+1).toString()+sq.substring(1,2))==undefined && sq.substring(0,1)!=5) {
        appendItem(moves, (Number(sq.substring(0,1))+1).toString()+sq.substring(1,2));
        //two squares forward
        if (sq.substring(0,1)=="2" && getp((Number(sq.substring(0,1))+2).toString()+sq.substring(1,2))==undefined) {
          appendItem(moves, (Number(sq.substring(0,1))+2).toString()+sq.substring(1,2));
        }
      }
    }
    //one square diagonal ahead (covered by vision)
      var movestemp2 = vision1(p, sq);
      for (var b = 0; b < movestemp2.length; b++) {
        if (getp(movestemp2[b])!=undefined) {
          if (getp(movestemp2[b]).substring(1,2)!=p.substring(1,2)) {
          appendItem(moves, movestemp2[b]);
          }
        }
      }
    //holy hell
    
  }
  if (p.substring(0,1)=="k") {
    if (p.substring(1,2)=="w") {
    moves = movecalcking(blackvision1, sq);
    }
    if (p.substring(1,2)=="b") {
    moves = movecalcking(whitevision1, sq);
    }
  }
  return moves;
}

function movecalcking(vis, sq) {
  //vis stands for enemy vision array, sq is a string
  var moves = [];
  var tempmoves = vision1("k", sq);
  for (var i = 0; i < tempmoves.length; i++) {
    //can't be of the same color, and can't be in the enemy's vision array
    var isinvis = false;
    if (getp(tempmoves[i])==undefined) {
      for (var j = 0; j < vis.length; j++) {
        for (var j2 = 1; j2 < vis[j].length; j2++) {
          if (vis[j][j2]==tempmoves[i]) {
            isinvis = true;
          }
        }
      }
      if (isinvis == false) {
      appendItem(moves, tempmoves[i]);
    }
    } else if (getp(tempmoves[i]).substring(1,2)!=getp(sq).substring(1,2)) {
      for (var k = 0; k < vis.length; k++) {
        for (var k2 = 1; k2 < vis[k].length; k2++) {
          if (vis[k][k2]==tempmoves[i]) {
            isinvis = true;
          }
        }
      }
      if (isinvis == false) {
      appendItem(moves, tempmoves[i]);
    }
    }
  }
  return moves;
}

function whitepin1() {
  console.log("calculating white pins");
  //nested arrays, each inner array includes the first element as the pinned piece and the second element as the pinning piece
  var pins = [];
  //pins that white has on black
  var extvis = [];
  var kingindex;
  for (var i = 0; i < whitevision1.length; i++) {
    kingindex = undefined;
    //if rook or queen, see if extvis contains the king and if there is only one piece between the king and pinner
    if (whitevision1[i][0].substring(2,3)=="r"||whitevision1[i][0].substring(2,3)=="q") {
      var p = whitevision1[i][0].substring(2,3);
      var sq = whitevision1[i][0].substring(0,2);
      extvis = visionextend(p, sq);
     for (var l = 0; l < extvis.length; l++) {
       //find the index of the bk
       if (extvis[l]==bkpos) {
         kingindex = l;
         break;
       }
     }
     if (kingindex!=undefined) {
       
     var c=1;
      //if rank is the same, go back from king in extvis as long as typeof is string, don't need a check for overlapping with the pinnersq
      //doubles for same file
      if (sq.substring(0,1)==bkpos.substring(0,1)||sq.substring(1,2)==bkpos.substring(1,2)) {
      var piececounter = 0;
      var pinarray = [];
        while (typeof(extvis[kingindex-c])=="string") {
          //check if there is a piece and another if for if the piece is not white
          if (getp(extvis[kingindex-c])!=undefined) {
            if (getp(extvis[kingindex-c]).substring(1,2)!="w") {
            appendItem(pinarray, extvis[kingindex-c]+getp(extvis[kingindex-c]));
            }
            piececounter++;
          }
          c++;
        }
        if (piececounter==1 && pinarray[0]!=undefined) {
          appendItem(pins, [pinarray[0], sq+p+"w"]);
        }
      } else {
        console.log("diagonal");
      var piececounter2 = 0;
      var pinarray2 = [];
      //mod for diagonals, if the difference between two consecutive squares is not 9 or 11, you know that the pinnersq is being skipped
      //and further squares after the skip don't count for the single piece in between req
      while (typeof(extvis[kingindex-c])=="string" && (Math.abs(Number(extvis[kingindex-c])-Number(extvis[kingindex-c-1]))==9 || Math.abs(Number(extvis[kingindex-c])-Number(extvis[kingindex-c-1]))==11)){
        if (getp(extvis[kingindex-c])!=undefined) {
            if (getp(extvis[kingindex-c]).substring(1,2)!="w") {
            appendItem(pinarray2, extvis[kingindex-c]+getp(extvis[kingindex-c]));
            }
            piececounter2++;
          }
          c++;
      }
      //still need to check one more
      if (getp(extvis[kingindex-c])!=undefined) {
            if (getp(extvis[kingindex-c]).substring(1,2)!="w") {
            appendItem(pinarray2, extvis[kingindex-c]+getp(extvis[kingindex-c]));
            }
            piececounter2++;
          }
      if (piececounter2==1 && pinarray2[0]!=undefined) {
        appendItem(pins, [pinarray2[0], sq+p+"w"]);
      }
      }
    }
       //actually doesn't need to update if you move a pinning piece
     }
  }
  return pins;
}

function blackpin1() {
  console.log("calculating black pins");
  //nested arrays, each inner array includes the first element as the pinned piece and the second element as the pinning piece
  var pins = [];
  //pins that black has on white
  var extvis = [];
  var kingindex;
  for (var i = 0; i < blackvision1.length; i++) {
    kingindex = undefined;
    //if rook or queen, see if extvis contains the king and if there is only one piece between the king and pinner
    if (blackvision1[i][0].substring(2,3)=="r"||blackvision1[i][0].substring(2,3)=="q") {
      var p = blackvision1[i][0].substring(2,3);
      var sq = blackvision1[i][0].substring(0,2);
      extvis = visionextend(p, sq);
      
     for (var l = 0; l < extvis.length; l++) {
       //find the index of the wk
       if (extvis[l]==wkpos) {
         kingindex = l;
         break;
       }
     }
     var c=1;
      //if rank is the same, go back from king in extvis as long as typeof is string, don't need a check for overlapping with the pinnersq
      //doubles for same file
      if (sq.substring(0,1)==wkpos.substring(0,1)||sq.substring(1,2)==wkpos.substring(1,2)) {
      var piececounter = 0;
      var pinarray = [];
        while (typeof(extvis[kingindex-c])=="string") {
          if (getp(extvis[kingindex-c])!=undefined) {
            //check if piece is black
            if (getp(extvis[kingindex-c]).substring(1,2)!="b") {
            appendItem(pinarray, extvis[kingindex-c]+getp(extvis[kingindex-c]));
            }
            piececounter++;
          }
          c++;
        }
        if (piececounter==1 && pinarray[0]!=undefined) {
          appendItem(pins, [pinarray[0], sq+p+"b"]);
        }
      } else {
      var piececounter2 = 0;
      var pinarray2 = [];
      //mod for diagonals, if the difference between two consecutive squares is not 9 or 11, you know that the pinnersq is being skipped
      //and further squares after the skip don't count for the single piece in between req
      while (typeof(extvis[kingindex-c])=="string" && (Math.abs(Number(extvis[kingindex-c])-Number(extvis[kingindex-c-1]))==9 || Math.abs(Number(extvis[kingindex-c])-Number(extvis[kingindex-c-1]))==11)){
        if (getp(extvis[kingindex-c])!=undefined) {
            if (getp(extvis[kingindex-c]).substring(1,2)!="b") {
            appendItem(pinarray2, extvis[kingindex-c]+getp(extvis[kingindex-c]));
            }
            piececounter2++;
          }
          c++;
      }
      //still need to check one more
      if (getp(extvis[kingindex-c])!=undefined) {
            if (getp(extvis[kingindex-c]).substring(1,2)!="b") {
            appendItem(pinarray2, extvis[kingindex-c]+getp(extvis[kingindex-c]));
            }
            piececounter2++;
          }
      if (piececounter2==1 && pinarray2[0]!=undefined) {
        appendItem(pins, [pinarray2[0], sq+p+"b"]);
      }
      }
    }
       //actually doesn't need to update if you move a pinning piece
     }
  return pins;
}

function visionextend(p, sq) {
  //p can only be "r" or "q"
  //sq is the square of the piece
  //recycled from vision1
  // needs to extend 3 spaces/as far as possible
  //false is inserted before every direction change b/c its a boolean and i can use typeof and other stuff
  var visible=[];
  //changing rank
    var a=(Number(sq.substring(0,1))+1).toString();
      while (Number(a)<6) {
      appendItem(visible, a+sq.substring(1,2));
      a=(Number(a)+1).toString();
      }
    a=(Number(sq.substring(0,1))-1).toString();
    appendItem(visible, false);
      while (Number(a)>0) {
      appendItem(visible, a+sq.substring(1,2));
      a=(Number(a)-1).toString();
      }
    //changing file
    var b=(Number(sq.substring(1,2))+1).toString();
    appendItem(visible, false);
    while (Number(b)<5) {
      appendItem(visible, sq.substring(0,1)+b);
      b=(Number(b)+1).toString();
    }
    b=(Number(sq.substring(1,2))-1).toString();
    appendItem(visible, false);
    while (Number(b)>0) {
      appendItem(visible, sq.substring(0,1)+b);
      b=(Number(b)-1).toString();
    }
    
    if (p=="q") {
      visible=visible.concat(bshpextend(sq));
    }
    console.log("vis"+visible);
    return visible;
}

function bshpextend(sq) {
  //this has been rearranged to better suit line of pin, going in two diagonal lines now inst of split into 4 separate ones
  //goes to the edge
  //obv doesn't include the initial sq
  var temparray=[];
  appendItem(temparray, false);
  //+45 degree diagonal, sub rank, add file
  var r1=(Number(sq.substring(0,1))-1).toString();
  var f1=(Number(sq.substring(1,2))+1).toString();
  while (Number(r1)>0&&Number(f1)<5) {
      appendItem(temparray, r1+f1);
      r1=(Number(r1)-1).toString();
      f1=(Number(f1)+1).toString();
      }
  //225 degree diagonal, add rank, sub file
  r1=(Number(sq.substring(0,1))+1).toString();
  f1=(Number(sq.substring(1,2))-1).toString();
  while (Number(r1)<6&&Number(f1)>0) {
      appendItem(temparray, r1+f1);
      r1=(Number(r1)+1).toString();
      f1=(Number(f1)-1).toString();
      }
      
      appendItem(temparray, false);
  //135 degree diagonal, sub rank, sub file
  r1=(Number(sq.substring(0,1))-1).toString();
  f1=(Number(sq.substring(1,2))-1).toString();
  while (Number(r1)>0&&Number(f1)>0) {
      appendItem(temparray, r1+f1);
      r1=(Number(r1)-1).toString();
      f1=(Number(f1)-1).toString();
      }
  
  //315 degree diagonal, add rank, add file
  r1=(Number(sq.substring(0,1))+1).toString();
  f1=(Number(sq.substring(1,2))+1).toString();
  while (Number(r1)<6&&Number(f1)<5) {
      appendItem(temparray, r1+f1);
      r1=(Number(r1)+1).toString();
      f1=(Number(f1)+1).toString();
      }
  return temparray;
}
function getp(sq) {
  var index;
  for (var i = 0; i < positions.length; i++) {
    if (positions[i]==sq) {
      index = i;
      break;
    }
  }
    return pieces[index];
}

function getpint(sq) {
  var index;
  for (var i = 0; i < positions.length; i++) {
    if (positions[i]==sq) {
      index = i;
      break;
    }
  }
  if (index!=undefined) {
    return piecesint[index];
  } else {
    return "";
  }
}


function lineofpin(pinnersq, pinnedsq, kingsq) {
  //idk what it's actually called, basically if a piece is pinned, its only legal moves are along this line of pin
  //pinned pieces still have vision outside of their line of pin (like reactionary attack/defense)
  //line of pin includes the pinner, but not the pinned (nvm it doesn't really matter if line of pin includes the pinned since you can't move to the same position anyway, it just deselects the piece)
  //first element is the pinned piece
  var readifarray = [pinnedsq+getp(pinnedsq)];
  //same rank
  if (pinnersq.substring(0,1)==pinnedsq.substring(0,1)) {
    //pinned is right of pinner, going from pinner to pinned
    if (pinnedsq.substring(1,2)>pinnersq.substring(1,2)) {
    for (var i = 0; i < Number(pinnedsq.substring(1,2))-Number(pinnersq.substring(1,2)); i++) {
    appendItem(readifarray, pinnersq.substring(0,1)+(Number(pinnersq.substring(1,2))+i).toString());
    }
    //going beyond up to the king (skipping the pinnedsq)
    if (Number(kingsq.substring(1,2))-Number(pinnedsq.substring(1,2))!=1) {
    for (var i2 = 0; i2 < Number(kingsq.substring(1,2))-Number(pinnedsq.substring(1,2)); i2++) {
    appendItem(readifarray, pinnedsq.substring(0,1)+(Number(pinnedsq.substring(1,2))+i2).toString());
    }}
    //pinned is left of pinner
    } else {
    for (var k = 0; k < Number(pinnersq.substring(1,2))-Number(pinnedsq.substring(1,2)); k++) {
    appendItem(readifarray, pinnersq.substring(0,1)+(Number(pinnersq.substring(1,2))-k).toString());
    }
    //going beyond up to the king (skipping the pinnedsq)
      if (Number(pinnedsq.substring(1,2))-Number(kingsq.substring(1,2))!=1) {
        for (var k2 = 0; k2 < Number(pinnedsq.substring(1,2))-Number(kingsq.substring(1,2)); k2++) {
    appendItem(readifarray, pinnedsq.substring(0,1)+(Number(pinnedsq.substring(1,2))-k2).toString());
    }
      }
    }
  }
  //same file
  else if (pinnersq.substring(1,2)==pinnedsq.substring(1,2)) {
    //pinned is below pinner, going from pinner to pinned
    if (pinnedsq.substring(0,1)>pinnersq.substring(0,1)) {
    for (var a = 0; a < Number(pinnedsq.substring(0,1))-Number(pinnersq.substring(0,1)); a++) {
    appendItem(readifarray, (Number(pinnersq.substring(0,1))+a).toString()+pinnersq.substring(1,2));
    }
    //going beyond up to the king (skipping the pinnedsq)
    if (Number(kingsq.substring(0,1))-Number(pinnedsq.substring(0,1))!=1) {
        for (var a2 = 0; a2 < Number(kingsq.substring(0,1))-Number(pinnedsq.substring(0,1)); a2++) {
    appendItem(readifarray, (Number(pinnedsq.substring(0,1))+a2).toString()+pinnedsq.substring(1,2));
    }
      }
    //pinned is above pinner
    } else {
    for (var b = 0; b < Number(pinnersq.substring(0,1))-Number(pinnedsq.substring(0,1)); b++) {
    appendItem(readifarray, (Number(pinnersq.substring(0,1))-b).toString()+pinnersq.substring(1,2));
    }
      //going beyond up to the king (skipping the pinnedsq)
      if (Number(pinnedsq.substring(0,1))-Number(kingsq.substring(0,1))!=1) {
        for (var b2 = 0; b2 < Number(pinnedsq.substring(0,1))-Number(kingsq.substring(0,1)); b2++) {
    appendItem(readifarray, (Number(pinnedsq.substring(0,1))-b2).toString()+pinnedsq.substring(1,2));
    }
      }
    }
  }
  //same diagonal
  else {
    var diagtemp = bshpextend(pinnedsq);
    var index;
    var temp = 0;
    for (var l = 0; l < diagtemp.length; l++) {
      if (diagtemp[l]==pinnersq) {
        index = l;
        break;
      }
    }
    while (typeof(diagtemp[index+temp])=="string") {
      appendItem(readifarray, diagtemp[index+temp]);
      temp++;
    }
    while (typeof(diagtemp[index+temp])=="string") {
      appendItem(readifarray, diagtemp[index+temp]);
      temp--;
    }
  }
  return readifarray;
}
