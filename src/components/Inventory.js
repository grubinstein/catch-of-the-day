import React from "react";
import PropTypes from "prop-types";
import firebase from "firebase";
import AddFishForm from "./AddFishForm";
import EditFishForm from "./EditFishForm";
import Login from "./Login";
import base, { firebaseApp } from "../base";

class Inventory extends React.Component {
	static propTypes = {
		fishes: PropTypes.objectOf(
			PropTypes.shape({
				image: PropTypes.string,
				name: PropTypes.string,
				desc: PropTypes.string,
				status: PropTypes.string,
				price: PropTypes.number,
			})
		),
		updateFish: PropTypes.func,
		deleteFish: PropTypes.func,
		addFish: PropTypes.func,
		loadSampleFishes: PropTypes.func,
	};

	state = {
		uid: null,
		owner: null,
	};

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.authHandler({ user });
			}
		});
	}

	authHandler = async (authData) => {
		// 1. Look up the current store in the firebase database
		const store = await base.fetch(this.props.storeId, { context: this });
		// 2. Claim it if there is no owner
		if (!store.owner) {
			// save it as our own
			await base.post(`${this.props.storeId}/owner`, {
				data: authData.user.uid,
			});
		}
		// 3. set th state of the inventory component to reflect current user.
		this.setState({
			uid: authData.user.uid,
			owner: store.owner || authData.user.uid,
		});
	};

	authenticate = (provider) => {
		const authProvider = new firebase.auth[`${provider}AuthProvider`]();
		firebaseApp.auth().signInWithPopup(authProvider).then(this.authHandler);
	};

	logout = async () => {
		console.log("Logging out!");
		await firebase.auth().signOut();
		this.setState({ uid: null });
	};
	render() {
		const logout = <button onClick={this.logout}>Log Out!</button>;
		// 1. Check if logged in
		if (!this.state.uid) {
			return <Login authenticate={this.authenticate}></Login>;
		}
		if (this.state.uid !== this.state.owner) {
			return (
				<div>
					<p>Sorry you are not the owner!</p>
					{logout}
				</div>
			);
		}
		return (
			<div className="inventory">
				{logout}
				<h2>Inventory</h2>
				{Object.keys(this.props.fishes).map((key) => (
					<EditFishForm
						key={key}
						index={key}
						fish={this.props.fishes[key]}
						updateFish={this.props.updateFish}
						deleteFish={this.props.deleteFish}
					/>
				))}
				<AddFishForm addFish={this.props.addFish}></AddFishForm>
				<button onClick={this.props.loadSampleFishes}>
					Load Sample Fishes
				</button>
			</div>
		);
	}
}

export default Inventory;
