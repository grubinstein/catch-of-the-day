import React, { Component } from "react";
import PropTypes from "prop-types";
import { getFunName } from "../helpers";

class StorePicker extends Component {
	myInput = React.createRef();
	static propTypes = {
		history: PropTypes.object,
	};

	goToStore = (event) => {
		event.preventDefault();
		// 1. get the text from that input
		const storeName = this.myInput.current.value;
		// 2. change the page to /store/whatever-they-entered
		this.props.history.push(`/store/${storeName}`);
	};
	render() {
		return (
			<form action="" className="store-selector" onSubmit={this.goToStore}>
				<h2>Please Enter A Store</h2>
				<input
					type="text"
					ref={this.myInput}
					required
					placeholder="Store Name"
					defaultValue={getFunName()}
				/>
				<button type="submit">Visit Store</button>
			</form>
		);
	}
}

export default StorePicker;
