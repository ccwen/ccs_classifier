/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var titlesincat = React.createClass({
  getInitialState: function() {
    return {bar: "world"};
  },
  render: function() {
    return (
      <div>
        titles in cat
      </div>
    );
  }
});
module.exports=titlesincat;