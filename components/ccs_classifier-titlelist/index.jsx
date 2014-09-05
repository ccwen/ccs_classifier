/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */
var dataset=Require("dataset"); 
var titlelist = React.createClass({
  getInitialState: function() {
    return {bar: "world"};
  },
  renderItem:function(item) {
    return <div>{item}.{dataset.titlenames[item]}
    <button>Add</button></div>
  },
  render: function() {
    return (
      <div>
        {this.props.titles.map(this.renderItem)}
      </div>
    );
  }
});
module.exports=titlelist;