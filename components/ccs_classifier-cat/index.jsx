/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

var catinput=Require("catinput"); 
var titlesincat=Require("titlesincat"); 

var cat = React.createClass({
  getInitialState: function() {
    return {bar: "world"};
  },
  render: function() {
    return (
      <div>
        <catinput/>
        <titlesincat/>
      </div>
    );
  }
});
module.exports=cat;