/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

var api=Require("api"); 
var titleinput = React.createClass({
  getInitialState: function() {
    return {bar: "world"};
  },
  search:function() {
    var tofind=this.refs["tofind"].getDOMNode().value;
    var res=api.search.findTitle(tofind);
    this.props.onResult(res);
  },  
  render: function() {
    return (
      <div>
        <input ref="tofind" defaultValue="聖"/>
        <button onClick={this.search}>Search</button>
      </div>
    );
  }
});
module.exports=titleinput;