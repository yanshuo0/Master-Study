function tellerror(msg, url, linenumber) {
//========================================
// For netscape and mozilla
// Alert the error type, display when the error happens and the line that error locates.
            alert('Error message= ' + msg + '\nURL= ' + url + '\nLine Number= ' + linenumber);
            return true;
        } // tellerror

        if (document.addEventListener) window.onerror=tellerror;  // If not, use IE

        // Constant Definition
        cteTopPosY = -20;  // position that knowledge displays from above.
        cteInfoDeltaY = -35; // position that knowledge end at the bottom of screen

        var anNbValue = new Array(50); // value of product of two numbers
        var nMouseValue = 0; // Correct answer that displayed on mouse

        var nNbIndex = 0;  // Count of numbers that fall

        var nNbAtBottom = 0; // Count of numbers that reach bottom of screen
        var nNbWrong  = 0; // Count of numbers answering wrong
        var nNbCorrect = 0; // Count of numbers answering correct
        var nTime   = 0; // time in unit of 1/10 second
        // var nOper = 4;    // Definition of operations (1 = '+';  2 = '-';  4 = '*';  8 = '/')

        var nTimerID = 0;
        var npixLimitBottom = 530;  // limit of bottom of the screen

        var nTime = 0; // For vary the speed of numbers
        var nDeltaTime = 100; // Speed. 100 = normal, 50 = half speed, 200 = double speed.

       // var nNbMin1 =  2; // The minimum limit of randomly generated first number
       // var nNbMax1 = 11; // The maximum limit of randomly generated first number
       // var nNbMin2 =  2; // The minimum limit of randomly generated second number
       // var nNbMax2 = 11; // The maximum limit of randomly generated second number

       // var nOptErr1 = 1; // Importance of error. (nOptErr1 , nOptErr2) =
       // var nOptErr2 = 1; // (0, 0) => Weak ;  (1, 0) => Average ;  (1, 1) => Strong
       var nOptErr = 1; // Importance of error, 0 => Weak, 1 => Average, 2 => Strong
        // Modify also document.MaForm1.options.choix_erreurs.selectedIndex = 2 at the end of program

        function myRightMouseDown(evt) { // For opera .
//============================
            var MyNumber=0;
            if (evt) MyNumber = evt.button;
            else     MyNumber = event.which;

            if ((MyNumber == 2) || (MyNumber == 3))  {
               alert("Right button is inactive");
               evt.preventBubble();    // Cannot function
               evt.stopPropagation();  // Cannot function
                if (evt)  evt.preventDefault();  // It works !!!  Work for Netscape 6+
            }
            return false;
        } // myRightMouseDown

        function myContextMenu(evt) { // For netscape 6+ and IE but no opera .
//===========================
// Cancel the context menu.
            if (evt)  evt.preventDefault();  // It works for Netscape

            return false;
        } // myContextMenu

