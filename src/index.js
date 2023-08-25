import React from "react"; 
import ReactDOM from "react-dom"; 
import { Provider, connect } from "react-redux";
import { legacy_createStore as createStore } from "redux";
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';


//Redux

const initialState = {
  input: '0',
  
};


const ADD_NUM = 'ADD_NUM';
const ADD_OPERATOR = 'ADD_OPERATOR';
const ADD_DECIMAL = 'ADD_DECIMAL';
const EQUALS_RESULT = 'EQUALS_RESULT';
const DELETE_RESULT = 'DELETE_RESULT';


const addNum = (num) => {
  return {
    type: ADD_NUM,
    payload: num
  }
}

const addOperator = (oper) => {
  return {
    type: ADD_OPERATOR,
    payload: oper
  }
}

const addDecimal = () => {
  return {
    type: ADD_DECIMAL
  }
}

const equalsResult = () => {
  return {
    type: EQUALS_RESULT
  }
}

const deleteResult = () => {
  return {
    type: DELETE_RESULT
  }
}

let currentInput = [];
let lastOperator = [];
let decimalPer = true;
let zeroPer = false;
let lastNumberRegex = /[0-9]$/;


const calculatorReducer = (state = initialState, action) => {
  
  switch (action.type) {
    case ADD_NUM:
      if (currentInput.length >= 15) {
        return {
          ...state,
          input: 'Limit passed!'
        }
      }
      const inputNumber = action.payload;
      if (currentInput[currentInput.length-1] == '0' && zeroPer == true) {
        if (inputNumber == '0') {
          lastOperator = [];
          return state
        } else if (inputNumber != '0' && zeroPer == true) {
          lastOperator = [];
          zeroPer = false;
          currentInput.pop();
          currentInput.push(inputNumber);
          return {
             ...state,
             input: currentInput.join('')
          }
        }
        
        
        
      } if (currentInput[currentInput.length-1] != '0' && zeroPer == true) {
        if (inputNumber == '0') {
          lastOperator = [];
          currentInput.push(inputNumber);
          return {
             ...state,
             input: currentInput.join('')
          }
        } else {
          lastOperator = [];
          zeroPer = false;
          currentInput.push(inputNumber);
          return {
             ...state,
             input: currentInput.join('')
          }
        }
          
      } else if (currentInput[0] == '0' && currentInput[1] == undefined) {
          if (inputNumber == '0') {
            lastOperator = [];
            return state;
          } else {
            lastOperator = [];
            currentInput.pop();
            currentInput.push(inputNumber);
            return {
             ...state,
             input: currentInput.join('')
            }
          }
        
      } else {
        if(currentInput[0] == undefined) {
          lastOperator = [];
          zeroPer = false;
          currentInput.push(inputNumber);
          return {
             ...state,
             input: inputNumber
          }
        } else {
          lastOperator = [];
          zeroPer = false;
          currentInput.push(inputNumber);
          return {
            ...state,
            input: currentInput.join('')
          }
        }
    }
      
      
    case ADD_OPERATOR:
      const userOperator = action.payload;
      
      if (currentInput[0] == undefined && userOperator != '.') {
        if (userOperator == '-') {
          lastOperator.push(userOperator);
          currentInput.push(userOperator);
          decimalPer = true;
          zeroPer = true;
          return {
            ...state,
            input: currentInput.join('')
          }
        } else {
          return state
        }
        
      } else if (lastOperator[0] == '-' && userOperator == '-') {
        return state
        
      } else if (currentInput[0] == '-' && currentInput[1] == undefined) {
        return state
        
      } else if (lastOperator[0] != undefined && userOperator != '.') {
          if (lastOperator[1] == undefined) {
            if (userOperator == '-') {
              lastOperator.push(userOperator);
              currentInput.push(userOperator);
              decimalPer = true;
              zeroPer = true;
              return {
                ...state,
                input: currentInput.join('')
              }
            } else {
              lastOperator = [userOperator];
              currentInput.pop()
              currentInput.push(userOperator);
              decimalPer = true;
              zeroPer = true;
              return {
                ...state,
                input: currentInput.join('')
              }
            }
            
          } else if (lastOperator[1] != undefined && userOperator != '.') {
            lastOperator = [userOperator];
            currentInput.pop();
            currentInput.pop();
            currentInput.push(userOperator);
            decimalPer = true;
            zeroPer = true;
            return {
                ...state,
                input: currentInput.join('')
              }
          }
          
        } else {
          lastOperator.push(userOperator);
          currentInput.push(userOperator);
          decimalPer = true;
          zeroPer = true;
          return {
             ...state,
             input: currentInput.join('')
           }
        }
      
      
      
      
      
    case ADD_DECIMAL:   
      
    if (lastNumberRegex.test(currentInput[currentInput.length - 1]) && decimalPer == true) {
          if (lastOperator[0] == undefined) {
            currentInput.push('.');
            decimalPer = false;
            zeroPer = false;
            return {
                ...state,
                input: currentInput.join('')
            }
          } 
      
    } else if (lastOperator[0] != undefined) {
          lastOperator = [];
          currentInput.push('0');
          currentInput.push('.');
          return {
            ...state,
            input: currentInput.join('')
          }
             
        } else {
          return state;
    }
      
      
    case EQUALS_RESULT:
      let output = currentInput.map((item) => (item === 'x' ? '*' : item));
      let result = eval(output.join(''));
      let resultString = result.toString();
      let resultSplit = resultString.split('');
      currentInput = [...resultSplit];
      return {
        ...state,
        input: result
      }
      
    case DELETE_RESULT:
      currentInput = [];
      lastOperator = [];
      decimalPer = true;
      zeroPer = false;
      return {
        ...state,
        input: 0
      }
      
    default:
      return state;
  }
};


