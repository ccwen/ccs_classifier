/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

var titleinput=Require("titleinput"); 
var titlelist=Require("titlelist"); 
var cat=Require("cat"); 

var main = React.createClass({
  getInitialState: function() {
    return {bar: "world", titles:[] };
  },
  setTitles:function(res) {
    this.setState({titles:res});
  },
  render: function() {
    return (
      <div>
          <div className="col-md-6">
            <titleinput onResult={this.setTitles} />
            <titlelist titles={this.state.titles} />
          </div>
          <div className="col-md-6">
            <cat/>
          </div>
      </div>
    );
  }
});
module.exports=main;