// =====================================================================================================================
        function Termine() {
//================
// When a number arrives at the bottom of the screen, displays a resume of results.

            if (nTimerID != 0) {
                clearInterval(nTimerID);
                nTimerID = 0;
            }

            var oDivS = document.getElementById("mouse_follow");  // Get the mouse follow element
            oDivS.innerHTML = "";

            var oDivTerm = document.getElementById("divTime");
            oDivTerm.innerHTML = '<table width="400" border="1">' +
                    '<tr><td bgcolor="#000099"><font size="+1"; color="#ffff90">' +
                    'Termine apr&egrave;s : ' + nTime/10 + ' secondes<br>' +
                    'Nombre de r&eacute;ponses justes = ' + nNbCorrect + '<br>' +
                    'Nombre de r&eacute;ponses fausses = ' + nNbWrong + '<br>' +
                    'Temps moyen par r&eacute;ponses juste = ' +
                    Math.round(10*nTime/(nNbCorrect + 0.00001)) / 100 + ' [s]' +
                    '</td></tr></table>';

// decide whether to display the commentaries
            if ((document.MaForm1.choix_commentaires.selectedIndex == 0) || (nTime < 300)) return;

// write commentaries, in terms of result
            var strCom1 = "Less than 2 minutes,";
            var strCom2 = "It's not enough.";
            var strCom3 = "";
            var strCom4 = "";

            if (nTime > 1200) {
                strCom1 = "Less than 2 minutes 30,";
                strCom2 = "Train to improve yourself.";
            }
            if (nTime > 1500) {
                strCom1 = "More than 2 minutes 30,";
                strCom2 = "It;s a great start.";
            }
            if (nTime > 1800) {
                strCom1 = "More than 3 minutes,";
                strCom2 = "It's quite well.";
            }
            if (nTime > 2100) {
                strCom1 = "More than 3 minutes 30,";
                strCom2 = "Good job.";
            }
            if (nTime > 2400) {
                strCom1 = "More than 4 minutes,";
                strCom2 = "Well done, you are an expert!";
            }
            if (nTime > 3000) {
                strCom1 = "More than 5 minutes, bravo,";
                strCom2 = "You are a guru!";
            }
            if (nTime > 3600) {
                strCom1 = "More than 6 minutes,";
                strCom2 = "You are one of the top!";
            }
            if (nTime > 4200) {
                strCom1 = "More than 7 minutes,";   
                strCom2 = "Incredible!";
            }
            if (nNbCorrect > 17) {
                if (nNbWrong == 0) strCom3 = "Perfect !";
                if (nNbWrong == 1) strCom3 = "1 error, it's acceptable !";
                if (nNbWrong == 2) strCom3 = "2 errors, that's the limit !";
                if (nNbWrong >  2) strCom3 = "More than 2 errors, that's too much !";
                if (nNbWrong >  5) strCom3 = "More than 5 errors, that's a tragedy !";
                if (nNbWrong > 10) strCom3 = "No comments...";

                if (nNbCorrect >  50) strCom4 = "You have conquered 50 questions.";
                if ((nNbCorrect >  60) && (nNbWrong < 3)) strCom4 = "60 correct answers, great.";
                if ((nNbCorrect >  70) && (nNbWrong < 3)) strCom4 = "70 correct answers, really good.";
                if ((nNbCorrect >  80) && (nNbWrong < 3)) strCom4 = "80 correct answers, excellent.";
                if ((nNbCorrect >  90) && (nNbWrong < 2)) strCom4 = "90 correct answers, remarkable.";
                if ((nNbCorrect > 100) && (nNbWrong == 0)) strCom4 = "100 questions done! Hello, expert.";
            }

            var oDivCom = document.getElementById("divCommentaires");
            oDivCom.innerHTML = '<table width="400" border="1">' +
                    '<tr><td bgcolor="#009999"><font size="+1"; color="#ffff90">' +
                    strCom1 + '<br>' +
                    strCom2 + '<br>' +
                    strCom3 + '<br>' +
                    strCom4 + '<br>' +
                    '</td></tr></table>';


        } // Termine

        function DisplayInfo() {
//====================
// display information at the bottom of screen
            oDivInfo = document.getElementById("divInfo");
            oDivInfo.innerHTML = "Correct : " + nNbCorrect + " &nbsp; &nbsp; Incorrect : " + nNbWrong +
                    " &nbsp; &nbsp; Average : " + Math.round(10*nTime/(nNbCorrect + 0.00001)) / 100 +
                    " &nbsp; &nbsp; Time : ";
        } // DisplayInfo

        function myWrite() {
//==================
// move numbers to the bottom
            nTime += 1; // plus 1/10 second
            odivTime = document.getElementById("divTime");
            odivTime.innerHTML = nTime/10;

            nTime = nTime + nDeltaTime;
            if (nTime < 0) return true;

            var nDeltaY = 0;
            while (nTime >= 0) { // accelerate the speed.
                nTime = nTime - 100;
                nDeltaY +=1;
            }

            for (nn=1; nn <=nNbIndex; nn++) {
                oDivLesNb = document.getElementById("divNb" + nn);
                anNbPosY[nn] += nDeltaY;
                anNbPosX[nn] += Math.round(4*(Math.random()-0.5));  // move randomly in axe X
                oDivLesNb.style.left = anNbPosX[nn];
                oDivLesNb.style.top  = anNbPosY[nn];

                if (anNbPosY[nn] > npixLimitBottom) {
                    // This number has arrived at the bottom
                    anNbPosX[nn] = 80*nn-40; // regeneration in the right column
                    anNbPosY[nn] = cteTopPosY; // regenerate from above screen
                    nNbAtBottom +=1; // count "arrive at bottom" increases 1

                    DisplayInfo();
                    Termine();
                }
            }

        } // myWrite

        function Mouse_follow(evt) {
//=======================
            if (nTimerID == 0) return true;

            var oDivS = document.getElementById("mouse_follow");
            var x = 0; var y = 0;

// Read the position of mouse
            if (evt) { x=evt.clientX; y=evt.clientY; } // in netscape 6
            else if (window.event){ x=window.event.x; y=window.event.y; } // in IE5

// move the text(equation) to follow the move of mouse
            oDivS.style.top  = y;
            oDivS.style.left = x;

        } // Mouse_follow

        function Click_action(evt) {
//==========================
// action of click the mouse.
            if (nTimerID == 0) return true;

            var x = 0; var y = 0;

// Read the position of mouse
            if (evt) { x=evt.clientX; y=evt.clientY; } // In ns6
            else if (window.event){ x=window.event.x; y=window.event.y; } // In ie5

// For each correct response, we test the size of window.
            if (window.innerHeight) npixLimitBottom = window.innerHeight;
            else if (document.body && document.body.clientHeight) npixLimitBottom = document.body.clientHeight;
            else npixLimitBottom = 500;

            oDivInfo = document.getElementById("divInfo");
            oDivInfo.style.top = npixLimitBottom + cteInfoDeltaY;
            odivTime = document.getElementById("divTime");
            odivTime .style.top = npixLimitBottom + cteInfoDeltaY;

// We let the test run faster
            if ((x < 3) && (y < 15)) {
                nTime+=1200 - 100*y;
                nNbCorrect +=5 * y;
                for (kk=1; kk <=nNbIndex; kk++) {
                    anNbPosY[kk] += 100;
                    oDivLeNb = document.getElementById("divNb" + kk);
                    oDivLeNb.style.top = anNbPosY[kk];
                }
                DisplayInfo();
                return;
            }

// For all the numbers, test whether the user click on a number
            for (nn=1; nn <=nNbIndex; nn++) {
                // Test whether a number is clicked
                if ((Math.abs(x-anNbPosX[nn]- 25) < 25) && (Math.abs(y-anNbPosY[nn]- 25) < 25)) {

                    // Test whether a correct number is clicked
                    if (nMouseValue == anNbValue[nn]) { // correct answer
                        nNbCorrect +=1;

                        // change the text on the mouse
                        var oDivS = document.getElementById("mouse_follow");

                        anNbPosY[nn] = cteTopPosY; // reset the number from above

                        // Choose a random number.
                        var kk = Math.floor(1+nNbIndex *Math.random());

                        if (nTime + nOptErr2*nNbWrong*(50 + 10*nNbWrong) < 2100) {
                            // If less than 2100 1/10 seconds = 3.5 minutes, then
                            // choose one from the lowest two.
                            var kk1 = Math.floor(1+nNbIndex *Math.random());
                            if (anNbPosY[kk1] > anNbPosY[kk]) kk = kk1;
                        }

                        if ((nNbIndex > 7) && (nTime + nOptErr2*nNbWrong*(30 + 5*nNbWrong) < 1500)) {
                            // If it is more than 7 numbers but less than 1500 1/10 seconds,
                            // we give more weight to the lowest one.
                            kk1 = Math.floor(1+nNbIndex *Math.random());
                            if (anNbPosY[kk1] > anNbPosY[kk]) kk = kk1;
                        }

                        // New numbers
                        // anNbVal1[nn] = Math.floor(nNbMin1 + (1 + nNbMax1 - nNbMin1)*Math.random()); // Value of first number
                        // anNbVal2[nn] = Math.floor(nNbMin2 + (1 + nNbMax2 - nNbMin2)*Math.random()); // Value of second number
                        /*if (nOper == 1) {
                            anNbValue[nn] = anNbVal1[nn] + anNbVal2[nn];
                            oDivS.innerHTML = anNbVal1[kk] + " + " + anNbVal2[kk];
                        }
                        else if (nOper == 2)  { // Subtraction
                            var nTemp  = anNbVal1[nn] + anNbVal2[nn];
                            var nTemp1 = anNbVal1[nn];
                            anNbVal1[nn] = nTemp;
                            anNbValue[nn] = nTemp1;
                            oDivS.innerHTML = anNbVal1[kk] + " - " + anNbVal2[kk];
                        }
                        else if (nOper == 4)  { // Production
                            anNbValue[nn] = anNbVal1[nn] * anNbVal2[nn];
                            oDivS.innerHTML = anNbVal1[kk] + " * " + anNbVal2[kk];
                        }

                        else if (nOper == 8)  { // division
                            var nTemp  = anNbVal1[nn] * anNbVal2[nn];
                            var nTemp1 = anNbVal1[nn];
                            anNbVal1[nn] = nTemp;
                            anNbValue[nn] = nTemp1;
                            oDivS.innerHTML = anNbVal1[kk] + " / " + anNbVal2[kk];
                        }*/
                        oDivS.innerHTML = anNbValue[kk];
                        nMouseValue = anNbValue[kk];

                        anNbPosX[nn] = 80*nn-40; // reset in the right column
                        anNbPosY[nn] = cteTopPosY; // reset the number from above
                        oDivLeNb = document.getElementById("divNb" + nn);
                        oDivLeNb.innerHTML = anNbValue[nn];
                        oDivLeNb.style.top = anNbPosY[nn];

                        // increase the count of number with time.
                        var nTime2  = nTime + 30*nOptErr2*nNbWrong;
                        if (((nTime2 >  150) && (nNbIndex <  5)) ||
                                ((nTime2 >  300) && (nNbIndex <  6)) ||
                                ((nTime2 >  450) && (nNbIndex <  7)) ||
                                ((nTime2 >  600) && (nNbIndex <  8)) ||
                                ((nTime2 >  750) && (nNbIndex <  9)) ||
                                ((nTime2 >  900) && (nNbIndex < 10)) ||
                                ((nTime2 > 1200) && (nNbIndex < 11))) {
                            nNbIndex = nNbIndex +1;
                            nn = nNbIndex;
                            // anNbVal1[nn] = Math.floor(nNbMin1 + (1 + nNbMax1 - nNbMin1)*Math.random()); // Value of first number
                            // anNbVal2[nn] = Math.floor(nNbMin2 + (1 + nNbMax2 - nNbMin2)*Math.random()); // Value of second number

                            // add a number float from above to bottom.
                            /*if (nOper == 1) {
                                anNbValue[nn] = anNbVal1[nn] + anNbVal2[nn];
                            }
                            else if (nOper == 2)  { // subtraction
                                var nTemp  = anNbVal1[nn] + anNbVal2[nn];
                                var nTemp1 = anNbVal1[nn];
                                anNbVal1[nn] = nTemp;
                                anNbValue[nn] = nTemp1;
                            }
                            else if (nOper == 4)  { // Production
                                anNbValue[nn] = anNbVal1[nn] * anNbVal2[nn];
                            }

                            else if (nOper == 8)  { // division
                                var nTemp  = anNbVal1[nn] * anNbVal2[nn];
                                var nTemp1 = anNbVal1[nn];
                                anNbVal1[nn] = nTemp;
                                anNbValue[nn] = nTemp1;
                            }*/

                            anNbPosX[nn] = 100*nn-100;
                            anNbPosY[nn] = -100;
                            strDivText = "<DIV id='divNb" + nn + "' STYLE='position:absolute; left:" + anNbPosX[nn] + "; top:" + anNbPosY[nn];
                            strDivText +="; color:white; font-size:36; visibility:visible'>" + anNbValue[nn] + "</DIV>";

                            var oDivLesNb = document.getElementById("divAllNumbers");
                            oDivLesNb.innerHTML += strDivText;
                        }

                        DisplayInfo();
                        return;
                    }
                    else {  // incorrect answer
                        nNbWrong +=1;
                        if (nOptErr1 == 0) {
                            // the number clicked down a little
                            anNbPosY[nn] += 50;
                            oDivLeNb = document.getElementById("divNb" + nn);
                            oDivLeNb.style.top = anNbPosY[nn];
                        }
                        else {
                            // the numbers clicked down a little
                            for (kk=1; kk <=nNbIndex; kk++) {
                                anNbPosY[kk] += 50;
                                oDivLeNb = document.getElementById("divNb" + kk);
                                oDivLeNb.style.top = anNbPosY[kk];
                            }
                        }
                        DisplayInfo();
                        return;
                    }
                }
            }
        } // Click_action

        function Start() {
//================
            var nn = 1;
            var strDivText = "du texte";
            var oDivLesNb = document.getElementById("divAllNumbers");
            oDivLesNb.innerHTML = '';
            nNbIndex = 4;

            nNbAtBottom = 0; // count of numbers arrive at the bottom
            nNbWrong  = 0; // count of incorrect answers
            nNbCorrect = 0; // count of correct answers
            nTime   = 0; // time in 1/10 seconds

            for (nn=1; nn <= nNbIndex ; nn++) {
                anNbVal1[nn] = Math.floor(nNbMin1 + (1 + nNbMax1 - nNbMin1)*Math.random()); // Value of first number
                anNbVal2[nn] = Math.floor(nNbMin2 + (1 + nNbMax2 - nNbMin2)*Math.random()); // Value of second number
//alert(anNbVal1[nn] + "  " + nNbMin1 + "  " + nNbMax1 + "  " + Math.random());

                if (nOper == 1) { // addition
                    anNbValue[nn] = anNbVal1[nn] + anNbVal2[nn];
                }
                else if (nOper == 2)  { // subtraction
                    var nTemp  = anNbVal1[nn] + anNbVal2[nn];
                    var nTemp1 = anNbVal1[nn];
                    anNbVal1[nn] = nTemp;
                    anNbValue[nn] = nTemp1;
                }
                else if (nOper == 4)  { // production
                    anNbValue[nn] = anNbVal1[nn] * anNbVal2[nn];
                }

                else if (nOper == 8)  { // division
                    var nTemp  = anNbVal1[nn] * anNbVal2[nn];
                    var nTemp1 = anNbVal1[nn];
                    anNbVal1[nn] = nTemp;
                    anNbValue[nn] = nTemp1;
                }

                anNbPosX[nn] = 80*nn-40;
                anNbPosY[nn] = -10;
                strDivText = "<DIV id='divNb" + nn + "' STYLE='position:absolute; left:" + anNbPosX[nn] + "; top:" + anNbPosY[nn];
                strDivText +="; color:white; font-size:36; visibility:visible'>" + anNbValue[nn] + "</DIV>";

                oDivLesNb.innerHTML += strDivText;
            }

// operation to do, which follows the mouse
            var oDivS = document.getElementById("mouse_follow");

            kk = Math.floor(1+nNbIndex * Math.random());
            if (nOper == 1) {
                oDivS.innerHTML = anNbVal1[kk] + " + " + anNbVal2[kk];
            }
            else if (nOper == 2)  {
                oDivS.innerHTML = anNbVal1[kk] + " - " + anNbVal2[kk];
            }
            else if (nOper == 4)  {
                oDivS.innerHTML = anNbVal1[kk] + " * " + anNbVal2[kk];
            }

            else if (nOper == 8)  {
                oDivS.innerHTML = anNbVal1[kk] + " / " + anNbVal2[kk];
            }

            nMouseValue = anNbValue[kk];

// position of the informations, in function of the window size
            if (window.innerHeight) npixLimitBottom = window.innerHeight;
            else if (document.body && document.body.clientHeight) npixLimitBottom = document.body.clientHeight;
            else npixLimitBottom = 500;

// Informations at bottom
            oDivInfo = document.getElementById("divInfo");
            oDivInfo.style.top = npixLimitBottom + cteInfoDeltaY;
            DisplayInfo();

            odivTime = document.getElementById("divTime");
            odivTime .style.top = npixLimitBottom + cteInfoDeltaY;

// Move numbers every '100' millisecondes.
            if (nTimerID == 0) nTimerID = setInterval("myWrite()", 100);

            var oDivTerm = document.getElementById("divTime");
            oDivTerm.innerHTML = "";

            var oDivCom = document.getElementById("divCommentaires");
            oDivCom.innerHTML = "";

        } // Start

        function SetOption(strOption) {
//=============================
// Options to be tested
            if (strOption == 'opt') {
                // hide the button "options" while display other buttons
                oDivOptions = document.getElementById("divOptionsShow");
                oDivOptions.style.visibility = "hidden";

                oDivOptions = document.getElementById("divOptions");
                oDivOptions.style.visibility = "visible";

                // update the context forms.
                document.MaForm1.textNbMin1.value=nNbMin1;
                document.MaForm1.textNbMax1.value=nNbMax1;
                document.MaForm1.textNbMin2.value=nNbMin2;
                document.MaForm1.textNbMax2.value=nNbMax2;

                Termine();
                return;
            }
            else {
                // show the "option" button and hide other buttons.
                oDivOptions = document.getElementById("divOptionsShow");
                oDivOptions.style.visibility = "visible";

                oDivOptions = document.getElementById("divOptions");
                oDivOptions.style.visibility = "hidden";
            }

// choosed operation
            if (strOption == 'add') nOper=1;
            if (strOption == 'sub') nOper=2;
            if (strOption == 'mul') nOper=4;
            if (strOption == 'div') nOper=8;

// choose the importance of error.
            if (document.MaForm1.choix_erreurs.selectedIndex == 0) {nOptErr1 = 0;  nOptErr2 = 0; }
            if (document.MaForm1.choix_erreurs.selectedIndex == 1) {nOptErr1 = 1;  nOptErr2 = 0; }
            if (document.MaForm1.choix_erreurs.selectedIndex == 2) {nOptErr1 = 1;  nOptErr2 = 1; }
//alert('Opt= ' + nOptErr1 + '   ' + nOptErr2 + '   ' +document.MaForm1.choix_erreurs.selectedIndex);
            Start();
        } // SetOption

        function mySetValue(nNb, strValue) {
//==================================
            nValue = parseInt(strValue); // convert a string to number

// Do nothing if we don't have a value
            if (isNaN(nValue)) return;

            if (nNb == 1) nNbMin1=nValue;
            if (nNb == 2) nNbMax1=nValue;
            if (nNb == 3) nNbMin2=nValue;
            if (nNb == 4) nNbMax2=nValue;

// Test of coherance
            if (nNbMin1 > nNbMax1) nNbMin1 = nNbMax1;
            if (nNbMin2 > nNbMax2) nNbMin2 = nNbMax2;

//alert(nValue + "  " + nNbMin1 + "  " + nNbMax1);
        } // mySetValue

        // Initialisation
        //=============================
        if (document.addEventListener) { // Netscape 6+  &  Opera
            document.addEventListener('mousemove', Mouse_follow, true);
            document.addEventListener('click', Click_action, true);
            document.addEventListener("mousedown",myRightMouseDown,false); // For opera
            document.addEventListener("contextmenu", myContextMenu, false);
        }
        else { // IE
            document.onmousemove = Mouse_follow;
            document.onclick = Click_action;
            document.oncontextmenu = myContextMenu;  // Works Well
        }

        //-->