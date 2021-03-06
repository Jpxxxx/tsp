import './App.css';
import React, { useState,useEffect,useRef } from 'react';

function App() {

  const  [points, setPoints] = useState([]);

  const [currentData, setCurrentData] = useState({nodes:[],line:[]});

  const [index, setIndex]=useState(0);
 
  const [shortLine, setShortLine] = useState([]);

  const [minDistance, setMinDistance] = useState(0);

  const [start, setStart] = useState(false);

  const timer= useRef();

  useEffect(() => {
    if(start){
      setIndex(0);
      permute([...points]).then(res => {
          timer.current = setInterval(() => {
            if(!res.next().done){
              res.next();
            }else{
              setStart(false);
            }
          }, 0);
      })
    }else{
      clearInterval(timer.current);
    }
  }, [start]);



  useEffect(() => {   
    if (start) {
      setIndex(index + 1);
      if(!minDistance){
        setShortLine(currentData.line);
        setMinDistance(getDistance(currentData.nodes));
      } else if(getDistance(currentData.nodes)<minDistance) {
        setShortLine(currentData.line);
        setMinDistance(getDistance(currentData.nodes));
      }
    }
  }, [currentData])


  function handleClick(e){
    if(!start){
      let _points = [...points];
      _points.push({x:e.nativeEvent.offsetX, y:e.nativeEvent.offsetY});
      setPoints(_points);
    }  
  }

  function getDistance(arr){
    let arrLength = arr.length;
    let Distance = 0;
    for(let i = 0; i<arrLength; i++){
      if(arr[i+1]){
        Distance += pointToPoint(arr[i], arr[i+1]);
      }else{
        Distance += pointToPoint(arr[i], arr[0]);
      }
    };
    return Distance;
  }

  function getLine(arr){
    let possibleLine = [];
    let arrLength = arr.length;
    for(let i = 0; i<arrLength; i++){
        if (arr[i+1]) {
          possibleLine.push({x1:arr[i].x, x2:arr[i+1].x, y1:arr[i].y, y2:arr[i+1].y});
        } else {
          possibleLine.push({x1:arr[i].x, x2:arr[0].x, y1:arr[i].y, y2:arr[0].y});
        }
    }
    return possibleLine;
  }

  function pointToPoint(a, b){
    let _x = +(a.x - b.x);
    let _y = +(a.y - b.y);
    return Math.sqrt(_x*_x + _y*_y);
  }

  function startButton(){
    setMinDistance(0);
    setStart(!start);
  }

  async function  permute(nums){
    const used = {};

    function* dfs(path) {
      if (path.length === nums.length) { // ???????????????
        let _path=path.slice();
        yield  setCurrentData({nodes:_path,line:getLine(_path)});
        // res.push(path.slice()); // ????????????path???????????????res
        return;                 // ????????????????????????
      }
     let l = nums.length;
      for (let i = 0; i<l; i++){     
      // for (const num of nums) { // for??????????????????????????????
        // if (path.includes(num)) continue; // ?????????????????????????????????O(n)????????????????????????
        if (used[i]) continue; // ?????????????????????
        path.push(nums[i]);        // ???????????????????????????path
        used[i] = true;       // ???????????? ?????????
        yield* dfs(path, i);              // ?????????????????????????????????
        path.pop();             // ??????????????????????????????????????????????????????pop??????
        used[i] = false;      // ??????????????????
      }
    }
    return dfs([]);
  };
  

  return (
    <div className="App">
      <div className="main">
        <div>{index}</div>
        <div>
          <div className="count">           
            <svg id="count" onClick={handleClick}  width="250" height="250">   
              {currentData.line.map((item,_index)=>{
                return(
                  <line key={_index} x1={item.x1} y1={item.y1} x2={item.x2} y2={item.y2} strokeWidth="5" stroke="gainsboro"></line>
                )                        
              })}
              {points.map((item,index)=>{
                return(
                  <circle key={index} cx={item.x} cy={item.y} r="5" fill="rgb(0,0,0)"></circle>
                )            
              })}
            </svg> 
          </div>
          <div className="optimal">
            <svg width="250" height="250">

              {shortLine.map((item,_index)=>{
                return(
                  <line key={_index} x1={item.x1} y1={item.y1} x2={item.x2} y2={item.y2} strokeWidth="5" stroke="gainsboro"></line>
                )                        
              })}

              {points.map((item,index)=>{
                return(
                  <circle key={index} cx={item.x} cy={item.y} r="5" fill="rgb(0,0,0)"></circle>
                )            
              })}
            </svg> 
          </div>
        </div>
        <button onClick={startButton}>{!start?'start':'stop'}</button>
      </div>
      <div className="list">
        <ul>
          {points.map((item,index)=>{
            return(
              <li key={index}>x:{item.x} , y:{item.y}</li>
            )            
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
