/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var catinput = React.createClass({
  getInitialState: function() {
    return {bar: "world"};
  },
  render: function() {
    return (
      <div>
        <input/>
      </div>
    );
  }
});
module.exports=catinput;