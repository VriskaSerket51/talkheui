export default function Mainscreen() {
  function Row(idx){
    return <div className="row">
      <Cell></Cell>
      <Cell></Cell>
      <Cell></Cell>
      <Cell></Cell>
      <Cell></Cell>
      <Cell></Cell>
    </div>
  }
  
  function Cell(row, column){
    const random_charset = "으악아희가나다라마바사아자차카타파하";
    const to_use = random_charset.charAt(Math.random()*random_charset.length)
    return <span className="cell">{to_use}</span>
  }

  
  function keydownHandler() {
    console.log("keydown");
  }
  return <>
    <h1>톡희</h1>
    <div>ㅎㅇ</div>
    <div id="container">
      <Row idx="0"></Row>
      <Row idx="1"></Row>
      <Row idx="2"></Row>
      <Row idx="3"></Row>
      <Row idx="4"></Row>
    </div>
    <input type="text" id="input"
      onKeyDown={keydownHandler}></input>
  </>
}

