import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const dictionary = [
  { name: '极速冷却', val: 'QQQ', class: 'qqq' },
  { name: '电磁脉冲', val: 'WWW', class: 'www' },
  { name: '阳炎冲击', val: 'EEE', class: 'eee' },
  { name: '强袭飓风', val: 'QWW', class: 'qqw' },
  { name: '熔炎精灵', val: 'QEE', class: 'qee' },
  { name: '幽灵漫步', val: 'QQW', class: 'qqw' },
  { name: '寒冰之墙', val: 'QQE', class: 'qqe' },
  { name: '混沌陨石', val: 'WEE', class: 'wee' },
  { name: '灵动迅捷', val: 'WWE', class: 'wwe' },
]

function App() {
  // 轨道
  const lines = document.getElementsByClassName('line')
  // 游戏速度
  const [speed, setSpeed] = useState(1)
  // 合成器
  const [mixArr, setMix] = useState(['', '', ''])
  // 分数
  const [scope, setScope] = useState(0)
  // 滑块
  const [curBox, setCurBox] = useState(null)
  // 游戏开始
  const [start, setStart] = useState(false)
  // 游戏失败
  const [failed, setFailed] = useState(false)

  // 键入防抖
  useDebouncedKeyPress((code) => {
    console.log(code)
    if (code === 'q' || code === 'w' || code === 'e') {
      setMix(prevArr => {
        const [, ...rest] = prevArr;
        return [...rest, code];
      });
    } else if (code === 'r') {
      comb()
    }
    switch (code) {
      case 'KeyQ':
        setMix(prevArr => {
          const [, ...rest] = prevArr;
          return [...rest, 'Q'];
        });
        break;
      case 'KeyW':
        setMix(prevArr => {
          const [, ...rest] = prevArr;
          return [...rest, 'W'];
        });
        break;
      case 'KeyE':
        setMix(prevArr => {
          const [, ...rest] = prevArr;
          return [...rest, 'E'];
        });
        break;
      case 'KeyR':
        comb()
        break;
      default:
        break;
    }
  }, 10);

  // 合成
  function comb() {
    if (!curBox) return
    const str = mixArr.join('')
    // 将传入的字符串转换为排序后的字符数组，并排序
    const mixStr = str.split('').sort().join('');
    const curStr = curBox.val.split('').sort().join('')

    if (mixStr === curStr) {
      const target = document.getElementById('div')
      target.classList.add('disappear')
      setTimeout(() => {
        target.parentNode.removeChild(target)
        setCurBox(null)
        setScope(sc => sc + 1)
      }, 300)
    }
    setMix(['', '', ''])
  }

  // 开始
  useEffect(() => {
    if (start) create_boxes()
  }, [start])

  // 失败
  useEffect(() => {
    if (failed) {
      let flag = window.confirm(`得分：${scope}, 再接再厉！`)
      if (flag) {
        window.location.reload()
      }
    }
  }, [failed])

  useEffect(() => {
    // 消除后创建新滑块
    if (start && scope) {
      create_boxes()
    }
    // 游戏加速
    if (start && scope && scope % 5 ===0) {
      setSpeed(speed => speed + 0.3)
    }
  }, [scope, start])

  // 创建盒子
  function create_boxes() {
    const div = document.createElement('div')
    // 生成列随机数
    const col_index = Math.floor(Math.random() * lines.length);
    // 生成技能索引随机数
    const dict_index = Math.floor(Math.random() * dictionary.length)
    div.className = `box ${dictionary[dict_index].class}`
    div.id = 'div'
    // div.innerText = dictionary[dict_index].name
    lines[col_index].appendChild(div)
    setCurBox({
      name: dictionary[dict_index].name,
      val: dictionary[dict_index].val
    })
    verticalMotion(div, lines[col_index].clientHeight + 100, 10000 / speed)
  }

    // 运动函数
  function verticalMotion(element, distance, duration) {
    const startY = element.offsetTop; // 获取元素初始的垂直位置
    const startTime = performance.now(); // 获取动画开始的时间戳
    const parentElement = element.parentElement; // 获取元素的父元素

    function step(currentTime) {
      const elapsedTime = currentTime - startTime; // 计算已经经过的时间
      if (elapsedTime < duration) { // 如果动画未结束
        const progress = elapsedTime / duration; // 计算动画进度
        const y = startY + distance * progress; // 计算垂直方向上的位移
        element.style.top = y + 'px'; // 更新元素的垂直位置
        if (y > parentElement.clientHeight) { // 如果元素超出了父元素的范围
          parentElement.removeChild(element); // 则销毁元素
          setFailed(true)
        } else {
          requestAnimationFrame(step); // 继续下一帧动画
        }
      } else { // 动画结束后也需要检查一次是否超出范围
        if (element.offsetTop > parentElement.clientHeight) {
          parentElement.removeChild(element);
        }
      }
    }

    requestAnimationFrame(step); // 启动动画
  }

  return (
    <div className="container">
      <div className="line"></div>
      <div className="line"></div>
      <div className="line"></div>
      <div className="line"></div>
      <div className="bar">
        <ul className="tip">
          <li>使用键盘【R】进行组合（小写；没有顺序）</li>
          <li>极速冷却：【冰】【冰】【冰】</li>
          <li>电磁脉冲：【雷】【雷】【雷】</li>
          <li>阳炎冲击：【火】【火】【火】</li>
          <li>强袭飓风：【冰】【雷】【雷】</li>
          <li>幽灵漫步：【冰】【冰】【雷】</li>
        </ul>
        <ul className="tip">
          <li>寒冰之墙：【冰】【冰】【火】</li>
          <li>熔岩精灵：【冰】【火】【火】</li>
          <li>混沌陨石：【雷】【火】【火】</li>
          <li>灵动迅捷：【雷】【雷】【火】</li>
          <li>超震声波：【冰】【雷】【火】</li>
        </ul>
        <div>
          <div className="speed">当前速度：{Math.floor(speed)}</div>
          <div className="scope">得分：{scope}</div>
        </div>
      </div>
    {/* <div className="mix">
        {mixArr.map((item, index) => <div key={index} className='el'>{item}</div>)}
      </div> */}
      <div className="start" onClick={() => setStart(true)}>开始</div>
    </div>
  );
}

export default App;

function useDebouncedKeyPress(callback, delay) {
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (timer) {
        clearTimeout(timer);
      }

      const newTimer = setTimeout(() => {
        callback(event.code);
      }, delay);

      setTimer(newTimer);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback, delay, timer]);
}