const store = createStore(calculatorReducer);





// React

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleOperator = this.handleOperator.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.handleEquals = this.handleEquals.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  handleClick = (event) => {
    const value = event.target.innerText;
    this.props.addNum(value);
  };

  handleOperator = (event) => {
    const operator = event.target.innerText;
    this.props.addOperator(operator);
  };

  handleDecimal = (event) => {
    this.props.addDecimal();
  };

  handleEquals = () => {
    this.props.equalsResult();
  };
  
  handleDelete = () => {
    this.props.deleteResult();
  }
  
  render() {
    return (
        
        <div id='calculator' className='container d-flex flex-column justify-content-center vh-100'>
        
          <div className='row'>
            
            <button onClick = {this.handleDelete} id='clear' className='col-3 delete'>AC</button>
            <span id='display' className='col-9'>{this.props.input}</span>
   
          </div>
          
          <div className='row'>
            
            <button onClick = {this.handleClick} id='one' className='col-3 nums'>1</button>
            <button onClick = {this.handleClick} id='two' className='col-3 nums'>2</button>
            <button onClick = {this.handleClick} id='three' className='col-3 nums'>3</button>
            <button onClick = {this.handleOperator} id='add' className='col-3 operator'>+</button>
            
          </div>
        
          <div className='row'>
            
            <button onClick = {this.handleClick} id='four' className='col-3 nums'>4</button>
            <button onClick = {this.handleClick} id='five' className='col-3 nums'>5</button>
            <button onClick = {this.handleClick} id='six' className='col-3 nums'>6</button>
            <button onClick = {this.handleOperator} id='subtract' className='col-3 operator'>-</button>
            
          </div>
        
          <div className='row'>
            
            <button onClick = {this.handleClick} id='seven' className='col-3 nums'>7</button>
            <button onClick = {this.handleClick} id='eight' className='col-3 nums'>8</button>
            <button onClick = {this.handleClick} id='nine' className='col-3 nums'>9</button>
            <button onClick = {this.handleOperator} id='divide' className='col-3 operator'>/</button>
            
          </div>
        
          <div className='row'>
            
            <button onClick = {this.handleClick} id='zero' className='col-3 nums'>0</button>
            <button onClick = {this.handleDecimal} id='decimal' className='col-3 nums'>.</button>
            <button onClick = {this.handleEquals} id='equals' className='col-3'>=</button>
            <button onClick = {this.handleOperator} id='multiply' className='col-3 operator'>x</button>
            
            
          </div>
        
        </div>
      
    )
  }
}



//React-Redux

const mapStateToProps = (state) => {
  return {
    input: state.input
  };
};

const mapDispatchToProps = {
  addNum,
  addOperator,
  addDecimal,
  equalsResult,
  deleteResult
  
};


const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(App);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedComponent />
  </Provider>,
  document.getElementById('root')
); 