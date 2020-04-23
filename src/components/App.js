import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import Inventory from "./Inventory";
import Order from "./Order";
import sampleFishes from "../sample-fishes";
import Fish from "./Fish";
import base from "../base";

class App extends React.Component {
	state = {
		fishes: {},
		order: {},
	};

	static propTypes = {
		match: PropTypes.object,
	};

	componentDidMount() {
		const { params } = this.props.match;
		const localStorageRef = localStorage.getItem(params.storeId);
		if (localStorageRef) {
			this.setState({ order: JSON.parse(localStorageRef) });
		}
		this.ref = base.syncState(`${params.storeId}/fishes`, {
			context: this,
			state: "fishes",
		});
	}

	componentDidUpdate() {
		const { params } = this.props.match;
		localStorage.setItem(params.storeId, JSON.stringify(this.state.order));
	}

	componentWillUnmount() {
		base.removeBinding(this.ref);
	}

	addFish = (fish) => {
		// 1. Take a copy of the existing state
		const fishes = { ...this.state.fishes };
		// 2. Add our new fish to that fishes variable
		fishes[`fish${Date.now()}`] = fish;
		// 3. Set the new fishes object to state
		this.setState({ fishes });
	};

	updateFish = (key, updatedFish) => {
		const fishes = { ...this.state.fishes };
		fishes[key] = updatedFish;
		this.setState({ fishes });
	};

	deleteFish = (key) => {
		const fishes = { ...this.state.fishes };
		fishes[key] = null;
		this.setState({ fishes });
	};

	loadSampleFishes = () => {
		this.setState({ fishes: sampleFishes });
	};

	addToOrder = (key) => {
		const order = { ...this.state.order };
		order[key] = order[key] + 1 || 1;
		this.setState({ order });
	};

	decreaseCount = (key) => {
		const order = { ...this.state.order };
		if (order[key] === 1) {
			delete order[key];
		} else {
			order[key]--;
		}
		this.setState({ order });
	};

	render() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Market" />
					<ul className="fishes">
						{Object.keys(this.state.fishes).map((key) => (
							<Fish
								key={key}
								index={key}
								details={this.state.fishes[key]}
								addToOrder={this.addToOrder}
							/>
						))}
					</ul>
				</div>
				<Order
					fishes={this.state.fishes}
					order={this.state.order}
					decreaseCount={this.decreaseCount}
					increaseCount={this.addToOrder}
				/>
				<Inventory
					addFish={this.addFish}
					updateFish={this.updateFish}
					deleteFish={this.deleteFish}
					loadSampleFishes={this.loadSampleFishes}
					fishes={this.state.fishes}
					storeId={this.props.match.params.storeId}
				/>
			</div>
		);
	}
}

export default App;
