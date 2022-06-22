let calcString="";
let calculatorInput=document.getElementById('calculator-input');
let charToAdd="";
let expressionSpan=document.getElementById('expression-span');

function buildCalcString(clickedElement){
	if (clickedElement.innerHTML==="CLR"){
		calculatorInput.value="";
		calcString="";
		calculatorInput.value=calcString;
		expressionSpan.innerHTML="";
		}
	else if (clickedElement.innerHTML==="←"){
		calcString=calculatorInput.value;
		calcString = calcString.slice(0,-1);
		calculatorInput.value=calcString;
		}
	else if (clickedElement.innerHTML==="="){
		evaluateExpression(calculatorInput.value);
	}
	else{
		calcString=calculatorInput.value;
		charToAdd = clickedElement.innerHTML;
		if (charToAdd==="x"){
			charToAdd="*";
		}
		calcString += charToAdd;
		calculatorInput.value=calcString;	
	}
}

function getAnOperator(str){
	let operators=['/','*','-','+'];
	str=str.trim();
	if (str[0]==="-"){
		str=str.slice(1);
	}
	for (let i=0;i<operators.length;i++){
		if (str.includes(operators[i])){
			return operators[i];
		}
	}
	return -1; //indicates no operator found
}


function justOneOperator(str){
	let operators=['/','*','-','+'];
	let operatorCount=0;
	str=str.trim();
	if (str[0]==="-"){
		str=str.slice(1);
	}
	
	for (let i=0;i<operators.length;i++){
		operatorCount+= str.split(operators[i]).length - 1;
	}
	if (operatorCount!=1){
		console.log("incorrect operator count",operatorCount)
		}
	return (operatorCount===1);
}

function tokenEmpty(str, operator){
	//trim string
	str=str.trim();
	//remove initial - sign if present
	if (str[0]==="-"){
		str=str.slice(1);
	}
	//split tokens
	tokens=str.split(operator);
	//trim tokens
	for (token of tokens){
		token=token.trim();
	}
	//check that length is correct
	if (tokens.length!=2){
		console.log("incorrect number of tokens");
		return true;
	}
	// if tokens are empty return true
	else if (tokens[0]===""){
		console.log("first token empty");
		return true;
	}
	else if (tokens[1]===""){
		console.log("second token empty");
		return true;
	}
	else {
		return false;
	}
}

function evaluateExpression(str){
	console.log("expression to evaluate",str);
	expressionSpan.innerHTML="evaluating: "+str;
	let result = "can't evaluate";

	if (justOneOperator(str)){
		let operator = getAnOperator(str);
		if (tokenEmpty(str,operator)===false){
			let tokens = getTokens(str,operator);
			console.log("operator",operator,"tokens",tokens);
			result = proceedWithEvaluation(tokens,operator).toString();
		}
	} 
	console.log(result);

	if (Number(result).toString()==="NaN"){
		//do nothing
		calculatorInput.style.backgroundColor="orange";
	} 
	/////OLD method for just saying out of range and ignoring large/small numbers
	//else if ((result.toString().includes("e"))||(result.toString().includes("E"))){
	//	calculatorInput.value="out of range";
	//	calculatorInput.style.backgroundColor="field";
	//	}

	else {
		
		//replace the input box with the result
		console.log(convertEStringToDecimalString(result));
		calculatorInput.value=convertEStringToDecimalString(result);/////////
		calcString=result;
		calculatorInput.style.backgroundColor="field";
	}
}
	
function getTokens(str,operator){
	str=str.trim();
	let token0Prefix="";
	if (str[0]==="-"){
		str=str.slice(1);
		token0Prefix="-";
	}
	let tokens=str.split(operator);
	for (let token of tokens){
		token.trim();
	}
	tokens[0]=token0Prefix+tokens[0];
	return tokens;
}

function proceedWithEvaluation(tokens,operator){
	if (operator==="+"){
		return (Number(tokens[0]) + Number(tokens[1]));
	}
	else if (operator==="-"){
		return (Number(tokens[0]) - Number(tokens[1]));
	}
	else if (operator==="/"){
		return (Number(tokens[0]) / Number(tokens[1]));
	}
	else if (operator==="*"){
		return (Number(tokens[0]) * Number(tokens[1]));
	}
	else return(NaN);
}

//accepts a string returns a string
function convertEStringToDecimalString(str){
	let result = str.toString();//ensures it is a string
	if (result.includes('e+')){ //must move decimal to right
		let power = result.split('e+')[1];
		let number = result.split('e+')[0];
		if (!(number.includes("."))){
			number = number+".";
			}
		let numberLeft = number.split(".")[0];
		let numberRight = number.split(".")[1];
		let addToRightNumberLength = parseInt(power)-numberRight.length;
		let addZeros = "";
		for (let i=0; i<addToRightNumberLength; i++){
			addZeros += "0";
			}
		numberRight = numberRight + addZeros;
		result = numberLeft + numberRight;
		}
	else if (result.includes('e-')){ //must move decimal to left
		let power = result.split('e-')[1];
		let number = result.split('e-')[0];
		if (!(number.includes("."))){
			number = number+".";
			}
		let numberLeft = number.split(".")[0];
		let numberRight = number.split(".")[1];
		let addToLeftNumberLength = parseInt(power)-numberLeft.length;
		let addZeros = "";
		for (let i=0; i<addToLeftNumberLength; i++){
			addZeros += "0";
			}
		result = "0." + addZeros + numberLeft + numberRight;
		}
		console.log("input string was",str);
		console.log("output string is", result);
		console.log("Number(result)",Number(result));
		return result;
}

// Get the input field
//https://www.w3schools.com/howto/howto_js_trigger_button_enter.asp
calculatorInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    //event.preventDefault();
    document.getElementById("equals-button").click();
  }
});